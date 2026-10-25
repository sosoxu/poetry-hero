import { reactive, watch } from 'vue';
import basePoems from '../data/poems.json';

const KEY = 'poetry-hero-v1';

// ---------- 等级 ----------
export const LEVELS = [
  { min: 0, name: '小书童', icon: '📖' },
  { min: 60, name: '诗童', icon: '🪶' },
  { min: 150, name: '小秀才', icon: '🎋' },
  { min: 300, name: '小举人', icon: '🎓' },
  { min: 550, name: '小进士', icon: '🏮' },
  { min: 900, name: '翰林学士', icon: '🖌️' },
  { min: 1400, name: '背诗小状元', icon: '👑' }
];

// ---------- 积分规则 ----------
export const POINTS = {
  pass: 10,        // 每次背过
  firstMaster: 30, // 首次背会某诗
  recordBreak: 20, // 打破个人最快纪录
  dailyCheckin: 5, // 当天首次背诵打卡
  goalDone: 50,    // 完成目标
  quizCorrect: 3,  // 挑战答对一题
  quizPerfect: 10  // 挑战全对奖励
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const d = JSON.parse(raw);
      return {
        profile: d.profile || { name: '小诗人', avatar: '🐼', totalPoints: 0 },
        userPoems: d.userPoems || [],
        records: d.records || [],
        poemStats: d.poemStats || {},
        goals: d.goals || [],
        events: d.events || [],
        videoStatus: d.videoStatus || {},      // { [url]: { ok, ts } } 视频有效性缓存
        poemOverrides: d.poemOverrides || {},   // { [poemId]: {...} } 内置诗的家长修改覆盖层
        quiz: d.quiz || { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 }
      };
    }
  } catch (e) { console.warn('读取本地数据失败', e); }
  return {
    profile: { name: '小诗人', avatar: '🐼', totalPoints: 0 },
    userPoems: [], records: [], poemStats: {}, goals: [], events: [],
    videoStatus: {}, poemOverrides: {},
    quiz: { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 }
  };
}

export const state = reactive(load());

watch(state, () => {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('保存失败', e); }
}, { deep: true });

// ---------- 工具 ----------
export function dayKey(ts) {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function allPoems() {
  const base = basePoems.map(p => state.poemOverrides[p.id] ? { ...p, ...state.poemOverrides[p.id] } : p);
  return [...base, ...state.userPoems];
}

export function getPoem(id) {
  return allPoems().find(p => p.id === id);
}

// ---------- 视频有效性 ----------
const CHECK_TTL = 7 * 24 * 3600 * 1000; // 检测结果缓存7天

export function videoOk(url) {
  const s = state.videoStatus[url];
  if (!s) return null;           // 未知
  return s.ts + CHECK_TTL > Date.now() ? s.ok : null; // 过期视为未知
}

export function setVideoStatus(url, ok) {
  state.videoStatus[url] = { ok, ts: Date.now() };
}

export function biliUrlsOf(poem) {
  return (poem.videos || []).filter(v => /bilibili\.com\/video\/BV\w+/.test(v.url)).map(v => v.url);
}

export function levelOf(points) {
  let lv = LEVELS[0], next = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) { lv = LEVELS[i]; next = LEVELS[i + 1] || null; }
  }
  return { level: lv, next };
}

// 连续打卡天数（截至今天，含今天）
export function currentStreak() {
  const days = new Set(state.records.filter(r => r.passed).map(r => dayKey(r.ts)));
  if (!days.size) return 0;
  let streak = 0;
  const d = new Date();
  // 若今天没背，从昨天起算（保持已获得的连续天数显示）
  if (!days.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
  while (days.has(dayKey(d.getTime()))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function statsOf(poemId) {
  return state.poemStats[poemId] || { passes: 0, fails: 0, fastestSec: null, mastered: false, masteredTs: null, stars: 0, lastTs: null, totalPoints: 0 };
}

// ---------- 背诵记录 ----------
export function addRecord({ poemId, durationSec, passed }) {
  const now = Date.now();
  const prev = statsOf(poemId);
  const firstMaster = passed && !prev.mastered;
  const recordBreak = passed && prev.fastestSec != null && durationSec < prev.fastestSec;
  const newRecord = passed && (prev.fastestSec == null || durationSec < prev.fastestSec);
  const todayHas = state.records.some(r => r.passed && dayKey(r.ts) === dayKey(now));

  let points = 0;
  if (passed) {
    points += POINTS.pass;
    if (firstMaster) points += POINTS.firstMaster;
    if (recordBreak) points += POINTS.recordBreak;
    if (!todayHas) points += POINTS.dailyCheckin;
  }

  const rec = {
    id: 'r' + now + Math.floor(Math.random() * 1000),
    poemId, ts: now, durationSec, passed,
    firstMaster, recordBreak, points
  };
  state.records.push(rec);

  if (passed) {
    const passes = prev.passes + 1;
    const stars = passes >= 3 ? 3 : passes;
    state.poemStats[poemId] = {
      ...prev,
      passes,
      fails: prev.fails,
      fastestSec: Math.round(durationSec),
      mastered: true,
      masteredTs: firstMaster ? now : prev.masteredTs,
      stars,
      lastTs: now,
      totalPoints: (prev.totalPoints || 0) + points
    };
  } else {
    state.poemStats[poemId] = { ...prev, fails: prev.fails + 1, lastTs: now };
  }

  state.profile.totalPoints += points;

  // 事件流（用于庆祝动画等）
  if (recordBreak || firstMaster) {
    state.events.push({ id: 'e' + now, ts: now, type: recordBreak ? 'recordBreak' : 'firstMaster', poemId, durationSec });
  }

  const completedGoals = checkGoals();

  const lvBeforeAdd = levelOf(state.profile.totalPoints - points).level;
  const lvAfter = levelOf(state.profile.totalPoints).level;

  return {
    record: rec, points, firstMaster, recordBreak, newRecord,
    prevFastest: prev.fastestSec, starsAfter: passed ? state.poemStats[poemId].stars : prev.stars,
    levelUp: lvAfter.name !== lvBeforeAdd.name ? lvAfter : null,
    completedGoals
  };
}

// ---------- 目标 ----------
// type: 'streak' 连续打卡N天 | 'count' 累计背过N次 | 'master' 累计背会N首
export function addGoal(goal) {
  const g = {
    id: 'g' + Date.now(),
    type: goal.type, target: goal.target, reward: goal.reward,
    note: goal.note || '',
    createdAt: Date.now(), completedAt: null, redeemedAt: null, pointsAwarded: false
  };
  state.goals.push(g);
  // 若创建时目标已达成，立即完成
  if (goalProgress(g) >= g.target) {
    g.completedAt = Date.now();
    state.profile.totalPoints += POINTS.goalDone;
    g.pointsAwarded = true;
  }
  return g;
}

export function goalProgress(g) {
  let cur = 0;
  if (g.type === 'streak') {
    // 以完成时刻之前的历史最长连续段计算：扫描有背诵的日期
    const days = [...new Set(state.records.filter(r => r.passed).map(r => dayKey(r.ts)))].sort();
    let best = 0, run = 0, prevDay = null;
    for (const d of days) {
      if (prevDay) {
        const diff = (new Date(d) - new Date(prevDay)) / 86400000;
        run = diff === 1 ? run + 1 : 1;
      } else run = 1;
      best = Math.max(best, run);
      prevDay = d;
    }
    cur = best;
  } else if (g.type === 'count') {
    cur = state.records.filter(r => r.passed).length;
  } else if (g.type === 'master') {
    cur = Object.values(state.poemStats).filter(s => s.mastered).length;
  }
  return Math.min(cur, g.target);
}

function checkGoals() {
  const done = [];
  for (const g of state.goals) {
    if (!g.completedAt && goalProgress(g) >= g.target) {
      g.completedAt = Date.now();
      state.profile.totalPoints += POINTS.goalDone;
      g.pointsAwarded = true;
      done.push(g);
    }
  }
  return done;
}

export function redeemGoal(id) {
  const g = state.goals.find(x => x.id === id);
  if (g && g.completedAt && !g.redeemedAt) g.redeemedAt = Date.now();
}

export function removeGoal(id) {
  state.goals = state.goals.filter(g => g.id !== id);
}

// ---------- 诗句挑战 ----------
// results: 本局每题对错数组
export function addQuizResult({ correct, total, bestStreak }) {
  let points = correct * POINTS.quizCorrect;
  if (correct === total && total > 0) points += POINTS.quizPerfect;
  state.profile.totalPoints += points;
  state.quiz.answered += total;
  state.quiz.correct += correct;
  state.quiz.runs += 1;
  if (bestStreak > state.quiz.bestStreak) state.quiz.bestStreak = bestStreak;
  if (correct > state.quiz.bestScore) state.quiz.bestScore = correct;
  return points;
}

// ---------- 自定义诗 ----------
import kbData from '../data/poems-kb.json';

// 规范化文本用于匹配（去标点/空白/书名号/括号变体）
function normText(s) {
  return (s || '').replace(/[《》【】\s　·（）()、，。！？：；'']/g, '')
    .replace('（', '').replace('）', '');
}

/**
 * 按标题+作者匹配知识库（先匹配内置99首，再匹配知识库）
 * @returns {{source:'builtin'|'kb', data:object, linesMatched:boolean}|null}
 */
export function matchPoemKnowledge(title, author, lines) {
  const nt = normText(title);
  const na = normText(author);
  const myLines = lines.map(normText).join('|');
  const myFull = lines.map(normText).join('');
  // 优先内置诗库（内容最全，含视频与场景）
  for (const pool of [allPoems(), kbData]) {
    for (const p of pool) {
      if (normText(p.title) !== nt) continue;
      if (na && normText(p.author) !== na) continue;
      const libLines = p.lines.map(normText).join('|');
      const libFull = p.lines.map(normText).join('');
      // 逐句一致，或全文一致（允许分句差异，如叠句诗）
      const linesMatched = myLines === libLines || (myFull && myFull === libFull);
      return {
        source: pool === kbData ? 'kb' : 'builtin',
        data: p,
        linesMatched
      };
    }
  }
  return null;
}

// 生成B站/抖音搜索直达视频入口（任何诗都可用）
export function makeSearchVideos(title, author) {
  const kw = encodeURIComponent((title + ' ' + (author || '')).trim() + ' 古诗讲解');
  const kwDy = encodeURIComponent((title + ' '.trim() + (author || '')).trim() + ' 古诗');
  return [
    { title: '🔍 B站搜索讲解视频', url: 'https://search.bilibili.com/all?keyword=' + kw, external: true },
    { title: '🎵 抖音搜索讲解视频', url: 'https://www.douyin.com/search/' + kwDy, external: true }
  ];
}

// 从匹配结果提取可复用的资料
export function knowledgeToPoemFields(match) {
  const d = match.data;
  return {
    theme: d.theme || 'spring',
    background: d.background || '',
    meaning: d.meaning || '',
    authorIntro: d.authorIntro || '',
    words: (d.words || []).map(w => ({ ...w })),
    lineNotes: match.linesMatched ? (d.lineNotes || []).map(n => ({ ...n })) : [],
    videos: makeSearchVideos(d.title, d.author)
  };
}
export function addCustomPoem(p) {
  const id = 'u' + Date.now();
  const poem = {
    id, title: p.title, dynasty: p.dynasty || '', author: p.author || '',
    lines: p.lines, theme: p.theme || 'auto', custom: true,
    background: p.background || '', meaning: p.meaning || '',
    authorIntro: p.authorIntro || '', words: p.words || [],
    lineNotes: p.lineNotes || [],
    videos: p.videos || [], customImage: p.customImage || ''
  };
  state.userPoems.push(poem);
  return poem;
}

export function updatePoem(id, patch) {
  const i = state.userPoems.findIndex(p => p.id === id);
  if (i >= 0) {
    Object.assign(state.userPoems[i], patch);
    return;
  }
  // 内置诗：写入覆盖层（不改动内置数据文件）
  const base = basePoems.find(p => p.id === id);
  if (base) {
    state.poemOverrides[id] = { ...(state.poemOverrides[id] || {}), ...patch };
  }
}

export function deletePoem(id) {
  state.userPoems = state.userPoems.filter(p => p.id !== id);
  state.records = state.records.filter(r => r.poemId !== id);
  delete state.poemStats[id];
}

// ---------- 备份 ----------
export function exportData() {
  return JSON.stringify({ ...state, _poems: allPoems().length, _exportedAt: new Date().toISOString() }, null, 2);
}

export function importData(json) {
  const d = JSON.parse(json);
  if (!d || typeof d !== 'object' || !('records' in d)) throw new Error('文件格式不正确');
  state.profile = d.profile || state.profile;
  state.userPoems = d.userPoems || [];
  state.records = d.records || [];
  state.poemStats = d.poemStats || {};
  state.goals = d.goals || [];
  state.events = d.events || [];
  state.videoStatus = d.videoStatus || {};
  state.poemOverrides = d.poemOverrides || {};
}
