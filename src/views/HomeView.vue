<template>
  <div class="page">
    <!-- 问候 + 等级 -->
    <div class="hello">
      <div class="avatar">
        <img v-if="avatarBeast" :src="beastDataUri(avatarBeast)" :alt="avatarBeast.name" />
        <template v-else>{{ profile.avatar }}</template>
      </div>
      <div class="hello-txt">
        <div class="hi">{{ greeting }}，{{ profile.name }}！</div>
        <div class="lv">{{ lv.level.icon }} {{ lv.level.name }}
          <template v-if="lv.next"> · 距 {{ lv.next.name }} 还差 {{ lv.next.min - profile.totalPoints }} 分</template>
        </div>
      </div>
      <div class="points-chip">🪙 {{ profile.totalPoints }}</div>
    </div>
    <div class="card level-card">
      <div class="bar"><span :style="{ width: lvPercent + '%' }"></span></div>
    </div>

    <!-- 今日打卡 -->
    <div class="card today">
      <div class="today-left">
        <div class="t-big">{{ todayDone ? '✅ 今日已打卡' : '🌤️ 今日还未打卡' }}</div>
        <div class="t-sub">连续背诵 <b class="streak">{{ streak }}</b> 天 🔥</div>
      </div>
      <div class="today-right">
        <div class="t-stat"><b>{{ masteredCount }}</b><span>已背会</span></div>
        <div class="t-stat"><b>{{ totalPoems }}</b><span>总诗数</span></div>
        <div class="t-stat"><b>{{ totalRecites }}</b><span>背诵次数</span></div>
      </div>
    </div>

    <!-- 今日推荐 -->
    <div class="section-head">📌 今日推荐</div>
    <div class="card recommend" v-if="recommend" @click="$router.push('/poem/' + recommend.id)">
      <div class="rec-top">
        <div class="rec-title">{{ recommend.title }}</div>
        <template v-if="statsOf(recommend.id).mastered">
          <span class="stars">{{ '★'.repeat(statsOf(recommend.id).stars) }}</span>
        </template>
        <span v-else class="badge badge-gray">未背过</span>
      </div>
      <div class="rec-author">{{ recommend.dynasty }} · {{ recommend.author }}</div>
      <div class="rec-bottom">
        <div class="rec-line">{{ recommend.lines[0] }}</div>
        <div class="go">去挑战 ›</div>
      </div>
    </div>
    <div class="card" v-else>
      <div class="empty"><div class="big">🎈</div>全部诗都背过了，太棒了！<br />去「诗集」温故知新，或「+」添加新诗吧</div>
    </div>

    <!-- 快捷入口 -->
    <div class="grid-2 quick">
      <div class="card quick-item" @click="$router.push('/quiz')">🎮<br />诗句挑战</div>
      <div class="card quick-item" @click="$router.push('/poems')">📖<br />翻翻诗集</div>
      <div class="card quick-item" @click="$router.push('/goals')">🎯<br />打卡目标</div>
      <div class="card quick-item" @click="$router.push('/timeline')">📅<br />背诵时间线</div>
    </div>

    <!-- 添加入口悬浮按钮 -->
    <router-link to="/add" class="fab">➕</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { state, statsOf, levelOf, currentStreak, dayKey, allPoems } from '../store/index.js';
import { beastById, beastDataUri } from '../data/beasts.js';

const profile = state.profile;
const avatarBeast = computed(() => beastById(profile.avatar));
const lv = computed(() => levelOf(profile.totalPoints));
const lvPercent = computed(() => {
  if (!lv.value.next) return 100;
  const lo = lv.value.level.min, hi = lv.value.next.min;
  return Math.min(100, Math.round((profile.totalPoints - lo) / (hi - lo) * 100));
});
const streak = computed(() => currentStreak());
const todayDone = computed(() => state.records.some(r => r.passed && dayKey(r.ts) === dayKey(Date.now())));
const totalPoems = computed(() => allPoems().length);
const masteredCount = computed(() => Object.values(state.poemStats).filter(s => s.mastered).length);
const totalRecites = computed(() => state.records.filter(r => r.passed).length);
const greeting = computed(() => {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '早上好';
  if (h < 14) return '中午好';
  if (h < 18) return '下午好';
  return '晚上好';
});

// 推荐：优先未背过的、最久没背的；全背过则推荐最久未复习的
const recommend = computed(() => {
  const poems = allPoems();
  const withTs = poems.map(p => ({ p, last: statsOf(p.id).lastTs || 0, mastered: statsOf(p.id).mastered }));
  const unmastered = withTs.filter(x => !x.mastered).sort((a, b) => a.last - b.last);
  if (unmastered.length) return unmastered[0].p;
  return withTs.sort((a, b) => a.last - b.last)[0]?.p;
});
</script>

<style scoped>
.hello { display: flex; align-items: center; gap: 12px; margin: 10px 2px 10px; }
.avatar { font-size: 44px; background: #fff; border-radius: 50%; width: 62px; height: 62px; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow); overflow: hidden; }
.avatar img { width: 100%; height: 100%; }
.hi { font-size: 19px; font-weight: 800; }
.lv { font-size: 13px; color: var(--ink-soft); margin-top: 3px; }
.points-chip { margin-left: auto; background: #fff3d6; color: #b8860b; font-weight: 800; border-radius: 999px; padding: 7px 13px; font-size: 14px; }
.level-card { padding: 10px 14px; }
.today { display: flex; align-items: center; }
.today-left { flex: 1; }
.t-big { font-size: 17px; font-weight: 800; }
.t-sub { color: var(--ink-soft); font-size: 13px; margin-top: 5px; }
.streak { color: var(--primary); font-size: 16px; }
.today-right { display: flex; gap: 4px; }
.t-stat { text-align: center; padding: 0 8px; }
.t-stat b { display: block; font-size: 19px; color: var(--jade); }
.t-stat span { font-size: 11px; color: var(--ink-soft); }
.section-head { font-weight: 800; margin: 6px 4px 10px; font-size: 15px; }
.recommend { cursor: pointer; }
.rec-top { display: flex; align-items: center; gap: 8px; }
.rec-title { font-size: 20px; font-weight: 900; }
.rec-author { color: var(--ink-soft); font-size: 13px; margin: 4px 0 10px; }
.rec-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.rec-line { font-size: 14px; color: var(--ink-soft); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.go { color: var(--primary); font-size: 13px; font-weight: 700; white-space: nowrap; }
.quick-item { text-align: center; font-size: 14px; font-weight: 700; cursor: pointer; line-height: 1.7; padding: 14px 6px; }
.quick-item:active { transform: scale(.96); }
.fab {
  position: fixed; right: 18px; bottom: 100px; z-index: 60;
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--primary-soft));
  color: #fff; font-size: 26px; text-decoration: none;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(232, 84, 31, .45);
}
</style>
