<template>
  <div class="scene" :class="theme">
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" :aria-label="theme + '场景'">
      <!-- 天空底色 -->
      <rect x="0" y="0" width="400" height="220" class="sky" />

      <!-- 太阳 / 月亮 -->
      <g v-if="hasSun">
        <circle cx="330" cy="52" r="26" class="sun" />
        <g class="rays">
          <line v-for="i in 8" :key="i" :x1="330" :y1="52" :x2="330" :y2="52" class="ray"
            :transform="`rotate(${i * 45} 330 52)`" />
        </g>
      </g>
      <g v-if="hasMoon">
        <circle cx="320" cy="50" r="24" class="moon" />
        <circle cx="330" cy="44" r="20" class="moon-bite" />
        <circle cx="280" cy="36" r="2" class="star twinkle" />
        <circle cx="352" cy="80" r="1.6" class="star twinkle" />
        <circle cx="300" cy="88" r="1.4" class="star twinkle" />
      </g>

      <!-- 云朵 -->
      <g class="cloud cloud-a">
        <ellipse cx="80" cy="46" rx="26" ry="11" />
        <ellipse cx="102" cy="40" rx="18" ry="9" />
      </g>
      <g class="cloud cloud-b">
        <ellipse cx="230" cy="66" rx="20" ry="8" />
        <ellipse cx="246" cy="61" rx="13" ry="6" />
      </g>

      <!-- 飞鸟 -->
      <g class="birds" v-if="hasBirds">
        <path d="M60 70 q7 -7 14 0 q7 -7 14 0" class="bird" />
        <path d="M110 88 q5 -5 10 0 q5 -5 10 0" class="bird" />
      </g>

      <!-- 远山 -->
      <path d="M0 150 Q60 84 130 148 Q190 100 260 150 Q320 112 400 156 L400 220 L0 220 Z" class="hill-far" />
      <!-- 近山 -->
      <path d="M0 172 Q80 118 170 170 Q250 128 340 174 Q375 158 400 170 L400 220 L0 220 Z" class="hill-near" />

      <!-- 水 / 河 -->
      <g v-if="hasWater">
        <rect x="0" y="182" width="400" height="38" class="water" />
        <path d="M20 192 q14 4 28 0 q14 -4 28 0" class="wave" />
        <path d="M120 202 q14 4 28 0 q14 -4 28 0" class="wave" />
        <path d="M240 194 q14 4 28 0 q14 -4 28 0" class="wave" />
        <path d="M320 206 q14 4 28 0" class="wave" />
      </g>

      <!-- 小船 -->
      <g v-if="hasBoat" class="boat">
        <path d="M240 196 q22 14 46 0 l-6 8 h-36 z" class="boat-body" />
        <line x1="264" y1="170" x2="264" y2="197" class="mast" />
        <path d="M264 172 l22 20 h-22 z" class="sail" />
      </g>

      <!-- 雪山 -->
      <g v-if="isSnowy">
        <path d="M40 172 L110 96 L180 172 Z" class="peak" />
        <path d="M110 96 L128 120 L116 124 L106 116 L98 126 Z" class="peak-snow" />
      </g>

      <!-- 松树 -->
      <g v-if="isSnowy">
        <rect x="46" y="164" width="6" height="16" class="trunk" />
        <path d="M28 168 L49 136 L70 168 Z" class="pine" />
        <path d="M32 154 L49 128 L66 154 Z" class="pine" />
      </g>

      <!-- 梅树 -->
      <g v-if="isPlum">
        <path d="M70 190 q6 -30 -4 -52 q-6 -16 4 -30" class="plum-branch" />
        <path d="M70 140 q18 -8 30 -4" class="plum-branch b2" />
        <circle cx="66" cy="104" r="4.5" class="plum-flower" />
        <circle cx="80" cy="94" r="4" class="plum-flower f2" />
        <circle cx="94" cy="122" r="4" class="plum-flower f3" />
        <circle cx="60" cy="130" r="4.5" class="plum-flower f4" />
        <circle cx="72" cy="158" r="4" class="plum-flower f5" />
        <circle cx="88" cy="140" r="3.4" class="plum-flower f6" />
      </g>

      <!-- 竹林 -->
      <g v-if="isBamboo">
        <g class="bamboo">
          <rect x="52" y="60" width="7" height="130" rx="3.5" class="cane" />
          <path d="M52 92 h7 M52 124 h7 M52 156 h7" class="node" />
          <path d="M59 84 q26 -10 34 6 q-20 10 -34 -6" class="leaf" />
          <path d="M59 116 q-24 -12 -32 4 q20 10 32 -4" class="leaf" />
        </g>
        <g class="bamboo b2">
          <rect x="320" y="40" width="8" height="150" rx="4" class="cane" />
          <path d="M320 80 h8 M320 120 h8 M320 160 h8" class="node" />
          <path d="M320 70 q-26 -12 -34 6 q20 10 34 -6" class="leaf" />
        </g>
        <g class="bamboo b3">
          <rect x="352" y="80" width="6" height="110" rx="3" class="cane" />
          <path d="M352 110 q22 -10 28 4 q-16 10 -28 -4" class="leaf" />
        </g>
      </g>

      <!-- 花 / 蝴蝶（春） -->
      <g v-if="isSpringy">
        <circle cx="40" cy="196" r="5" class="flower" />
        <circle cx="52" cy="204" r="4" class="flower f2" />
        <circle cx="360" cy="200" r="5" class="flower f3" />
        <circle cx="348" cy="192" r="4" class="flower f4" />
        <circle cx="200" cy="206" r="4" class="flower f5" />
        <g class="butterfly">
          <ellipse cx="150" cy="120" rx="3" ry="5" class="bf-wing" />
          <path d="M150 120 q-10 -12 -14 -2 q2 10 14 2 q10 -12 14 -2 q-2 10 -14 2" class="bf-wing w2" />
        </g>
      </g>

      <!-- 枫叶（秋） -->
      <g v-if="isAutumn">
        <path d="M60 190 q4 -20 -2 -34 M60 168 q12 -6 16 2 M60 176 q-12 -6 -16 2" class="maple-branch" />
        <path d="M340 196 q4 -18 -2 -30" class="maple-branch b2" />
        <g class="falling-leaf">
          <path d="M180 60 q6 -8 12 0 q-6 8 -12 0" class="maple-leaf" />
        </g>
        <g class="falling-leaf f2">
          <path d="M260 40 q5 -7 10 0 q-5 7 -10 0" class="maple-leaf" />
        </g>
      </g>

      <!-- 长城（边塞） -->
      <g v-if="isBorder">
        <path d="M0 190 L60 168 L120 186 L200 160 L280 184 L360 166 L400 178" class="wall-base" />
        <g class="beacon">
          <rect x="96" y="150" width="14" height="20" class="tower" />
          <path d="M92 150 h22 l-4 -8 h-14 z" class="roof" />
          <rect x="240" y="140" width="16" height="24" class="tower" />
          <path d="M236 140 h26 l-4 -9 h-18 z" class="roof" />
        </g>
      </g>

      <!-- 柳树（送别） -->
      <g v-if="isFarewell">
        <path d="M50 190 q4 -24 -2 -40" class="willow-trunk" />
        <g class="willow">
          <path d="M48 150 q-20 -14 -36 -10" class="willow-branch" />
          <path d="M48 150 q-8 -22 -26 -28" class="willow-branch b2" />
          <path d="M48 150 q10 -20 30 -22" class="willow-branch b3" />
          <path d="M14 140 v26 M22 144 v24 M30 138 v22 M48 128 v24 M60 130 v22 M72 134 v20" class="willow-leaves" />
        </g>
        <circle cx="320" cy="182" r="7" class="person-head" />
        <path d="M320 189 v14 M320 193 l-8 8 M320 193 l8 6 M320 203 l-6 12 M320 203 l6 12" class="person-body" />
      </g>

      <!-- 牧童 / 纸鸢（童趣） -->
      <g v-if="isChild">
        <path d="M60 188 q10 -16 22 0 q-10 8 -22 0" class="ox-body" />
        <circle cx="82" cy="180" r="6" class="ox-head" />
        <path d="M84 176 q4 -4 6 0 M84 176 q-4 -4 -6 0" class="ox-horn" />
        <circle cx="66" cy="164" r="5.5" class="person-head" />
        <path d="M66 170 v11 M66 174 l-7 6 M66 174 l7 5" class="person-body" />
        <g class="kite">
          <path d="M300 60 l16 22 h-32 z" class="kite-body" />
          <path d="M300 82 v34 M300 92 q-8 6 -12 12 M300 100 q8 6 12 10" class="kite-tail" />
        </g>
      </g>

      <!-- 雨（雨天） -->
      <g v-if="isRainy">
        <g class="rain-group">
          <line v-for="(x, i) in rainXs" :key="i" :x1="x" :y1="60 + (i % 3) * 14" :x2="x - 4" :y2="76 + (i % 3) * 14" class="raindrop" />
        </g>
        <path d="M150 196 q30 -22 60 0 q-30 14 -60 0" class="lotus-leaf" />
        <path d="M240 192 q24 -18 48 0 q-24 12 -48 0" class="lotus-leaf l2" />
      </g>

      <!-- 雪（飘雪） -->
      <g v-if="isSnowy">
        <g class="snow-group">
          <circle v-for="(s, i) in snowDots" :key="i" :cx="s.x" :cy="s.y" r="2.2" class="snowflake" />
        </g>
      </g>

      <!-- ===== 按诗定制道具 ===== -->
      <!-- 孤舟蓑笠翁 -->
      <g v-if="has('fisher')" class="prop fisher-prop">
        <path d="M180 196 q26 16 54 0 l-8 9 h-40 z" class="pr-boat" />
        <circle cx="204" cy="178" r="5" class="pr-skin" />
        <path d="M198 172 a8 8 0 0 1 12 0 z" class="pr-hat" />
        <path d="M204 183 v10" class="pr-body" />
        <line x1="222" y1="170" x2="230" y2="196" class="pr-line" />
        <animateTransform attributeName="transform" type="translate" values="0 0;0 3;0 0" dur="4s" repeatCount="indefinite" />
      </g>

      <!-- 戏水鸭 -->
      <g v-if="has('duck')" class="prop duck-prop">
        <g class="duck d1">
          <ellipse cx="0" cy="0" rx="10" ry="7" class="pr-duck" />
          <circle cx="8" cy="-6" r="4.5" class="pr-duck" />
          <path d="M12 -6 l5 1.5 l-5 1.5 z" class="pr-duckbill" />
          <circle cx="9.5" cy="-7" r="1" class="pr-eye" />
        </g>
        <g class="duck d2">
          <ellipse cx="0" cy="0" rx="8" ry="6" class="pr-duck duck2" />
          <circle cx="7" cy="-5" r="4" class="pr-duck duck2" />
          <path d="M10.5 -5 l4 1.3 l-4 1.3 z" class="pr-duckbill" />
        </g>
      </g>

      <!-- 白鹭 -->
      <g v-if="has('egret')" class="prop egret-prop">
        <g class="egret e1">
          <path d="M0 0 q6 -6 12 0 q6 -6 12 0" class="pr-egret-wing" />
          <path d="M24 0 q8 2 12 8" class="pr-egret-neck" />
          <path d="M36 8 l4 -1 l-3 3 z" class="pr-egret-beak" />
        </g>
        <g class="egret e2">
          <path d="M0 0 q5 -5 10 0 q5 -5 10 0" class="pr-egret-wing" />
        </g>
      </g>

      <!-- 雁阵（人字形） -->
      <g v-if="has('geeseV')" class="prop geese-prop">
        <path v-for="(g2, i) in geeseDots" :key="i" d="M0 0 q5 -5 10 0 q5 -5 10 0" class="pr-goose" :transform="`translate(${g2.x} ${g2.y}) rotate(${g2.r})`" />
      </g>

      <!-- 枝头蝉 -->
      <g v-if="has('cicada')" class="prop cicada-prop">
        <path d="M60 120 q20 -14 40 -6" class="pr-branch" />
        <ellipse cx="86" cy="112" rx="4" ry="6.5" class="pr-cicada" />
        <circle cx="86" cy="104" r="3" class="pr-cicada c2" />
        <path d="M83 118 q-3 4 -6 4 M89 118 q3 4 6 4" class="pr-cicada-wing" />
        <g class="sound-ring"><circle cx="86" cy="112" r="10" class="pr-ring" /></g>
        <g class="sound-ring r2"><circle cx="86" cy="112" r="14" class="pr-ring" /></g>
      </g>

      <!-- 流萤 -->
      <g v-if="has('firefly')">
        <circle v-for="(f, i) in fireflies" :key="i" :cx="f.x" :cy="f.y" r="2" class="pr-firefly" :style="{ animationDelay: f.d + 's', animationDuration: f.dur + 's' }" />
      </g>

      <!-- 古寺钟声 -->
      <g v-if="has('bell')" class="prop bell-prop">
        <path d="M330 96 l40 0 l-6 12 h-28 z" class="pr-pagoda" />
        <path d="M322 96 l56 0 l-4 -8 h-48 z" class="pr-pagoda roof" />
        <circle cx="350" cy="112" r="6" class="pr-bell" />
        <g class="ring-wave"><circle cx="350" cy="112" r="12" class="pr-ring" /></g>
        <g class="ring-wave w2"><circle cx="350" cy="112" r="20" class="pr-ring" /></g>
      </g>

      <!-- 黄牛 -->
      <g v-if="has('ox')" class="prop ox-prop">
        <path d="M60 188 q10 -15 22 0 q-10 8 -22 0" class="pr-oxbody" />
        <circle cx="82" cy="180" r="6" class="pr-oxhead" />
        <path d="M84 176 q4 -4 6 0 M84 176 q-4 -4 -6 0" class="pr-oxhorn" />
        <path d="M66 176 q2 -4 6 -2 M74 175 q2 -4 6 -2" class="pr-oxleg" />
      </g>

      <!-- 烛光（窗口） -->
      <g v-if="has('candle')" class="prop candle-prop">
        <rect x="266" y="128" width="52" height="44" rx="4" class="pr-window" />
        <rect x="292" y="128" width="0.5" height="44" class="pr-window-bar" />
        <g class="pr-flame-glow">
          <ellipse cx="280" cy="152" rx="7" ry="11" class="pr-flame" />
          <ellipse cx="280" cy="155" rx="3.4" ry="6" class="pr-flame inner" />
        </g>
      </g>

      <!-- 月光柱 -->
      <g v-if="has('moonbeam')" class="prop moonbeam-prop">
        <path d="M282 74 L252 220 L322 220 Z" class="pr-beam" />
      </g>

      <!-- 桃花枝 -->
      <g v-if="has('peach')" class="prop peach-prop">
        <path d="M20 160 q26 -18 54 -8" class="pr-branch" />
        <circle cx="34" cy="146" r="4.5" class="pr-blossom" />
        <circle cx="50" cy="140" r="4" class="pr-blossom b2" />
        <circle cx="64" cy="146" r="4.5" class="pr-blossom" />
        <circle cx="44" cy="154" r="4" class="pr-blossom b2" />
      </g>

      <!-- 帆船 -->
      <g v-if="has('ferry')" class="prop ferry-prop">
        <path d="M250 200 q30 16 60 0 l-8 9 h-46 z" class="pr-boat" />
        <line x1="282" y1="164" x2="282" y2="201" class="pr-mast" />
        <path d="M282 166 q26 16 26 30 l-26 0 z" class="pr-sail" />
        <path d="M282 170 q-18 12 -18 26 l18 0 z" class="pr-sail s2" />
      </g>

      <!-- 烽火 -->
      <g v-if="has('beacon')" class="prop beacon-prop">
        <path d="M28 170 l14 -22 l14 22 z" class="pr-tower" />
        <path d="M36 148 q6 -10 4 -18 q6 8 6 18" class="pr-smoke" />
        <g class="pr-fire"><path d="M42 162 q-4 -8 0 -14 q4 6 0 14" /></g>
      </g>

      <!-- 骏马 -->
      <g v-if="has('horse')" class="prop horse-prop">
        <g class="pr-horse-gallop">
          <path d="M46 176 q4 -16 18 -16 q12 0 16 10 l10 2 q4 2 2 6 l-12 0 q-2 8 -12 8 q-12 0 -14 -8 q-6 0 -8 -2 z" class="pr-horse" />
          <path d="M50 186 l-3 10 M58 186 l-1 10 M68 184 l2 10 M76 182 l4 9" class="pr-horse-leg" />
          <path d="M90 172 l10 -6 l-8 10 z" class="pr-horse-mane" />
        </g>
      </g>

      <!-- 风线 -->
      <g v-if="has('windlines')">
        <path v-for="(w, i) in windLines" :key="i" :d="`M${w.x} ${w.y} q14 -6 30 0 q16 6 32 0`" class="pr-wind" :style="{ animationDelay: w.d + 's' }" />
      </g>

      <!-- 红豆枝 -->
      <g v-if="has('redbean')" class="prop redbean-prop">
        <path d="M48 170 q-10 -20 4 -36" class="pr-branch" />
        <path d="M50 148 q16 -10 28 -4 M50 158 q-16 -8 -26 0" class="pr-branch b2" />
        <circle cx="60" cy="132" r="3" class="pr-bean" />
        <circle cx="72" cy="142" r="3" class="pr-bean" />
        <circle cx="34" cy="152" r="3" class="pr-bean" />
        <circle cx="52" cy="164" r="3" class="pr-bean" />
      </g>

      <!-- 雪中花树（忽如一夜梨花开） -->
      <g v-if="has('snowbloom')" class="prop snowbloom-prop">
        <path d="M40 190 q4 -26 -4 -42" class="pr-branch" />
        <path d="M36 148 q16 -12 30 -8 M36 158 q-14 -8 -24 -2" class="pr-branch b2" />
        <circle cx="44" cy="142" r="4" class="pr-snowflower" />
        <circle cx="58" cy="138" r="4" class="pr-snowflower" />
        <circle cx="70" cy="144" r="4.4" class="pr-snowflower" />
        <circle cx="28" cy="152" r="4" class="pr-snowflower" />
        <circle cx="52" cy="158" r="4" class="pr-snowflower" />
      </g>

      <!-- 蜜蜂 -->
      <g v-if="has('bee')" class="prop bee-prop">
        <g class="pr-bee">
          <ellipse cx="0" cy="0" rx="5" ry="3.6" class="pr-bee-body" />
          <path d="M-2 -3.6 v7 M1 -3.8 v7.6" class="pr-bee-stripe" />
          <ellipse cx="-4" cy="-1" rx="3" ry="2" class="pr-bee-wing" />
          <circle cx="5" cy="0" r="0.8" class="pr-eye" />
        </g>
      </g>

      <!-- 落花 -->
      <g v-if="has('petals')">
        <ellipse v-for="(p2, i) in petalDots" :key="i" :cx="p2.x" :cy="p2.y" rx="3" ry="2" class="pr-petal" :style="{ animationDelay: p2.d + 's', animationDuration: p2.dur + 's' }" :transform="`rotate(${p2.r} ${p2.x} ${p2.y})`" />
      </g>

      <!-- 飞燕 -->
      <g v-if="has('swallow')" class="prop swallow-prop">
        <g class="pr-swallow s1">
          <path d="M0 0 q8 -10 16 -2 q6 -8 14 -4 q-8 2 -10 8 q-10 6 -20 -2 z" class="pr-swallow-body" />
        </g>
        <g class="pr-swallow s2">
          <path d="M0 0 q7 -8 13 -2 q5 -6 11 -3 q-6 2 -8 6 q-8 5 -16 -1 z" class="pr-swallow-body" />
        </g>
      </g>

      <!-- 红杏枝 -->
      <g v-if="has('apricot')" class="prop apricot-prop">
        <path d="M330 190 q-4 -24 6 -40 M336 160 q14 -8 26 -4" class="pr-branch" />
        <circle cx="326" cy="140" r="4" class="pr-apricotflower" />
        <circle cx="340" cy="136" r="4.4" class="pr-apricotflower" />
        <circle cx="352" cy="146" r="4" class="pr-apricotflower" />
        <circle cx="334" cy="152" r="4" class="pr-apricotflower" />
      </g>

      <!-- 酒旗 -->
      <g v-if="has('wineflag')" class="prop wineflag-prop">
        <line x1="96" y1="130" x2="96" y2="196" class="pr-pole" />
        <path d="M96 136 q18 -4 32 2 q-14 8 -32 4 z" class="pr-flag" />
        <text x="106" y="148" class="pr-flag-text">酒</text>
      </g>

      <!-- 音符 -->
      <g v-if="has('musicnotes')" class="prop music-prop">
        <g v-for="(m, i) in musicDots" :key="i" class="pr-note" :style="{ animationDelay: m.d + 's', animationDuration: m.dur + 's' }" :transform="`translate(${m.x} ${m.y})`">
          <ellipse cx="0" cy="0" rx="3" ry="2.2" />
          <line x1="2.6" y1="-0.6" x2="2.6" y2="-11" />
          <path d="M2.6 -11 q5 1 6 5" />
        </g>
      </g>

      <!-- 茅屋炊烟 -->
      <g v-if="has('hut')" class="prop hut-prop">
        <rect x="80" y="170" width="36" height="24" class="pr-hutwall" />
        <path d="M74 170 l24 -14 l24 14 z" class="pr-hutroof" />
        <path d="M100 156 q-2 -10 2 -18 q4 10 4 16" class="pr-smoke" />
      </g>

      <!-- 云海 -->
      <g v-if="has('cloudsea')">
        <ellipse cx="90" cy="158" rx="60" ry="12" class="pr-seacloud" />
        <ellipse cx="220" cy="166" rx="80" ry="14" class="pr-seacloud s2" />
        <ellipse cx="330" cy="160" rx="55" ry="11" class="pr-seacloud s3" />
      </g>

      <!-- 旭日（大太阳光芒） -->
      <g v-if="has('sunburst')" class="prop sunburst-prop">
        <circle cx="200" cy="86" r="20" class="pr-bigsun" />
        <g class="pr-burst">
          <line v-for="i in 12" :key="i" x1="200" y1="86" x2="200" y2="86" class="pr-bighray"
            :transform="`rotate(${i * 30} 200 86)`" />
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  theme: { type: String, default: 'spring' },
  props: { type: Array, default: () => [] }
});

const has = (p) => props.props.includes(p);

const hasSun = computed(() => ['spring', 'river', 'mountain', 'border', 'autumn', 'child'].includes(props.theme));
const hasMoon = computed(() => ['moon', 'snow', 'bamboo'].includes(props.theme));
const hasBirds = computed(() => ['mountain', 'spring', 'river', 'farewell', 'autumn'].includes(props.theme));
const hasWater = computed(() => ['river', 'moon', 'snow', 'rain', 'border'].includes(props.theme));
const hasBoat = computed(() => ['river', 'moon', 'farewell', 'snow'].includes(props.theme));
const isSnowy = computed(() => props.theme === 'snow');
const isPlum = computed(() => props.theme === 'plum');
const isBamboo = computed(() => props.theme === 'bamboo');
const isSpringy = computed(() => props.theme === 'spring');
const isAutumn = computed(() => props.theme === 'autumn');
const isBorder = computed(() => props.theme === 'border');
const isFarewell = computed(() => props.theme === 'farewell');
const isChild = computed(() => props.theme === 'child');
const isRainy = computed(() => props.theme === 'rain');

const rainXs = [40, 90, 140, 190, 240, 290, 340, 380, 65, 165, 265, 365];
const snowDots = Array.from({ length: 14 }, (_, i) => ({ x: 20 + i * 27, y: 30 + ((i * 37) % 130) }));

// 道具动画数据
const geeseDots = [
  { x: 250, y: 46, r: -18 }, { x: 272, y: 54, r: -18 }, { x: 294, y: 62, r: -18 },
  { x: 272, y: 38, r: -18 }, { x: 294, y: 46, r: -18 }, { x: 316, y: 54, r: -18 }
];
const fireflies = Array.from({ length: 7 }, (_, i) => ({
  x: 60 + ((i * 67) % 280), y: 90 + ((i * 43) % 70), d: i * 0.7, dur: 3 + (i % 3)
}));
const windLines = [
  { x: 30, y: 70, d: 0 }, { x: 210, y: 96, d: 0.8 }, { x: 90, y: 126, d: 1.6 }, { x: 280, y: 60, d: 2.2 }
];
const petalDots = Array.from({ length: 8 }, (_, i) => ({
  x: 24 + i * 46, y: 20 + ((i * 29) % 60), d: i * 0.9, dur: 4.5 + (i % 4), r: (i * 47) % 360
}));
const musicDots = Array.from({ length: 4 }, (_, i) => ({
  x: 60 + i * 80, y: 80 + (i % 2) * 26, d: i * 1.1, dur: 5 + i
}));
</script>

<style scoped>
.scene { width: 100%; height: 170px; overflow: hidden; border-radius: 18px 18px 0 0; position: relative; }
.scene svg { width: 100%; height: 100%; display: block; }

.sky { fill: #bfe3f7; }
.mountain .sky, .border .sky { fill: #ffd9a0; }
.moon .sky, .snow .sky, .bamboo .sky { fill: #2c3e63; }
.rain .sky { fill: #9fb6c9; }
.autumn .sky { fill: #ffe3bd; }

.sun { fill: #ffb347; }
.ray { stroke: #ffb347; stroke-width: 3; stroke-linecap: round; }
.rays line { x2: 340; }
.moon { fill: #ffe9a8; }
.moon-bite { fill: var(--sky, #2c3e63); }
.moon-bite { fill: #2c3e63; }
.moon .sky {}
.star { fill: #fff8dc; }
.twinkle { animation: twinkle 2.2s infinite alternate; }
@keyframes twinkle { from { opacity: .3; } to { opacity: 1; } }

.cloud ellipse { fill: rgba(255,255,255,.85); }
.cloud-a { animation: drift 26s linear infinite; }
.cloud-b { animation: drift 34s linear infinite reverse; }
@keyframes drift { from { transform: translateX(-60px); } to { transform: translateX(420px); } }

.bird { stroke: #556; stroke-width: 2; fill: none; stroke-linecap: round; }
.birds { animation: flyAcross 30s linear infinite; }
@keyframes flyAcross { from { transform: translateX(-40px); } to { transform: translateX(420px); } }

.hill-far { fill: #9fd0a9; }
.mountain .hill-far, .border .hill-far { fill: #e8b06e; }
.autumn .hill-far { fill: #f0b070; }
.moon .hill-far, .snow .hill-far { fill: #4a5a80; }
.moon .hill-near, .snow .hill-near { fill: #374767; }
.bamboo .hill-far { fill: #3d5a52; }
.bamboo .hill-near { fill: #2d463f; }
.rain .hill-far { fill: #7fa58a; }
.hill-near { fill: #6dbb8a; }
.mountain .hill-near, .border .hill-near { fill: #d9995c; }
.autumn .hill-near { fill: #dd8a52; }
.rain .hill-near { fill: #67987a; }

.water { fill: #7fc4e8; opacity: .9; }
.moon .water, .snow .water { fill: #3b4d78; }
.wave { stroke: rgba(255,255,255,.7); stroke-width: 2; fill: none; stroke-linecap: round; }

.boat { animation: bob 4s ease-in-out infinite; }
@keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
.boat-body { fill: #8a5a2b; }
.mast { stroke: #6d4420; stroke-width: 2.5; }
.sail { fill: #fff7ec; }

.peak { fill: #8d9dbb; }
.peak-snow { fill: #fff; }
.trunk { fill: #6d4420; }
.pine { fill: #2f7a52; }
.snow .pine { fill: #2c5a45; }

.plum-branch { stroke: #7a4a2b; stroke-width: 4; fill: none; stroke-linecap: round; }
.plum-branch.b2 { stroke-width: 2.6; }
.plum-flower { fill: #ff7e8a; }
.plum-flower.f2 { fill: #ff9aa5; animation: sway 3s infinite alternate; }
.plum-flower.f3 { fill: #ff6f7d; animation: sway 2.6s infinite alternate-reverse; }
.plum-flower.f4 { fill: #ffb3bc; }
.plum-flower.f5 { fill: #ff8d99; }
.plum-flower.f6 { fill: #ffd3d8; }
@keyframes sway { from { transform: translateY(0); } to { transform: translateY(2px); } }

.cane { fill: #4c9e5f; }
.bamboo.b2 .cane { fill: #3f8f54; }
.bamboo.b3 .cane { fill: #58aa6a; }
.node { stroke: #2e6b3e; stroke-width: 2; }
.leaf { fill: #5cb872; opacity: .9; }

.flower { fill: #ff8f6b; }
.flower.f2 { fill: #ffd166; }
.flower.f3 { fill: #ff6f91; }
.flower.f4 { fill: #ffd166; }
.flower.f5 { fill: #9adcff; }
.butterfly { animation: flutter 6s ease-in-out infinite; }
@keyframes flutter { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-14px); } }
.bf-wing { fill: #f78fb3; }
.bf-wing.w2 { fill: #f8a5c2; }

.maple-branch { stroke: #a0522d; stroke-width: 3; fill: none; stroke-linecap: round; }
.maple-leaf { fill: #e8541f; }
.falling-leaf { animation: fallLeaf 5s linear infinite; }
.falling-leaf.f2 { animation-duration: 6.5s; animation-delay: 2s; }
@keyframes fallLeaf { from { transform: translateY(-10px) rotate(0); opacity: 1; } to { transform: translateY(140px) rotate(360deg); opacity: .2; } }

.wall-base { stroke: #c98a4b; stroke-width: 7; fill: none; }
.tower { fill: #d9995c; }
.roof { fill: #b06a35; }

.willow-trunk { stroke: #7a5230; stroke-width: 5; fill: none; stroke-linecap: round; }
.willow-branch { stroke: #5f9e4c; stroke-width: 2.4; fill: none; }
.willow-branch.b2 { stroke: #6fae58; }
.willow-branch.b3 { stroke: #549044; }
.willow-leaves { stroke: #7fc06a; stroke-width: 2; }
.person-head { fill: #ffd9b3; }
.person-body { stroke: #d93425; stroke-width: 2.4; stroke-linecap: round; fill: none; }

.ox-body { fill: #c98a4b; }
.ox-head { fill: #b5793c; }
.ox-horn { stroke: #8d5a2b; stroke-width: 2; fill: none; }
.kite { animation: kiteFloat 5s ease-in-out infinite; }
@keyframes kiteFloat { 0%,100% { transform: translate(0,0) rotate(-3deg); } 50% { transform: translate(8px,-10px) rotate(3deg); } }
.kite-body { fill: #ff6f61; stroke: #d93425; stroke-width: 1.5; }
.kite-tail { stroke: #d93425; stroke-width: 1.6; fill: none; }

.raindrop { stroke: #bcd9ec; stroke-width: 2; stroke-linecap: round; }
.rain-group { animation: rainFall 1.1s linear infinite; }
@keyframes rainFall { from { transform: translateY(-14px); } to { transform: translateY(14px); } }
.lotus-leaf { fill: #3f9e5f; opacity: .92; }
.lotus-leaf.l2 { fill: #55b872; }

.snowflake { fill: #fff; opacity: .9; }
.snow-group { animation: snowFall 5s linear infinite; }
@keyframes snowFall { from { transform: translateY(-20px); } to { transform: translateY(40px); } }

.scene { position: relative; }

/* ===== 定制道具 ===== */
.pr-boat { fill: #8a5a2b; }
.pr-mast { stroke: #6d4420; stroke-width: 2.5; }
.pr-sail { fill: #fff7ec; } .pr-sail.s2 { fill: #f4e6d0; }
.pr-skin { fill: #ffd9b3; }
.pr-hat { fill: #d9c9a8; }
.pr-body { stroke: #6b8e9c; stroke-width: 3; stroke-linecap: round; }
.pr-line { stroke: rgba(255,255,255,.8); stroke-width: 1; }
.fisher-prop { animation: bob 4.5s ease-in-out infinite; }

.pr-duck { fill: #f7f3e8; } .pr-duck.duck2 { fill: #e8ddc8; }
.pr-duckbill { fill: #f5a623; }
.pr-eye { fill: #333; }
.duck-prop .duck.d1 { animation: swimBy 22s linear infinite; }
.duck-prop .duck.d2 { animation: swimBy 28s linear infinite; animation-delay: -9s; }
@keyframes swimBy { from { transform: translate(-40px, 0); } to { transform: translate(430px, 0); } }

.pr-egret-wing { stroke: #fff; stroke-width: 3; fill: none; stroke-linecap: round; filter: drop-shadow(0 1px 0 rgba(0,0,0,.15)); }
.pr-egret-neck { stroke: #fff; stroke-width: 3; fill: none; stroke-linecap: round; }
.pr-egret-beak { fill: #f5a623; }
.egret-prop .egret.e1 { animation: flyAcross 18s linear infinite; }
.egret-prop .egret.e2 { animation: flyAcross 24s linear infinite; animation-delay: -6s; }

.pr-goose { stroke: #4a4a58; stroke-width: 2.4; fill: none; stroke-linecap: round; }
.geese-prop { animation: flyAcross 38s linear infinite; }

.pr-branch { stroke: #7a4a2b; stroke-width: 4; fill: none; stroke-linecap: round; }
.pr-branch.b2 { stroke-width: 2.6; }
.pr-cicada { fill: #6d5a3f; } .pr-cicada.c2 { fill: #57472f; }
.pr-cicada-wing { stroke: #cfe3f2; stroke-width: 2; fill: none; }
.pr-ring { stroke: rgba(255,255,255,.75); stroke-width: 1.6; fill: none; }
.sound-ring { animation: ringPulse 2.4s ease-out infinite; transform-origin: 86px 112px; }
.sound-ring.r2 { animation-delay: 1.2s; }
@keyframes ringPulse { from { transform: scale(.4); opacity: .9; } to { transform: scale(1.7); opacity: 0; } }

.pr-pagoda { fill: #b06a35; } .pr-pagoda.roof { fill: #8d4f26; }
.pr-bell { fill: #f5c542; }
.ring-wave { animation: ringPulse 2.8s ease-out infinite; transform-origin: 350px 112px; }
.ring-wave.w2 { animation-delay: 1.4s; }

.pr-oxbody { fill: #c98a4b; } .pr-oxhead { fill: #b5793c; }
.pr-oxhorn { stroke: #8d5a2b; stroke-width: 2; fill: none; }
.pr-oxleg { stroke: #a06a34; stroke-width: 2; fill: none; }
.ox-prop { animation: graze 6s ease-in-out infinite; transform-origin: 72px 188px; }
@keyframes graze { 0%,100% { transform: rotate(0); } 50% { transform: rotate(-2.2deg); } }

.pr-window { fill: #2b2340; stroke: #8a6f4d; stroke-width: 2.5; }
.pr-window-bar { stroke: #8a6f4d; stroke-width: 2; }
.pr-flame { fill: #ffb347; }
.pr-flame.inner { fill: #fff3b0; }
.pr-flame-glow { animation: flicker 1.6s ease-in-out infinite; transform-origin: 280px 152px; }
@keyframes flicker { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.15, .92); opacity: .85; } }

.pr-beam { fill: rgba(255,244,180,.14); animation: beamGlow 4s ease-in-out infinite; }
@keyframes beamGlow { 0%,100% { opacity: .7; } 50% { opacity: 1; } }

.pr-blossom { fill: #ffb7c5; } .pr-blossom.b2 { fill: #ff9db1; }

.pr-tower { fill: #b0876a; }
.pr-smoke { stroke: #cfc4b4; stroke-width: 3; fill: none; stroke-linecap: round; opacity: .8; }
.pr-fire path { fill: #ff8a50; animation: flicker 1.1s infinite; transform-origin: 42px 162px; }

.pr-horse { fill: #7a5230; }
.pr-horse-leg { stroke: #7a5230; stroke-width: 2.6; stroke-linecap: round; }
.pr-horse-mane { fill: #5e3d20; }
.pr-horse-gallop { animation: gallop 0.7s ease-in-out infinite alternate; transform-origin: 62px 186px; }
@keyframes gallop { from { transform: translateY(0) rotate(0); } to { transform: translateY(-2.5px) rotate(-1.5deg); } }

.pr-wind { stroke: rgba(255,255,255,.55); stroke-width: 2; fill: none; stroke-linecap: round; animation: windDash 3s linear infinite; }
@keyframes windDash { from { stroke-dasharray: 0 90; } 60% { stroke-dasharray: 62 0; } to { stroke-dasharray: 62 0; opacity: 0; } }

.pr-bean { fill: #d93425; }

.pr-snowflower { fill: #fff; stroke: #ffd9e0; stroke-width: 1; }

.pr-bee-body { fill: #f7c948; }
.pr-bee-stripe { stroke: #3d2b1f; stroke-width: 1.6; }
.pr-bee-wing { fill: rgba(255,255,255,.75); animation: buzzWing .15s linear infinite alternate; }
@keyframes buzzWing { from { transform: rotate(-12deg); } to { transform: rotate(14deg); } }
.pr-bee { animation: beeFly 9s ease-in-out infinite; }
@keyframes beeFly { 0%,100% { transform: translate(0,0); } 25% { transform: translate(46px,-26px); } 50% { transform: translate(96px,4px); } 75% { transform: translate(40px,22px); } }

.pr-petal { fill: #ffc2cc; opacity: .9; animation: petalFall linear infinite; }
@keyframes petalFall { from { transform: translateY(-14px) rotate(0); } to { transform: translateY(150px) rotate(300deg); opacity: .25; } }

.pr-swallow-body { fill: #3d3d4d; }
.pr-swallow.s1 { animation: swallowPath 11s ease-in-out infinite; }
.pr-swallow.s2 { animation: swallowPath 14s ease-in-out infinite; animation-delay: -5s; }
@keyframes swallowPath { 0%,100% { transform: translate(40px, 70px); } 30% { transform: translate(180px, 40px); } 60% { transform: translate(320px, 84px); } 80% { transform: translate(180px, 56px); } }

.pr-apricotflower { fill: #ff6f61; }

.pr-pole { stroke: #8a6f4d; stroke-width: 3; }
.pr-flag { fill: #f5e6c8; stroke: #d9c9a0; stroke-width: 1; animation: flagWave 2.6s ease-in-out infinite; transform-origin: 96px 140px; }
.pr-flag-text { font-size: 11px; fill: #b8860b; font-weight: 700; }
@keyframes flagWave { 0%,100% { transform: skewY(0deg); } 50% { transform: skewY(-4deg); } }

.pr-note ellipse { fill: #4a3d5f; }
.pr-note line, .pr-note path { stroke: #4a3d5f; stroke-width: 1.6; fill: none; }
.pr-note { animation: noteFloat linear infinite; }
@keyframes noteFloat { from { transform: translateY(12px) scale(.6); opacity: 0; } 25% { opacity: 1; } to { transform: translateY(-44px) scale(1); opacity: 0; } }

.pr-hutwall { fill: #d9c9a8; }
.pr-hutroof { fill: #a06a34; }

.pr-seacloud { fill: rgba(255,255,255,.65); animation: seaDrift 26s ease-in-out infinite alternate; }
.pr-seacloud.s2 { animation-duration: 32s; }
.pr-seacloud.s3 { animation-duration: 22s; }
@keyframes seaDrift { from { transform: translateX(-14px); } to { transform: translateX(14px); } }

.pr-bigsun { fill: #ff9d3f; animation: sunPulse 5s ease-in-out infinite; }
@keyframes sunPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
.pr-bighray { stroke: rgba(255,180,80,.8); stroke-width: 3; stroke-linecap: round; x2: 232; }
.pr-burst { animation: burstSpin 40s linear infinite; transform-origin: 200px 86px; }
@keyframes burstSpin { to { transform: rotate(360deg); } }
</style>
