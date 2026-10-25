<template>
  <teleport to="body">
    <div v-if="active" class="confetti-wrap" aria-hidden="true">
      <span v-for="(p, i) in pieces" :key="i" class="confetti-piece"
        :style="{ left: p.left + '%', animationDuration: p.dur + 's', animationDelay: p.delay + 's', fontSize: p.size + 'px' }">{{ p.emoji }}</span>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({ trigger: { type: Number, default: 0 } });
const active = ref(false);
const pieces = ref([]);
let timer = null;

watch(() => props.trigger, () => {
  const emojis = ['🎉', '⭐', '🎊', '🏅', '🌸', '✨', '🧧', '🏆'];
  pieces.value = Array.from({ length: 36 }, () => ({
    left: Math.random() * 100,
    dur: 2.2 + Math.random() * 1.8,
    delay: Math.random() * 0.6,
    size: 16 + Math.random() * 16,
    emoji: emojis[Math.floor(Math.random() * emojis.length)]
  }));
  active.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => { active.value = false; }, 4200);
});

onUnmounted(() => clearTimeout(timer));
</script>
