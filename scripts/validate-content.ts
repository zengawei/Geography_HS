import { readdirSync, readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { parse } from 'yaml';
import { z } from 'zod';

const ROOT = join(import.meta.dirname, '..');
const KP_DIR = join(ROOT, 'src', 'content', 'knowledge-points');
const NCEE_DIR = join(ROOT, 'src', 'content', 'textbooks', 'ncee');

const textbookEnum = z.enum(['required-1', 'required-2', 'selective-1', 'selective-2', 'selective-3']);

const nceeSchema = z.object({
  type: z.literal('ncee'),
  ncee_id: z.string(),
  year: z.number().int().min(2012).max(2026),
  paper: z.string(),
  paper_code: z.string().regex(/^\d{4}-[a-z0-9-]+$/),
  question_number: z.number().int().min(1),
  question_type: z.enum(['choice', 'comprehensive', 'fill_blank', 'elective']),
  sub_type: z.string().optional(),
  difficulty: z.enum(['basic', 'medium', 'hard']),
  score: z.number().optional(),
  knowledge_points: z.array(z.string()).min(1),
  textbook_refs: z.array(z.object({
    textbook: textbookEnum,
    chapter: z.number().int().min(1),
    section: z.number().int().min(1).optional(),
  })).default([]),
  is_deprecated: z.boolean().default(false),
  source: z.literal('高考真题'),
  region: z.string().optional(),
  original_section: z.string().optional(),
  has_chart: z.boolean().default(false),
  chart_text_desc: z.string().optional(),
  chart_files: z.array(z.string()).default([]),
  elective_group_id: z.string().optional(),
});

let errors = 0;
let warnings = 0;

function error(msg: string) { console.error(`❌ ${msg}`); errors++; }
function warn(msg: string) { console.warn(`⚠️  ${msg}`); warnings++; }
function ok(msg: string) { console.log(`✅ ${msg}`); }

// 1. Validate knowledge points
console.log('\n--- Knowledge Points ---');
const kpFiles = readdirSync(KP_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
const kpIds = new Set<string>();
const kpSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['natural', 'human', 'regional', 'world_china', 'tools']),
  exam_frequency: z.enum(['high', 'medium', 'low']),
  description: z.string().min(1),
  key_concepts: z.array(z.string()),
  textbook_refs: z.array(z.object({
    textbook: textbookEnum,
    chapter: z.number().int(),
    section: z.number().int().optional(),
  })),
  related_points: z.array(z.string()),
  common_mistakes: z.array(z.string()).optional(),
});

for (const file of kpFiles) {
  const content = readFileSync(join(KP_DIR, file), 'utf-8');
  const data = parse(content);
  const result = kpSchema.safeParse(data);
  if (!result.success) {
    error(`KP ${file}: ${result.error.message}`);
  } else {
    kpIds.add(data.id);
  }
}
ok(`Validated ${kpFiles.length} knowledge points (${kpIds.size} unique IDs)`);

// 2. Validate NCEE questions
console.log('\n--- NCEE Questions ---');
const nceeIds = new Set<string>();
const QUESTION_FILE_RE = /^q\d{2}\.md$/;

if (existsSync(NCEE_DIR)) {
  const yearDirs = readdirSync(NCEE_DIR).filter(d => {
    return statSync(join(NCEE_DIR, d)).isDirectory() && /^\d{4}$/.test(d);
  });

  for (const yearDir of yearDirs) {
    const yearPath = join(NCEE_DIR, yearDir);
    const paperDirs = readdirSync(yearPath).filter(d =>
      statSync(join(yearPath, d)).isDirectory()
    );

    for (const paperDir of paperDirs) {
      const paperPath = join(yearPath, paperDir);

      // Check _index.yml exists
      if (!existsSync(join(paperPath, '_index.yml'))) {
        error(`Missing _index.yml in ${paperDir}`);
      }

      // Check no subdirectories
      const subdirs = readdirSync(paperPath).filter(f =>
        statSync(join(paperPath, f)).isDirectory()
      );
      if (subdirs.length > 0) {
        error(`Subdirectories found in ${paperDir}: ${subdirs.join(', ')}`);
      }

      const qFiles = readdirSync(paperPath).filter(f => QUESTION_FILE_RE.test(f));
      const invalidFiles = readdirSync(paperPath).filter(f =>
        !QUESTION_FILE_RE.test(f) && f !== '_index.yml' && statSync(join(paperPath, f)).isFile()
      );
      if (invalidFiles.length > 0) {
        error(`Invalid files in ${paperDir}: ${invalidFiles.join(', ')}`);
      }

      for (const qFile of qFiles) {
        const { data } = matter(readFileSync(join(paperPath, qFile), 'utf-8'));
        const result = nceeSchema.safeParse(data);
        if (!result.success) {
          error(`NCEE ${qFile} in ${paperDir}: ${result.error.message}`);
        } else {
          if (nceeIds.has(data.ncee_id)) {
            error(`Duplicate ncee_id: ${data.ncee_id}`);
          }
          nceeIds.add(data.ncee_id);

          // Check knowledge_points reference valid IDs
          for (const kpId of data.knowledge_points) {
            if (!kpIds.has(kpId)) {
              error(`NCEE ${data.ncee_id}: references unknown KP "${kpId}"`);
            }
          }

          // Business rules
          if (data.year <= 2020 && (data.question_type === 'comprehensive' || data.question_type === 'elective') && !data.original_section) {
            warn(`NCEE ${data.ncee_id}: old gaokao comprehensive/elective missing original_section`);
          }
          if (data.year >= 2021 && data.original_section) {
            warn(`NCEE ${data.ncee_id}: new gaokao should not have original_section`);
          }
          if (data.has_chart && !data.chart_text_desc) {
            error(`NCEE ${data.ncee_id}: has_chart=true but chart_text_desc is empty`);
          }
        }
      }
    }
  }
  ok(`Validated ${nceeIds.size} NCEE questions`);
} else {
  ok('No NCEE directory yet, skipping.');
}

// 3. SVG integrity
console.log('\n--- SVG Files ---');
const svgDir = join(ROOT, 'public', 'svg');
if (existsSync(svgDir)) {
  let svgCount = 0;
  function scanSvg(dir: string) {
    for (const f of readdirSync(dir)) {
      const fp = join(dir, f);
      if (statSync(fp).isDirectory()) { scanSvg(fp); continue; }
      if (!f.endsWith('.svg')) continue;
      svgCount++;
      const content = readFileSync(fp, 'utf-8');
      if (content.includes('<image')) error(`SVG ${fp}: contains <image> bitmap embed`);
      if (!content.includes('<title')) warn(`SVG ${fp}: missing <title> element`);
      const size = statSync(fp).size;
      if (size > 200 * 1024) error(`SVG ${fp}: exceeds 200KB (${(size / 1024).toFixed(0)}KB)`);
    }
  }
  scanSvg(svgDir);
  ok(`Checked ${svgCount} SVG files`);
} else {
  ok('No SVG directory yet, skipping.');
}

// Summary
console.log(`\n--- Summary ---`);
console.log(`Knowledge points: ${kpIds.size}`);
console.log(`NCEE questions: ${nceeIds.size}`);
console.log(`Errors: ${errors}`);
console.log(`Warnings: ${warnings}`);

if (errors > 0) {
  console.error(`\n❌ Validation failed with ${errors} errors.`);
  process.exit(1);
}
console.log('\n✅ All validations passed.');
