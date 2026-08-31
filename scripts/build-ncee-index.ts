import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';

const ROOT = join(import.meta.dirname, '..');
const NCEE_DIR = join(ROOT, 'src', 'content', 'textbooks', 'ncee');
const OUTPUT_DIR = join(ROOT, 'public', 'data', 'ncee');
const QUESTION_FILE_RE = /^q\d{2}\.md$/;

interface NceeEntry {
  ncee_id: string;
  year: number;
  paper: string;
  paper_code: string;
  question_number: number;
  question_type: string;
  sub_type?: string;
  difficulty: string;
  score?: number;
  knowledge_points: string[];
  has_chart: boolean;
  is_deprecated: boolean;
  region?: string;
  source: string;
}

interface PaperSummary {
  year: number;
  paper: string;
  paper_code: string;
  region: string | null;
  total_score: number;
  exam_type: string;
  question_count: number;
}

function scanNceeDir(): { entries: NceeEntry[]; papers: PaperSummary[] } {
  const entries: NceeEntry[] = [];
  const papers: PaperSummary[] = [];

  if (!existsSync(NCEE_DIR)) {
    console.log('NCEE directory does not exist yet, skipping.');
    return { entries, papers };
  }

  const yearDirs = readdirSync(NCEE_DIR).filter(d => {
    return statSync(join(NCEE_DIR, d)).isDirectory() && /^\d{4}$/.test(d);
  });

  for (const yearDir of yearDirs) {
    const yearPath = join(NCEE_DIR, yearDir);
    const paperDirs = readdirSync(yearPath).filter(d => {
      return statSync(join(yearPath, d)).isDirectory();
    });

    for (const paperDir of paperDirs) {
      const paperPath = join(yearPath, paperDir);

      // Read _index.yml
      const indexPath = join(paperPath, '_index.yml');
      if (!existsSync(indexPath)) {
        console.warn(`WARNING: Missing _index.yml in ${paperPath}`);
        continue;
      }

      // Parse index YAML (simple key-value parsing)
      const indexContent = readFileSync(indexPath, 'utf-8');
      const indexData: Record<string, any> = {};
      for (const line of indexContent.split('\n')) {
        const match = line.match(/^(\w+):\s*(.+)?$/);
        if (match) {
          const key = match[1];
          let val: any = match[2]?.trim() ?? '';
          if (val === 'null') val = null;
          else if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (/^\d+$/.test(val)) val = parseInt(val);
          else val = val.replace(/^["']|["']$/g, '');
          indexData[key] = val;
        }
      }

      // Scan question files
      const qFiles = readdirSync(paperPath)
        .filter(f => QUESTION_FILE_RE.test(f))
        .sort();

      const paperEntries: NceeEntry[] = [];
      for (const qFile of qFiles) {
        const qPath = join(paperPath, qFile);
        const { data } = matter(readFileSync(qPath, 'utf-8'));

        if (data.is_deprecated) continue;

        const entry: NceeEntry = {
          ncee_id: data.ncee_id,
          year: data.year,
          paper: data.paper,
          paper_code: data.paper_code,
          question_number: data.question_number,
          question_type: data.question_type,
          sub_type: data.sub_type,
          difficulty: data.difficulty,
          score: data.score,
          knowledge_points: data.knowledge_points || [],
          has_chart: data.has_chart || false,
          is_deprecated: false,
          region: data.region,
          source: data.source,
        };
        paperEntries.push(entry);
      }

      entries.push(...paperEntries);

      const paperSummary: PaperSummary = {
        year: indexData.year ?? parseInt(yearDir),
        paper: indexData.paper ?? paperDir,
        paper_code: indexData.paper_code ?? paperDir,
        region: indexData.region ?? null,
        total_score: indexData.total_score ?? 100,
        exam_type: indexData.exam_type ?? 'unknown',
        question_count: qFiles.length,
      };
      papers.push(paperSummary);
    }
  }

  return { entries, papers };
}

function buildIndexes(entries: NceeEntry[], papers: PaperSummary[]) {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  // by-year
  const byYearDir = join(OUTPUT_DIR, 'by-year');
  mkdirSync(byYearDir, { recursive: true });
  const yearMap = new Map<number, NceeEntry[]>();
  for (const e of entries) {
    if (!yearMap.has(e.year)) yearMap.set(e.year, []);
    yearMap.get(e.year)!.push(e);
  }
  for (const [year, yearEntries] of yearMap) {
    writeFileSync(join(byYearDir, `${year}.json`), JSON.stringify(yearEntries, null, 2));
  }

  // by-kp
  const byKpDir = join(OUTPUT_DIR, 'by-kp');
  mkdirSync(byKpDir, { recursive: true });
  const kpMap = new Map<string, NceeEntry[]>();
  for (const e of entries) {
    for (const kp of e.knowledge_points) {
      if (!kpMap.has(kp)) kpMap.set(kp, []);
      kpMap.get(kp)!.push(e);
    }
  }
  for (const [kpId, kpEntries] of kpMap) {
    writeFileSync(join(byKpDir, `${kpId}.json`), JSON.stringify(kpEntries, null, 2));
  }

  // by-paper
  const byPaperDir = join(OUTPUT_DIR, 'by-paper');
  mkdirSync(byPaperDir, { recursive: true });
  const paperMap = new Map<string, NceeEntry[]>();
  for (const e of entries) {
    if (!paperMap.has(e.paper_code)) paperMap.set(e.paper_code, []);
    paperMap.get(e.paper_code)!.push(e);
  }
  for (const [code, paperEntries] of paperMap) {
    writeFileSync(join(byPaperDir, `${code}.json`), JSON.stringify(paperEntries, null, 2));
  }

  // summary
  const summary = {
    total_questions: entries.length,
    total_papers: papers.length,
    by_year: Object.fromEntries(
      [...yearMap.entries()].map(([y, es]) => [y, es.length])
    ),
    by_kp_count: Object.fromEntries(
      [...kpMap.entries()].map(([kp, es]) => [kp, es.length])
    ),
    papers,
  };
  writeFileSync(join(OUTPUT_DIR, 'summary.json'), JSON.stringify(summary, null, 2));
}

// Main
console.log('Building NCEE index...');
const { entries, papers } = scanNceeDir();
console.log(`Found ${entries.length} questions in ${papers.length} papers.`);

if (entries.length > 0) {
  buildIndexes(entries, papers);
  console.log(`Output written to ${OUTPUT_DIR}`);
} else {
  console.log('No NCEE questions found. Creating empty summary.');
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, 'summary.json'), JSON.stringify({
    total_questions: 0,
    total_papers: 0,
    by_year: {},
    by_kp_count: {},
    papers: [],
  }, null, 2));
}

console.log('✅ NCEE index build complete.');
