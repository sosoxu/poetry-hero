<template>
  <div class="page">
    <div class="page-title">📖 诗集 <span class="count">{{ filtered.length }} 首</span></div>

    <div class="search-row">
      <input v-model="q" placeholder="搜诗名 / 作者 / 诗句…" />
    </div>
    <div class="tabs">
      <button :class="{ on: tab === 'all' }" @click="tab = 'all'">全部</button>
      <button :class="{ on: tab === 'todo' }" @click="tab = 'todo'">未背过 {{ todoCount }}</button>
      <button :class="{ on: tab === 'done' }" @click="tab = 'done'">已背过 {{ doneCount }}</button>
    </div>

    <div class="poem-grid">
      <div class="poem-card" v-for="p in filtered" :key="p.id" @click="$router.push('/poem/' + p.id)">
        <div class="pc-head">
          <div class="pc-title">{{ p.title }}</div>
          <div class="pc-badge">
            <span v-if="st(p.id).mastered" class="stars">{{ '★'.repeat(st(p.id).stars) }}</span>
            <span v-else class="badge badge-gray">未背</span>
          </div>
        </div>
        <div class="pc-author">{{ p.dynasty }} · {{ p.author }}<span v-if="p.custom" class="badge badge-blue">自建</span></div>
        <div class="pc-line">{{ p.lines[0] }}…</div>
        <div class="pc-fast" v-if="st(p.id).fastestSec != null">🏅 最快 {{ fmt(st(p.id).fastestSec) }}</div>
      </div>
    </div>
    <div v-if="!filtered.length" class="empty"><div class="big">🔍</div>没有找到，换个关键词试试</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { allPoems, statsOf } from '../store/index.js';

const q = ref('');
const tab = ref('all');
const st = statsOf;

const list = allPoems();
const todoCount = computed(() => list.filter(p => !st(p.id).mastered).length);
const doneCount = computed(() => list.filter(p => st(p.id).mastered).length);

const filtered = computed(() => {
  let arr = list;
  if (tab.value === 'todo') arr = arr.filter(p => !st(p.id).mastered);
  if (tab.value === 'done') arr = arr.filter(p => st(p.id).mastered);
  const kw = q.value.trim();
  if (kw) arr = arr.filter(p => p.title.includes(kw) || p.author.includes(kw) || p.lines.join('').includes(kw));
  return arr;
});

function fmt(s) {
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}分${String(s % 60).padStart(2, '0')}` : `${s}秒`;
}
</script>

<style scoped>
.count { font-size: 13px; color: var(--ink-soft); font-weight: 400; }
.search-row { margin-bottom: 10px; }
.search-row input {
  width: 100%; border: 2px solid #eadfd2; border-radius: 999px;
  padding: 10px 16px; font-size: 14px; background: #fff; outline: none;
}
.search-row input:focus { border-color: var(--primary-soft); }
.tabs { display: flex; gap: 8px; margin-bottom: 12px; }
.tabs button {
  flex: 1; border: none; background: #fff; padding: 9px 0;
  border-radius: 999px; font-size: 13px; font-weight: 700; color: var(--ink-soft);
}
.tabs button.on { background: var(--primary); color: #fff; }
.poem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.poem-card {
  background: #fff; border-radius: var(--radius); box-shadow: var(--shadow);
  padding: 13px 14px; cursor: pointer;
}
.poem-card:active { transform: scale(.97); }
.pc-head { display: flex; justify-content: space-between; align-items: center; gap: 4px; }
.pc-title { font-size: 16px; font-weight: 800; }
.pc-author { font-size: 12px; color: var(--ink-soft); margin: 3px 0 6px; display:flex; gap:5px; align-items:center;}
.pc-line { font-size: 12px; color: var(--ink-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pc-fast { font-size: 11px; color: #b8860b; margin-top: 5px; font-weight: 700; }
</style>
