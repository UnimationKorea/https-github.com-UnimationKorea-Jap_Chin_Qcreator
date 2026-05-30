import { parseWavDuration } from '../../lib/wav';
import { estimateDurationSec } from '../tts/mock';
import type { TimedSentence } from '../../types';
import type { AlignInput, AlignProvider } from './types';

/**
 * 오프라인 mock 정렬: 오디오 전체 길이를 문장 텍스트 길이에 비례 분배.
 * 실제 Whisper 정렬 전, /api/align 응답 형태를 키 없이 검증하는 용도.
 */
export class MockAlignProvider implements AlignProvider {
  readonly name = 'mock';

  async align(input: AlignInput): Promise<TimedSentence[]> {
    const total =
      input.durationSec ??
      parseWavDuration(input.audio) ??
      input.sentences.reduce((sum, s) => sum + estimateDurationSec(s.text), 0);

    const weights = input.sentences.map((s) => Math.max(1, s.text.trim().length));
    const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

    let t = 0;
    return input.sentences.map((s, i) => {
      const dur = (weights[i] / weightSum) * total;
      const start = t;
      const end = t + dur;
      t = end;
      return { id: s.id, text: s.text, start: round(start), end: round(end) };
    });
  }
}

const round = (n: number) => Math.round(n * 1000) / 1000;
