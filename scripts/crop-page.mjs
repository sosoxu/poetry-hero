// 裁剪页面局部区域用于精确识别：node scripts/crop-page.mjs <pageNN> <y0%> <y1%> <outName>
import * as canvas from '@napi-rs/canvas';
import { readFileSync, writeFileSync } from 'node:fs';

const [page, y0s, y1s, outName] = process.argv.slice(2);
const y0 = Number(y0s) / 100, y1 = Number(y1s) / 100;
const img = await canvas.loadImage(`D:/mywsl/projects/games/poetry-app/scripts/pages/${page}.png`);
const w = img.width, h = img.height;
const c = canvas.createCanvas(w, Math.round(h * (y1 - y0)));
const ctx = c.getContext('2d');
ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, c.width, c.height);
ctx.drawImage(img, 0, Math.round(h * y0), w, Math.round(h * (y1 - y0)), 0, 0, w, c.height);
const buf = c.toBuffer('image/png');
writeFileSync(`D:/mywsl/projects/games/poetry-app/scripts/pages/${outName}.png`, buf);
console.log(`${outName}.png ${c.width}x${c.height} ${Math.round(buf.length / 1024)}KB`);
