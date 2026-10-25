// 将古诗PDF的内容页渲染为PNG，用于视觉识别提取诗文
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { DOMMatrix, ImageData } from '@napi-rs/canvas';
import * as canvas from '@napi-rs/canvas';

const require = createRequire(import.meta.url);
globalThis.DOMMatrix = DOMMatrix;
globalThis.ImageData = ImageData;

const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

const PDF_PATH = 'D:/mywsl/projects/games/五年级河北小学古诗集.pdf';
const OUT_DIR = 'D:/mywsl/projects/games/poetry-app/scripts/pages';
const TARGET_WIDTH = 1400;

mkdirSync(OUT_DIR, { recursive: true });

const raw = require('node:fs').readFileSync(PDF_PATH);
const doc = await pdfjs.getDocument({ data: new Uint8Array(raw), useSystemFonts: true }).promise;
console.log('总页数:', doc.numPages);

for (let p = 2; p <= 28; p++) {
  const page = await doc.getPage(p);
  const baseViewport = page.getViewport({ scale: 1 });
  const scale = TARGET_WIDTH / baseViewport.width;
  const viewport = page.getViewport({ scale });
  const c = canvas.createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const buf = c.toBuffer('image/png');
  writeFileSync(`${OUT_DIR}/page-${String(p).padStart(2, '0')}.png`, buf);
  console.log(`page ${p} -> ${c.width}x${c.height} (${Math.round(buf.length / 1024)}KB)`);
}
console.log('完成');
