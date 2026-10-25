<template>
  <div class="page">
    <div class="page-title">🎯 打卡目标</div>

    <!-- 进行中 -->
    <div class="card goal" v-for="g in activeGoals" :key="g.id">
      <div class="g-top">
        <div class="g-type">{{ typeIcon(g.type) }} {{ typeName(g.type) }}</div>
        <div class="g-reward">🎁 {{ g.reward }}</div>
      </div>
      <div class="g-progress">
        <div class="bar"><span :style="{ width: pct(g) + '%' }"></span></div>
        <div class="g-num">{{ progress(g) }} / {{ g.target }}</div>
      </div>
      <div class="g-actions" v-if="g.completedAt && !g.redeemedAt">
        <span class="badge badge-gold">🎉 已达成（+50分）</span>
        <button class="btn btn-gold btn-sm" @click="redeem(g)">✅ 奖励已兑现</button>
      </div>
      <div class="g-actions" v-else-if="!g.completedAt">
        <button class="btn btn-ghost btn-sm del" @click="remove(g)">删除</button>
      </div>
    </div>

    <!-- 已完成归档 -->
    <template v-if="doneGoals.length">
      <div class="section-head">🏆 达成档案</div>
      <div class="card goal done" v-for="g in doneGoals" :key="g.id">
        <div class="g-top">
          <div class="g-type">{{ typeIcon(g.type) }} {{ typeName(g.type) }}</div>
          <div class="g-reward">🎁 {{ g.reward }}</div>
        </div>
        <div class="g-done-line">{{ g.redeemedAt ? '✅ 已兑现奖励' : '🎁 待兑现' }} · {{ dateOf(g.completedAt) }} 达成</div>
      </div>
    </template>

    <div v-if="!activeGoals.length && !doneGoals.length" class="empty">
      <div class="big">🎯</div>还没有目标<br />定一个小目标，完成就有奖励！
    </div>

    <button class="btn btn-primary btn-block new-goal" @click="openNew">➕ 新建目标</button>

    <!-- 新建弹窗 -->
    <div class="overlay" v-if="showNew" @click.self="showNew = false">
      <div class="sheet">
        <h3 style="margin:0 0 14px">🎯 新建打卡目标</h3>
        <div class="presets">
          <button v-for="p in presets" :key="p.label" class="preset" @click="applyPreset(p)">{{ p.label }}</button>
        </div>
        <div class="field"><label>目标类型</label>
          <select v-model="form.type">
            <option value="streak">连续打卡（天）</option>
            <option value="count">累计背过（次）</option>
            <option value="master">累计背会（首）</option>
          </select>
        </div>
        <div class="field"><label>目标数值</label><input type="number" v-model.number="form.target" min="1" /></div>
        <div class="field"><label>完成奖励（如：去游乐园、吃冰淇淋、买一本书）</label><input v-model="form.reward" placeholder="和孩子一起商量填～" /></div>
        <div style="display:flex; gap:10px; margin-top:14px">
          <button class="btn btn-primary btn-block" @click="save" :disabled="!form.target || !form.reward.trim()">创建目标</button>
          <button class="btn btn-ghost" @click="showNew = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { state, addGoal, goalProgress, redeemGoal, removeGoal } from '../store/index.js';
import { sfx } from '../utils/sfx.js';

const showNew = ref(false);
const form = reactive({ type: 'streak', target: 7, reward: '' });

const presets = [
  { label: '连续打卡 3 天', type: 'streak', target: 3 },
  { label: '连续打卡 7 天', type: 'streak', target: 7 },
  { label: '连续打卡 21 天', type: 'streak', target: 21 },
  { label: '累计背过 10 次', type: 'count', target: 10 },
  { label: '累计背过 30 次', type: 'count', target: 30 },
  { label: '背会 5 首', type: 'master', target: 5 },
  { label: '背会 10 首', type: 'master', target: 10 }
];

const activeGoals = computed(() => state.goals.filter(g => !g.redeemedAt));
const doneGoals = computed(() => state.goals.filter(g => g.redeemedAt));

function openNew() { showNew.value = true; sfx.tap(); }
function applyPreset(p) { form.type = p.type; form.target = p.target; }
function save() {
  addGoal({ type: form.type, target: Math.max(1, form.target | 0), reward: form.reward.trim() });
  showNew.value = false;
  form.reward = '';
  sfx.pass();
}
function progress(g) { return goalProgress(g); }
function pct(g) { return Math.round(progress(g) / g.target * 100); }
function redeem(g) { redeemGoal(g.id); sfx.fanfare(); }
function remove(g) { if (confirm('删除这个目标？')) removeGoal(g.id); }
function typeName(t) { return { streak: '连续打卡', count: '累计背诵', master: '背会新诗' }[t]; }
function typeIcon(t) { return { streak: '🔥', count: '📚', master: '⭐' }[t]; }
function dateOf(ts) { return new Date(ts).toLocaleDateString('zh-CN'); }
</script>

<style scoped>
.goal.done { opacity: .75; }
.g-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; }
.g-type { font-weight: 800; font-size: 15px; }
.g-reward { font-size: 14px; background: #fff3d6; color: #b8860b; padding: 5px 12px; border-radius: 999px; font-weight: 700; }
.g-progress { display: flex; align-items: center; gap: 10px; }
.g-progress .bar { flex: 1; }
.g-num { font-size: 13px; color: var(--ink-soft); font-weight: 700; white-space: nowrap; }
.g-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; align-items: center; }
.g-done-line { font-size: 13px; color: var(--jade); font-weight: 700; }
.section-head { font-weight: 800; margin: 16px 4px 10px; font-size: 15px; }
.new-goal { margin-top: 6px; }
.presets { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.preset { border: 2px solid #eadfd2; background: #fff; border-radius: 999px; padding: 7px 13px; font-size: 13px; font-weight: 700; color: var(--ink-soft); cursor: pointer; }
.preset:active { border-color: var(--primary); color: var(--primary); }
.del { color: #c0504d; }
</style>
