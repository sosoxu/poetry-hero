// 全量更新视频链接：真实视频（已API验证）+ B站/抖音搜索兜底，保证每首诗都有视频入口
// BV1wh41177Hi《爱上古诗》动画合集 / BV1z2RpYGEFr《唐诗大世界》/ BV1AwXYYKEGJ《113集必背》/ 单集
import { readFileSync, writeFileSync } from 'node:fs';

const A = (p) => ({ title: '爱上古诗·动画讲解', url: `https://www.bilibili.com/video/BV1wh41177Hi?p=${p}` });
const D = (p) => ({ title: '唐诗大世界·讲解', url: `https://www.bilibili.com/video/BV1z2RpYGEFr?p=${p}` });
const B = (p) => ({ title: '必背古诗·动画', url: `https://www.bilibili.com/video/BV1AwXYYKEGJ?p=${p}` });
const S = (bv, title) => ({ title, url: `https://www.bilibili.com/video/${bv}` });

const real = {
  biedongda: A(1), chusai: A(6), chuzhouxijian: A(8), chunxiao: A(10), chunyexiyu: A(11),
  congjunxing: A(13), dengguanquelou: A(15), duzuojingtingshan: A(19), 'feng-liqiao': A(22),
  fengqiaoyebo: A(23), 'feng-mifeng': A(24), furonglou: A(25), cao: A(26), gulangyuxing: A(27),
  huanghelou: A(31), jiangnanchun: A(34), jiangxue: A(36), jingyesi: A(37), chongyang: A(38),
  'jueju-chiri': A(39), 'jueju-huangli': A(40), langtaosha: A(42), 'liangzhouci-han': A(44),
  'liangzhouci-huan': A(45), luchai: A(46), mujiangyin: A(51), qingming: A(56), qiupuge: A(57),
  saixiaqu: A(60), shanxing: A(62), songyuaner: A(66), wangyue: A(71), wenguanjun: A(72),
  wuyixiang: A(81), xunyinzhe: A(79),
  // 唐诗大世界（诗人生平+讲解）
  xiangsi: D(44), youziyin: D(49), qiuxi: D(43), wenwangchangling: D(74),
  // 113集必背古诗动画
  meihua: B(14), cunju: B(20), suojian: B(28), huichong: B(38), yijiangnan: B(40), tixilinbi: B(48),
  // 单集（已验证）
  shier: S('BV1Ph4y1z7rc', '《示儿》讲解'),
  momei: S('BV1LobR69EAJ', '墨梅·绘本动画'),
  xiarijueju: S('BV1rV2kBqE8J', '夏日绝句·记忆讲解'),
  bochuaguazhou: S('BV1qY4y1y7nm', '泊船瓜洲·讲解（6.5万播放）'),
  zhushi: S('BV12L4y1G7Cq', '竹石·动画讲解'),
  qiuyejiangxiao: S('BV1eb4y1U7t1', '秋夜将晓·小学必背古诗'),
  zhouguoanren: S('BV15g4y1x7YL', '舟过安仁·趣味动画'),
  youyuanbuzhi: S('BV1AaERzREC6', '游园不值·一分钟学古诗'),
  tilinandi: S('BV1eDn2z4Eoz', '古诗三首讲解（示儿/题临安邸/己亥杂诗）'),
  jihaizashi: S('BV1eDn2z4Eoz', '古诗三首讲解（示儿/题临安邸/己亥杂诗）')
};

const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
let realCount = 0, fallbackCount = 0;
for (const p of poems) {
  if (real[p.id]) {
    p.videos = [real[p.id]];
    realCount++;
  } else {
    const kw = encodeURIComponent(`${p.title} ${p.author} 古诗讲解`);
    const kwDy = encodeURIComponent(`${p.title} ${p.author} 古诗`);
    p.videos = [
      { title: '🔍 B站搜索讲解视频', url: `https://search.bilibili.com/all?keyword=${kw}`, external: true },
      { title: '🎵 抖音搜索讲解视频', url: `https://www.douyin.com/search/${kwDy}`, external: true }
    ];
    fallbackCount++;
  }
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
console.log(`✅ 已更新：${realCount} 首真实视频 + ${fallbackCount} 首搜索兜底（共${poems.length}首）`);
