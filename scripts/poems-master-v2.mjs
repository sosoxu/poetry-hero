// 五年级河北小学古诗集（原书104-131页）——v2 重建版，共97首
// 依据：逐页高清渲染图像人工核读（此前v1的73首清单大部分识别有误，已废弃）
export const poems = [
  // P2
  { id: 'songyouren', title: '送友人', dynasty: '唐', author: '李白', theme: 'mountain', lines: ['青山横北郭，', '白水绕东城。', '此地一为别，', '孤蓬万里征。', '浮云游子意，', '落日故人情。', '挥手自兹去，', '萧萧班马鸣。'] },
  { id: 'wangyue', title: '望岳', dynasty: '唐', author: '杜甫', theme: 'mountain', lines: ['岱宗夫如何？', '齐鲁青未了。', '造化钟神秀，', '阴阳割昏晓。', '荡胸生曾云，', '决眦入归鸟。', '会当凌绝顶，', '一览众山小。'] },
  { id: 'muchun-dufu', title: '暮春', dynasty: '唐', author: '杜甫', theme: 'river', lines: ['卧病拥塞在峡中，', '潇湘洞庭虚映空。', '楚天不断四时雨，', '巫峡常吹千里风。', '沙上草阁柳新暗，', '城边野池莲欲红。', '暮春鸳鹭立洲渚，', '挟子翻飞还一丛。'] },
  // P3
  { id: 'yueye-yishe', title: '月夜忆舍弟', dynasty: '唐', author: '杜甫', theme: 'moon', lines: ['戍鼓断人行，', '边秋一雁声。', '露从今夜白，', '月是故乡明。', '有弟皆分散，', '无家问死生。', '寄书长不达，', '况乃未休兵。'] },
  { id: 'shanshan-zaoxing', title: '商山早行', dynasty: '唐', author: '温庭筠', theme: 'mountain', lines: ['晨起动征铎，', '客行悲故乡。', '鸡声茅店月，', '人迹板桥霜。', '槲叶落山路，', '枳花明驿墙。', '因思杜陵梦，', '凫雁满回塘。'] },
  { id: 'wuti-xiangjian', title: '无题', dynasty: '唐', author: '李商隐', theme: 'candle', lines: ['相见时难别亦难，', '东风无力百花残。', '春蚕到死丝方尽，', '蜡炬成灰泪始干。', '晓镜但愁云鬓改，', '夜吟应觉月光寒。', '蓬山此去无多路，', '青鸟殷勤为探看。'] },
  // P4
  { id: 'jinse', title: '锦瑟', dynasty: '唐', author: '李商隐', theme: 'music', lines: ['锦瑟无端五十弦，', '一弦一柱思华年。', '庄生晓梦迷蝴蝶，', '望帝春心托杜鹃。', '沧海月明珠有泪，', '蓝田日暖玉生烟。', '此情可待成追忆，', '只是当时已惘然。'] },
  { id: 'chibi', title: '赤壁', dynasty: '唐', author: '杜牧', theme: 'river', lines: ['折戟沉沙铁未销，', '自将磨洗认前朝。', '东风不与周郎便，', '铜雀春深锁二乔。'] },
  { id: 'guohuaqinggong', title: '过华清宫绝句', dynasty: '唐', author: '杜牧', theme: 'horse', lines: ['长安回望绣成堆，', '山顶千门次第开。', '一骑红尘妃子笑，', '无人知是荔枝来。'] },
  { id: 'boqinhuai', title: '泊秦淮', dynasty: '唐', author: '杜牧', theme: 'river', lines: ['烟笼寒水月笼沙，', '夜泊秦淮近酒家。', '商女不知亡国恨，', '隔江犹唱后庭花。'] },
  // P5
  { id: 'yanmen-taishouxing', title: '雁门太守行', dynasty: '唐', author: '李贺', theme: 'border', lines: ['黑云压城城欲摧，', '甲光向日金鳞开。', '角声满天秋色里，', '塞上燕脂凝夜紫。', '半卷红旗临易水，', '霜重鼓寒声不起。', '报君黄金台上意，', '提携玉龙为君死。'] },
  { id: 'nanyuan-qi5', title: '南园·其五', dynasty: '唐', author: '李贺', theme: 'border', lines: ['男儿何不带吴钩，', '收取关山五十州。', '请君暂上凌烟阁，', '若个书生万户侯？'] },
  { id: 'mashi-qi5', title: '马诗·其五', dynasty: '唐', author: '李贺', theme: 'horse', lines: ['大漠沙如雪，', '燕山月似钩。', '何当金络脑，', '快走踏清秋。'] },
  // P6
  { id: 'kezhi', title: '客至', dynasty: '唐', author: '杜甫', theme: 'spring', lines: ['舍南舍北皆春水，', '但见群鸥日日来。', '花径不曾缘客扫，', '蓬门今始为君开。', '盘飧市远无兼味，', '樽酒家贫只旧醅。', '肯与邻翁相对饮，', '隔篱呼取尽余杯。'] },
  { id: 'tianmo-huailibai', title: '天末怀李白', dynasty: '唐', author: '杜甫', theme: 'river', lines: ['凉风起天末，', '君子意如何。', '鸿雁几时到，', '江湖秋水多。', '文章憎命达，', '魑魅喜人过。', '应共冤魂语，', '投诗赠汨罗。'] },
  { id: 'jiyangzhou-hanchuo', title: '寄扬州韩绰判官', dynasty: '唐', author: '杜牧', theme: 'moon', lines: ['青山隐隐水迢迢，', '秋尽江南草未凋。', '二十四桥明月夜，', '玉人何处教吹箫。'] },
  // P7
  { id: 'lvye-shuhuai', title: '旅夜书怀', dynasty: '唐', author: '杜甫', theme: 'river', lines: ['细草微风岸，', '危樯独夜舟。', '星垂平野阔，', '月涌大江流。', '名岂文章著，', '官应老病休。', '飘飘何所似，', '天地一沙鸥。'] },
  { id: 'deng-yueyanglou', title: '登岳阳楼', dynasty: '唐', author: '杜甫', theme: 'river', lines: ['昔闻洞庭水，', '今上岳阳楼。', '吴楚东南坼，', '乾坤日夜浮。', '亲朋无一字，', '老病有孤舟。', '戎马关山北，', '凭轩涕泗流。'] },
  { id: 'hanjiang-lintiao', title: '汉江临眺', dynasty: '唐', author: '王维', theme: 'river', lines: ['楚塞三湘接，', '荆门九派通。', '江流天地外，', '山色有无中。', '郡邑浮前浦，', '波澜动远空。', '襄阳好风日，', '留醉与山翁。'] },
  // P8
  { id: 'zhongnanshan', title: '终南山', dynasty: '唐', author: '王维', theme: 'mountain', lines: ['太乙近天都，', '连山接海隅。', '白云回望合，', '青霭入看无。', '分野中峰变，', '阴晴众壑殊。', '欲投人处宿，', '隔水问樵夫。'] },
  { id: 'guyao', title: '古谣', dynasty: '唐', author: '王建', theme: 'child', lines: ['一东一西垄头水，', '一聚一散天边霞。', '一来一去道上客，', '一颠一倒池中麻。'] },
  { id: 'ti-qiujianjudiaotu', title: '题秋江独钓图', dynasty: '清', author: '王士祯', theme: 'river', lines: ['一蓑一笠一扁舟，', '一丈丝纶一寸钩。', '一曲高歌一樽酒，', '一人独钓一江秋。'] },
  { id: 'shiwuyewangyue', title: '十五夜望月寄杜郎中', dynasty: '唐', author: '王建', theme: 'moon', lines: ['中庭地白树栖鸦，', '冷露无声湿桂花。', '今夜月明人尽望，', '不知秋思落谁家。'] },
  // P9
  { id: 'jianglou-ganjiu', title: '江楼感旧', dynasty: '唐', author: '赵嘏', theme: 'moon', lines: ['独上江楼思渺然，', '月光如水水如天。', '同来望月人何处？', '风景依稀似去年。'] },
  { id: 'sudi-qingming', title: '苏堤清明即事', dynasty: '宋', author: '吴惟信', theme: 'spring', lines: ['梨花风起正清明，', '游子寻春半出城。', '日暮笙歌收拾去，', '万株杨柳属流莺。'] },
  { id: 'wuxing-zashi', title: '吴兴杂诗', dynasty: '清', author: '阮元', theme: 'river', lines: ['交流四水抱城斜，', '散作千溪遍万家。', '深处种菱浅种稻，', '不深不浅种荷花。'] },
  { id: 'hanju', title: '寒菊', dynasty: '宋', author: '郑思肖', theme: 'plum', lines: ['花开不并百花丛，', '独立疏篱趣未穷。', '宁可枝头抱香死，', '何曾吹落北风中。'] },
  // P10
  { id: 'fangbingcao-humashi', title: '房兵曹胡马诗', dynasty: '唐', author: '杜甫', theme: 'horse', lines: ['胡马大宛名，', '锋棱瘦骨成。', '竹批双耳峻，', '风入四蹄轻。', '所向无空阔，', '真堪托死生。', '骁腾有如此，', '万里可横行。'] },
  { id: 'tianjingsha-chun', title: '天净沙·春', dynasty: '元', author: '白朴', theme: 'spring', lines: ['春山暖日和风，', '阑干楼阁帘栊，', '杨柳秋千院中。', '啼莺舞燕，', '小桥流水飞红。'] },
  { id: 'tianjingsha-qiu', title: '天净沙·秋', dynasty: '元', author: '白朴', theme: 'autumn', lines: ['孤村落日残霞，', '轻烟老树寒鸦，', '一点飞鸿影下。', '青山绿水，', '白草红叶黄花。'] },
  // P11
  { id: 'rumengling-changji', title: '如梦令·常记溪亭日暮', dynasty: '宋', author: '李清照', theme: 'river', lines: ['常记溪亭日暮，', '沉醉不知归路。', '兴尽晚回舟，', '误入藕花深处。', '争渡，争渡，', '惊起一滩鸥鹭。'] },
  { id: 'rumengling-zuoye', title: '如梦令·昨夜雨疏风骤', dynasty: '宋', author: '李清照', theme: 'rain', lines: ['昨夜雨疏风骤，', '浓睡不消残酒。', '试问卷帘人，', '却道海棠依旧。', '知否，知否？', '应是绿肥红瘦。'] },
  { id: 'rumengling-weixiang', title: '如梦令·为向东坡传语', dynasty: '宋', author: '苏轼', theme: 'rain', lines: ['为向东坡传语，', '人在玉堂深处。', '别后有谁来？', '雪压小桥无路。', '归去，归去，', '江上一犁春雨。'] },
  { id: 'qiupuge', title: '秋浦歌', dynasty: '唐', author: '李白', theme: 'autumn', lines: ['白发三千丈，', '缘愁似个长。', '不知明镜里，', '何处得秋霜。'] },
  // P12
  { id: 'qingpingle-cunju', title: '清平乐·村居', dynasty: '宋', author: '辛弃疾', theme: 'child', lines: ['茅檐低小，', '溪上青青草。', '醉里吴音相媚好，', '白发谁家翁媪？', '大儿锄豆溪东，', '中儿正织鸡笼。', '最喜小儿亡赖，', '溪头卧剥莲蓬。'] },
  { id: 'mushu', title: '牧竖', dynasty: '唐', author: '崔道融', theme: 'child', lines: ['牧竖持蓑笠，', '逢人气傲然。', '卧牛吹短笛，', '耕却傍溪田。'] },
  { id: 'junxing-libai', title: '军行', dynasty: '唐', author: '李白', theme: 'border', lines: ['骝马新跨白玉鞍，', '战罢沙场月色寒。', '城头铁鼓声犹震，', '匣里金刀血未干。'] },
  // P13
  { id: 'banv-yao', title: '巴女谣', dynasty: '唐', author: '于鹄', theme: 'child', lines: ['巴女骑牛唱竹枝，', '藕丝菱叶傍江时。', '不愁日暮还家错，', '记得芭蕉出槿篱。'] },
  { id: 'tingzheng', title: '听筝', dynasty: '唐', author: '李端', theme: 'music', lines: ['鸣筝金粟柱，', '素手玉房前。', '欲得周郎顾，', '时时误拂弦。'] },
  { id: 'changan-eyou', title: '长安夜游', dynasty: '唐', author: '袁不约', theme: 'candle', lines: ['凤城连夜九门通，', '帝女皇妃出汉宫。', '千乘宝莲珠箔卷，', '万条银烛碧纱笼。', '歌声缓过青楼月，', '香霭潜来紫陌风。', '长乐晓钟归骑后，', '遗簪堕珥满街中。'] },
  { id: 'wandie', title: '晚蝶', dynasty: '唐', author: '王建', theme: 'spring', lines: ['粉翅嫩如水，', '绕砌乍依风。', '日高山露解，', '飞入菊花中。'] },
  // P14
  { id: 'ziweihua', title: '紫薇花', dynasty: '唐', author: '杜牧', theme: 'spring', lines: ['晓迎秋露一枝新，', '不占园中最上春。', '桃李无言又何在，', '向风偏笑艳阳人。'] },
  { id: 'xiju-liuzongyuan', title: '溪居', dynasty: '唐', author: '柳宗元', theme: 'bamboo', lines: ['久为簪组累，', '幸此南夷谪。', '闲依农圃邻，', '偶似山林客。', '晓耕翻露草，', '夜榜响溪石。', '来往不逢人，', '长歌楚天碧。'] },
  { id: 'gongzixing', title: '公子行', dynasty: '唐', author: '孟宾于', theme: 'spring', lines: ['锦衣红夺彩霞明，', '侵晓春游向野庭。', '不识农夫辛苦力，', '骄骢踏烂麦青青。'] },
  { id: 'tianweng', title: '田翁', dynasty: '唐', author: '杜荀鹤', theme: 'autumn', lines: ['白发星星筋力衰，', '种田犹自伴孙儿。', '官苗若不平平纳，', '任是丰年也受饥。'] },
  // P15
  { id: 'canfu', title: '蚕妇', dynasty: '宋', author: '张俞', theme: 'child', lines: ['昨日到城廓，', '归来泪满巾。', '遍身罗绮者，', '不是养蚕人。'] },
  { id: 'tianjia-ouyangxiu', title: '田家', dynasty: '宋', author: '欧阳修', theme: 'spring', lines: ['绿桑高下映平川，', '赛罢田神笑语喧。', '林外鸣鸠春雨歇，', '屋头初日杏花繁。'] },
  { id: 'xiangsi-ligou', title: '乡思', dynasty: '宋', author: '李觏', theme: 'moon', lines: ['人言落日是天涯，', '望极天涯不见家。', '已恨碧山相阻隔，', '碧山还被暮云遮。'] },
  { id: 'jueju-zhinan', title: '绝句', dynasty: '宋', author: '志南', theme: 'spring', lines: ['古木阴中系短篷，', '杖藜扶我过桥东。', '沾衣欲湿杏花雨，', '吹面不寒杨柳风。'] },
  // P16
  { id: 'yingsuo', title: '莺梭', dynasty: '宋', author: '刘克庄', theme: 'spring', lines: ['掷柳迁乔大有情，', '交交时作弄机声。', '洛阳三月春如锦，', '多少工夫织得成。'] },
  { id: 'hushang-xuyuanjie', title: '湖上', dynasty: '宋', author: '徐元杰', theme: 'river', lines: ['花开红树乱莺啼，', '草长平湖白鹭飞。', '风日晴和人意好，', '夕阳箫鼓几船归。'] },
  { id: 'muchun-jishi', title: '暮春即事', dynasty: '宋', author: '叶采', theme: 'bamboo', lines: ['双双瓦雀行书案，', '点点杨花入砚池。', '闲坐小窗读周易，', '不知春去几多时。'] },
  { id: 'hanye', title: '寒夜', dynasty: '宋', author: '杜耒', theme: 'plum', lines: ['寒夜客来茶当酒，', '竹炉汤沸火初红。', '寻常一样窗前月，', '才有梅花便不同。'] },
  // P17
  { id: 'tihua-yuanmei', title: '题画', dynasty: '清', author: '袁枚', theme: 'child', lines: ['村落晚晴天，', '桃花映水鲜。', '牧童何处去？', '牛背一鸥眠。'] },
  // （题秋江独钓图与P8重复，已去重）
  { id: 'zhenzhou-jueju', title: '真州绝句', dynasty: '清', author: '王士祯', theme: 'river', lines: ['江干多是钓人居，', '柳陌菱塘一带疏。', '好是日斜风定后，', '半江红树卖鲈鱼。'] },
  { id: 'shanzhong-liuke', title: '山中留客', dynasty: '唐', author: '张旭', theme: 'mountain', lines: ['山光物态弄春晖，', '莫为轻阴便拟归。', '纵使晴明无雨色，', '入云深处亦沾衣。'] },
  // P18
  { id: 'yijia-biehushangting', title: '移家别湖上亭', dynasty: '唐', author: '戎昱', theme: 'farewell', lines: ['好是春风湖上亭，', '柳条藤蔓系离情。', '黄莺久住浑相识，', '欲别频啼四五声。'] },
  { id: 'qinzhenglou-xilaoliu', title: '勤政楼西老柳', dynasty: '唐', author: '白居易', theme: 'autumn', lines: ['半朽临风树，', '多情立马人。', '开元一株柳，', '长庆二年春。'] },
  { id: 'zengfanye', title: '赠范晔', dynasty: '南北朝', author: '陆凯', theme: 'plum', lines: ['折花逢驿使，', '寄与陇头人。', '江南无所有，', '聊赠一枝春。'] },
  { id: 'renri-sigui', title: '人日思归', dynasty: '隋', author: '薛道衡', theme: 'autumn', lines: ['入春才七日，', '离家已二年。', '人归落雁后，', '思发在花前。'] },
  // P19
  { id: 'yaozao-hanshandao', title: '杳杳寒山道', dynasty: '唐', author: '寒山', theme: 'snow', lines: ['杳杳寒山道，', '落落冷涧滨。', '啾啾常有鸟，', '寂寂更无人。', '淅淅风吹面，', '纷纷雪积身。', '朝朝不见日，', '岁岁不知春。'] },
  { id: 'chongbie-zhoushangshu', title: '重别周尚书', dynasty: '南北朝', author: '庾信', theme: 'farewell', lines: ['阳关万里道，', '不见一人归。', '惟有河边雁，', '秋来南向飞。'] },
  { id: 'chuncao-tangyanqian', title: '春草', dynasty: '唐', author: '唐彦谦', theme: 'spring', lines: ['天南天北绕路边，', '托根无处不延绵。', '萋萋总是无情物，', '吹绿东风又一年。'] },
  { id: 'chuncao-liuchang', title: '春草', dynasty: '宋', author: '刘敞', theme: 'spring', lines: ['春草绵绵不可名，', '水边原上乱抽荣。', '似嫌车马繁华地，', '才入城门便不生。'] },
  // P20
  { id: 'weiyu-dengcheng', title: '微雨登城二首·其一', dynasty: '宋', author: '刘敞', theme: 'rain', lines: ['雨映寒空半有无，', '重楼闲上倚城隅。', '浅深山色高低树，', '一片江南水墨图。'] },
  { id: 'su-ganlusi-sengshe', title: '宿甘露寺僧舍', dynasty: '宋', author: '曾公亮', theme: 'river', lines: ['枕中云气千峰近，', '床底松声万壑哀。', '要看银山拍天浪，', '开窗放入大江来。'] },
  { id: 'jiangshang-wanganshi', title: '江上', dynasty: '宋', author: '王安石', theme: 'river', lines: ['江北秋阴一半开，', '晚云含雨却低回。', '青山缭绕疑无路，', '忽见千帆隐映来。'] },
  { id: 'jiaoxing-wanganshi', title: '郊行', dynasty: '宋', author: '王安石', theme: 'spring', lines: ['柔桑采尽绿阴稀，', '芦箔蚕成密茧肥。', '聊向村家问风俗，', '如何勤苦尚凶饥。'] },
  // P21
  { id: 'liuzhou-eryue', title: '柳州二月榕叶落尽偶题', dynasty: '唐', author: '柳宗元', theme: 'rain', lines: ['宦情羁思共凄凄，', '春半如秋意转迷。', '山城过雨百花尽，', '榕叶满庭莺乱啼。'] },
  { id: 'chunguisi', title: '春闺思', dynasty: '唐', author: '张仲素', theme: 'spring', lines: ['袅袅城边柳，', '青青陌上桑。', '提笼忘采叶，', '昨夜梦渔阳。'] },
  { id: 'cailianqu-liufangping', title: '采莲曲', dynasty: '唐', author: '刘方平', theme: 'river', lines: ['落日清江里，', '荆歌艳楚腰。', '采莲从小惯，', '十五即乘潮。'] },
  { id: 'gongzijia', title: '公子家', dynasty: '唐', author: '聂夷中', theme: 'spring', lines: ['种花满西园，', '花发青楼道。', '花下一禾生，', '去之为恶草。'] },
  // P22
  { id: 'gongci-qier', title: '宫词五首·其二', dynasty: '唐', author: '顾况', theme: 'candle', lines: ['玉楼天半起笙歌，', '风送宫嫔笑语和。', '月殿影开闻夜漏，', '水晶帘卷近银河。'] },
  { id: 'chunsi-libai', title: '春思', dynasty: '唐', author: '李白', theme: 'spring', lines: ['燕草如碧丝，', '秦桑低绿枝。', '当君怀归日，', '是妾断肠时。', '春风不相识，', '何事入罗帏。'] },
  { id: 'ziyewuge-dongge', title: '子夜吴歌·冬歌', dynasty: '唐', author: '李白', theme: 'candle', lines: ['明朝驿使发，', '一夜絮征袍。', '素手抽针冷，', '那堪把剪刀。', '裁缝寄远道，', '几日到临洮。'] },
  { id: 'qingxixing', title: '清溪行', dynasty: '唐', author: '李白', theme: 'river', lines: ['清溪清我心，', '水色异诸水。', '借问新安江，', '见底何如此。', '人行明镜中，', '鸟度屏风里。', '向晚猩猩啼，', '空悲远游子。'] },
  // P23
  { id: 'biefang-taiweimu', title: '别房太尉墓', dynasty: '唐', author: '杜甫', theme: 'farewell', lines: ['他乡复行役，', '驻马别孤坟。', '近泪无干土，', '低空有断云。', '对棋陪谢傅，', '把剑觅徐君。', '唯见林花落，', '莺啼送客闻。'] },
  { id: 'shuxianzhumiao', title: '蜀先主庙', dynasty: '唐', author: '刘禹锡', theme: 'mountain', lines: ['天地英雄气，', '千秋尚凛然。', '势分三足鼎，', '业复五铢钱。', '得相能开国，', '生儿不象贤。', '凄凉蜀故妓，', '来舞魏宫前。'] },
  { id: 'fude-muyu-songlizhou', title: '赋得暮雨送李胄', dynasty: '唐', author: '韦应物', theme: 'rain', lines: ['楚江微雨里，', '建业暮钟时。', '漠漠帆来重，', '冥冥鸟去迟。', '海门深不见，', '浦树远含滋。', '相送情无限，', '沾襟比散丝。'] },
  // P24
  { id: 'beiqingluo', title: '北青萝', dynasty: '唐', author: '李商隐', theme: 'mountain', lines: ['残阳西入崦，', '茅屋访孤僧。', '落叶人何在，', '寒云路几层。', '独敲初夜磬，', '闲倚一枝藤。', '世界微尘里，', '吾宁爱与憎。'] },
  { id: 'bashang-qiuju', title: '灞上秋居', dynasty: '唐', author: '马戴', theme: 'autumn', lines: ['灞原风雨定，', '晚见雁行频。', '落叶他乡树，', '寒灯独夜人。', '空园白露滴，', '孤壁野僧邻。', '寄卧郊扉久，', '何年致此身。'] },
  { id: 'chujiang-huaigu', title: '楚江怀古', dynasty: '唐', author: '马戴', theme: 'river', lines: ['露气寒光集，', '微阳下楚丘。', '猿啼洞庭树，', '人在木兰舟。', '广泽生明月，', '苍山夹乱流。', '云中君不见，', '竟夕自悲秋。'] },
  // P25
  { id: 'chuye-youhuai', title: '除夜有怀', dynasty: '唐', author: '崔涂', theme: 'snow', lines: ['迢递三巴路，', '羁危万里身。', '乱山残雪夜，', '孤烛异乡人。', '渐与骨肉远，', '转于僮仆亲。', '那堪正飘泊，', '明日岁华新。'] },
  { id: 'zhangtai-yesii', title: '章台夜思', dynasty: '唐', author: '韦庄', theme: 'candle', lines: ['清瑟怨遥夜，', '绕弦风雨哀。', '孤灯闻楚角，', '残月下章台。', '芳草已云暮，', '故人殊未来。', '乡书不可寄，', '秋雁又南回。'] },
  { id: 'xun-luhongjian', title: '寻陆鸿渐不遇', dynasty: '唐', author: '皎然', theme: 'bamboo', lines: ['移家虽带郭，', '野径入桑麻。', '近种篱边菊，', '秋来未著花。', '扣门无犬吠，', '欲去问西家。', '报道山中去，', '归时每日斜。'] },
  // P26
  { id: 'yufu-zhangzhihe', title: '渔父', dynasty: '唐', author: '张志和', theme: 'river', lines: ['西塞山前白鹭飞，', '桃花流水鳜鱼肥。', '青箬笠，绿蓑衣，', '斜风细雨不须归。'] },
  { id: 'baixinyue', title: '拜新月', dynasty: '唐', author: '李端', theme: 'moon', lines: ['开帘见新月，', '便即下阶拜。', '细语人不闻，', '北风吹裙带。'] },
  { id: 'gongzhongci', title: '宫中词', dynasty: '唐', author: '朱庆馀', theme: 'candle', lines: ['寂寂花时闭院门，', '美人相并立琼轩。', '含情欲说宫中事，', '鹦鹉前头不敢言。'] },
  { id: 'jiren-zhangbi', title: '寄人', dynasty: '唐', author: '张泌', theme: 'moon', lines: ['别梦依依到谢家，', '小廊回合曲阑斜。', '多情只有春庭月，', '犹为离人照落花。'] },
  // P27
  { id: 'cailianzi-qi1', title: '采莲子·其一', dynasty: '唐', author: '皇甫松', theme: 'river', lines: ['菡萏香连十顷陂，', '小姑贪戏采莲迟。', '晚来弄水船头湿，', '更脱红裙裹鸭儿。'] },
  { id: 'cailianzi-qi2', title: '采莲子·其二', dynasty: '唐', author: '皇甫松', theme: 'river', lines: ['船动湖光滟滟秋，', '贪看年少信船流。', '无端隔水抛莲子，', '遥被人知半日羞。'] },
  { id: 'yeshang-shouxiangcheng', title: '夜上受降城闻笛', dynasty: '唐', author: '李益', theme: 'border', lines: ['回乐烽前沙似雪，', '受降城外月如霜。', '不知何处吹芦管，', '一夜征人尽望乡。'] },
  { id: 'jiangnanqu-yugu', title: '江南曲', dynasty: '唐', author: '于鹄', theme: 'river', lines: ['偶向江边采白蘋，', '还随女伴赛江神。', '众中不敢分明语，', '暗掷金钱卜远人。'] },
  // P28
  { id: 'songyouren-xuetao', title: '送友人', dynasty: '唐', author: '薛涛', theme: 'farewell', lines: ['水国蒹葭夜有霜，', '月寒山色共苍苍。', '谁言千里自今夕，', '离梦杳如关塞长。'] },
  { id: 'guyi-liqi', title: '古意', dynasty: '唐', author: '李颀', theme: 'border', lines: ['男儿事长征，', '少小幽燕客。', '赌胜马蹄下，', '由来轻七尺。', '杀人莫敢前，', '须如猬毛磔。', '黄云陇底白云飞，', '未得报恩不能归。', '辽东小妇年十五，', '惯弹琵琶解歌舞。', '今为羌笛出塞声，', '使我三军泪如雨。'] },
  { id: 'zaohan-jiangshang', title: '早寒江上有怀', dynasty: '唐', author: '孟浩然', theme: 'river', lines: ['木落雁南度，', '北风江上寒。', '我家襄水曲，', '遥隔楚云端。', '乡泪客中尽，', '孤帆天际看。', '迷津欲有问，', '平海夕漫漫。'] },
  // P29（原书129页，此前误判为封底漏掉，经考级表对照补入）
  { id: 'wanbo-xunyang', title: '晚泊浔阳望庐山', dynasty: '唐', author: '孟浩然', theme: 'mountain', lines: ['挂席几千里，', '名山都未逢。', '泊舟浔阳郭，', '始见香炉峰。', '尝读远公传，', '永怀尘外踪。', '东林精舍近，', '日暮空闻钟。'] },
  { id: 'deng-yanzhouchenglou', title: '登兖州城楼', dynasty: '唐', author: '杜甫', theme: 'mountain', lines: ['东郡趋庭日，', '南楼纵目初。', '浮云连海岱，', '平野入青徐。', '孤嶂秦碑在，', '荒城鲁殿余。', '从来多古意，', '临眺独踌躇。'] },
  { id: 'wuti-yibai-98', title: '无题一百首·其九十八', dynasty: '唐', author: '钱珝', theme: 'autumn', lines: ['万木已清霜，', '江边村事忙。', '故溪黄稻熟，', '一夜梦中香。'] }
];
