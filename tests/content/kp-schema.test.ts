import { describe, test, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

const ROOT = join(__dirname, '..', '..');
const KP_DIR = join(ROOT, 'src', 'content', 'knowledge-points');

const textbookEnum = z.enum(['required-1', 'required-2', 'selective-1', 'selective-2', 'selective-3']);

const kpSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.enum(['natural', 'human', 'regional', 'world_china', 'tools']),
  exam_frequency: z.enum(['high', 'medium', 'low']),
  description: z.string().min(1),
  key_concepts: z.array(z.union([
    z.string(),
    z.object({
      title: z.string(),
      definition: z.string().optional(),
      explanation: z.string().optional(),
      example: z.string().optional(),
      formula: z.string().nullable().optional(),
    })
  ])),
  textbook_refs: z.array(z.object({
    textbook: textbookEnum,
    chapter: z.number().int(),
    section: z.number().int().optional(),
  })),
  related_points: z.array(z.string()),
  common_mistakes: z.array(z.string()).optional(),
});

describe('Knowledge point schema validation', () => {
  const files = readdirSync(KP_DIR).filter(f => f.endsWith('.json'));
  const allData = files.map(f => ({
    file: f,
    data: JSON.parse(readFileSync(join(KP_DIR, f), 'utf-8')),
  }));

  test('all KP files have valid schema', () => {
    for (const { file, data } of allData) {
      const result = kpSchema.safeParse(data);
      expect(result.success, `${file}: ${result.success ? '' : result.error.message}`).toBe(true);
    }
  });

  test('KP id matches filename', () => {
    for (const { file, data } of allData) {
      const expectedId = file.replace(/\.json$/, '');
      expect(data.id).toBe(expectedId);
    }
  });

  test('all KP ids are unique', () => {
    const ids = allData.map(d => d.data.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  test('total KP count is 74', () => {
    expect(files.length).toBeGreaterThanOrEqual(74);
  });

  test('related_points reference existing KP ids', () => {
    const ids = new Set(allData.map(d => d.data.id));
    for (const { file, data } of allData) {
      for (const rp of data.related_points) {
        expect(ids.has(rp), `${file}: related_point "${rp}" does not exist`).toBe(true);
      }
    }
  });

  test('category distribution is correct', () => {
    const cats = allData.map(d => d.data.category);
    expect(cats.filter(c => c === 'natural').length).toBe(26);
    expect(cats.filter(c => c === 'human').length).toBe(14);
    expect(cats.filter(c => c === 'regional').length).toBe(14);
    expect(cats.filter(c => c === 'world_china').length).toBe(12);
    expect(cats.filter(c => c === 'tools').length).toBe(8);
  });
});
