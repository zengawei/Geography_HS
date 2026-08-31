import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

const ROOT = join(import.meta.dirname, '..');
const KP_DIR = join(ROOT, 'src', 'content', 'knowledge-points');
const OUTPUT_DIR = join(ROOT, 'public', 'data');

interface KPNode {
  id: string;
  name: string;
  category: string;
  exam_frequency: string;
  description: string;
  key_concepts: string[];
  related_points: string[];
  ncee_count: number;
}

function loadKnowledgePoints(): KPNode[] {
  const files = readdirSync(KP_DIR).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
  const nodes: KPNode[] = [];

  for (const file of files) {
    const content = readFileSync(join(KP_DIR, file), 'utf-8');
    const data = parse(content);
    nodes.push({
      id: data.id,
      name: data.name,
      category: data.category,
      exam_frequency: data.exam_frequency,
      description: data.description,
      key_concepts: data.key_concepts || [],
      related_points: data.related_points || [],
      ncee_count: 0, // Will be updated when NCEE index is built
    });
  }

  return nodes;
}

function buildGraph(nodes: KPNode[]) {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const graph = {
    nodes: nodes.map(n => ({
      id: n.id,
      name: n.name,
      category: n.category,
      exam_frequency: n.exam_frequency,
      ncee_count: n.ncee_count,
    })),
    edges: nodes.flatMap(n =>
      n.related_points
        .filter(rp => nodes.some(node => node.id === rp))
        .map(rp => ({ source: n.id, target: rp }))
    ),
    stats: {
      total: nodes.length,
      by_category: {
        natural: nodes.filter(n => n.category === 'natural').length,
        human: nodes.filter(n => n.category === 'human').length,
        regional: nodes.filter(n => n.category === 'regional').length,
        world_china: nodes.filter(n => n.category === 'world_china').length,
        tools: nodes.filter(n => n.category === 'tools').length,
      },
    },
  };

  writeFileSync(join(OUTPUT_DIR, 'knowledge-graph.json'), JSON.stringify(graph, null, 2));
}

// Main
console.log('Building knowledge graph...');
const nodes = loadKnowledgePoints();
console.log(`Loaded ${nodes.length} knowledge points.`);
buildGraph(nodes);
console.log(`Output written to ${OUTPUT_DIR}/knowledge-graph.json`);
console.log('✅ Knowledge graph build complete.');
