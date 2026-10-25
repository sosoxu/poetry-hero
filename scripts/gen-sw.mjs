// 构建后生成 Service Worker（预缓存全部构建产物，实现离线可用）
import { createHash } from 'node:crypto';
import { writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir, base = '') {
  const files = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = base ? `${base}/${name}` : name;
    if (statSync(full).isDirectory()) files.push(...walk(full, rel));
    else files.push(rel);
  }
  return files;
}

const assets = walk('dist');
const list = JSON.stringify(['./', ...assets.map(f => './' + f)]);
// 用构建产物内容生成版本号，内容变化 → 新缓存自动生效
const hash = createHash('md5').update(list + assets.map(f => statSync(join('dist', f)).size).join(',')).digest('hex').slice(0, 10);

const sw = `const CACHE='poetry-hero-${hash}';
const ASSETS=${list};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return; // 跨域（如B站播放器）直连
  // 页面导航请求：网络优先（保证拿到新版本），离线时回退缓存
  if(e.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname==='/'){
    e.respondWith(fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>caches.match(e.request).then(h=>h||caches.match('./'))));
    return;
  }
  // 静态资源：缓存优先，未命中再取网络
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
      const clone=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,clone));
      return res;
    }).catch(()=>caches.match('./')))
  );
});`;
writeFileSync('dist/sw.js', sw);
console.log('✅ sw.js 已生成，预缓存', assets.length, '个文件，版本', hash);
