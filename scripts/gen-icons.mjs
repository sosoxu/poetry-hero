// 生成应用图标（卡通风格：暖橙底 + 白色"诗"字 + 小星星）
import * as canvas from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });

function drawIcon(size) {
  const c = canvas.createCanvas(size, size);
  const ctx = c.getContext('2d');
  const s = size / 192; // 以192为基准的缩放

  // 背景圆角矩形
  const r = 42 * s;
  ctx.fillStyle = '#e8541f';
  roundRect(ctx, 4 * s, 4 * s, size - 8 * s, size - 8 * s, r);
  ctx.fill();

  // 内层浅色纸张
  ctx.fillStyle = '#fdf6ec';
  roundRect(ctx, 26 * s, 30 * s, 140 * s, 132 * s, 14 * s);
  ctx.fill();

  // "诗"字
  ctx.fillStyle = '#d93425';
  ctx.font = `900 ${86 * s}px "Microsoft YaHei", "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('诗', size / 2, size / 2 + 4 * s);

  // 星星装饰
  ctx.fillStyle = '#f5a623';
  star(ctx, 42 * s, 46 * s, 9 * s);
  star(ctx, 156 * s, 148 * s, 7 * s);
  ctx.fillStyle = '#ffd166';
  star(ctx, 152 * s, 44 * s, 6 * s);

  return c.toBuffer('image/png');
}

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

// SVG 图标（manifest 用）
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
<rect x="4" y="4" width="184" height="184" rx="42" fill="#e8541f"/>
<rect x="26" y="30" width="140" height="132" rx="14" fill="#fdf6ec"/>
<text x="96" y="102" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="86" font-weight="900" fill="#d93425" text-anchor="middle" dominant-baseline="middle">诗</text>
<circle cx="42" cy="46" r="7" fill="#f5a623"/>
<circle cx="152" cy="146" r="5" fill="#f5a623"/>
<circle cx="150" cy="44" r="4" fill="#ffd166"/>
</svg>`;

writeFileSync('public/icons/icon.svg', svg);
for (const size of [192, 512]) {
  writeFileSync(`public/icons/icon-${size}.png`, drawIcon(size));
}
// favicon 用小图
writeFileSync('public/icons/icon-64.png', drawIcon(64));
console.log('✅ 图标已生成: public/icons/');
