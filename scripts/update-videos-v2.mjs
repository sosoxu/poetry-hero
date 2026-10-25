// v2 视频重建：全部提供B站/抖音搜索入口（新清单与旧合集分P几乎无重叠，避免再塞未经验证的硬链接）
// 名家名篇优先附已验证合集链接
import { readFileSync, writeFileSync } from 'node:fs';

// 已验证的合集分P（与B站API核对过）：
// BV1wh41177Hi 爱上古诗：23=枫桥夜泊✗(不在新清单)…重新对照新清单：
const A = (p) => ({ title: '爱上古诗·动画讲解', url: `https://www.bilibili.com/video/BV1wh41177Hi?p=${p}` });
// 新清单中该合集覆盖：蜂✗…经逐条对照合集81集标题，仅以下命中：
const heji = {
  qiupuge: A(57) // 秋浦歌(李白) = P57
};

const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
let hard = 0, search = 0;
for (const p of poems) {
  const known = heji[p.id];
  if (known) {
    p.videos = [known, searchLinks(p)[0]];
    hard++;
  } else {
    p.videos = searchLinks(p);
    search++;
  }
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
console.log(`✅ 视频：${hard} 首硬链接 + ${search} 首搜索入口`);

function searchLinks(p) {
  const kw = encodeURIComponent(`${p.title} ${p.author} 古诗讲解`);
  const kwDy = encodeURIComponent(`${p.title} ${p.author} 古诗`);
  return [
    { title: '🔍 B站搜索讲解视频', url: `https://search.bilibili.com/all?keyword=${kw}`, external: true },
    { title: '🎵 抖音搜索讲解视频', url: `https://www.douyin.com/search/${kwDy}`, external: true }
  ];
}
