// 朗读引擎统一封装：安卓 APK 用原生 TTS（系统语音引擎，稳定有声），网页用 Web Speech API
export function isNative() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
}

export function speakSupported() {
  // 原生环境始终支持（系统 TTS）；网页环境看 API
  return isNative() || 'speechSynthesis' in window;
}

let pluginPromise = null;
function getPlugin() {
  if (!pluginPromise) pluginPromise = import('@capacitor-community/text-to-speech').then(m => m.TextToSpeech);
  return pluginPromise;
}

/**
 * 原生朗读一行（promise 在该行读完后 resolve）
 * @param {string} text
 * @param {number} rate 0.5~2.0
 */
export async function nativeSpeakLine(text, rate) {
  const tts = await getPlugin();
  await tts.speak({ text, lang: 'zh-CN', rate, pitch: 1.05 });
}

export async function nativeStop() {
  try {
    const tts = await getPlugin();
    await tts.stop();
  } catch (e) { /* noop */ }
}
