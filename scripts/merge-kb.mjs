// 合并知识库主数据 + 内容批次 → src/data/poems-kb.json
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pinyin } from 'pinyin-pro';

const require = createRequire(import.meta.url);
const { kbPoems } = await import('./kb-master.mjs');

const batches = [1, 2, 3, 4, 5].map(i => `scripts/enrich4/kb${i}.json`);
const enrich = {};
const missing = [];
for (const f of batches) {
  if (!existsSync(f)) { missing.push(f); continue; }
  Object.assign(enrich, JSON.parse(readFileSync(f, 'utf8')));
}
if (missing.length) { console.error('缺少:', missing.join(', ')); process.exit(1); }

const problems = [];
const out = kbPoems.map(p => {
  const e = enrich[p.id];
  if (!e) { problems.push(`缺少解读: ${p.id}`); return null; }
  if (!e.background || !e.meaning || !e.authorIntro || !Array.isArray(e.words) || e.words.length < 3) problems.push(`${p.id} 字段不全`);
  if (!Array.isArray(e.lineNotes) || e.lineNotes.length !== p.lines.length) { problems.push(`${p.id} lineNotes数量不符`); return null; }
  e.lineNotes.forEach((n, i) => { if (n.line !== p.lines[i]) problems.push(`${p.id} 第${i + 1}句不匹配`); });
  return {
    id: p.id, title: p.title, dynasty: p.dynasty, author: p.author, theme: p.theme,
    lines: p.lines, pinyin: p.lines.map(l => pinyin(l.replace(/[，。？！、]/g, ''), { toneType: 'symbol', type: 'string', nonZh: 'consecutive' })),
    background: e.background, meaning: e.meaning, authorIntro: e.authorIntro,
    words: e.words, lineNotes: e.lineNotes
  };
}).filter(Boolean);

if (problems.length) { console.error('问题:'); problems.forEach(x => console.error(' -', x)); process.exit(1); }

writeFileSync('src/data/poems-kb.json', JSON.stringify(out, null, 1));
console.log(`✅ 已生成 src/data/poems-kb.json（${out.length} 首，${Math.round(statSync('src/data/poems-kb.json').size / 1024)}KB）`);
