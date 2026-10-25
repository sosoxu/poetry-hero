// 生成安卓全套图标（传统 mipmap + 自适应图标前景），替换 Capacitor 默认图标
import * as canvas from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RES = 'android/app/src/main/res';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function star(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5;
    const b = a + Math.PI / 5;
    ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    ctx.lineTo(cx + r * 0.45 * Math.cos(b), cy + r * 0.45 * Math.sin(b));
  }
  ctx.closePath();
  ctx.fill();
}

// 传统启动图标：完整圆角方形设计（基准192）
function legacyIcon(size) {
  const c = canvas.createCanvas(size, size);
  const ctx = c.getContext('2d');
  const s = size / 192;
  ctx.fillStyle = '#e8541f';
  roundRect(ctx, 0, 0, size, size, 40 * s);
  ctx.fill();
  ctx.fillStyle = '#fdf6ec';
  roundRect(ctx, 26 * s, 30 * s, 140 * s, 132 * s, 14 * s);
  ctx.fill();
  ctx.fillStyle = '#d93425';
  ctx.font = `900 ${86 * s}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('诗', size / 2, size / 2 + 4 * s);
  ctx.fillStyle = '#f5a623';
  star(ctx, 42 * s, 46 * s, 9 * s);
  star(ctx, 156 * s, 148 * s, 7 * s);
  ctx.fillStyle = '#ffd166';
  star(ctx, 152 * s, 44 * s, 6 * s);
  return c.toBuffer('image/png');
}

// 自适应图标前景：透明底 + 中央内容（基准108dp，安全区中心66dp）
function fgIcon(size) {
  const c = canvas.createCanvas(size, size);
  const ctx = c.getContext('2d');
  const s = size / 108; // 画布为 108dp
  // 白纸卡片占中间
  ctx.fillStyle = '#fdf6ec';
  roundRect(ctx, 30 * s, 32 * s, 48 * s, 44 * s, 5 * s);
  ctx.fill();
  ctx.fillStyle = '#d93425';
  ctx.font = `900 ${30 * s}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('诗', 54 * s, 55 * s);
  ctx.fillStyle = '#f5a623';
  star(ctx, 33 * s, 32 * s, 3.4 * s);
  star(ctx, 76 * s, 72 * s, 2.8 * s);
  return c.toBuffer('image/png');
}

const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [d, mult] of Object.entries(dens)) {
  writeFileSync(join(RES, `mipmap-${d}`, 'ic_launcher.png'), legacyIcon(Math.round(48 * mult)));
  writeFileSync(join(RES, `mipmap-${d}`, 'ic_launcher_round.png'), legacyIcon(Math.round(48 * mult)));
  writeFileSync(join(RES, `mipmap-${d}`, 'ic_launcher_foreground.png'), fgIcon(Math.round(108 * mult)));
}
console.log('✅ 安卓图标已生成');
