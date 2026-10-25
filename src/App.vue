<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <nav class="tabbar">
    <router-link to="/"><span class="ico">🏠</span>首页</router-link>
    <router-link to="/poems"><span class="ico">📖</span>诗集</router-link>
    <router-link to="/quiz"><span class="ico">🎮</span>挑战</router-link>
    <router-link to="/timeline"><span class="ico">📅</span>时间线</router-link>
    <router-link to="/goals"><span class="ico">🎯</span>目标</router-link>
    <router-link to="/settings"><span class="ico">⚙️</span>设置</router-link>
  </nav>
</template>

<script setup>
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .18s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
