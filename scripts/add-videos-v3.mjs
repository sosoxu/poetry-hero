// v3 视频增强：为内置99首+知识库83首尽量配上已验证的B站合集分P（内嵌播放），搜索入口保留为兜底
import { readFileSync, writeFileSync } from 'node:fs';

// 合集（分P均经 B 站 API pagelist 核对）
// A=爱上古诗81集 BV1wh41177Hi / D=唐诗大世界80集 BV1z2RpYGEFr / B=113集必背 BV1AwXYYKEGJ
const A = p => ({ title: '爱上古诗·动画讲解', url: `https://www.bilibili.com/video/BV1wh41177Hi?p=${p}` });
const D = p => ({ title: '唐诗大世界·讲解', url: `https://www.bilibili.com/video/BV1z2RpYGEFr?p=${p}` });
const B = p => ({ title: '必背古诗·动画', url: `https://www.bilibili.com/video/BV1AwXYYKEGJ?p=${p}` });

const hard = {
  // ===== 内置99首 =====
  qiupuge: A(57),
  wangyue: A(71),
  // ===== 知识库83首 =====
  'kb-biedongda': A(1), 'kb-chusai': A(6), 'kb-chuzhou-xijian': A(8), 'kb-chunxiao': A(10),
  'kb-chunyexiyu': A(11), 'kb-dengguanquelou': A(15), 'kb-duzuo-jingtingshan': A(19),
  'kb-fengqiaoyebo': A(23), 'kb-feng-mifeng': A(24), 'kb-furonglou': A(25),
  'kb-fude-guyuancao': A(26), 'kb-gulangyuxing': A(27), 'kb-huanghelou-song': A(31),
  'kb-jiangnanchun': A(34), 'kb-jiangxue': A(36), 'kb-jingyesi': A(37), 'kb-chongyang': A(38),
  'kb-jueju-chiri': A(39), 'kb-jueju-huangli': A(40), 'kb-langtaosha': A(42),
  'kb-liangzhouci-huan': A(45), 'kb-luchai': A(46), 'kb-qingming': A(56),
  'kb-saixiaqu': A(60), 'kb-shanxing': A(62), 'kb-songyuaner': A(66), 'kb-xunyinzhe': A(79),
  // 唐诗大世界补充
  'kb-xiangsi-wangwei': D(44),
  'kb-youziyin': D(49),
  // 113集必背补充
  'kb-meihua': B(14), 'kb-cunju': B(20), 'kb-suojian': B(28), 'kb-huichong': B(38),
  'kb-yijiangnan': B(40), 'kb-tixilinbi': B(48)
};

function makeSearch(title, author) {
  const kw = encodeURIComponent(`${title} ${author} 古诗讲解`);
  const kwDy = encodeURIComponent(`${title} ${author} 古诗`);
  return [
    { title: '🔍 B站搜索讲解视频', url: `https://search.bilibili.com/all?keyword=${kw}`, external: true },
    { title: '🎵 抖音搜索讲解视频', url: `https://www.douyin.com/search/${kwDy}`, external: true }
  ];
}

function apply(file) {
  const poems = JSON.parse(readFileSync(file, 'utf8'));
  let n = 0;
  for (const p of poems) {
    const h = hard[p.id];
    p.videos = h ? [h, ...makeSearch(p.title, p.author)] : makeSearch(p.title, p.author);
    if (h) n++;
  }
  writeFileSync(file, JSON.stringify(poems, null, 1));
  console.log(`${file}: ${n}/${poems.length} 首配硬链接`);
}

apply('src/data/poems.json');
apply('src/data/poems-kb.json');
console.log('✅ 视频数据已增强');
