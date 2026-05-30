import type { ShadowingLanguage } from '../../types';

export interface TtsOptions {
  language: ShadowingLanguage;
  voice?: string;
  rate?: number; // 1 = 기본 속도
}

export interface TtsClip {
  audio: Buffer; // WAV(PCM) 권장 — 길이를 헤더로 계산
  mime: string;
  durationSec: number;
}

export interface TtsProvider {
  readonly name: string;
  synthesize(text: string, opts: TtsOptions): Promise<TtsClip>;
}
