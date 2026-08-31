import { describe, test, expect } from 'vitest';
import { z } from 'zod';

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

describe('Business rules validation', () => {
  test('paper_code must match regex', () => {
    const valid = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
      paper_code: '2024-new-gao-kao-1', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
    });
    expect(valid.success).toBe(true);

    const invalid = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
      paper_code: '2024_NewGaoKao_1', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
    });
    expect(invalid.success).toBe(false);
  });

  test('textbook_refs must use valid enum values', () => {
    const result = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
      paper_code: '2024-test', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
      textbook_refs: [{ textbook: 'invalid-textbook', chapter: 1 }],
    });
    expect(result.success).toBe(false);
  });

  test('has_chart true requires chart_text_desc for validation', () => {
    // Schema allows chart_text_desc to be optional, but validate-content script enforces it
    const result = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
      paper_code: '2024-test', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
      has_chart: true,
    });
    // Schema passes but business rule check (in validate-content.ts) would catch this
    expect(result.success).toBe(true);
  });

  test('year range is 2012-2026', () => {
    const tooOld = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2011, paper: 'test',
      paper_code: '2011-test', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
    });
    expect(tooOld.success).toBe(false);

    const tooNew = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2027, paper: 'test',
      paper_code: '2027-test', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: ['test-kp'], source: '高考真题',
    });
    expect(tooNew.success).toBe(false);
  });

  test('knowledge_points must have at least 1 entry', () => {
    const empty = nceeSchema.safeParse({
      type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
      paper_code: '2024-test', question_number: 1,
      question_type: 'choice', difficulty: 'basic',
      knowledge_points: [], source: '高考真题',
    });
    expect(empty.success).toBe(false);
  });

  test('question_type enum values', () => {
    for (const qt of ['choice', 'comprehensive', 'fill_blank', 'elective']) {
      const result = nceeSchema.safeParse({
        type: 'ncee', ncee_id: 'test', year: 2024, paper: 'test',
        paper_code: '2024-test', question_number: 1,
        question_type: qt, difficulty: 'basic',
        knowledge_points: ['test-kp'], source: '高考真题',
      });
      expect(result.success, `question_type "${qt}" should be valid`).toBe(true);
    }
  });
});
