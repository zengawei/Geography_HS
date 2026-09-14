# 知识点 ID 映射裁定表

> 状态：**A 类已执行，B/C/D 类待裁定**
> 生成时间：2026-09-14
> 数据来源：`npm run validate`（修复后）+ 共现分析

## 背景

知识点内容曾从 YAML 迁移为 JSON，但 `scripts/validate-content.ts` 与
`scripts/build-knowledge-graph.ts` 仍按 `.yaml/.yml` 过滤，导致知识点集合恒为空。
校验器因此输出 `Knowledge points: 0`，把 1959 道真题的知识点引用**全量**误判为
unknown，产生 2306 个假错误，真实缺陷反被掩盖（commit `b99e0b5` 已修复）。

修复后暴露出真实的悬空引用。由于两个真题页面会把 `knowledge_points` 直接渲染为链接：

```astro
// src/pages/ncee/[paperCode]/index.astro:127
// src/pages/ncee/[paperCode]/[questionNum]/index.astro:67
<a href={`/Geography_HS/knowledge/${kpId}/`}>{kpId}</a>
```

每个悬空 ID 在已部署站点上都是一个 **404 死链**。

| 阶段 | 悬空引用数 | 悬空 ID 种类 |
|---|---|---|
| 修复校验器后（暴露真实值） | 457 | 37 |
| A 类执行后（当前） | **356** | **26** |

---

## A 类：已执行（语义无歧义的近似错配）

判定依据：词形/词序差异或术语同义，映射目标唯一且无需学科判断。
执行方式：一次性脚本按行精确替换 frontmatter 中 `  - "<id>"`，目标 ID 必须先通过
「存在于 74 个知识点」校验，否则脚本终止。

| 悬空 ID | → 目标 ID | 目标名称 | 处数 |
|---|---|---|---|
| `agriculture-location` | `agricultural-location` | 农业区位 | 27 |
| `industry-location` | `industrial-location` | 工业区位 | 16 |
| `natural-integrity` | `ecosystem-integrity` | 生态系统整体性 | 14 |
| `transportation` | `transportation-layout` | 交通运输布局 | 13 |
| `natural-disasters` | `natural-hazards` | 自然灾害 | 11 |
| `green-economy` | `green-development` | 绿色发展 | 8 |
| `service` | `service-industry` | 服务业 | 4 |
| `time-and-date` | `earth-rotation` | 地球自转 | 3 |
| `typhoon` | `natural-hazards` | 自然灾害 | 2 |
| `coordinate-grid` | `coordinate-system` | 经纬网 | 2 |
| `earthquake` | `natural-hazards` | 自然灾害 | 1 |
| **合计** | | | **101** |

**执行结果核验**

- 受影响文件：96 个；改动行 199 行，经逐行比对**全部**为 `knowledge_points` 列表项，无越界改动
- `git diff --numstat` 合计 `+98 −101`：98 处替换（±98）+ 3 处去重删除（−3）
- **去重 3 例**（映射后与同题已有 ID 重复，已删除冗余项）：
  - `2024/shanghai/q01.md`、`2025/beijing/q01.md`、`2026/new-gao-kao-1/q01.md`
  - 均为 `time-and-date` → `earth-rotation`，而该题已含 `earth-rotation`
- 校验错误 457 → **356**（正好 −101），悬空 ID 37 → **26**
- `npm test` 23/23 通过；`npm run build` 2154 页构建成功

---

## B 类：待裁定（单目标映射）

「共现」列 = 与该悬空 ID 出现在**同一道题**里的合法知识点及其频次，是判断语义的最强线索。
「无共现」表示该 ID 是那些题的**唯一**标注。

| 悬空 ID | 处数 | 共现证据 | 建议目标 | 置信度 |
|---|---|---|---|---|
| `celestial-system` | 98 | 无共现 | `earth-position`（地球的位置） | ⚠️ 中 — **建议先抽查** |
| `urban-problems` | 30 | 无共现 | `urbanization`（城市化）或 `urban-planning`（城市规划） | ⚠️ 中 — 二选一 |
| `natural-differentiation` | 29 | climate-types(11), vegetation(8), world-regions(4) | `ecosystem-differentiation`（生态系统差异性） | ✅ 高 |
| `eco-environment-region` | 29 | sustainable-development(21), ecosystem-integrity(8) | `environmental-protection`（环境保护） | ⚠️ 中 |
| `regional-coordination` | 28 | industrial-transfer(14), urbanization(3) | `regional-development`（区域发展） | ✅ 中高 |
| `exogenic-landform` | 15 | plate-tectonics(5), china-terrain(3) | `geological-processes`（地质作用） | ⚠️ 中 |
| `energy-security` | 14 | sustainable-development(4), resource-allocation(2) | `resource-security`（资源安全） | ✅ 高 |
| `urban-radiation` | 11 | industrial-transfer(4) | `urban-hierarchy`（城市等级体系） | ✅ 中高 |
| `carbon-emission` | 11 | sustainable-development(3), green-development(1) | `green-development`（绿色发展） | ⚠️ 中 |
| `geomorphic-profile` | 8 | plate-tectonics(2) | `landforms`（地貌）或 `contour-lines`（等高线） | ⚠️ 低 — 需看题 |
| `general-geography` | 8 | 无共现 | `world-geography`（世界地理概况） | ⚠️ 低 |
| `marine-development` | 6 | sustainable-development(4), transportation-layout(3) | `china-coastal`（中国沿海） | ⚠️ 低-中 |
| `china-ecological` | 6 | sustainable-development(5) | `ecological-security`（生态安全） | ✅ 中高 |
| `natural-zones` | 5 | 无共现 | `five-zones`（五带划分）或 `ecosystem-differentiation` | ⚠️ 低 — 二选一 |
| `industry-regions` | 5 | industrial-location(5) | `china-industry`（中国工业） | ✅ 中高 |
| `resource-exploitation` | 4 | industrial-location(1), plate-tectonics(1), sustainable-development(1) | `resource-allocation`（资源配置） | ⚠️ 中 |
| `earth-in-universe` | 3 | 无共现 | `earth-position`（地球的位置） | ✅ 高（近乎同义） |
| `food-security` | 2 | agricultural-location(2), sustainable-development(2) | `resource-security`（资源安全） | ⚠️ 中 |
| `karst-coastal-landform` | 1 | plate-tectonics(1) | `landforms`（地貌） | ✅ 中高 |
| `agriculture-regions` | 1 | agricultural-location(1) | `china-agriculture`（中国农业） | ✅ 中高 |
| **小计** | **314** | | | |

### 关于 `celestial-system`（98 处，占剩余量 28%）

这是最大宗，且**全部为唯一标注**（无共现），分布上几乎每套卷出现 1 次，
形态更像生成时的**兜底默认值**而非逐题判定结果。因此：

- 不建议未经抽查就整批映射到 `earth-position`
- 建议先抽查 5–10 道题的实际题干，确认是否真属「天体系统／地球在宇宙中的位置」
- 若抽查发现题目主题分散，则应逐题重新标注，而非统一映射

搞定这一项即可消除剩余错误的 28%，性价比最高。

---

## C 类：待裁定（一对多，需拆分而非替换）

这类悬空 ID 对应**多个**现存知识点，直接替换会丢失信息或造成误标。
执行时需要按题目内容判断，或同时写入多个 ID（脚本需支持一对多展开 + 去重）。

| 悬空 ID | 处数 | 共现证据 | 候选目标（多选） |
|---|---|---|---|
| `river-lake-hydrology` | 13 | water-cycle(7), china-rivers(1) | `river-characteristics`（河流特征）+ `lakes`（湖泊） |
| `geo-it` | 12 | map-elements(1) | `gis-application`（地理信息系统）/ `gps-application`（全球定位系统）/ `remote-sensing`（遥感技术）— 需按题三选一 |
| `pressure-monsoon` | 4 | climate-types(2), weather-systems(2), atmospheric-circulation(1) | `pressure-belts`（气压带与风带）+ `monsoon`（季风环流） |
| **小计** | **29** | | |

---

## D 类：可能应新建知识点，而非映射

以下 ID 在现有 74 个知识点中**找不到语义对等项**，强行映射会制造错配。
建议评估是否新增知识点（新增会牵动 `kp-schema.test.ts` 的分类分布断言：
natural 26 / human 14 / regional 14 / world_china 12 / tools 8）。

| 悬空 ID | 处数 | 语义 | 说明 |
|---|---|---|---|
| `climate-change` | 6 | 全球气候变化 | 现有 `atmosphere-heating` 只讲受热过程，不含气候变化议题 |
| `ocean-properties` | 4 | 海水温度/盐度/密度 | 现有 `ocean-currents`（洋流）是海水运动，非海水性质 |
| `solar-radiation-activity` | 3 | 太阳辐射 + 太阳活动 | 两者是不同概念（辐射=能量来源，活动=黑子/耀斑），宜拆为两个知识点 |
| **小计** | **13** | | |

---

## 裁定后的执行方式

1. 在本文件对应表格的「建议目标」列直接改写为你的决定（或另附清单）
2. 复用 A 类的一次性脚本模式：
   - 映射表驱动，目标 ID 必须先校验存在于 74 个知识点，否则终止
   - 仅在 frontmatter 的 `knowledge_points` 块内做行级精确替换
   - 一对多映射需支持展开，并在同题内去重
   - 默认 dry-run，确认命中数与预期一致后再 `--apply`
3. 核验三件套：
   - `npm run validate` → 悬空引用数应等于「当前值 − 本次命中数」
   - `npm test` → 23/23
   - `npm run build` → 2154 页
4. `git diff -U0` 逐行确认所有改动都落在 `knowledge_points` 列表项上

## 遗留问题（本次未处理）

真题页面的知识点标签直接显示英文 slug（如 `celestial-system`）而非中文名称，
且未对不存在的 ID 做降级处理（渲染为纯文本而非死链）。建议后续：

- 标签文字改用知识点的 `name` 字段
- 对无法解析的 ID 降级为不可点击的纯文本，避免产生 404
