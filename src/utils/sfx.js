// 简单的 WebAudio 音效（无需外部音频文件）
let ctx = null;
function ac() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(vol, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur);
  o.connect(g); g.connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  tap() { tone(660, 0, 0.08, 'triangle', 0.1); },
  start() { tone(523, 0, 0.12, 'triangle'); tone(784, 0.1, 0.15, 'triangle'); },
  pass() { [523, 659, 784].forEach((f, i) => tone(f, i * 0.09, 0.22, 'triangle')); },
  fail() { tone(392, 0, 0.2, 'sine'); tone(330, 0.15, 0.3, 'sine'); },
  fanfare() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.2));
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.5 + i * 0.09, 0.35, 'sine', 0.15));
  },
  tick() { tone(880, 0, 0.04, 'square', 0.05); }
};
