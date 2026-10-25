// 山海经异兽头像（卡通SVG）与趣味介绍
const B = (id, name, desc, body) => ({
  id, name, desc, emoji: ({baize:'🦄',jiuweihu:'🦊',qilin:'🐉',fenghuang:'🦚',kunpeng:'🐋',bifang:'🔥',taotie:'🐲',xiezhi:'🐐',suanni:'🦁',chongming:'🐦',zhulong:'🐲',tiangou:'🐕'})[id] || '🐾',
  img: './avatars/' + id + '.png',
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">${body}</svg>`
});

export const BEASTS = [
  B('baize', '白泽', '通晓天下万物的智慧神兽，问它什么都知道', `
    <defs><radialGradient id="g-bz" cx="50%" cy="38%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#dceaf5"/></radialGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-bz)"/>
    <path d="M20 52 q6 -30 28 -30 q22 0 28 30 q-14 16 -28 16 q-14 0 -28 -16z" fill="#f7fbff" stroke="#b9d2e6" stroke-width="2"/>
    <path d="M32 26 l4 -12 l6 10 M56 24 l6 -10 l2 13" fill="#b9d2e6"/>
    <path d="M30 46 q6 4 12 0 M54 46 q6 4 12 0" stroke="#5a7d9a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="44" r="2" fill="#3d5a75"/><circle cx="60" cy="44" r="2" fill="#3d5a75"/>
    <path d="M42 56 q6 5 12 0" stroke="#5a7d9a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M24 38 q-6 2 -8 8 M72 38 q6 2 8 8" stroke="#b9d2e6" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 63 q8 4 16 0 l-2 5 q-6 2 -12 0z" fill="#f0c4a8"/>`),
  B('jiuweihu', '九尾狐', '青丘山的灵狐，有九条蓬松的大尾巴', `
    <defs><linearGradient id="g-jw" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe3d0"/><stop offset="100%" stop-color="#ffb08f"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-jw)"/>
    <g stroke="#e8835e" stroke-width="2" fill="#fff4ea" stroke-linecap="round">
      <path d="M48 44 q-26 -6 -34 -22 q14 2 20 8" fill="#fff4ea"/>
      <path d="M48 44 q-20 -14 -22 -34 q12 6 16 16" fill="#fff4ea"/>
      <path d="M48 44 q-10 -20 -2 -38 q8 10 6 26" fill="#fff4ea"/>
      <path d="M48 44 q10 -20 2 -38 q8 18 6 26" fill="#fff4ea" transform="translate(4 0)"/>
      <path d="M48 44 q20 -14 22 -34 q-12 6 -16 16" fill="#fff4ea" transform="translate(4 0)"/>
      <path d="M48 44 q26 -6 34 -22 q-14 2 -20 8" fill="#fff4ea" transform="translate(2 0)"/>
    </g>
    <ellipse cx="48" cy="56" rx="24" ry="22" fill="#fff9f4" stroke="#e8835e" stroke-width="2.5"/>
    <path d="M36 46 l8 3 -8 4z M60 46 l-8 3 8 4z" fill="#5a4632"/>
    <path d="M44 60 q4 3 8 0" stroke="#d96a4a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M46 64 q2 3 4 0" fill="#e8835e"/>`),
  B('qilin', '麒麟', '仁慈的祥瑞之兽，走路连小虫都不踩', `
    <defs><linearGradient id="g-ql" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8f8ec"/><stop offset="100%" stop-color="#bfe8cb"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-ql)"/>
    <ellipse cx="48" cy="56" rx="24" ry="21" fill="#f4fbf6" stroke="#6faf85" stroke-width="2.5"/>
    <path d="M42 30 q2 -14 8 -18 q2 10 -2 18z M52 30 q4 -12 12 -14 q-1 10 -8 16z" fill="#6faf85"/>
    <path d="M46 26 q0 -10 4 -14" stroke="#4a8a63" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="41" cy="46" r="2.6" fill="#2f5e42"/><circle cx="55" cy="46" r="2.6" fill="#2f5e42"/>
    <path d="M38 42 q3 -2 6 0 M52 42 q3 -2 6 0" stroke="#4a8a63" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M43 57 q5 4 10 0" stroke="#4a8a63" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="33" cy="53" r="3.5" fill="#ffc9d6" opacity=".8"/><circle cx="63" cy="53" r="3.5" fill="#ffc9d6" opacity=".8"/>
    <path d="M40 71 q8 5 16 0" stroke="#6faf85" stroke-width="2" fill="none" stroke-linecap="round"/>`),
  B('fenghuang', '凤凰', '百鸟之王，现身之处天下安宁', `
    <defs><linearGradient id="g-fh" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ff8f6b"/><stop offset="100%" stop-color="#e8503a"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-fh)"/>
    <g fill="#ffd166">
      <path d="M48 62 q-22 6 -34 -4 q16 -2 22 -8z"/>
      <path d="M48 62 q22 6 34 -4 q-16 -2 -22 -8z"/>
      <path d="M48 66 q-14 14 -30 12 q12 -8 14 -16z"/>
      <path d="M48 66 q14 14 30 12 q-12 -8 -14 -16z"/>
    </g>
    <ellipse cx="48" cy="48" rx="17" ry="19" fill="#ffe9c9"/>
    <path d="M44 34 q0 -12 4 -20 q4 8 4 20z" fill="#ffd166"/>
    <path d="M40 32 q-6 -8 -4 -14 q6 4 8 12z M56 32 q6 -8 4 -14 q-6 4 -8 12z" fill="#ffb347"/>
    <circle cx="43" cy="45" r="2.6" fill="#7a2d1d"/><circle cx="53" cy="45" r="2.6" fill="#7a2d1d"/>
    <path d="M46 40 q2 -2 4 0" stroke="#7a2d1d" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M45 53 l3 4 l3 -4z" fill="#e8503a"/>`),
  B('kunpeng', '鲲鹏', '北冥的大鱼，一变身就成了遮天蔽日的大鸟', `
    <defs><linearGradient id="g-kp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cfeef7"/><stop offset="100%" stop-color="#8fd0e8"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-kp)"/>
    <path d="M30 50 q-18 -10 -24 -26 q20 4 28 14z" fill="#5bb8d4"/>
    <path d="M66 50 q18 -10 24 -26 q-20 4 -28 14z" fill="#5bb8d4"/>
    <ellipse cx="48" cy="56" rx="22" ry="18" fill="#3d9dbf"/>
    <ellipse cx="48" cy="52" rx="14" ry="10" fill="#7ccce4"/>
    <circle cx="41" cy="50" r="2.6" fill="#123f52"/><circle cx="55" cy="50" r="2.6" fill="#123f52"/>
    <circle cx="42" cy="49" r=".9" fill="#fff"/><circle cx="56" cy="49" r=".9" fill="#fff"/>
    <path d="M46 56 l2 3 l2 -3z" fill="#ffb347"/>
    <path d="M40 68 q8 6 16 0 q-4 8 -8 12 q-4 -4 -8 -12z" fill="#5bb8d4"/>
    <path d="M38 63 q10 4 20 0" stroke="#2d7a99" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="35" cy="57" r="2.4" fill="#bfeaf6"/><circle cx="61" cy="57" r="2.4" fill="#bfeaf6"/>`),
  B('bifang', '毕方', '独脚神鸟，它出现的地方会有小小的火光', `
    <defs><radialGradient id="g-bf" cx="50%" cy="40%"><stop offset="0%" stop-color="#fff2f0"/><stop offset="100%" stop-color="#ffd9cf"/></radialGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-bf)"/>
    <ellipse cx="48" cy="46" rx="18" ry="22" fill="#fffaf7" stroke="#e05e4e" stroke-width="2.5"/>
    <path d="M46 26 q-2 -10 -8 -14 q10 2 12 12z M50 26 q2 -10 8 -14 q-10 2 -12 12z" fill="#e05e4e"/>
    <path d="M44 30 q4 -14 12 -16 q-2 10 -8 16z" fill="#ff8a5e"/>
    <circle cx="43" cy="42" r="2.6" fill="#7a2018"/><circle cx="53" cy="42" r="2.6" fill="#7a2018"/>
    <path d="M45 50 l3 4 l3 -4z" fill="#e05e4e"/>
    <path d="M48 68 l0 16 M44 84 h8" stroke="#e05e4e" stroke-width="4" stroke-linecap="round"/>
    <path d="M42 60 q6 4 12 0" stroke="#e05e4e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M40 70 q-6 6 -4 12 M56 70 q6 6 4 12" stroke="#ffb347" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),
  B('taotie', '饕餮', '传说中的大胃王，贪吃到连自己都吃掉了', `
    <defs><linearGradient id="g-tt" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cfe0c8"/><stop offset="100%" stop-color="#9dbd96"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-tt)"/>
    <ellipse cx="48" cy="48" rx="27" ry="25" fill="#e9f2e4" stroke="#5e7d55" stroke-width="3"/>
    <path d="M30 38 q6 -6 12 -2 M54 36 q6 -4 12 2" stroke="#5e7d55" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="38" cy="46" r="5" fill="#fff" stroke="#5e7d55" stroke-width="2"/><circle cx="58" cy="46" r="5" fill="#fff" stroke="#5e7d55" stroke-width="2"/>
    <circle cx="38" cy="46" r="2" fill="#2d4228"/><circle cx="58" cy="46" r="2" fill="#2d4228"/>
    <path d="M34 60 q14 10 28 0 q-4 10 -14 10 q-10 0 -14 -10z" fill="#5e7d55"/>
    <path d="M40 61 l3 5 l3 -4 M52 61 l-3 5 l-3 -4 M56 61 l2 4" stroke="#fff" stroke-width="1.6" fill="none"/>
    <path d="M28 52 q4 3 8 1 M60 53 q4 2 8 -1" stroke="#5e7d55" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="56" r="4" fill="#c4d9bd"/><circle cx="66" cy="56" r="4" fill="#c4d9bd"/>`),
  B('xiezhi', '獬豸', '公正的神羊，能分辨谁对谁错', `
    <defs><linearGradient id="g-xz" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8e0f5"/><stop offset="100%" stop-color="#c3b3e0"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-xz)"/>
    <ellipse cx="48" cy="54" rx="23" ry="21" fill="#f5f1fb" stroke="#6b5a94" stroke-width="2.5"/>
    <path d="M44 36 q-4 -16 4 -24 q4 10 2 24z" fill="#6b5a94"/>
    <path d="M50 34 q6 -12 0 -22 q-4 8 0 22z" fill="#8d7ab8"/>
    <ellipse cx="40" cy="52" rx="8" ry="9" fill="#fff" transform="rotate(-14 40 52)"/>
    <ellipse cx="56" cy="52" rx="8" ry="9" fill="#fff" transform="rotate(14 56 52)"/>
    <rect x="36" y="47" width="5" height="6" rx="2" fill="#3d2f5e" transform="rotate(-14 38 50)"/>
    <rect x="55" y="47" width="5" height="6" rx="2" fill="#3d2f5e" transform="rotate(14 58 50)"/>
    <path d="M46 63 h5 M45 66 h7" stroke="#6b5a94" stroke-width="2" stroke-linecap="round"/>
    <path d="M48 68 q0 6 -3 9 q6 -1 6 -9z" fill="#8d7ab8"/>
    <path d="M36 70 q-5 4 -4 10 M60 70 q5 4 4 10" stroke="#c3b3e0" stroke-width="2.5" fill="none" stroke-linecap="round"/>`),
  B('suanni', '狻猊', '爱闻烟火的狮子，喜欢安静地坐着看香炉', `
    <defs><linearGradient id="g-sn" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ffe8b8"/><stop offset="100%" stop-color="#f5c46b"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-sn)"/>
    <path d="M26 46 q-2 -16 6 -18 q-2 10 2 14z M34 38 q-2 -14 8 -16 q0 10 4 13z M54 35 q2 -13 12 -13 q-3 9 0 13z M66 44 q6 -12 14 -10 q-6 8 -4 13z" fill="#e8a94a"/>
    <ellipse cx="48" cy="52" rx="24" ry="21" fill="#ffedc7" stroke="#c98a2e" stroke-width="2.5"/>
    <circle cx="39" cy="47" r="3.4" fill="#6b4413"/><circle cx="57" cy="47" r="3.4" fill="#6b4413"/>
    <path d="M35 42 q4 -3 8 0 M53 42 q4 -3 8 0" stroke="#6b4413" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M42 57 q6 6 12 0 l-2 6 q-4 3 -8 0z" fill="#e07b39"/>
    <path d="M45 57 l1.5 5 M51 57 l-1.5 5" stroke="#fff" stroke-width="1.6"/>
    <path d="M28 56 q-6 0 -8 -6 M68 56 q6 0 8 -6" stroke="#e8a94a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M76 28 q4 -8 0 -14 M82 30 q6 -6 6 -14" stroke="#b8c4cc" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>`),
  B('chongming', '重明鸟', '每只眼睛里有两个瞳孔的勇猛神鸟', `
    <defs><radialGradient id="g-cm" cx="50%" cy="40%"><stop offset="0%" stop-color="#fdf6e3"/><stop offset="100%" stop-color="#f3e2b8"/></radialGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-cm)"/>
    <path d="M48 30 q-4 -10 -12 -12 q4 8 2 14z M48 30 q4 -10 12 -12 q-4 8 -2 14z" fill="#d9534f"/>
    <ellipse cx="48" cy="50" rx="19" ry="21" fill="#fffaf0" stroke="#c9982e" stroke-width="2.5"/>
    <circle cx="41" cy="46" r="6" fill="#fff" stroke="#c9982e" stroke-width="1.6"/>
    <circle cx="57" cy="46" r="6" fill="#fff" stroke="#c9982e" stroke-width="1.6"/>
    <circle cx="40" cy="45" r="2.4" fill="#7a4a0e"/><circle cx="43" cy="48" r="1.6" fill="#7a4a0e"/>
    <circle cx="56" cy="45" r="2.4" fill="#7a4a0e"/><circle cx="59" cy="48" r="1.6" fill="#7a4a0e"/>
    <path d="M44 58 l4 5 l4 -5z" fill="#d9534f"/>
    <path d="M40 66 q8 5 16 0" stroke="#c9982e" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30 58 q-8 4 -6 12 q8 0 12 -6z M66 58 q8 4 6 12 q-8 0 -12 -6z" fill="#e8b84a"/>`),
  B('zhulong', '烛龙', '红色巨龙，睁眼是白天，闭眼是黑夜', `
    <defs><linearGradient id="g-zl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff9a8b"/><stop offset="100%" stop-color="#e05e50"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-zl)"/>
    <path d="M20 66 q10 -26 28 -30 q22 -4 28 12 q4 12 -8 18 q-20 8 -36 4 q-8 -2 -12 -4z" fill="#d94a3d"/>
    <path d="M22 64 q10 -20 26 -24 q16 -4 24 8" fill="none" stroke="#ffb0a0" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 34 q4 -10 12 -10 q-2 6 2 10z" fill="#8a2f24"/>
    <path d="M62 44 q10 -2 14 4 q-8 2 -10 6z" fill="#8a2f24"/>
    <circle cx="52" cy="48" r="8.5" fill="#ffe9a8"/>
    <circle cx="52" cy="48" r="4.5" fill="#ff8a00"/>
    <circle cx="50.6" cy="46.6" r="1.4" fill="#fff"/>
    <path d="M30 58 q8 6 18 4" stroke="#8a2f24" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M28 56 l-4 4 M34 62 l-2 5 M42 65 l0 5" stroke="#ffce7a" stroke-width="2" stroke-linecap="round"/>`),
  B('tiangou', '天狗', '御凶的天狗，像狸猫一样白脑袋，守护人们平安', `
    <defs><linearGradient id="g-tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eaf2f8"/><stop offset="100%" stop-color="#c5dbe8"/></linearGradient></defs>
    <circle cx="48" cy="48" r="46" fill="url(#g-tg)"/>
    <path d="M30 42 q-8 -18 2 -26 q8 8 10 20z M66 42 q8 -18 -2 -26 q-8 8 -10 20z" fill="#4a6b80"/>
    <ellipse cx="48" cy="54" rx="24" ry="21" fill="#fbfdff" stroke="#4a6b80" stroke-width="2.5"/>
    <path d="M28 48 q6 -4 12 0 M56 48 q6 -4 12 0" stroke="#c5dbe8" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M42 36 l6 20 l6 -20 q-6 -4 -12 0z" fill="#f4d7c8"/>
    <path d="M38 50 l8 3 -8 3z M58 50 l-8 3 8 3z" fill="#33505f"/>
    <path d="M45 60 q3 3 6 0" stroke="#33505f" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M40 64 h16 M42 67 h12" stroke="#4a6b80" stroke-width="2" stroke-linecap="round"/>
    <path d="M24 60 q-10 2 -12 -8 q8 0 10 -4z M72 60 q10 2 12 -8 q-8 0 -10 -4z" fill="#e8835e" opacity=".9"/>
    <circle cx="36" cy="58" r="3" fill="#ffc9d6" opacity=".8"/><circle cx="60" cy="58" r="3" fill="#ffc9d6" opacity=".8"/>`)
];

export const beastById = (id) => BEASTS.find(b => b.id === id) || null;

export function beastDataUri(b) {
  return b.img; // AI 生成头像；加载失败时组件用 emoji 兜底
}
