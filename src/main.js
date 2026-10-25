import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './styles/main.css';

createApp(App).use(router).mount('#app');

// 全局外链拦截（APK环境）：任何外部链接/ window.open 一律走 Custom Tab，杜绝 WebView 内导航
const capGlobal = window.Capacitor;
if (capGlobal && capGlobal.isNativePlatform && capGlobal.isNativePlatform()) {
  async function openInCustomTab(url) {
    try {
      await capGlobal.Plugins.Browser.open({ url, toolbarColor: '#e8541f' });
    } catch (e) {
      try {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url, toolbarColor: '#e8541f' });
      } catch (e2) { /* 放弃，绝不导航 */ }
    }
  }
  window.open = function (url) { if (url) openInCustomTab(String(url)); return null; };
  document.addEventListener('click', (ev) => {
    const a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    const isExternal = /^https?:/i.test(href) && !href.includes('localhost');
    if (isExternal) {
      ev.preventDefault();
      ev.stopPropagation();
      openInCustomTab(href);
    }
  }, true);
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
