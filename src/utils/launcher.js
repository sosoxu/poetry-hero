// 外部页面/应用拉起：安卓优先拉起对应App（B站/抖音），未安装回退浏览器；网页环境 window.open
export function isNativeEnv() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

// 由 https 链接推导 App 深链 intent（未安装时由原生层自动回退浏览器打开原链接）
export function intentForUrl(url) {
  let m = url.match(/search\.bilibili\.com\/all\?keyword=([^&]+)/);
  if (m) return 'intent://search/?keyword=' + m[1] + '#Intent;scheme=bilibili;package=tv.danmaku.bili;end';
  m = url.match(/douyin\.com\/search\/([^?]+)/);
  if (m) return 'intent://search?keyword=' + m[1] + '#Intent;scheme=snssdk1128;package=com.ss.android.ugc.aweme;end';
  m = url.match(/bilibili\.com\/video\/(BV\w+)(?:\?p=(\d+))?/);
  if (m) {
    const page = m[2] ? '%3Fpage%3D' + m[2] : '';
    return 'intent://video/' + m[1] + page + '#Intent;scheme=bilibili;package=tv.danmaku.bili;end';
  }
  return null;
}

export async function launchExternal(url) {
  const cap = window.Capacitor;
  if (cap && cap.isNativePlatform && cap.isNativePlatform()) {
    // 1. 优先拉起对应App（B站/抖音），未安装自动回退浏览器
    const intent = intentForUrl(url);
    if (intent) {
      try {
        await cap.Plugins.AppLauncher.open({ uri: intent, fallbackUrl: url });
        return;
      } catch (e) { /* 插件不可用则继续 */ }
    }
    // 2. 其他链接：Custom Tab 浏览器层
    try {
      await cap.Plugins.Browser.open({ url, toolbarColor: '#e8541f' });
      return;
    } catch (e) { /* 继续下一种 */ }
    try {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url, toolbarColor: '#e8541f' });
      return;
    } catch (e) { /* 放弃，绝不导航 */ }
    alert('打开外部页面失败，请稍后再试');
    return;
  }
  // 网页环境
  window.open(url, '_blank');
}
