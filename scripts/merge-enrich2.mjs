// 合并扩写内容（backgroundRich/meaningRich/lineNotes）到 poems.json
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';

const batches = [1, 2, 3, 4].map(i => `scripts/enrich2/batch${i}.json`);
const enrich = {};
for (const f of batches) {
  if (!existsSync(f)) { console.error('缺少:', f); process.exit(1); }
  Object.assign(enrich, JSON.parse(readFileSync(f, 'utf8')));
}

const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
const problems = [];
let withNotes = 0;
for (const p of poems) {
  const e = enrich[p.id];
  if (!e) { problems.push(`缺: ${p.id}`); continue; }
  p.backgroundRich = e.backgroundRich || '';
  p.meaningRich = e.meaningRich || '';
  if (Array.isArray(e.lineNotes) && e.lineNotes.length === p.lines.length) {
    // 校验 line 与原诗一致
    for (let i = 0; i < e.lineNotes.length; i++) {
      if (e.lineNotes[i].line !== p.lines[i]) problems.push(`${p.id} 第${i + 1}句不匹配: "${e.lineNotes[i].line}" vs "${p.lines[i]}"`);
    }
    p.lineNotes = e.lineNotes;
    withNotes++;
  } else {
    problems.push(`${p.id} lineNotes数量不符: ${e.lineNotes?.length}/${p.lines.length}`);
  }
  if (!p.backgroundRich || !p.meaningRich) problems.push(`${p.id} 富文本为空`);
}

if (problems.length) {
  console.error('发现', problems.length, '个问题:');
  problems.forEach(x => console.error(' -', x));
  process.exit(1);
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
const size = Math.round(statSync('src/data/poems.json').size / 1024);
console.log(`✅ 已合并73首扩写内容（${withNotes}首含逐句讲解），文件 ${size}KB`);
