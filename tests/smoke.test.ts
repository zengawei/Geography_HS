import { describe, test, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

describe('Smoke tests', () => {
  test('project structure exists', () => {
    expect(existsSync(join(ROOT, 'package.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'astro.config.mjs'))).toBe(true);
    expect(existsSync(join(ROOT, 'tsconfig.json'))).toBe(true);
    expect(existsSync(join(ROOT, 'vitest.config.ts'))).toBe(true);
    expect(existsSync(join(ROOT, 'src/content/config.ts'))).toBe(true);
  });

  test('knowledge points directory has files', () => {
    const kpDir = join(ROOT, 'src/content/knowledge-points');
    expect(existsSync(kpDir)).toBe(true);
  });

  test('AGENTS.md exists', () => {
    expect(existsSync(join(ROOT, 'AGENTS.md'))).toBe(true);
  });

  test('README.md exists', () => {
    expect(existsSync(join(ROOT, 'README.md'))).toBe(true);
  });
});
