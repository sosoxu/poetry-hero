<template>
  <div class="page detail" v-if="poem">
    <!-- 场景头图 -->
    <div class="scene-wrap" v-if="poem.customImage">
      <img :src="poem.customImage" class="custom-img" @error="imgError = true" v-if="!imgError" />
      <div class="scene-fallback" v-if="imgError"><ThemedScene :theme="poem.theme" /></div>
    </div>
    <div class="scene-wrap" v-else>
      <ThemedScene :theme="poem.theme" :props="poem.sceneProps || []" />
    </div>
    <div class="scene-bar">
      <button class="back" @click="$router.back()">‹ 返回</button>
      <div class="head-info">
        <h1>{{ poem.title }}</h1>
        <div class="author">〔{{ poem.dynasty }}〕{{ poem.author }}</div>
      </div>
      <button class="edit-btn" @click="editOpen = true">✏️</button>
    </div>

    <!-- 诗文 -->
    <div class="card poem-card">
      <div class="py-toggle" @click="showPy = !showPy">{{ showPy ? '隐藏拼音' : '显示拼音' }} 🈶</div>
      <button class="speak-icon" :class="{ on: speaking }" v-if="ttsSupported" @click="speaking ? stopSpeak() : startSpeak()" :aria-label="speaking ? '停止朗读' : '朗读古诗'">{{ speaking ? '📢' : '🔊' }}</button>
      <div class="poem-lines">
        <span class="ln" :class="{ speaking: speakingIdx === i }" v-for="(l, i) in poem.lines" :key="i">
          <span class="py" v-if="showPy && poem.pinyin && poem.pinyin[i]">{{ poem.pinyin[i] }}</span>{{ l }}
        </span>
      </div>
    </div>

    <!-- 背诵挑战 -->
    <div class="card recite-card">
      <div class="recite-head">🏆 背诵挑战</div>
      <div class="recite-stats">
        <div class="rs"><b>{{ st.fastestSec != null ? fmt(st.fastestSec) : '—' }}</b><span>最快纪录</span></div>
        <div class="rs"><b>{{ st.passes || 0 }}</b><span>背过次数</span></div>
        <div class="rs"><b class="stars">{{ '★'.repeat(st.stars) || '☆' }}{{ st.stars ? '☆'.repeat(3 - st.stars) : '' }}</b><span>掌握星级</span></div>
      </div>
      <div class="mastered-line" v-if="st.mastered">
        ✅ {{ st.masteredTs ? new Date(st.masteredTs).toLocaleDateString('zh-CN') : '' }} 首次背会
      </div>
      <button class="btn btn-primary btn-block" @click="reciteOpen = true">🎤 开始背诵挑战</button>
    </div>

    <!-- 自动生成资料标识 -->
    <div class="autofill-badge" v-if="poem.custom && (poem.background || poem.lineNotes && poem.lineNotes.length)">✨ 资料由内置知识库自动生成，可在 ✏️ 中调整</div>

    <!-- 折叠资料 -->
    <div class="section-gap"></div>
    <CollapsePanel title="背景故事" icon="📜"><p class="enrich">{{ poem.backgroundRich || poem.background || '还没有资料，点右上角 ✏️ 补充吧' }}</p></CollapsePanel>
    <CollapsePanel title="诗意与寓意" icon="💡">
      <p class="enrich pre">{{ poem.meaningRich || poem.meaning || '还没有资料，点右上角 ✏️ 补充吧' }}</p>
    </CollapsePanel>
    <CollapsePanel title="逐句讲解" icon="🎐" v-if="poem.lineNotes && poem.lineNotes.length">
      <div class="ln-row" v-for="(n, i) in poem.lineNotes" :key="i">
        <div class="ln-line">{{ n.line }}</div>
        <div class="ln-note">{{ n.note }}</div>
      </div>
    </CollapsePanel>
    <CollapsePanel title="作者介绍" icon="✍️"><p class="enrich">{{ poem.authorIntro || '还没有资料，点右上角 ✏️ 补充吧' }}</p></CollapsePanel>
    <CollapsePanel title="词语解释" icon="🔍">
      <div v-if="poem.words && poem.words.length">
        <div class="word-row" v-for="(w, i) in poem.words" :key="i">
          <span class="w">{{ w.w }}</span><span class="ex">{{ w.ex }}</span>
        </div>
      </div>
      <p class="enrich" v-else>还没有资料，点右上角 ✏️ 补充吧</p>
    </CollapsePanel>
    <CollapsePanel title="视频讲解" icon="🎬" v-if="allVideos.length">
      <!-- 有效的B站内嵌视频 -->
      <div v-for="(v, i) in aliveBili" :key="'b' + i" class="video-item">
        <div class="v-title">▶ {{ v.title }}</div>
        <iframe :src="biliEmbed(v.url)" scrolling="no" frameborder="0" allowfullscreen class="bili-frame"></iframe>
      </div>

      <!-- 外部搜索链接 -->
      <div v-for="(v, i) in externalLinks" :key="'e' + i" class="video-item">
        <div class="v-title">{{ v.title }}</div>
        <button class="btn btn-blue btn-block v-open" @click="openExternal(v.url)">🔗 打开视频页面</button>
      </div>

      <!-- 原视频失效提示 + 自动搜索兜底 -->
      <div v-if="deadCount && !needFallback" class="dead-note">⚠️ 另一个视频源已失效，已隐藏</div>
      <template v-if="needFallback">
        <div class="dead-note">⚠️ 原视频已失效（可能被下架），已自动切换为搜索入口：</div>
        <div class="video-item" v-for="(v, i) in fallbackLinks" :key="'f' + i">
          <div class="v-title">{{ v.title }}</div>
          <button class="btn btn-blue btn-block v-open" @click="openExternal(v.url)">🔗 打开视频页面</button>
        </div>
      </template>

      <!-- 手动报失效（网页版用，APK会自动检测） -->
      <button v-if="aliveBili.length" class="btn btn-ghost btn-sm v-repair" @click="markAllDead">😴 视频看不了？换搜索链接</button>
    </CollapsePanel>

    <div class="section-gap"></div>
    <div class="danger-zone" v-if="poem.custom">
      <button class="btn btn-ghost btn-sm" @click="remove">🗑️ 删除这首诗</button>
    </div>

    <ReciteOverlay :visible="reciteOpen" :poem="poem" @close="reciteOpen = false" @done="onReciteDone" />
    <Confetti :trigger="confettiTick" />

    <!-- 编辑弹窗 -->
    <div class="overlay" v-if="editOpen" @click.self="editOpen = false">
      <div class="sheet">
        <h3 style="margin:0 0 14px">✏️ 编辑资料（家长操作）</h3>
        <div class="field"><label>背景故事</label><textarea v-model="editForm.background" rows="3"></textarea></div>
        <div class="field"><label>诗意与寓意</label><textarea v-model="editForm.meaning" rows="4"></textarea></div>
        <div class="field"><label>作者介绍</label><textarea v-model="editForm.authorIntro" rows="2"></textarea></div>
        <div class="field"><label>词语解释（每行一个：词语=解释）</label><textarea v-model="editForm.wordsText" rows="4" placeholder="孤蓬=随风飘转的蓬草，比喻远行的朋友"></textarea></div>
        <div class="field"><label>视频链接（每行一个：标题=网址，支持B站内嵌）</label><textarea v-model="editForm.videosText" rows="3" placeholder="动画讲解=https://www.bilibili.com/video/BVxxxx"></textarea></div>
        <div class="field"><label>自定义配图网址（可选）</label><input v-model="editForm.customImage" placeholder="https://…" /></div>
        <div class="field"><label>主题场景</label>
          <select v-model="editForm.theme">
            <option v-for="t in themes" :key="t" :value="t">{{ themeNames[t] }}</option>
          </select>
        </div>
        <div style="display:flex; gap:10px; margin-top:16px">
          <button class="btn btn-primary btn-block" @click="saveEdit">保存</button>
          <button class="btn btn-ghost" @click="editOpen = false">取消</button>
        </div>
      </div>
    </div>
  </div>
  <div class="page" v-else>
    <div class="empty"><div class="big">🤷</div>没有找到这首诗<br /><router-link to="/poems">返回诗集</router-link></div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPoem, statsOf, updatePoem, deletePoem, videoOk, setVideoStatus, biliUrlsOf } from '../store/index.js';
import { silentCheck, canAutoCheck } from '../utils/videoCheck.js';
import ThemedScene from '../components/ThemedScene.vue';
import CollapsePanel from '../components/CollapsePanel.vue';
import ReciteOverlay from '../components/ReciteOverlay.vue';
import Confetti from '../components/Confetti.vue';
import { sfx } from '../utils/sfx.js';
import { isNative as isNativeApp, speakSupported, nativeSpeakLine, nativeStop } from '../utils/speak.js';

const route = useRoute();
const router = useRouter();
const poem = computed(() => getPoem(route.params.id));
const st = computed(() => statsOf(route.params.id));

const showPy = ref(false);
const reciteOpen = ref(false);
const confettiTick = ref(0);
const editOpen = ref(false);
const imgError = ref(false);

// ---- 视频有效性 ----
const isBili = (u) => /bilibili\.com\/video\/BV\w+/.test(u);

const allVideos = computed(() => {
  const vs = (poem.value && poem.value.videos) || [];
  if (vs.length) return vs;
  // 旧数据兜底：无视频时动态生成搜索入口，保证每首诗都有视频讲解
  return poem.value ? searchLinks(poem.value) : [];
});
const biliVideos = computed(() => allVideos.value.filter(v => isBili(v.url)));
const aliveBili = computed(() => biliVideos.value.filter(v => videoOk(v.url) !== false));
const deadCount = computed(() => biliVideos.value.length - aliveBili.value.length);
const externalLinks = computed(() => allVideos.value.filter(v => !isBili(v.url)));
const needFallback = computed(() => biliVideos.value.length > 0 && aliveBili.value.length === 0);
const fallbackLinks = computed(() => poem.value ? searchLinks(poem.value) : []);

function searchLinks(p) {
  const kw = encodeURIComponent(`${p.title} ${p.author} 古诗讲解`);
  const kwDy = encodeURIComponent(`${p.title} ${p.author} 古诗`);
  return [
    { title: '🔍 B站搜索讲解视频', url: `https://search.bilibili.com/all?keyword=${kw}` },
    { title: '🎵 抖音搜索讲解视频', url: `https://www.douyin.com/search/${kwDy}` }
  ];
}

function markAllDead() {
  for (const v of biliVideos.value) setVideoStatus(v.url, false);
  sfx.tap();
}

// ---- 朗读功能（安卓原生TTS / 网页Web Speech，逐句高亮） ----
const ttsSupported = speakSupported();
const nativeMode = isNativeApp();
const speaking = ref(false);
const speakingIdx = ref(-1);
const speakSlow = computed(() => (state.settings && state.settings.speakRate) !== 'normal');
let zhVoice = null;
function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices();
  zhVoice = voices.find(v => v.lang === 'zh-CN') || voices.find(v => /zh/i.test(v.lang)) || null;
}
if (!nativeMode && 'speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
}
// 网页引擎：逐句
function speakNext() {
  if (!speaking.value) return;
  const i = speakingIdx.value + 1;
  if (i >= poem.value.lines.length) { stopSpeak(); return; }
  speakingIdx.value = i;
  const text = poem.value.lines[i];
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  if (zhVoice) u.voice = zhVoice;
  u.rate = speakSlow.value ? 0.7 : 0.95;
  u.pitch = 1.05;
  u.onend = () => { if (speaking.value) speakNext(); };
  u.onerror = () => { if (speaking.value) speakNext(); };
  speechSynthesis.speak(u);
}
// 原生引擎：逐行 await（每行读完 resolve，期间检查停止标记）
async function speakAllNative() {
  const rate = speakSlow.value ? 0.75 : 1.0;
  for (let i = 0; i < poem.value.lines.length; i++) {
    if (!speaking.value) return;
    speakingIdx.value = i;
    try {
      await nativeSpeakLine(poem.value.lines[i], rate);
    } catch (e) {
      alert('朗读失败：请在手机 设置→更多设置→语言与输入法→文字转语音 中开启并安装中文语音引擎');
      break;
    }
  }
  if (speaking.value) stopSpeak();
}
function startSpeak() {
  if (!ttsSupported) return;
  speaking.value = true;
  speakingIdx.value = -1;
  sfx.tap();
  if (nativeMode) {
    speakAllNative();
  } else {
    speechSynthesis.cancel();
    speakNext();
  }
}
function stopSpeak() {
  speaking.value = false;
  speakingIdx.value = -1;
  if (nativeMode) nativeStop();
  else if ('speechSynthesis' in window) speechSynthesis.cancel();
}

// 打开诗页时后台体检（仅APK自动检测；网页端点"看不了"手动触发）
onUnmounted(() => { if (nativeMode) nativeStop(); else if ('speechSynthesis' in window) speechSynthesis.cancel(); });

onMounted(() => {
  if (canAutoCheck() && poem.value) {
    silentCheck(biliUrlsOf(poem.value));
  }
});

const themes = ['mountain', 'river', 'moon', 'snow', 'plum', 'spring', 'autumn', 'border', 'farewell', 'child', 'rain', 'bamboo'];
const themeNames = {
  mountain: '青山', river: '江水', moon: '明月', snow: '雪景', plum: '梅花', spring: '春花',
  autumn: '秋叶', border: '边塞', farewell: '送别', child: '童趣', rain: '烟雨', bamboo: '竹林'
};

const editForm = reactive({ background: '', meaning: '', authorIntro: '', wordsText: '', videosText: '', customImage: '', theme: 'spring' });

watch([poem, editOpen], () => {
  if (poem.value && editOpen.value) {
    imgError.value = false;
    editForm.background = poem.value.background || '';
    editForm.meaning = poem.value.meaning || '';
    editForm.authorIntro = poem.value.authorIntro || '';
    editForm.wordsText = (poem.value.words || []).map(w => `${w.w}=${w.ex}`).join('\n');
    editForm.videosText = (poem.value.videos || []).map(v => `${v.title}=${v.url}`).join('\n');
    editForm.customImage = poem.value.customImage || '';
    editForm.theme = poem.value.theme || 'spring';
  }
}, { immediate: true });

function saveEdit() {
  const words = editForm.wordsText.split('\n').map(s => s.trim()).filter(Boolean).map(s => {
    const i = s.indexOf('=');
    return i > 0 ? { w: s.slice(0, i).trim(), ex: s.slice(i + 1).trim() } : { w: s, ex: '' };
  });
  const videos = editForm.videosText.split('\n').map(s => s.trim()).filter(Boolean).map(s => {
    const i = s.indexOf('=');
    return i > 0 ? { title: s.slice(0, i).trim(), url: s.slice(i + 1).trim() } : { title: '视频', url: s };
  });
  const patch = {
    background: editForm.background, meaning: editForm.meaning, authorIntro: editForm.authorIntro,
    words, videos, customImage: editForm.customImage.trim(), theme: editForm.theme
  };
  if (poem.value.custom) updatePoem(poem.value.id, patch);
  else updatePoem(poem.value.id, patch); // 基础诗也允许覆盖（存到 userPoems 的覆盖层）
  editOpen.value = false;
  sfx.tap();
  router.replace('/poem/' + route.params.id + '?t=' + Date.now());
}

function remove() {
  if (confirm('确定删除这首自建诗吗？相关记录也会删除。')) {
    deletePoem(poem.value.id);
    router.replace('/poems');
  }
}

function onReciteDone(r) {
  if (r.recordBreak || r.firstMaster) confettiTick.value++;
  st.value = statsOf(route.params.id);
}

function fmt(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${String(s % 60).padStart(2, '0')}秒` : `${s}秒`;
}
function biliEmbed(u) {
  const m = u.match(/bilibili\.com\/video\/(BV\w+)/);
  if (!m) return u;
  const pm = u.match(/[?&]p=(\d+)/);
  const page = pm ? `&page=${pm[1]}` : '';
  return `https://player.bilibili.com/player.html?bvid=${m[1]}${page}&autoplay=0&high_quality=1`;
}
async function openExternal(url) {
  sfx.tap();
  const cap = window.Capacitor;
  if (cap && cap.isNativePlatform && cap.isNativePlatform()) {
    // 原生环境：一律用系统浏览器（Custom Tab，带关闭按钮，不会顶掉应用界面）
    // 优先用 Capacitor 原生插件代理（不依赖打包的动态import）
    try {
      await cap.Plugins.Browser.open({ url, toolbarColor: '#e8541f' });
      return;
    } catch (e) { /* 尝试下一种方式 */ }
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, toolbarColor: '#e8541f' });
      return;
    } catch (e) { /* 仍失败则提示，绝不在WebView内导航 */ }
    alert('打开外部页面失败，请稍后再试');
    return;
  }
  // 网页环境
  window.open(url, '_blank');
}
</script>

<style scoped>
.detail { padding-top: 0; padding-left: 0; padding-right: 0; }
.scene-wrap { margin: 0 -0px; }
.scene-wrap :deep(.scene) { border-radius: 0; height: 200px; }
.custom-img { width: 100%; height: 200px; object-fit: cover; display: block; }
.scene-bar {
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0), var(--paper) 70%);
  margin: -30px 14px 0; padding-top: 6px; position: relative;
}
.back { border: none; background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 14px; font-weight: 700; color: var(--ink); box-shadow: var(--shadow); cursor: pointer; }
.head-info { flex: 1; }
.head-info h1 { margin: 0; font-size: 24px; }
.author { color: var(--ink-soft); font-size: 13px; }
.edit-btn { border: none; background: #fff; border-radius: 50%; width: 36px; height: 36px; font-size: 16px; box-shadow: var(--shadow); cursor: pointer; }
.detail > :deep(*) { max-width: 560px; }
.detail { padding-left: 14px; padding-right: 14px; }
.detail .scene-wrap { margin: 0 -14px; }
.poem-card { position: relative; }
.speak-icon {
  position: absolute; top: 10px; left: 10px; z-index: 2;
  width: 30px; height: 30px; border-radius: 50%;
  border: 1.5px solid #eadfd2; background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; cursor: pointer; line-height: 1;
  box-shadow: 0 2px 6px rgba(61, 43, 31, .12);
  transition: transform .12s, background .2s;
}
.speak-icon:active { transform: scale(.88); }
.speak-icon.on { background: #fff3e9; border-color: #ffb27d; animation: soundWave 1.2s ease-in-out infinite; }
@keyframes soundWave { 0%,100% { box-shadow: 0 2px 6px rgba(232, 84, 31, .15); } 50% { box-shadow: 0 2px 10px rgba(232, 84, 31, .5); } }
.poem-lines .ln.speaking { background: #fff3d6; border-radius: 10px; box-shadow: inset 0 0 0 2px #f5a623; }
.py-toggle { position: absolute; top: 10px; right: 12px; font-size: 12px; color: var(--ink-soft); cursor: pointer; font-weight: 700; }
.recite-head { font-weight: 800; margin-bottom: 10px; }
.recite-stats { display: flex; gap: 6px; margin-bottom: 8px; }
.rs { flex: 1; text-align: center; background: #faf5ec; border-radius: 12px; padding: 10px 4px; }
.rs b { display: block; font-size: 17px; color: var(--primary); }
.rs span { font-size: 11px; color: var(--ink-soft); }
.mastered-line { font-size: 13px; color: var(--jade); margin-bottom: 10px; }
.section-gap { height: 6px; }
.enrich { white-space: pre-wrap; }
.ln-row { padding: 10px 0; border-bottom: 1px dashed #eee2d0; }
.ln-row:last-child { border-bottom: none; }
.ln-line { font-weight: 800; color: var(--primary); text-align: center; font-size: 16px; margin-bottom: 4px; }
.autofill-badge { font-size: 12px; color: var(--jade); background: #e3f5ec; border-radius: 10px; padding: 8px 12px; margin-bottom: 10px; text-align: center; }
.ln-note { color: #57493d; font-size: 14px; line-height: 1.8; }
.word-row { display: flex; gap: 10px; padding: 7px 0; border-bottom: 1px dashed #eee2d0; align-items: baseline; }
.word-row:last-child { border-bottom: none; }
.w { color: var(--primary); font-weight: 800; flex-shrink: 0; }
.ex { color: #57493d; }
.video-item { margin-bottom: 12px; }
.v-title { font-weight: 700; margin-bottom: 6px; }
.bili-frame { width: 100%; height: 200px; border-radius: 12px; }
.v-open { margin-top: 4px; }
.dead-note { font-size: 12px; color: #c0504d; background: #fdecea; border-radius: 10px; padding: 8px 12px; margin-bottom: 10px; }
.v-repair { margin-top: 10px; color: var(--ink-soft); }
.danger-zone { text-align: center; padding: 6px 0 20px; }
</style>
