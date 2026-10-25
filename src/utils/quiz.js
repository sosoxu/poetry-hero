// 诗句挑战：题目生成器
// 题型：next 接下句 / prev 补上句 / meaning 据意猜句 / blank 填字 / title 猜诗题
import { allPoems } from '../store/index.js';

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickDistractors(pool, answer, count, sameLen) {
  const cand = pool.filter(x => x && x !== answer && (!sameLen || x.length === answer.length));
  let picked = [];
  if (sameLen && cand.length >= count) {
    picked = shuffle(cand).slice(0, count);
  } else {
    const rest = shuffle(pool.filter(x => x && x !== answer && !picked.includes(x)));
    picked = shuffle([...new Set([...cand, ...rest])]).slice(0, count);
  }
  return picked;
}

const plain = (s) => s.replace(/[，。？！、]/g, '');
const withPunct = (s) => /[，。？！、]/.test(s);

// 接下句 / 补上句
function qNextPrev(poem, type, allLines) {
  if (poem.lines.length < 2) return null;
  const i = Math.floor(Math.random() * (poem.lines.length - 1));
  const cur = poem.lines[i], nxt = poem.lines[i + 1];
  if (!cur || !nxt) return null;
  const q = type === 'next' ? cur : nxt;
  const ans = type === 'next' ? nxt : cur;
  const opts = pickDistractors(allLines, ans, 3, true);
  if (opts.length < 3) return null;
  return {
    type,
    prompt: type === 'next' ? `「${q}」的下一句是？` : `「${q}」的上一句是？`,
    answer: ans,
    options: shuffle([ans, ...opts]),
    poemId: poem.id, poemTitle: poem.title
  };
}

// 据意猜句（用逐句讲解）
function qMeaning(poem) {
  const notes = (poem.lineNotes || []).filter(n => n && n.note && n.note.length >= 8);
  if (!notes.length) return null;
  const n = rnd(notes);
  const others = [];
  for (const p2 of allPoems()) {
    if (p2.id === poem.id) continue;
    for (const ln of (p2.lineNotes || [])) if (ln && ln.line && ln.line !== n.line) others.push(ln.line);
    if (others.length > 40) break;
  }
  const opts = pickDistractors(others, n.line, 3, true);
  if (opts.length < 3) return null;
  return {
    type: 'meaning',
    prompt: `「${n.note}」——这是哪一句？`,
    answer: n.line,
    options: shuffle([n.line, ...opts]),
    poemId: poem.id, poemTitle: poem.title
  };
}

// 填字
function qBlank(poem, allChars) {
  const line = rnd(poem.lines.filter(l => plain(l).length >= 4));
  if (!line) return null;
  const chars = plain(line).split('');
  const idx = Math.floor(Math.random() * chars.length);
  const ch = chars[idx];
  const shown = line.replace(ch, '〇');
  const opts = pickDistractors(allChars, ch, 3, false).filter(c => c && c !== ch && !plain(line).includes(c));
  if (opts.length < 3) return null;
  return {
    type: 'blank',
    prompt: `「${shown}」〇 处应填哪个字？`,
    answer: ch,
    options: shuffle([ch, ...opts]),
    poemId: poem.id, poemTitle: poem.title
  };
}

// 猜诗题
function qTitle(poem, allTitles) {
  const famous = rnd(poem.lines.filter(l => plain(l).length >= 4));
  if (!famous) return null;
  const opts = pickDistractors(allTitles, poem.title, 3, false);
  if (opts.length < 3) return null;
  return {
    type: 'title',
    prompt: `「${famous}」出自哪首诗？`,
    answer: poem.title,
    options: shuffle([poem.title, ...opts]),
    poemId: poem.id, poemTitle: poem.title
  };
}

const TYPE_LABEL = { next: '接下句', prev: '补上句', meaning: '据意猜句', blank: '巧填字', title: '猜诗题' };

/** 生成一局题目（默认10题，混合题型） */
export function makeQuiz(count = 10) {
  const poems = allPoems().filter(p => p.lines && p.lines.length >= 2);
  const allLines = [];
  const allTitles = [];
  const allChars = [];
  for (const p of poems) {
    allLines.push(...p.lines.filter(l => plain(l).length >= 3));
    allTitles.push(p.title);
    for (const l of p.lines) for (const c of plain(l)) allChars.push(c);
  }

  const mix = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    if (r < 0.32) mix.push('next');
    else if (r < 0.52) mix.push('prev');
    else if (r < 0.72) mix.push('meaning');
    else if (r < 0.87) mix.push('blank');
    else mix.push('title');
  }

  const questions = [];
  const usedPoems = new Set();
  for (const type of mix) {
    let q = null;
    // 尽量不重复同一首诗
    for (let tries = 0; tries < 8 && !q; tries++) {
      const poem = rnd(poems);
      if (type !== 'title' && usedPoems.has(poem.id) && tries < 5) continue;
      if (type === 'next' || type === 'prev') q = qNextPrev(poem, type, allLines);
      else if (type === 'meaning') q = qMeaning(poem);
      else if (type === 'blank') q = qBlank(poem, allChars);
      else q = qTitle(poem, allTitles);
      if (q) usedPoems.add(poem.id);
    }
    if (q) questions.push(q);
  }
  return questions;
}

export { TYPE_LABEL };
