// 合并主数据 + 解读内容 + 生成拼音 → src/data/poems.json
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pinyin } from 'pinyin-pro';

const require = createRequire(import.meta.url);
const { poems } = await import('./poems-master.mjs');

const batches = [1, 2, 3, 4].map(i => `scripts/enrich/batch${i}.json`);
const enrich = {};
for (const f of batches) {
  if (!existsSync(f)) { console.error('缺少文件:', f); process.exit(1); }
  Object.assign(enrich, JSON.parse(readFileSync(f, 'utf8')));
}

const problems = [];
const out = poems.map(p => {
  const e = enrich[p.id];
  if (!e) { problems.push(`缺少解读: ${p.id} ${p.title}`); }
  else {
    for (const k of ['background', 'meaning', 'authorIntro']) {
      if (!e[k] || !e[k].trim()) problems.push(`${p.id} 字段为空: ${k}`);
    }
    if (!Array.isArray(e.words) || e.words.length < 3) problems.push(`${p.id} words 不足3个`);
  }
  // 拼音：每行一个拼音串
  const py = p.lines.map(l => pinyin(l.replace(/[，。？！、]/g, ''), { toneType: 'symbol', type: 'string', nonZh: 'consecutive' }));
  return {
    id: p.id, title: p.title, dynasty: p.dynasty, author: p.author, theme: p.theme,
    lines: p.lines, pinyin: py,
    background: e ? e.background : '',
    meaning: e ? e.meaning : '',
    authorIntro: e ? e.authorIntro : '',
    words: e ? e.words : [],
    videos: []
  };
});

if (problems.length) {
  console.error('发现', problems.length, '个问题:');
  problems.forEach(x => console.error(' -', x));
  process.exit(1);
}

// id 唯一性
const ids = out.map(p => p.id);
if (new Set(ids).size !== ids.length) { console.error('存在重复id'); process.exit(1); }

writeFileSync('src/data/poems.json', JSON.stringify(out, null, 1));
console.log(`✅ 已生成 src/data/poems.json（${out.length} 首，含拼音与全部解读）`);
