import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './styles/main.css';

createApp(App).use(router).mount('#app');

// PWA Service Worker（仅生产构建）
if (import.meta.env.PROD && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
