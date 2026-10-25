// 为名篇预填B站动画讲解视频链接（合集 BV1wh41177Hi《爱上古诗》）
import { readFileSync, writeFileSync } from 'node:fs';

const B = 'https://www.bilibili.com/video/BV1wh41177Hi?p=';
const mapping = {
  biedongda: 1, chusai: 6, chuzhouxijian: 8, chunxiao: 10, chunyexiyu: 11,
  congjunxing: 13, dengguanquelou: 15, duzuojingtingshan: 19, 'feng-liqiao': 22,
  fengqiaoyebo: 23, 'feng-mifeng': 24, furonglou: 25, cao: 26, gulangyuxing: 27,
  huanghelou: 31, jiangnanchun: 34, jiangxue: 36, jingyesi: 37, chongyang: 38,
  'jueju-chiri': 39, 'jueju-huangli': 40, langtaosha: 42, 'liangzhouci-han': 44,
  'liangzhouci-huan': 45, luchai: 46, mujiangyin: 51, qingming: 56, qiupuge: 57,
  saixiaqu: 60, shanxing: 62, songyuaner: 66, wangyue: 71, wenguanjun: 72,
  wuyixiang: 81, xunyinzhe: 79
};

const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
let n = 0;
for (const p of poems) {
  if (mapping[p.id] != null) {
    p.videos = [{ title: '爱上古诗·动画讲解', url: B + mapping[p.id] }];
    n++;
  }
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
console.log(`✅ 已为 ${n} 首诗预填B站视频链接`);
