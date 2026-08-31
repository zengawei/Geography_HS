# AGENTS.md — Geography_HS

## 项目概述
高中地理知识库静态网站。Astro + Tailwind + Vitest。覆盖人教版 2019 全册 + 2012-2026 高考地理真题。

## 开发规范
- TDD：先写测试，再写实现
- Conventional Commits：feat/fix/content/test/docs/refactor/chore
- 构建脚本用 TypeScript（npx tsx 运行），不用 Python
- 内容文件在 src/content/，构建输出在 public/data/（gitignore）
- SVG 文件在 public/svg/，遵循 SVG 规范（见 docs/requirements.md 2.2）
- 所有真题 source 必须为 "高考真题"

## 常用命令
- `npm test` — 运行测试
- `npm run validate` — 内容校验（schema + SVG + 索引完整性）
- `npm run build:scripts` — 运行构建脚本
- `npm run build` — 构建网站
- `npm run dev` — 本地开发服务器

## 目录结构
- `src/content/textbooks/ncee/` — 高考真题（Markdown + YAML frontmatter）
- `src/content/knowledge-points/` — 知识点定义（YAML）
- `src/content/config.ts` — Content Schema（Zod）
- `public/svg/` — SVG 图表文件
- `scripts/` — 构建时脚本
- `tests/` — 测试文件
- `docs/adr/` — 架构决策记录
- `docs/requirements.md` — 需求文档 v1.2
