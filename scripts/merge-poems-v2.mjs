// v2 合并：主数据 + 内容批次 + 拼音 + 场景道具 → src/data/poems.json
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pinyin } from 'pinyin-pro';

const require = createRequire(import.meta.url);
const { poems } = await import('./poems-master-v2.mjs');

const batches = [1, 2, 3, 4, 5, 6].map(i => `scripts/enrich3/batch${i}.json`);
const enrich = {};
const missing = [];
for (const f of batches) {
  if (!existsSync(f)) { missing.push(f); continue; }
  Object.assign(enrich, JSON.parse(readFileSync(f, 'utf8')));
}

if (missing.length) {
  console.error('缺少内容批次:', missing.join(', '));
  process.exit(1);
}

const problems = [];
const out = poems.map(p => {
  const e = enrich[p.id];
  if (!e) { problems.push(`缺少解读: ${p.id} ${p.title}`); return null; }
  for (const k of ['background', 'meaning', 'authorIntro']) {
    if (!e[k] || !e[k].trim()) problems.push(`${p.id} 字段为空: ${k}`);
  }
  if (!Array.isArray(e.words) || e.words.length < 3) problems.push(`${p.id} words 不足3个`);
  if (!Array.isArray(e.lineNotes) || e.lineNotes.length !== p.lines.length) {
    problems.push(`${p.id} lineNotes 数量不符: ${e.lineNotes?.length}/${p.lines.length}`);
  } else {
    e.lineNotes.forEach((n, i) => { if (n.line !== p.lines[i]) problems.push(`${p.id} 第${i + 1}句不匹配`); });
  }
  const py = p.lines.map(l => pinyin(l.replace(/[，。？！、]/g, ''), { toneType: 'symbol', type: 'string', nonZh: 'consecutive' }));
  return {
    id: p.id, title: p.title, dynasty: p.dynasty, author: p.author, theme: p.theme,
    lines: p.lines, pinyin: py,
    background: e.background, meaning: e.meaning, authorIntro: e.authorIntro,
    words: e.words, lineNotes: e.lineNotes,
    sceneProps: p.sceneProps || [],
    videos: [] // 由 update-videos-v2 填充
  };
}).filter(Boolean);

if (problems.length) {
  console.error('发现', problems.length, '个问题:');
  problems.forEach(x => console.error(' -', x));
  process.exit(1);
}

const ids = out.map(p => p.id);
if (new Set(ids).size !== ids.length) { console.error('存在重复id'); process.exit(1); }

writeFileSync('src/data/poems.json', JSON.stringify(out, null, 1));
console.log(`✅ 已生成 src/data/poems.json（${out.length} 首，含拼音/解读/逐句讲解）`);
