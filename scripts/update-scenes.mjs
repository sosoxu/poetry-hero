// 按诗的内容为每首诗定制场景道具（sceneProps），让顶部动画与诗意呼应
import { readFileSync, writeFileSync } from 'node:fs';

const P = {
  fisher: '孤舟蓑笠翁', duck: '戏水鸭', egret: '白鹭', geeseV: '雁阵', cicada: '枝头蝉',
  firefly: '流萤', bell: '古寺钟声', ox: '黄牛', candle: '烛光', moonbeam: '月光',
  peach: '桃花', ferry: '帆船', beacon: '烽火', horse: '骏马', windlines: '风',
  redbean: '红豆', snowbloom: '雪中花树', bee: '蜜蜂', petals: '落花', swallow: '飞燕',
  apricot: '红杏枝', wineflag: '酒旗', musicnotes: '音符', hut: '茅屋炊烟', cloudsea: '云海', sunburst: '旭日'
};

const map = {
  songyouren: ['horse'],                    // 萧萧班马鸣
  wangyue: ['cloudsea'],                    // 荡胸生曾云
  muchun: ['egret'],                        // 鸳鹭立洲渚
  mujiangyin: ['moonbeam'],                 // 月似弓
  'feng-mifeng': ['bee'],                   // 采得百花
  chusai: ['beacon'],                       // 秦时明月汉时关
  'liangzhouci-han': ['beacon'],            // 古来征战
  youziyin: ['candle'],                     // 慈母灯下缝衣
  cao: ['windlines'],                       // 春风吹又生
  yijiangnan: ['sunburst'],                 // 日出江花红胜火
  jingyesi: ['moonbeam'],                   // 床前明月光
  chunxiao: ['petals'],                     // 花落知多少
  xiangsi: ['redbean'],                     // 红豆生南国
  jiangxue: ['fisher'],                     // 孤舟蓑笠翁
  fengxue: ['hut'],                         // 天寒白屋贫
  'feng-liqiao': ['windlines'],             // 过江千尺浪
  chan: ['cicada'],                         // 垂緌饮清露
  'jueju-chiri': ['swallow'],               // 泥融飞燕子
  saixiaqu: ['geeseV'],                     // 月黑雁飞高
  youyuanbuzhi: ['apricot'],                // 一枝红杏出墙来
  suojian: ['cicada', 'ox'],                // 牧童骑黄牛捕鸣蝉
  qingming: ['ox'],                         // 牧童遥指杏花村
  huichong: ['duck', 'peach'],              // 春江水暖鸭先知
  tixilinbi: ['cloudsea'],                  // 横看成岭侧成峰
  xiarijueju: ['horse'],                    // 至今思项羽
  zhuliguan: ['moonbeam'],                  // 明月来相照
  bochuaguazhou: ['moonbeam'],              // 明月何时照我还
  baimei: ['snowbloom'],                    // 冰雪林中著此身
  'jueju-huangli': ['egret', 'ferry'],      // 一行白鹭上青天，门泊东吴万里船
  hanye: ['candle'],                        // 竹炉汤沸火初红
  chunyexiyu: ['petals'],                   // 花重锦官城
  wenguanjun: ['ferry'],                    // 青春作伴好还乡
  zenghuajing: ['musicnotes'],              // 锦城丝管日纷纷
  biedongda: ['geeseV'],                    // 北风吹雁雪纷纷
  huanghelou: ['ferry', 'petals'],          // 烟花三月下扬州
  qiuxi: ['firefly'],                       // 轻罗小扇扑流萤
  hanshi: ['petals', 'candle'],             // 春城无处不飞花 / 传蜡烛
  chuzhouxijian: ['ferry'],                 // 野渡无人舟自横
  wuyixiang: ['swallow'],                   // 旧时王谢堂前燕
  fengqiaoyebo: ['bell'],                   // 夜半钟声到客船
  'liangzhouci-huan': ['beacon'],           // 一片孤城万仞山
  zhuzhici: ['sunburst'],                   // 东边日出西边雨
  congjunxing: ['beacon'],                  // 孤城遥望玉门关
  wenwangchangling: ['moonbeam'],           // 我寄愁心与明月
  baixuege: ['snowbloom'],                  // 千树万树梨花开
  jihaizashi: ['horse', 'windlines'],       // 万马齐喑恃风雷
  shiyiyue: ['horse']                       // 铁马冰河入梦来
};

const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
let n = 0;
for (const p of poems) {
  p.sceneProps = map[p.id] || [];
  if (p.sceneProps.length) n++;
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
console.log(`✅ ${n} 首诗已定制场景道具（其余保持主题场景）`);
console.log('道具库:', Object.values(P).join('、'));
