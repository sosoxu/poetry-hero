// 视频有效性检测：APK(Capacitor原生HTTP)可实时检测；网页端受B站CORS风控限制，跳过自动检测
import { videoOk, setVideoStatus } from '../store/index.js';

const VIEW_API = 'https://api.bilibili.com/x/web-interface/view?bvid=';

function isNative() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

async function fetchView(bvid) {
  if (isNative()) {
    const { CapacitorHttp } = await import('@capacitor/core');
    const res = await CapacitorHttp.get({ url: VIEW_API + bvid, headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36' } });
    return res.data;
  }
  // 网页端：B站对带Origin的该接口返回403，无法可靠检测
  const res = await fetch(VIEW_API + bvid);
  if (!res.ok) throw new Error('http ' + res.status);
  return res.json();
}

/**
 * 检测单个B站视频链接
 * @returns {Promise<'ok'|'dead'|'unknown'|'stale'>}
 *  - ok     视频可播
 *  - dead   视频已下架/分P超出
 *  - unknown 检测不可用（网页端或网络失败），不写缓存
 *  - stale  缓存里有dead记录且已过期，本次无法复检
 */
export async function checkBiliVideo(url) {
  const m = url.match(/bilibili\.com\/video\/(BV\w+)/);
  if (!m) return 'unknown';
  const bvid = m[1];
  const pm = url.match(/[?&]p=(\d+)/);
  const page = pm ? parseInt(pm[1], 10) : 1;

  try {
    const data = await fetchView(bvid);
    if (data.code !== 0 || !data.data) {
      setVideoStatus(url, false);
      return 'dead'; // -400/-404 均视为失效
    }
    const partCount = data.data.videos || 1;
    const ok = page <= partCount;
    setVideoStatus(url, ok);
    return ok ? 'ok' : 'dead';
  } catch (e) {
    return 'unknown';
  }
}

/** 后台静默体检一组URL（只查没有新鲜缓存的），返回是否有新发现的失效 */
export async function silentCheck(urls, onEach) {
  if (!isNative()) return false;
  let foundDead = false;
  for (const u of urls) {
    if (videoOk(u) !== null) continue; // 缓存新鲜
    const r = await checkBiliVideo(u);
    onEach && onEach(u, r);
    if (r === 'dead') foundDead = true;
    await new Promise(r2 => setTimeout(r2, 350)); // 温和限速
  }
  return foundDead;
}

/** 全量体检（设置页用）：只统计有明确结果的 */
export async function fullCheck(urls, onProgress) {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    let r;
    if (!isNative()) r = 'unknown';
    else if (videoOk(u) !== null) r = videoOk(u) ? 'ok' : 'dead';
    else r = await checkBiliVideo(u);
    results.push({ url: u, result: r });
    onProgress && onProgress(i + 1, urls.length, { url: u, result: r });
    if (isNative() && i < urls.length - 1) await new Promise(r2 => setTimeout(r2, 350));
  }
  return results;
}

export function canAutoCheck() { return isNative(); }
