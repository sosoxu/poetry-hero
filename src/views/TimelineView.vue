<template>
  <div class="page">
    <div class="page-title">📅 背诵时间线</div>

    <!-- 月历 -->
    <div class="card">
      <div class="cal-head">
        <button class="cal-nav" @click="monthOffset--">‹</button>
        <b>{{ calTitle }}</b>
        <button class="cal-nav" @click="monthOffset++">›</button>
      </div>
      <div class="cal-week">
        <span v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</span>
      </div>
      <div class="cal-grid">
        <div v-for="(cell, i) in cells" :key="i" class="cal-cell" :class="{ blank: !cell, today: cell && cell.key === todayKey }">
          <template v-if="cell">
            <span class="d">{{ cell.day }}</span>
            <span v-if="cell.count" class="dot" :class="{ more: cell.count > 1 }">{{ cell.count > 9 ? '9+' : cell.count }}</span>
          </template>
        </div>
      </div>
      <div class="cal-tip">🔥 连续打卡 <b>{{ streak }}</b> 天 · 累计 <b>{{ passedRecords.length }}</b> 次背诵</div>
    </div>

    <!-- 按天列表 -->
    <template v-for="day in days" :key="day.key">
      <div class="tl-day">
        <div class="tl-date">
          🗓️ {{ day.label }}<span v-if="day.key === todayKey" class="badge badge-red">今天</span>
        </div>
        <div class="tl-item" v-for="r in day.items" :key="r.id" @click="goPoem(r.poemId)">
          <span class="tl-icon">{{ r.passed ? (r.recordBreak ? '🏆' : '✅') : '💪' }}</span>
          <div class="tl-info">
            <div class="tl-poem">{{ poemTitle(r.poemId) }}</div>
            <div class="tl-meta">
              {{ timeOf(r.ts) }} · 用时 {{ fmt(r.durationSec) }}
              <span v-if="r.firstMaster" class="badge badge-green">首次背会</span>
              <span v-if="r.recordBreak" class="badge badge-gold">破纪录</span>
            </div>
          </div>
          <span class="tl-pts">+{{ r.points }}</span>
        </div>
      </div>
    </template>
    <div v-if="!days.length" class="empty"><div class="big">🌱</div>还没有背诵记录<br />快去挑战第一首诗吧！</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { state, getPoem, currentStreak, dayKey } from '../store/index.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const monthOffset = ref(0);
const todayKey = dayKey(Date.now());
const streak = computed(() => currentStreak());

const passedRecords = computed(() => state.records.filter(r => r.passed));

const calTitle = computed(() => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthOffset.value);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
});

const cells = computed(() => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + monthOffset.value);
  const y = d.getFullYear(), m = d.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const counts = {};
  for (const r of state.records) {
    if (!r.passed) continue;
    const k = dayKey(r.ts);
    counts[k] = (counts[k] || 0) + 1;
  }
  const arr = [];
  for (let i = 0; i < firstDay; i++) arr.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const p = n => String(n).padStart(2, '0');
    const key = `${y}-${p(m + 1)}-${p(day)}`;
    arr.push({ day, key, count: counts[key] || 0 });
  }
  return arr;
});

const days = computed(() => {
  const byDay = {};
  for (const r of [...state.records].sort((a, b) => b.ts - a.ts)) {
    const k = dayKey(r.ts);
    (byDay[k] = byDay[k] || []).push(r);
  }
  return Object.entries(byDay).sort((a, b) => b[0].localeCompare(a[0])).map(([k, items]) => {
    const d = new Date(k + 'T12:00:00');
    const wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return { key: k, label: `${d.getMonth() + 1}月${d.getDate()}日 星期${wd}`, items };
  });
});

function poemTitle(id) {
  const p = getPoem(id);
  return p ? p.title : '（已删除的诗）';
}
function timeOf(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
function fmt(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${String(s % 60).padStart(2, '0')}` : `${s}秒`;
}
function goPoem(id) {
  if (getPoem(id)) router.push('/poem/' + id);
}
</script>

<style scoped>
.cal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cal-nav { border: none; background: #faf5ec; width: 34px; height: 34px; border-radius: 10px; font-size: 18px; font-weight: 800; color: var(--ink); cursor: pointer; }
.cal-week { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 11px; color: var(--ink-soft); margin-bottom: 4px; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
.cal-cell { height: 40px; background: #faf5ec; border-radius: 9px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.cal-cell.blank { background: transparent; }
.cal-cell.today { outline: 2px solid var(--primary); }
.cal-cell .d { font-size: 12px; }
.dot { position: absolute; bottom: 2px; font-size: 9px; background: var(--jade); color: #fff; border-radius: 999px; padding: 0 5px; line-height: 14px; }
.dot.more { background: var(--primary); }
.cal-tip { text-align: center; font-size: 13px; color: var(--ink-soft); margin-top: 10px; }
.tl-day { margin-bottom: 16px; }
.tl-date { font-weight: 800; font-size: 14px; color: var(--ink-soft); margin: 0 0 8px 4px; display: flex; align-items: center; gap: 6px; }
.tl-item { background: #fff; border-radius: 14px; box-shadow: var(--shadow); padding: 12px 14px; margin-bottom: 8px; display: flex; align-items: center; gap: 10px; cursor: pointer; }
.tl-icon { font-size: 22px; }
.tl-info { flex: 1; min-width: 0; }
.tl-poem { font-weight: 800; font-size: 15px; }
.tl-meta { font-size: 12px; color: var(--ink-soft); margin-top: 3px; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.tl-pts { color: #b8860b; font-weight: 800; }
</style>
