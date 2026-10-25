// UI 调整：诗页朗读改为左上角图标按钮、语速移至设置、头像改点击弹窗选择
import { readFileSync, writeFileSync } from 'node:fs';

// ===== 1. store：settings 字段 =====
{
  let s = readFileSync('src/store/index.js', 'utf8');
  if (!s.includes('settings:')) {
    s = s.replace(
      "        quiz: d.quiz || { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 }",
      "        quiz: d.quiz || { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 },\n        settings: d.settings || { speakRate: 'slow' }"
    );
    s = s.replace(
      "    videoStatus: {}, poemOverrides: {},\n    quiz: { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 }",
      "    videoStatus: {}, poemOverrides: {},\n    quiz: { answered: 0, correct: 0, bestStreak: 0, runs: 0, bestScore: 0 },\n    settings: { speakRate: 'slow' }"
    );
    s = s.replace(
      "  state.videoStatus = d.videoStatus || {};\n  state.poemOverrides = d.poemOverrides || {};\n}",
      "  state.videoStatus = d.videoStatus || {};\n  state.poemOverrides = d.poemOverrides || {};\n  state.settings = d.settings || { speakRate: 'slow' };\n}"
    );
    writeFileSync('src/store/index.js', s);
    console.log('store settings:', s.includes('settings: d.settings') ? '✅' : '❌');
  } else console.log('store settings: 已存在');
}

// ===== 2. PoemDetailView：朗读按钮改左上角图标，语速读设置 =====
{
  let s = readFileSync('src/views/PoemDetailView.vue', 'utf8');
  // 2a. 模板：speak-bar → 图标按钮
  const barStart = s.indexOf('      <div class="speak-bar"');
  const barEnd = s.indexOf('</div>', s.indexOf('rate-btn')) + 6;
  if (barStart > -1) {
    s = s.slice(0, barStart) +
      `      <button class="speak-icon" :class="{ on: speaking }" v-if="ttsSupported" @click="speaking ? stopSpeak() : startSpeak()" :aria-label="speaking ? '停止朗读' : '朗读古诗'">{{ speaking ? '⏹' : '▶' }}</button>` +
      s.slice(barEnd);
    console.log('2a 图标按钮:', s.includes('speak-icon') && !s.includes('speak-bar') ? '✅' : '❌');
  }
  // 2b. 语速读设置
  s = s.replace('const speakSlow = ref(true);', "const speakSlow = computed(() => (state.settings && state.settings.speakRate) !== 'normal');");
  console.log('2b 语速读设置:', s.includes("state.settings && state.settings.speakRate") ? '✅' : '❌');
  // 2c. 样式：speak-bar 系 → speak-icon
  const stStart = s.indexOf('.speak-bar {');
  const stEnd = s.indexOf('.poem-lines .ln.speaking');
  if (stStart > -1 && stEnd > stStart) {
    s = s.slice(0, stStart) +
`.speak-icon {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  width: 38px; height: 38px; border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; color: #fff; cursor: pointer;
  background: linear-gradient(135deg, #3a7bd5, #6ea8ff);
  box-shadow: 0 4px 12px rgba(58, 123, 213, .4);
  transition: transform .12s;
}
.speak-icon:active { transform: scale(.9); }
.speak-icon.on { background: linear-gradient(135deg, #d93425, #ff6f61); animation: speakPulse 1.4s ease-in-out infinite; }
@keyframes speakPulse { 0%,100% { box-shadow: 0 4px 12px rgba(217, 52, 37, .4); } 50% { box-shadow: 0 4px 18px rgba(217, 52, 37, .75); } }
` + s.slice(stEnd);
    console.log('2c 样式:', s.includes('.speak-icon {') && !s.includes('.speak-bar') ? '✅' : '❌');
  }
  writeFileSync('src/views/PoemDetailView.vue', s);
}
