// 批量生成山海经异兽头像（pollinations.ai 免费生图），裁剪底部水印
import * as canvas from '@napi-rs/canvas';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';

mkdirSync('public/avatars', { recursive: true });

const STYLE = 'cute chibi mythical creature, kawaii flat illustration, children picture book style, soft pastel colors, plain light cream background, centered portrait avatar, big sparkly eyes, adorable, clean art, no text, no watermark';
const beasts = [
  { id: 'baize', en: 'white mystical beast with one golden horn, like a holy goat-lion, gentle expression', seed: 101 },
  { id: 'jiuweihu', en: 'orange fox with nine fluffy tails fanned out behind, charming smile', seed: 202 },
  { id: 'qilin', en: 'green qilin dragon-horse with small antlers and scale patterns, kind eyes', seed: 303 },
  { id: 'fenghuang', en: 'red and golden phoenix bird with flowing tail feathers and small crest', seed: 404 },
  { id: 'kunpeng', en: 'giant blue whale-fish with small wings, swimming pose', seed: 505 },
  { id: 'bifang', en: 'red crane-like bird standing on a single leg, tiny flames around, white face', seed: 606 },
  { id: 'taotie', en: 'chubby bronze-green ancient monster with a huge friendly grin and spiral horns', seed: 707 },
  { id: 'xiezhi', en: 'purple goat with a single straight horn and wise half-closed eyes', seed: 808 },
  { id: 'suanni', en: 'golden lion cub with curly smoke-like mane, sitting calmly', seed: 909 },
  { id: 'chongming', en: 'colorful mythical bird with double pupils in each eye, red crest', seed: 1010 },
  { id: 'zhulong', en: 'cute small red chinese dragon with glowing amber eyes', seed: 1111 },
  { id: 'tiangou', en: 'white-faced guardian dog-cat creature with dark ears and red collar', seed: 1212 }
];

for (const b of beasts) {
  const out = `public/avatars/${b.id}.png`;
  if (existsSync(out)) { console.log('跳过(已存在):', b.id); continue; }
  const prompt = encodeURIComponent(`${b.en}, ${STYLE}`);
  const url = `https://image.pollinations.ai/prompt/${prompt}?width=256&height=256&nologo=true&seed=${b.seed}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!res.ok) { console.error('失败:', b.id, res.status); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    // 裁掉底部水印（约底部11%）并重新编码为正方形PNG
    const img = await canvas.loadImage(buf);
    const size = img.width;
    const crop = Math.round(size * 0.885); // 去掉底部水印区
    const c = canvas.createCanvas(size, crop);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fdf6ec';
    ctx.fillRect(0, 0, size, crop);
    ctx.drawImage(img, 0, 0, size, crop, 0, 0, size, crop);
    writeFileSync(out, c.toBuffer('image/png'));
    console.log('✅', b.id, Math.round(buf.length / 1024) + 'KB');
  } catch (e) {
    console.error('✗', b.id, e.message.slice(0, 80));
  }
  await new Promise(r => setTimeout(r, 1500)); // 温和限速
}
console.log('完成');
