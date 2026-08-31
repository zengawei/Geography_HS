import { defineCollection, z } from 'astro:content';

// 共用教材枚举（nceeSchema 和 knowledgePointSchema 共享）
const textbookEnum = z.enum([
  'required-1', 'required-2',
  'selective-1', 'selective-2', 'selective-3',
]);

const nceeSchema = z.object({
  type: z.literal('ncee'),
  ncee_id: z.string(),
  year: z.number().int().min(2012).max(2026),
  paper: z.string(),
  paper_code: z.string().regex(
    /^\d{4}-[a-z0-9-]+$/,
    'paper_code 必须全小写，短横线分隔，格式: {year}-{type}-{suffix}'
  ),
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

const knowledgePointSchema = z.object({
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

const nceeCollection = defineCollection({
  type: 'content',
  schema: nceeSchema,
});

const knowledgePoints = defineCollection({
  type: 'data',
  schema: knowledgePointSchema,
});

export const collections = {
  'textbooks/ncee': nceeCollection,
  'knowledge-points': knowledgePoints,
};

// 导出 schema 供构建脚本和测试使用
export { nceeSchema, knowledgePointSchema, textbookEnum };
