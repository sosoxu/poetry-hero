<template>
  <div class="page">
    <div class="page-title">⚙️ 设置</div>

    <!-- 孩子信息 -->
    <div class="card">
      <div class="sec-title">👧 孩子信息</div>
      <div class="field"><label>昵称</label><input v-model="profile.name" /></div>
      <div class="field"><label>头像（山海经异兽）</label>
        <div class="avatars">
          <button v-for="b in BEASTS" :key="b.id" class="avatar-btn" :class="{ on: profile.avatar === b.id }" @click="pickBeast(b)">
            <img v-if="!imgFails.has(b.id)" :src="beastDataUri(b)" :alt="b.name" @error="imgFails.add(b.id)" />
            <span v-else class="avatar-emoji">{{ b.emoji }}</span>
            <span class="avatar-name">{{ b.name }}</span>
          </button>
        </div>
        <div class="beast-desc" v-if="currentBeast">✨ <b>{{ currentBeast.name }}</b>：{{ currentBeast.desc }}</div>
      </div>
    </div>

    <!-- 视频体检 -->
    <div class="card">
      <div class="sec-title">🔍 视频链接体检</div>
      <template v-if="canAuto">
        <p class="tip">检查全部 B 站视频是否下架（结果缓存 7 天）。失效的诗会自动切换为搜索入口，也可在编辑里手动换新链接。</p>
        <button class="btn btn-jade" @click="runCheck" :disabled="checking">
          {{ checking ? `⏳ 检查中 ${checkDone}/${checkTotal}…` : '🔍 开始体检' }}
        </button>
        <div v-if="checkResult" class="check-result">
          <div class="cr-line">✅ 正常：<b>{{ okCount }}</b> 个</div>
          <div class="cr-line cr-dead" v-if="deadList.length">⚠️ 已失效：<b>{{ deadList.length }}</b> 个（对应诗页已自动换成搜索链接）</div>
          <div class="cr-dead-list" v-if="deadList.length">
            <span v-for="d in deadList" :key="d" class="cr-poem">{{ d }}</span>
          </div>
          <div class="cr-line" v-if="unknownCount" style="color:var(--ink-soft)">❓ 无法确认：{{ unknownCount }} 个（网络原因，下次再查）</div>
        </div>
      </template>
      <template v-else>
        <p class="tip">网页版受 B 站接口限制无法自动检测。若某个视频打不开：在该诗页点「😴 视频看不了？换搜索链接」即可一键切换；安卓 APK 版支持自动体检。</p>
      </template>
    </div>

    <!-- 数据备份 -->
    <div class="card">
      <div class="sec-title">💾 数据备份</div>
      <p class="tip">背诵记录都保存在这台手机的浏览器里。建议定期导出备份，换手机或清理浏览器前一定要先导出！</p>
      <div class="grid-2">
        <button class="btn btn-jade" @click="doExport">📤 导出备份</button>
        <button class="btn btn-blue" @click="pickFile">📥 导入恢复</button>
      </div>
      <input ref="fileInput" type="file" accept=".json,application/json" style="display:none" @change="doImport" />
      <p class="tip" v-if="lastExport">上次导出：{{ lastExport }}</p>
    </div>

    <!-- 自建诗管理 -->
    <div class="card">
      <div class="sec-title">📚 自建古诗（{{ userPoems.length }} 首）</div>
      <div v-if="!userPoems.length" class="tip">还没有自建的诗。去首页点 ➕ 添加。</div>
      <div v-for="p in userPoems" :key="p.id" class="poem-row" @click="$router.push('/poem/' + p.id)">
        <span>{{ p.title }}</span><span class="pr-author">{{ p.dynasty }}·{{ p.author }}</span>
      </div>
    </div>

    <!-- 危险区 -->
    <div class="card">
      <div class="sec-title danger">⚠️ 危险操作</div>
      <button class="btn btn-ghost btn-sm danger-btn" @click="clearRecords">清空全部背诵记录</button>
    </div>

    <div class="about">背诗小状元 v1.0 · 专为爱背诗的孩子制作 💌</div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { state, exportData, importData, allPoems, biliUrlsOf } from '../store/index.js';
import { fullCheck, canAutoCheck } from '../utils/videoCheck.js';
import { BEASTS, beastById, beastDataUri } from '../data/beasts.js';
import { sfx } from '../utils/sfx.js';

const currentBeast = ref(beastById(state.profile.avatar));
const imgFails = reactive(new Set());
function pickBeast(b) {
  state.profile.avatar = b.id;
  currentBeast.value = b;
  sfx.tap();
}

const checking = ref(false);
const checkDone = ref(0);
const checkTotal = ref(0);
const checkResult = ref(null);
const canAuto = canAutoCheck();

async function runCheck() {
  const poems = allPoems().filter(p => biliUrlsOf(p).length);
  const pairs = poems.flatMap(p => biliUrlsOf(p).map(u => ({ p, u })));
  checking.value = true;
  checkDone.value = 0;
  checkTotal.value = pairs.length;
  checkResult.value = null;
  const dead = new Set();
  let unknown = 0;
  const results = await fullCheck(pairs.map(x => x.u), (i, total, r) => {
    checkDone.value = i;
    if (r.result === 'dead') {
      const hit = pairs.find(x => x.u === r.url);
      if (hit) dead.add(hit.p.title);
    }
  });
  for (const r of results) { if (r.result === 'unknown') unknown++; }
  checkResult.value = {
    ok: results.filter(r => r.result === 'ok').length,
    dead: [...dead],
    unknown
  };
  checking.value = false;
  sfx.pass();
}

const okCount = computed(() => checkResult.value?.ok || 0);
const deadList = computed(() => checkResult.value?.dead || []);
const unknownCount = computed(() => checkResult.value?.unknown || 0);

const profile = state.profile;
const userPoems = computed(() => state.userPoems);
const fileInput = ref(null);
const lastExport = ref('');

const avatars = []; // 已改用山海经异兽头像（BEASTS）

function doExport() {
  const blob = new Blob([exportData()], { type: 'application/json' });
  const a = document.createElement('a');
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  a.href = URL.createObjectURL(blob);
  a.download = `背诗小状元备份_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  lastExport.value = new Date().toLocaleString('zh-CN');
  sfx.pass();
}

function pickFile() { fileInput.value.click(); }

function doImport(e) {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      importData(reader.result);
      alert('导入成功！数据已恢复。');
      sfx.fanfare();
    } catch (err) {
      alert('导入失败：' + err.message);
    }
  };
  reader.readAsText(f, 'utf-8');
  e.target.value = '';
}

function clearRecords() {
  if (confirm('确定清空全部背诵记录、积分和目标吗？此操作不可恢复（建议先导出备份）！')) {
    if (confirm('再次确认：真的要清空吗？')) {
      state.records = [];
      state.poemStats = {};
      state.goals = [];
      state.events = [];
      state.profile.totalPoints = 0;
      alert('已清空。');
    }
  }
}
</script>

<style scoped>
.sec-title { font-weight: 800; margin-bottom: 12px; }
.sec-title.danger { color: #c0504d; }
.tip { font-size: 13px; color: var(--ink-soft); line-height: 1.7; margin: 0 0 12px; }
.avatars { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.avatar-btn { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 4px 6px; border: 2px solid #eadfd2; border-radius: 14px; background: #fff; cursor: pointer; }
.avatar-btn img { width: 46px; height: 46px; border-radius: 50%; }
.avatar-emoji { font-size: 34px; line-height: 46px; width: 46px; height: 46px; }
.avatar-btn .avatar-name { font-size: 11px; color: var(--ink-soft); font-weight: 700; }
.avatar-btn.on { border-color: var(--primary); background: #fff3e9; }
.avatar-btn.on .avatar-name { color: var(--primary); }
.beast-desc { font-size: 13px; color: var(--ink-soft); background: #faf5ec; border-radius: 10px; padding: 9px 12px; margin-top: 10px; line-height: 1.7; }
.beast-desc b { color: var(--primary); }
.poem-row { display: flex; justify-content: space-between; padding: 10px 4px; border-bottom: 1px dashed #eee2d0; font-weight: 700; cursor: pointer; }
.poem-row:last-child { border-bottom: none; }
.pr-author { color: var(--ink-soft); font-weight: 400; font-size: 13px; }
.danger-btn { color: #c0504d; }
.check-result { margin-top: 14px; }
.cr-line { font-size: 14px; margin-bottom: 6px; }
.cr-line b { color: var(--jade); }
.cr-dead b { color: #c0504d; }
.cr-dead-list { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 8px; }
.cr-poem { background: #fdecea; color: #c0504d; font-size: 12px; font-weight: 700; border-radius: 999px; padding: 3px 10px; }
.about { text-align: center; color: #c3b6a8; font-size: 12px; padding: 10px 0 20px; }
</style>
