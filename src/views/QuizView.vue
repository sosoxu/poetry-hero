<template>
  <div class="page">
    <div class="page-title">🎮 诗句挑战</div>

    <!-- 首页 -->
    <template v-if="stage === 'home'">
      <div class="card q-intro">
        <div class="qi-emoji bounce">🏮</div>
        <p class="qi-text">随机抽取诗句考考你！<br />接下句、补上句、据意猜句、巧填字、猜诗题<br />答对一题 <b>+3 分</b>，全对再奖 <b>+10 分</b>！</p>
        <button class="btn btn-primary btn-block" @click="start">🚀 开始挑战（10题）</button>
      </div>
      <div class="card" v-if="state.quiz.runs">
        <div class="q-stats">
          <div class="qs"><b>{{ state.quiz.runs }}</b><span>挑战局数</span></div>
          <div class="qs"><b>{{ state.quiz.bestScore }}</b><span>单局最佳</span></div>
          <div class="qs"><b>{{ state.quiz.bestStreak }}</b><span>最长连对</span></div>
          <div class="qs"><b>{{ acc }}%</b><span>总正确率</span></div>
        </div>
      </div>
    </template>

    <!-- 答题 -->
    <template v-else-if="stage === 'play'">
      <div class="q-meta">
        <span class="badge badge-blue">{{ TYPE_LABEL[q.type] }}</span>
        <span class="q-progress">{{ idx + 1 }} / {{ questions.length }}</span>
        <span class="q-streak" v-if="streak >= 2">🔥 连对{{ streak }}</span>
      </div>
      <div class="card q-card">
        <div class="q-prompt">{{ q.prompt }}</div>
        <div class="q-options">
          <button v-for="(opt, i) in q.options" :key="i" class="q-opt"
            :class="{ right: answered && opt === q.answer, wrong: answered && opt !== q.answer && opt === picked, dim: answered && opt !== q.answer && opt !== picked }"
            @click="choose(opt)">
            <span class="q-opt-txt">{{ opt }}</span>
          </button>
        </div>
        <div class="q-feedback" v-if="answered">
          <template v-if="picked === q.answer">✅ 太棒了！</template>
          <template v-else>💪 正确答案：{{ q.answer }}</template>
          <span class="q-from">（《{{ q.poemTitle }}》）</span>
        </div>
      </div>
    </template>

    <!-- 结果 -->
    <template v-else>
      <div class="card q-intro">
        <div class="qi-emoji">{{ perfect ? '🏆' : (correct >= 6 ? '🎉' : '💪') }}</div>
        <h2 class="q-result-title">{{ perfect ? '全对！诗坛小状元！' : (correct >= 6 ? '表现不错！' : '再接再厉！') }}</h2>
        <div class="q-result">
          <div class="row">答对 <b>{{ correct }} / {{ questions.length }}</b> 题</div>
          <div class="row">本局最长连对 <b>{{ runBestStreak }}</b> 题 🔥</div>
          <div class="row">获得 <b class="gold">+{{ earnedPoints }}</b> 积分<span v-if="perfect">（含全对奖励+10）</span></div>
        </div>
        <button class="btn btn-primary btn-block" @click="start">🔄 再来一轮</button>
        <button class="btn btn-ghost btn-sm" @click="stage = 'home'">返回</button>
      </div>
    </template>

    <Confetti :trigger="confettiTick" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { state, addQuizResult } from '../store/index.js';
import { makeQuiz, TYPE_LABEL } from '../utils/quiz.js';
import Confetti from '../components/Confetti.vue';
import { sfx } from '../utils/sfx.js';

const stage = ref('home');
const questions = ref([]);
const idx = ref(0);
const picked = ref(null);
const answered = ref(false);
const correct = ref(0);
const streak = ref(0);
const runBestStreak = ref(0);
const earnedPoints = ref(0);
const confettiTick = ref(0);

const q = computed(() => questions.value[idx.value] || null);
const perfect = computed(() => questions.value.length > 0 && correct.value === questions.value.length);
const acc = computed(() => state.quiz.answered ? Math.round(state.quiz.correct / state.quiz.answered * 100) : 0);

function start() {
  questions.value = makeQuiz(10);
  if (!questions.value.length) { alert('题库生成失败'); return; }
  idx.value = 0; picked.value = null; answered.value = false;
  correct.value = 0; streak.value = 0; runBestStreak.value = 0;
  stage.value = 'play';
  sfx.start();
}

function choose(opt) {
  if (answered.value) return;
  picked.value = opt;
  answered.value = true;
  const ok = opt === q.value.answer;
  if (ok) {
    correct.value++;
    streak.value++;
    if (streak.value > runBestStreak.value) runBestStreak.value = streak.value;
    sfx.pass();
  } else {
    streak.value = 0;
    sfx.fail();
  }
  setTimeout(next, ok ? 850 : 1500);
}

function next() {
  if (idx.value < questions.value.length - 1) {
    idx.value++;
    picked.value = null;
    answered.value = false;
  } else {
    earnedPoints.value = addQuizResult({
      correct: correct.value,
      total: questions.value.length,
      bestStreak: runBestStreak.value
    });
    stage.value = 'result';
    if (perfect.value || correct.value >= 8) { confettiTick.value++; sfx.fanfare(); }
  }
}
</script>

<style scoped>
.q-intro { text-align: center; padding: 26px 20px; }
.qi-emoji { font-size: 56px; }
.qi-text { color: var(--ink-soft); line-height: 2; margin: 10px 0 16px; font-size: 14px; }
.qi-text b { color: #b8860b; }
.q-stats { display: flex; }
.qs { flex: 1; text-align: center; }
.qs b { display: block; font-size: 19px; color: var(--primary); }
.qs span { font-size: 11px; color: var(--ink-soft); }
.q-meta { display: flex; align-items: center; gap: 10px; margin: 0 4px 10px; }
.q-progress { font-weight: 800; color: var(--ink-soft); font-size: 14px; }
.q-streak { color: var(--primary); font-weight: 800; font-size: 13px; margin-left: auto; }
.q-card { padding: 20px 16px; }
.q-prompt { font-size: 18px; font-weight: 800; line-height: 1.8; margin-bottom: 16px; text-align: center; }
.q-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.q-opt {
  border: 2px solid #eadfd2; border-radius: 14px; background: #fff;
  padding: 14px 8px; font-size: 15px; font-weight: 700; color: var(--ink);
  cursor: pointer; line-height: 1.6; transition: transform .1s;
  min-height: 64px; display: flex; align-items: center; justify-content: center;
}
.q-opt:active { transform: scale(.96); }
.q-opt.right { border-color: var(--jade); background: #e3f5ec; color: var(--jade); }
.q-opt.wrong { border-color: #c0504d; background: #fdecea; color: #c0504d; }
.q-opt.dim { opacity: .55; }
.q-feedback { text-align: center; margin-top: 14px; font-size: 15px; font-weight: 800; }
.q-from { font-size: 12px; color: var(--ink-soft); font-weight: 400; }
.q-result-title { margin: 8px 0 14px; font-size: 22px; }
.q-result { text-align: left; background: #faf5ec; border-radius: 14px; padding: 14px 18px; margin-bottom: 18px; }
.q-result .row { padding: 5px 0; font-size: 15px; }
.q-result b { color: var(--jade); }
.gold { color: #b8860b; }
</style>
