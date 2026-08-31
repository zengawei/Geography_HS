import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const ROOT = join(__dirname, '..', '..');
const NCEE_DIR = join(ROOT, 'src', 'content', 'textbooks', 'ncee');
const QUESTION_FILE_RE = /^q\d{2}\.md$/;

describe('NCEE filename and structure validation', () => {
  test('all question files match qNN.md pattern', () => {
    if (!existsSync(NCEE_DIR)) return;

    const yearDirs = readdirSync(NCEE_DIR).filter(d =>
      statSync(join(NCEE_DIR, d)).isDirectory() && /^\d{4}$/.test(d)
    );

    for (const yearDir of yearDirs) {
      const yearPath = join(NCEE_DIR, yearDir);
      const paperDirs = readdirSync(yearPath).filter(d =>
        statSync(join(yearPath, d)).isDirectory()
      );

      for (const paperDir of paperDirs) {
        const paperPath = join(yearPath, paperDir);
        const allFiles = readdirSync(paperPath).filter(f =>
          statSync(join(paperPath, f)).isFile()
        );

        for (const f of allFiles) {
          if (f === '_index.yml') continue;
          expect(f, `${paperDir}: invalid file "${f}"`).toMatch(QUESTION_FILE_RE);
        }
      }
    }
  });

  test('no subdirectories in paper directories', () => {
    if (!existsSync(NCEE_DIR)) return;

    const yearDirs = readdirSync(NCEE_DIR).filter(d =>
      statSync(join(NCEE_DIR, d)).isDirectory() && /^\d{4}$/.test(d)
    );

    for (const yearDir of yearDirs) {
      const yearPath = join(NCEE_DIR, yearDir);
      const paperDirs = readdirSync(yearPath).filter(d =>
        statSync(join(yearPath, d)).isDirectory()
      );

      for (const paperDir of paperDirs) {
        const paperPath = join(yearPath, paperDir);
        const subdirs = readdirSync(paperPath).filter(f =>
          statSync(join(paperPath, f)).isDirectory()
        );
        expect(subdirs.length, `${paperDir}: contains subdirectories`).toBe(0);
      }
    }
  });

  test('every paper directory has _index.yml', () => {
    if (!existsSync(NCEE_DIR)) return;

    const yearDirs = readdirSync(NCEE_DIR).filter(d =>
      statSync(join(NCEE_DIR, d)).isDirectory() && /^\d{4}$/.test(d)
    );

    for (const yearDir of yearDirs) {
      const yearPath = join(NCEE_DIR, yearDir);
      const paperDirs = readdirSync(yearPath).filter(d =>
        statSync(join(yearPath, d)).isDirectory()
      );

      for (const paperDir of paperDirs) {
        const indexPath = join(yearPath, paperDir, '_index.yml');
        expect(existsSync(indexPath), `${paperDir}: missing _index.yml`).toBe(true);
      }
    }
  });
});
