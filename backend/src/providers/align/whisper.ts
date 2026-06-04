import { config } from '../../config';
import type { TimedSentence } from '../../types';
import type { AlignInput, AlignProvider } from './types';

interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

/**
 * OpenAI Whisper 기반 강제정렬.
 * verbose_json + segment 타임스탬프를 받아 우리 문장에 매핑한다.
 *
 * 매핑(스캐폴드): 세그먼트 경계 누적 시간을 문장 텍스트 길이 비례로 분배.
 * → 문장 단위 정밀도면 충분(전략 문서 섹션 2). 단어 정렬은 섹션 7 확장 경로.
 */
export class WhisperAlignProvider implements AlignProvider {
  readonly name = 'whisper';

  constructor() {
    if (!config.openaiKey) {
      throw new Error('OPENAI_API_KEY 가 설정되지 않았습니다.');
    }
  }

  async align(input: AlignInput): Promise<TimedSentence[]> {
    const form = new FormData();
    const blob = new Blob([new Uint8Array(input.audio)], { type: input.mime || 'audio/mpeg' });
    form.append('file', blob, 'audio');
    form.append('model', 'whisper-1');
    form.append('response_format', 'verbose_json');
    form.append('timestamp_granularities[]', 'segment');

    const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.openaiKey}` },
      body: form,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Whisper 정렬 실패 (${res.status}): ${detail.slice(0, 200)}`);
    }

    const data = (await res.json()) as { segments?: WhisperSegment[]; duration?: number };
    const total =
      data.duration ?? (data.segments?.length ? data.segments[data.segments.length - 1].end : 0);

    // 세그먼트 전체 길이를 문장 텍스트 길이 비례로 분배(스캐폴드 매핑)
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
