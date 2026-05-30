import { makeSilentWav } from '../../lib/wav';
import type { TtsClip, TtsOptions, TtsProvider } from './types';

/**
 * 오프라인 mock TTS: API 키 없이 동작.
 * 텍스트 길이로 발화 길이를 추정해 무음 WAV를 생성한다.
 * → 키 없이도 /api/tts의 응답 형태(타임스탬프 누적)를 그대로 검증할 수 있다.
 */
export function estimateDurationSec(text: string, rate = 1): number {
  const t = text.trim();
  const hasCJK = /[぀-ヿ㐀-鿿]/.test(t);
  const words = (t.match(/\S+/g) ?? []).length || 1;
  // 라틴: ~2.6 단어/초, CJK: ~5 글자/초
  const base = hasCJK ? t.length / 5 : words / 2.6;
  return Math.max(0.6, base / (rate || 1));
}

export class MockTtsProvider implements TtsProvider {
  readonly name = 'mock';

  async synthesize(text: string, opts: TtsOptions): Promise<TtsClip> {
    const durationSec = estimateDurationSec(text, opts.rate);
    return { audio: makeSilentWav(durationSec), mime: 'audio/wav', durationSec };
  }
}
