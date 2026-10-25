<template>
  <div class="page">
    <div class="page-title">➕ 添加古诗</div>

    <div class="tabs2">
      <button :class="{ on: mode === 'paste' }" @click="mode = 'paste'">📝 粘贴诗文</button>
      <button :class="{ on: mode === 'url' }" @click="mode = 'url'">🔗 从链接导入</button>
    </div>

    <div class="card" v-if="mode === 'paste'">
      <div class="field">
        <label>把古诗粘贴到这里（第一行诗题，第二行朝代和作者，然后是诗句）</label>
        <textarea v-model="raw" rows="8" placeholder="示例：
静夜思
唐·李白
床前明月光，疑是地上霜。
举头望明月，低头思故乡。"></textarea>
      </div>
      <button class="btn btn-primary btn-block" @click="parse" :disabled="!raw.trim()">🧠 自动识别</button>
    </div>

    <div class="card" v-if="mode === 'url'">
      <div class="field">
        <label>输入古诗页面的网址（支持大多数古诗文网站）</label>
        <input v-model="url" placeholder="https://www.gushiwen.cn/…" />
      </div>
      <button class="btn btn-primary btn-block" @click="fetchUrl" :disabled="!url.trim() || fetching">
        {{ fetching ? '⏳ 抓取中…' : '🌐 抓取诗文' }}
      </button>
      <div class="url-tip">通过公共代理抓取，可能较慢或失败；失败时请切换到「粘贴诗文」方式。</div>
    </div>

    <!-- 预览编辑 -->
    <template v-if="parsed">
      <div class="section-head">✅ 识别结果（可修改）</div>
      <div class="card">
        <div class="field"><label>诗题</label><input v-model="parsed.title" /></div>
        <div class="grid-2">
          <div class="field"><label>朝代</label><input v-model="parsed.dynasty" placeholder="唐" /></div>
          <div class="field"><label>作者</label><input v-model="parsed.author" placeholder="李白" /></div>
        </div>
        <div class="field"><label>诗句（每句一行）</label><textarea v-model="parsed.linesText" rows="6"></textarea></div>
        <div class="field"><label>主题场景（决定配图风格）</label>
          <select v-model="parsed.theme">
            <option v-for="t in themes" :key="t" :value="t">{{ themeNames[t] }}</option>
          </select>
        </div>
        <div class="preview-lines">
          <div class="pv-title">{{ parsed.title }}</div>
          <div class="pv-author">〔{{ parsed.dynasty }}〕{{ parsed.author }}</div>
          <div v-for="(l, i) in finalLines" :key="i">{{ l }}</div>
        </div>
        <button class="btn btn-gold btn-block" style="margin-top:14px" @click="save" :disabled="!parsed.title.trim() || !finalLines.length">💾 保存并生成背诵页</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { addCustomPoem, matchPoemKnowledge, knowledgeToPoemFields, makeSearchVideos } from '../store/index.js';
import { sfx } from '../utils/sfx.js';

const router = useRouter();
const mode = ref('paste');
const raw = ref('');
const url = ref('');
const fetching = ref(false);
const parsed = ref(null);
const autoFilled = ref(false);

const themes = ['mountain', 'river', 'moon', 'snow', 'plum', 'spring', 'autumn', 'border', 'farewell', 'child', 'rain', 'bamboo'];
const themeNames = {
  mountain: '青山', river: '江水', moon: '明月', snow: '雪景', plum: '梅花', spring: '春花',
  autumn: '秋叶', border: '边塞', farewell: '送别', child: '童趣', rain: '烟雨', bamboo: '竹林'
};

const DYN = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '宋', '元', '明', '清', '近现代', '近代'];

function splitLines(body) {
  // 把正文拆成单句一行，保留标点
  const out = [];
  for (const seg of body.split(/\n+/)) {
    const s = seg.trim();
    if (!s) continue;
    const parts = s.match(/[^，。？！；、]+[，。？！；]?/g) || [s];
    out.push(...parts.map(x => x.trim()).filter(Boolean));
  }
  return out;
}

function parseText(text) {
  const lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean);
  if (!lines.length) return null;
  let title = '', dynasty = '', author = '', bodyStart = 0;

  // 第一行：诗题（可能带《》）
  title = lines[0].replace(/[《》【】\s]/g, '');
  // 第二行可能是朝代·作者
  if (lines[1]) {
    const m = lines[1].match(new RegExp(`^((?:${DYN.join('|')})|)[·\\s,，/／\\-—]*(.+)$`));
    if (m && (DYN.some(d => lines[1].includes(d)) || /^[·\s,，/／]/.test(lines[1]))) {
      dynasty = m[1] || '';
      author = (m[2] || '').replace(/\s/g, '');
      if (author && author.length <= 6) bodyStart = 2;
    }
  }
  const body = lines.slice(bodyStart).join('\n');
  return { title, dynasty, author, linesArr: splitLines(body) };
}

function parse() {
  const r = parseText(raw.value);
  if (!r || !r.linesArr.length) { alert('没有识别到诗句，请检查格式'); return; }
  parsed.value = {
    title: r.title || '无题',
    dynasty: r.dynasty || '',
    author: r.author || '佚名',
    linesText: r.linesArr.join('\n'),
    theme: 'spring'
  };
  sfx.tap();
}

async function fetchUrl() {
  fetching.value = true;
  const target = url.value.trim();
  const proxies = [
    u => 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u),
    u => 'https://corsproxy.io/?' + encodeURIComponent(u),
    u => 'https://r.jina.ai/' + u
  ];
  let text = '';
  for (const p of proxies) {
    try {
      const res = await fetch(p(target), { signal: AbortSignal.timeout(15000) });
      if (!res.ok) continue;
      text = await res.text();
      if (text && text.length > 30) break;
    } catch (e) { /* 尝试下一个 */ }
  }
  fetching.value = false;
  if (!text) {
    alert('抓取失败（网络或代理不可用）。请改用「粘贴诗文」方式：打开链接复制诗文内容粘贴过来。');
    mode.value = 'paste';
    return;
  }
  // 清理HTML
  text = text
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\r/g, '');
  const cleaned = text.split('\n').map(s => s.trim()).filter(s => /[\u4e00-\u9fa5]/.test(s) && s.length < 200).slice(0, 40).join('\n');
  raw.value = cleaned;
  mode.value = 'paste';
  parse();
}

const finalLines = computed(() => splitLines(parsed.value?.linesText || ''));

function save() {
  // 自动匹配知识库：内置诗库 / 课本知识库
  const match = matchPoemKnowledge(parsed.value.title.trim(), parsed.value.author.trim(), finalLines.value);
  const fields = match ? knowledgeToPoemFields(match) : { theme: parsed.value.theme, background: '', meaning: '', authorIntro: '', words: [], lineNotes: [], videos: makeSearchVideos(parsed.value.title.trim(), parsed.value.author.trim()) };
  if (match) fields.theme = parsed.value.theme; // 用户手选场景优先
  const poem = addCustomPoem({
    title: parsed.value.title.trim(),
    dynasty: parsed.value.dynasty.trim(),
    author: parsed.value.author.trim(),
    lines: finalLines.value,
    theme: fields.theme,
    background: fields.background,
    meaning: fields.meaning,
    authorIntro: fields.authorIntro,
    words: fields.words,
    lineNotes: fields.lineNotes || [],
    videos: fields.videos || []
  });
  autoFilled.value = !!match && (!!fields.background || !!fields.meaning);
  sfx.pass();
  router.replace('/poem/' + poem.id);
}
</script>

<style scoped>
.tabs2 { display: flex; gap: 8px; margin-bottom: 12px; }
.tabs2 button { flex: 1; border: 2px solid #eadfd2; background: #fff; border-radius: 999px; padding: 10px 0; font-size: 14px; font-weight: 700; color: var(--ink-soft); }
.tabs2 button.on { border-color: var(--primary); color: var(--primary); background: #fff7ec; }
.url-tip { font-size: 12px; color: var(--ink-soft); margin-top: 10px; line-height: 1.6; }
.section-head { font-weight: 800; margin: 16px 4px 10px; font-size: 15px; }
.preview-lines { background: #faf5ec; border-radius: 12px; padding: 16px; text-align: center; line-height: 2; font-size: 16px; font-weight: 600; }
.pv-title { font-size: 20px; font-weight: 900; }
.pv-author { font-size: 13px; color: var(--ink-soft); margin-bottom: 8px; }
</style>
