import type { SentenceInput, ShadowingLanguage, TimedSentence } from '../../types';

export interface AlignInput {
  audio: Buffer;
  mime: string;
  sentences: SentenceInput[];
  language: ShadowingLanguage;
  /** 클라이언트가 아는 경우의 오디오 길이(초). 없으면 프로바이더가 추정 */
  durationSec?: number;
}

export interface AlignProvider {
  readonly name: string;
  /** 기존 녹음 + 문장 목록 → 문장별 start/end (전략 문서 섹션 2: 강제정렬) */
  align(input: AlignInput): Promise<TimedSentence[]>;
}
