/**
 * Shadowing Manifest 타입 (전략 문서 섹션 3 스키마와 정합).
 * 프론트엔드 src/types/shadowing.ts 와 형태를 맞춘다.
 */
export type ShadowingLanguage = 'en' | 'ja' | 'zh' | 'ko';

export interface SentenceInput {
  id: string;
  text: string;
}

export interface TimedSentence extends SentenceInput {
  /** 페이지 오디오 기준 시작/종료 시간(초) */
  start: number;
  end: number;
  /** TTS 개별 클립 경로(옵션) */
  clipUrl?: string;
}

export interface ManifestPage {
  page: number;
  audio: { mode: 'tts' | 'file'; url?: string };
  provider: string;
  sentences: TimedSentence[];
}
