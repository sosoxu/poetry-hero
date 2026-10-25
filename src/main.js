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

// 安卓返回键守护（APK环境）：万一页面被导航到外部网站，返回键直接回到应用
const cap = window.Capacitor;
if (cap && cap.isNativePlatform && cap.isNativePlatform()) {
  const APP_URL = location.href; // 应用加载时的地址（外跳后 location 已变，须在此刻记录）
  import('@capacitor/app').then(({ App }) => {
    App.addListener('backButton', () => {
      if (location.hostname === 'localhost' || location.protocol === 'capacitor:') {
        // 仍在应用内：正常返回上一页；已在首页则最小化
        if (window.history.length > 1 && router.currentRoute.value.path !== '/') {
          router.back();
        } else {
          App.exitApp();
        }
      } else {
        // 页面被外部网站顶掉：直接回到应用首页
        location.replace(APP_URL);
      }
    });
  }).catch(() => {});
}
