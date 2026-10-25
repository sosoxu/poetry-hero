<template>
  <div class="collapse-item" :class="{ open }">
    <div class="collapse-head" @click="open = !open">
      <span class="ci-icon">{{ icon }}</span>
      <span>{{ title }}</span>
      <span class="arrow">▶</span>
    </div>
    <div class="collapse-body" v-if="open">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
defineProps({ title: String, icon: { type: String, default: '📂' } });
const open = ref(false);
</script>
