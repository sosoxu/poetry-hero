<template>
  <teleport to="body">
    <div class="recite-overlay" v-if="visible">
      <!-- 准备 -->
      <div v-if="stage === 'ready'" class="rc-center">
        <div class="rc-emoji bounce">🎤</div>
        <h2 class="rc-title">{{ poem.title }}</h2>
        <p class="rc-sub">{{ poem.dynasty }} · {{ poem.author }}</p>
        <div class="rc-record" v-if="stats.fastestSec != null">
          <span class="medal">🏅</span> 当前最快纪录
          <b class="rc-big">{{ fmt(stats.fastestSec) }}</b>
          <div class="rc-goal">目标：打败 {{ fmt(stats.fastestSec) }}，破纪录 +20 分！</div>
        </div>
        <div class="rc-record" v-else>
          <div class="rc-goal">第一次背诵，创造属于自己的纪录吧！</div>
        </div>
        <label class="rc-voice" v-if="voiceSupported">
          <input type="checkbox" v-model="wantVoice" />
          开启语音辅助（对着手机背，帮你对照原文）
        </label>
        <button class="btn btn-primary btn-lg" @click="startRun">🚀 开始背诵挑战</button>
        <button class="btn btn-ghost btn-sm" @click="close">返回</button>
      </div>

      <!-- 计时中 -->
      <div v-else-if="stage === 'running'" class="rc-center">
        <div class="rc-timer" :class="{ danger: secs >= 120 }">{{ fmt(secs) }}</div>
        <p class="rc-hint">背完后让爸爸妈妈按下面的按钮</p>
        <div v-if="voiceOn" class="rc-voice-box">
          <div class="rc-voice-head">🗣️ 听到的内容（辅助参考）</div>
          <div class="rc-lines">
            <div v-for="(l, i) in poem.lines" :key="i" class="rc-line" :class="{ ok: matchedLines.includes(i) }">{{ l }}</div>
          </div>
        </div>
        <div v-else class="rc-peek">
          <button class="btn btn-ghost btn-sm" @click="peek = !peek">{{ peek ? '🙈 收起原文' : '👀 看一眼原文' }}</button>
          <div v-if="peek" class="rc-lines small">
            <div v-for="(l, i) in poem.lines" :key="i" class="rc-line">{{ l }}</div>
          </div>
        </div>
        <button class="btn btn-gold btn-lg" @click="stopRun">✋ 我背完了</button>
        <button class="btn btn-ghost btn-sm" @click="giveup">放弃这次</button>
      </div>

      <!-- 判定 -->
      <div v-else-if="stage === 'judge'" class="rc-center">
        <div class="rc-emoji">🤔</div>
        <div class="rc-timer">{{ fmt(secs) }}</div>
        <p class="rc-hint">背得怎么样？请家长判定</p>
        <div class="judge-btns">
          <button class="btn btn-jade btn-lg" @click="judge(true)">✅ 背过了</button>
          <button class="btn btn-ghost btn-lg" @click="judge(false)">💪 还没背过</button>
        </div>
      </div>

      <!-- 结果 -->
      <div v-else-if="stage === 'result'" class="rc-center">
        <template v-if="result.passed">
          <div class="rc-emoji">{{ result.recordBreak ? '🏆' : '🎉' }}</div>
          <h2 class="rc-title">{{ result.recordBreak ? '破纪录啦！' : (result.firstMaster ? '首次背会！' : '背诵成功！') }}</h2>
          <div class="rc-detail card-lite">
            <div class="row">用时 <b>{{ fmt(result.record.durationSec) }}</b>
              <span v-if="result.recordBreak" class="badge badge-gold">比纪录快 {{ fmt(result.prevFastest - result.record.durationSec) }}</span>
            </div>
            <div class="row">得分 <b class="gold">+{{ result.points }}</b>
              <span v-if="result.pointsDetail" class="pts">（{{ result.pointsDetail }}）</span>
            </div>
            <div class="row">星级 <span class="stars">{{ '★'.repeat(result.starsAfter) }}{{ '☆'.repeat(3 - result.starsAfter) }}</span></div>
            <div class="row" v-if="result.levelUp">🎉 升级啦！<b>{{ result.levelUp.icon }} {{ result.levelUp.name }}</b></div>
            <div class="row" v-for="g in result.completedGoals" :key="g.id">🎯 目标达成：{{ g.reward }}（+50分）</div>
          </div>
        </template>
        <template v-else>
          <div class="rc-emoji">💪</div>
          <h2 class="rc-title">差一点点！</h2>
          <div class="rc-detail card-lite">多读几遍，明天再来挑战，你一定行！</div>
        </template>
        <button class="btn btn-primary btn-lg" @click="close">完成</button>
        <button class="btn btn-ghost btn-sm" @click="again">再来一次</button>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { statsOf, addRecord, POINTS } from '../store/index.js';
import { sfx } from '../utils/sfx.js';

const props = defineProps({ visible: Boolean, poem: Object });
const emit = defineEmits(['close', 'done']);

const stage = ref('ready');
const secs = ref(0);
const peek = ref(false);
const result = ref(null);
const wantVoice = ref(false);
const voiceText = ref('');
const matchedLines = ref([]);

const stats = computed(() => statsOf(props.poem.id));

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceSupported = !!SR;
let recog = null;
let timerId = null;

function plain(s) { return (s || '').replace(/[，。？！、·\s]/g, ''); }

function startRun() {
  stage.value = 'running';
  secs.value = 0;
  peek.value = false;
  matchedLines.value = [];
  sfx.start();
  timerId = setInterval(() => { secs.value++; }, 1000);
  if (wantVoice.value && SR) startVoice();
}

function startVoice() {
  recog = new SR();
  recog.lang = 'zh-CN';
  recog.continuous = true;
  recog.interimResults = true;
  recog.onresult = (e) => {
    let txt = '';
    for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
    voiceText.value = txt;
    matchVoice(txt);
  };
  recog.onend = () => { if (stage.value === 'running' && recog) { try { recog.start(); } catch (e) { /* noop */ } } };
  try { recog.start(); } catch (e) { /* noop */ }
}

function matchVoice(txt) {
  const t = plain(txt);
  const matched = [];
  props.poem.lines.forEach((l, i) => {
    const p = plain(l);
    // 该行是否作为子串（允许少量偏差：检查每句前4字）
    if (t.includes(p) || (p.length >= 4 && t.includes(p.slice(0, 4)))) matched.push(i);
  });
  matchedLines.value = matched;
}

function stopRun() {
  clearInterval(timerId);
  stopVoice();
  stage.value = 'judge';
}

function giveup() {
  clearInterval(timerId);
  stopVoice();
  close();
}

function stopVoice() {
  if (recog) { const r = recog; recog = null; try { r.onend = null; r.stop(); } catch (e) { /* noop */ } }
}

function judge(passed) {
  const r = addRecord({ poemId: props.poem.id, durationSec: secs.value, passed });
  const detail = [];
  if (passed) {
    detail.push(`背诵+${POINTS.pass}`);
    if (r.firstMaster) detail.push(`首次背会+${POINTS.firstMaster}`);
    if (r.recordBreak) detail.push(`破纪录+${POINTS.recordBreak}`);
    if (r.points > detail.map(s => parseInt(s.match(/\+(\d+)/)[1])).reduce((a, b) => a + b, 0)) detail.push(`打卡+${POINTS.dailyCheckin}`);
  }
  result.value = { ...r, passed, pointsDetail: detail.join(' ') };
  stage.value = 'result';
  if (passed) { r.recordBreak ? sfx.fanfare() : sfx.pass(); }
  else sfx.fail();
  if (passed) emit('done', r);
}

function again() {
  result.value = null;
  stage.value = 'ready';
}

function close() {
  clearInterval(timerId);
  stopVoice();
  stage.value = 'ready';
  result.value = null;
  emit('close');
}

function fmt(s) {
  const m = Math.floor(s / 60), ss = s % 60;
  return m > 0 ? `${m}分${String(ss).padStart(2, '0')}秒` : `${ss}秒`;
}

onUnmounted(() => { clearInterval(timerId); stopVoice(); });
</script>

<style scoped>
.recite-overlay {
  position: fixed; inset: 0; z-index: 150;
  background: linear-gradient(180deg, #fff7ec, #ffe9d2);
  overflow-y: auto; padding: 30px 22px 40px;
}
.rc-center { max-width: 420px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; gap: 14px; align-items: center; }
.rc-emoji { font-size: 64px; margin-top: 10vh; }
.rc-title { font-size: 26px; margin: 0; }
.rc-sub { color: var(--ink-soft); margin: 0; }
.rc-record { background: #fff; border-radius: 16px; padding: 12px 20px; box-shadow: var(--shadow); font-size: 15px; }
.rc-big { font-size: 22px; color: var(--primary); margin: 0 4px; }
.rc-goal { font-size: 14px; color: var(--ink-soft); margin-top: 4px; }
.medal { font-size: 20px; }
.rc-voice { font-size: 13px; color: var(--ink-soft); display: flex; gap: 6px; align-items: center; }
.rc-timer { font-size: 64px; font-weight: 900; color: var(--primary); font-variant-numeric: tabular-nums; }
.rc-timer.danger { color: var(--red); }
.rc-hint { color: var(--ink-soft); margin: 0; }
.rc-lines { background: #fff; border-radius: 14px; padding: 12px; box-shadow: var(--shadow); max-height: 34vh; overflow-y: auto; width: 100%; }
.rc-lines.small { font-size: 15px; line-height: 1.9; }
.rc-line { padding: 2px 6px; border-radius: 6px; font-size: 17px; }
.rc-line.ok { background: #e3f5ec; color: var(--jade); font-weight: 700; }
.rc-voice-box { width: 100%; }
.rc-voice-head { font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; }
.rc-peek { display: flex; flex-direction: column; gap: 8px; align-items: center; width: 100%; }
.judge-btns { display: flex; gap: 14px; }
.btn-lg { padding: 16px 30px; font-size: 19px; }
.rc-detail { background: #fff; border-radius: 16px; box-shadow: var(--shadow); padding: 16px 20px; width: 100%; text-align: left; }
.rc-detail .row { display: flex; align-items: center; gap: 8px; padding: 6px 0; font-size: 15px; flex-wrap: wrap; }
.rc-detail .row b { font-size: 17px; }
.gold { color: #d48806; }
.pts { font-size: 12px; color: var(--ink-soft); }
.card-lite { animation: popIn .3s; }
</style>
