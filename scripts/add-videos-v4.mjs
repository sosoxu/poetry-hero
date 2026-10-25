// v4 视频增强：扩大已验证合集覆盖（全部集数经B站API pagelist实时核对）
import { readFileSync, writeFileSync } from 'node:fs';

// A=爱上古诗 BV1wh41177Hi / D=唐诗大世界 BV1z2RpYGEFr / B=113集必背 BV1AwXYYKEGJ
const A = p => ({ title: '爱上古诗·动画讲解', url: `https://www.bilibili.com/video/BV1wh41177Hi?p=${p}` });
const D = p => ({ title: '唐诗大世界·讲解', url: `https://www.bilibili.com/video/BV1z2RpYGEFr?p=${p}` });
const B = p => ({ title: '必背古诗·动画', url: `https://www.bilibili.com/video/BV1AwXYYKEGJ?p=${p}` });

const hard = {
  // ===== 内置99首（与合集标题逐一核对） =====
  qiupuge: A(57),            // 秋浦歌
  wangyue: A(71),            // 望岳
  chibi: A(4),               // 赤壁(杜牧)
  'fangbingcao-humashi': A(21), // 房兵曹胡马(杜甫)
  'jiyangzhou-hanchuo': A(33),  // 寄扬州韩绰判官
  'mashi-qi5': A(47),        // 马诗(李贺)

  // ===== 知识库83首 =====
  // A合集
  'kb-biedongda': A(1), 'kb-chusai': A(6), 'kb-chuzhou-xijian': A(8), 'kb-chunxiao': A(10),
  'kb-chunyexiyu': A(11), 'kb-dengguanquelou': A(15), 'kb-duzuo-jingtingshan': A(19),
  'kb-fengqiaoyebo': A(23), 'kb-feng-mifeng': A(24), 'kb-furonglou': A(25),
  'kb-fude-guyuancao': A(26), 'kb-gulangyuxing': A(27), 'kb-huanghelou-song': A(31),
  'kb-jiangnanchun': A(34), 'kb-jiangxue': A(36), 'kb-jingyesi': A(37), 'kb-chongyang': A(38),
  'kb-jueju-chiri': A(39), 'kb-jueju-huangli': A(40), 'kb-langtaosha': A(42),
  'kb-liangzhouci-huan': A(45), 'kb-luchai': A(46), 'kb-qingming': A(56),
  'kb-saixiaqu': A(60), 'kb-shanxing': A(62), 'kb-songyuaner': A(66), 'kb-xunyinzhe': A(79),
  // A合集·本次新增
  'kb-chishang': A(3), 'kb-huixiang-oushu': A(32), 'kb-jiangpan-xunhua': A(35),
  'kb-minnong-1': A(48), 'kb-minnong-2': A(49), 'kb-wangdongting': A(68),
  'kb-wanglushan-pubu': A(69), 'kb-wangtianmenshan': A(70), 'kb-zaofa-baidicheng': A(73),
  'kb-zaochun-cheng': A(74), 'kb-yong-liu': A(76),
  // D合集
  'kb-xiangsi-wangwei': D(44), 'kb-youziyin': D(49),
  // B合集
  'kb-meihua': B(14), 'kb-cunju': B(20), 'kb-suojian': B(28), 'kb-huichong': B(38),
  'kb-yijiangnan': B(40), 'kb-tixilinbi': B(48),
  // B合集·本次新增
  'kb-yong-e': B(1), 'kb-jiangnan': B(2), 'kb-zengwanglun': B(8), 'kb-xiaochi': B(12),
  'kb-huaji': B(13), 'kb-chilege': B(21), 'kb-xiaochu-jingci': B(24),
  'kb-zhouye-shu-suojuan': B(27), 'kb-yeshu-suojian': B(31), 'kb-yinhu-shang': B(33),
  'kb-sanqu-daozhong': B(39), 'kb-yuanri': B(41)
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
  console.log(`${file}: ${n}/${poems.length} 首配内嵌视频`);
}

apply('src/data/poems.json');
apply('src/data/poems-kb.json');
