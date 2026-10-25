// SettingsView：头像改为点击弹窗选择；新增朗读语速设置
import { readFileSync, writeFileSync } from 'node:fs';
import fs from 'node:fs';

let s = readFileSync('src/views/SettingsView.vue', 'utf8');

// 1. 头像区：显示当前头像 + 点击弹窗
const avatarOld = s.indexOf('      <div class="field"><label>头像（山海经异兽）</label>');
const avatarEnd = s.indexOf('</div>', s.indexOf('beast-desc', avatarOld)) + 6;
if (avatarOld > -1) {
  s = s.slice(0, avatarOld) +
`      <div class="field"><label>头像（山海经异兽）</label>
        <button class="avatar-current" @click="showAvatars = true">
          <img v-if="currentBeast && !imgFails.has(currentBeast.id)" :src="beastDataUri(currentBeast)" :alt="currentBeast.name" @error="imgFails.add(currentBeast.id)" />
          <span v-else class="avatar-emoji">{{ currentBeast ? currentBeast.emoji : '🐾' }}</span>
          <span class="avatar-hint">{{ currentBeast ? currentBeast.name : '点击选择' }} · 点击更换</span>
        </button>
        <div class="beast-desc" v-if="currentBeast">✨ <b>{{ currentBeast.name }}</b>：{{ currentBeast.desc }}</div>
      </div>

      <!-- 头像选择弹窗 -->
      <div class="overlay" v-if="showAvatars" @click.self="showAvatars = false">
        <div class="sheet">
          <h3 style="margin:0 0 14px">🐾 选择头像（山海经异兽）</h3>
          <div class="avatars">
            <button v-for="b in BEASTS" :key="b.id" class="avatar-btn" :class="{ on: profile.avatar === b.id }" @click="pickBeast(b)">
              <img v-if="!imgFails.has(b.id)" :src="beastDataUri(b)" :alt="b.name" @error="imgFails.add(b.id)" />
              <span v-else class="avatar-emoji">{{ b.emoji }}</span>
              <span class="avatar-name">{{ b.name }}</span>
            </button>
          </div>
          <div class="beast-desc" v-if="currentBeast">✨ <b>{{ currentBeast.name }}</b>：{{ currentBeast.desc }}</div>
          <button class="btn btn-primary btn-block" style="margin-top:14px" @click="showAvatars = false">完成</button>
        </div>
      </div>` +
  s.slice(avatarEnd);
  console.log('1 头像弹窗:', s.includes('showAvatars') && s.includes('avatar-current') ? '✅' : '❌');
}

// 2. 朗读语速设置：加到孩子信息卡片后（联系作者前）
if (!s.includes('朗读语速')) {
  s = s.replace(
    '    <!-- 视频体检 -->',
    `    <!-- 朗读语速 -->
    <div class="card">
      <div class="sec-title">🔊 朗读语速</div>
      <div class="rate-row">
        <button class="rate-opt" :class="{ on: (state.settings.speakRate || 'slow') === 'slow' }" @click="setRate('slow')">🐢 慢速（适合跟读）</button>
        <button class="rate-opt" :class="{ on: state.settings.speakRate === 'normal' }" @click="setRate('normal')">🐇 正常</button>
      </div>
    </div>

    <!-- 视频体检 -->`
  );
  console.log('2 语速设置:', s.includes('朗读语速') ? '✅' : '❌');
}

// 3. 脚本：showAvatars 状态 + setRate
s = s.replace(
  'const showContact = ref(false);',
  'const showContact = ref(false);\nconst showAvatars = ref(false);\nfunction setRate(r) { state.settings.speakRate = r; sfx.tap(); }'
);
console.log('3 脚本:', s.includes('setRate') ? '✅' : '❌');

// 4. 样式
s = s.replace(
  '.avatars { display: grid;',
  `.avatar-current { display: flex; align-items: center; gap: 14px; width: 100%; border: 2px solid #eadfd2; border-radius: 16px; background: #fff; padding: 12px 14px; cursor: pointer; }
.avatar-current img, .avatar-current .avatar-emoji { width: 58px; height: 58px; border-radius: 50%; }
.avatar-current .avatar-emoji { font-size: 34px; display: flex; align-items: center; justify-content: center; background: #faf5ec; }
.avatar-hint { font-size: 14px; font-weight: 700; color: var(--ink); text-align: left; }
.rate-row { display: flex; gap: 10px; }
.rate-opt { flex: 1; border: 2px solid #eadfd2; background: #fff; border-radius: 12px; padding: 12px 8px; font-size: 14px; font-weight: 700; color: var(--ink-soft); cursor: pointer; }
.rate-opt.on { border-color: var(--primary); color: var(--primary); background: #fff3e9; }
.avatars { display: grid;`
);
fs.writeFileSync('src/views/SettingsView.vue', s);
console.log('4 样式:', s.includes('.avatar-current') ? '✅' : '❌');
