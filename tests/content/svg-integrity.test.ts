import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..', '..');
const SVG_DIR = join(ROOT, 'public', 'svg');

function collectSvgFiles(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  for (const f of readdirSync(dir)) {
    const fp = join(dir, f);
    if (statSync(fp).isDirectory()) {
      results.push(...collectSvgFiles(fp));
    } else if (f.endsWith('.svg')) {
      results.push(fp);
    }
  }
  return results;
}

describe('SVG integrity', () => {
  const svgFiles = collectSvgFiles(SVG_DIR);

  test('SVG files do not contain <image> bitmap embed', () => {
    for (const fp of svgFiles) {
      const content = readFileSync(fp, 'utf-8');
      expect(content, `${fp}: contains <image> bitmap`).not.toContain('<image');
    }
  });

  test('SVG files contain <title> element', () => {
    for (const fp of svgFiles) {
      const content = readFileSync(fp, 'utf-8');
      expect(content, `${fp}: missing <title>`).toContain('<title');
    }
  });

  test('SVG files are under 200KB', () => {
    for (const fp of svgFiles) {
      const size = statSync(fp).size;
      expect(size, `${fp}: ${(size / 1024).toFixed(0)}KB exceeds 200KB`).toBeLessThanOrEqual(200 * 1024);
    }
  });

  test('SVG filenames are lowercase with hyphens', () => {
    for (const fp of svgFiles) {
      const name = fp.split('/').pop()!;
      expect(name).toMatch(/^[a-z0-9-]+\.svg$/);
    }
  });
});
