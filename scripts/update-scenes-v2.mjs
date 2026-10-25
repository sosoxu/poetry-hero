// v2 场景道具映射：按新96首诗的内容定制
import { readFileSync, writeFileSync } from 'node:fs';

const map = {
  songyouren: ['horse'],                       // 萧萧班马鸣
  wangyue: ['cloudsea'],                       // 荡胸生曾云
  'muchun-dufu': ['egret'],                    // 鸳鹭立洲渚
  'yueye-yishe': ['geeseV', 'moonbeam'],       // 边秋一雁声 / 月是故乡明
  'shanshan-zaoxing': ['hut', 'moonbeam'],     // 鸡声茅店月 / 人迹板桥霜
  'wuti-xiangjian': ['candle'],                // 蜡炬成灰泪始干
  jinse: ['musicnotes', 'moonbeam'],           // 锦瑟五十弦
  chibi: ['ferry'],                            // 折戟沉沙
  guohuaqinggong: ['horse'],                   // 一骑红尘
  boqinhuai: ['ferry', 'moonbeam'],            // 夜泊秦淮 / 烟笼寒水月笼沙
  'yanmen-taishouxing': ['beacon'],            // 黑云压城 / 半卷红旗
  'nanyuan-qi5': ['horse'],                    // 男儿何不带吴钩
  'mashi-qi5': ['horse', 'moonbeam'],          // 大漠沙如雪 / 燕山月似钩
  kezhi: ['swallow'],                          // 但见群鸥日日来
  'tianmo-huailibai': ['geeseV'],              // 鸿雁几时到
  'jiyangzhou-hanchuo': ['moonbeam', 'musicnotes'], // 二十四桥明月夜 / 玉人何处教吹箫
  'lvye-shuhuai': ['fisher'],                  // 天地一沙鸥 / 危樯独夜舟
  'deng-yueyanglou': ['ferry'],                // 老病有孤舟
  'hanjiang-lintiao': ['egret', 'cloudsea'],   // 山色有无中
  zhongnanshan: ['cloudsea'],                  // 白云回望合
  guyao: ['cloudsea'],                         // 一聚一散天边霞
  'ti-qiujianjudiaotu': ['fisher'],            // 一人独钓一江秋
  shiwuyewangyue: ['moonbeam'],                // 今夜月明人尽望
  'jianglou-ganjiu': ['moonbeam'],             // 月光如水水如天
  'sudi-qingming': ['swallow', 'petals'],      // 梨花风起 / 万株杨柳
  'wuxing-zashi': ['sunburst'],                // 屋头初日
  hanju: ['snowbloom'],                        // 枝头抱香死
  'fangbingcao-humashi': ['horse'],            // 胡马大宛名
  'tianjingsha-chun': ['swallow', 'petals'],   // 啼莺舞燕 / 小桥流水飞红
  'tianjingsha-qiu': ['geeseV', 'petals'],     // 一点飞鸿影下 / 白草红叶黄花
  'rumengling-changji': ['egret'],             // 惊起一滩鸥鹭
  'rumengling-zuoye': ['petals', 'rain'],      // 绿肥红瘦
  'rumengling-weixiang': ['snowbloom'],        // 雪压小桥无路
  qiupuge: ['moonbeam'],                       // 何处得秋霜
  'qingpingle-cunju': ['ox'],                  // 大儿锄豆溪东 / 溪头卧剥莲蓬
  mushu: ['ox'],                               // 卧牛吹短笛
  'junxing-libai': ['horse', 'moonbeam'],      // 骝马新跨白玉鞍
  'banv-yao': ['ox'],                          // 巴女骑牛唱竹枝
  tingzheng: ['musicnotes'],                   // 鸣筝金粟柱
  'changan-eyou': ['candle', 'musicnotes'],    // 万条银烛 / 歌声缓过
  wandie: ['butterfly', 'flower'],             // 飞入菊花中
  ziweihua: ['flower'],                        // 晓迎秋露一枝新
  'xiju-liuzongyuan': ['bamboo'],              // 长歌楚天碧
  gongzixing: ['horse'],                       // 骄骢踏烂麦青青
  tianweng: ['hut'],                           // 种田犹自伴孙儿
  canfu: ['hut'],                              // 昨日到城廓
  'tianjia-ouyangxiu': ['sunburst', 'swallow'],// 屋头初日 / 林外鸣鸠
  'xiangsi-ligou': ['moonbeam', 'cloudsea'],   // 落日/暮云
  'jueju-zhinan': ['apricot', 'willowrain'],   // 杏花雨 / 杨柳风
  yingsuo: ['bird'],                           // 莺梭（黄莺织柳）
  'hushang-xuyuanjie': ['egret', 'ferry'],     // 白鹭飞 / 夕阳箫鼓几船归
  'muchun-jishi': ['swallow', 'petals'],       // 双双瓦雀 / 点点杨花
  hanye: ['candle', 'moonbeam'],               // 竹炉汤沸 / 窗前月
  'tihua-yuanmei': ['ox', 'peach'],            // 牛背一鸥眠 / 桃花映水鲜
  'zhenzhou-jueju': ['fisher'],                // 半江红树卖鲈鱼
  'shanzhong-liuke': ['cloudsea'],             // 入云深处亦沾衣
  'yijia-biehushangting': ['willowrain'],      // 柳条藤蔓系离情
  'qinzhenglou-xilaoliu': ['willowrain'],      // 开元一株柳
  zengfanye: ['plum'],                         // 聊赠一枝春
  'renri-sigui': ['geeseV'],                   // 人归落雁后
  'yaozao-hanshandao': ['snowbloom'],          // 纷纷雪积身
  'chongbie-zhoushangshu': ['geeseV'],         // 惟有河边雁
  'chuncao-tangyanqian': ['windlines'],        // 吹绿东风又一年
  'chuncao-liuchang': ['windlines'],           // 春草绵绵
  'weiyu-dengcheng': ['rain'],                 // 雨映寒空
  'su-ganlusi-sengshe': ['wave'],              // 银山拍天浪
  'jiangshang-wanganshi': ['ferry'],           // 忽见千帆隐映来
  'jiaoxing-wanganshi': ['hut'],               // 芦箔蚕成
  'liuzhou-eryue': ['rain', 'petals'],         // 山城过雨百花尽
  chunguisi: ['swallow', 'windlines'],         // 袅袅城边柳
  'cailianqu-liufangping': ['ferry'],          // 落日清江里
  gongzijia: ['flower'],                       // 种花满西园
  'gongci-qier': ['musicnotes', 'candle'],     // 玉楼天半起笙歌
  'chunsi-libai': ['swallow'],                 // 燕草如碧丝
  'ziyewuge-dongge': ['candle'],               // 素手抽针冷（灯下裁衣）
  qingxixing: ['fisher'],                      // 人行明镜中
  'biefang-taiweimu': ['petals'],              // 唯见林花落
  shuxianzhumiao: ['cloudsea'],                // 天地英雄气
  'fude-muyu-songlizhou': ['rain', 'ferry'],   // 楚江微雨 / 漠漠帆来重
  beiqingluo: ['bell'],                        // 独敲初夜磬
  'bashang-qiuju': ['geeseV'],                 // 晚见雁行频
  'chujiang-huaigu': ['ferry', 'moonbeam'],    // 人在木兰舟 / 广泽生明月
  'chuye-youhuai': ['candle', 'snowbloom'],    // 孤烛异乡人 / 乱山残雪夜
  'zhangtai-yesii': ['candle', 'moonbeam'],    // 孤灯 / 残月下章台
  'xun-luhongjian': ['flower'],                // 近种篱边菊
  'yufu-zhangzhihe': ['fisher', 'egret'],      // 白鹭飞 / 青箬笠绿蓑衣
  baixinyue: ['moonbeam'],                     // 开帘见新月
  gongzhongci: ['candle'],                     // 含情欲说宫中事
  'jiren-zhangbi': ['moonbeam'],               // 春庭月照落花
  'cailianzi-qi1': ['ferry', 'duck'],          // 晚来弄水船头湿
  'cailianzi-qi2': ['ferry'],                  // 船动湖光滟滟秋
  'yeshang-shouxiangcheng': ['beacon', 'moonbeam'], // 回乐烽前 / 月如霜
  'jiangnanqu-yugu': ['ferry'],                // 偶向江边采白蘋
  'songyouren-xuetao': ['moonbeam', 'windlines'], // 水国蒹葭夜有霜
  'guyi-liqi': ['horse', 'musicnotes'],        // 赌胜马蹄下 / 惯弹琵琶
  'zaohan-jiangshang': ['geeseV', 'ferry'],    // 木落雁南度 / 孤帆天际看
};

// 新道具补充：butterfly蝴蝶 flower花朵 bird黄莺 willowrain柳雨 wave浪
const poems = JSON.parse(readFileSync('src/data/poems.json', 'utf8'));
let n = 0;
for (const p of poems) {
  p.sceneProps = map[p.id] || [];
  if (p.sceneProps.length) n++;
}
writeFileSync('src/data/poems.json', JSON.stringify(poems, null, 1));
console.log(`✅ ${n}/${poems.length} 首已配置场景道具`);
