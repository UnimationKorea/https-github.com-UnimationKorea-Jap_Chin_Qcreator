// Shadowing(노래방 자막식 따라읽기) 관련 타입
// 개발전략 문서(EBOOK_SHADOWING_STRATEGY.md) 섹션 3의 Shadowing Manifest 스키마 구현

export type ShadowingLanguage = 'ja' | 'zh' | 'ko';

/** 오디오 확보 방식: tts(합성) | file(기존 녹음) */
export type AudioMode = 'tts' | 'file';

/** 문장 단위 싱크 데이터. start/end는 페이지 오디오 기준 초 단위(없으면 순차 재생) */
export interface ShadowingSentence {
  id: string;
  text: string;
  reading?: string; // 후리가나/병음 등 (옵션)
  start?: number; // 페이지 오디오 내 시작(초)
  end?: number; // 페이지 오디오 내 종료(초)
  clipUrl?: string; // 문장별 개별 TTS 클립(옵션)
}

export interface ShadowingPageAudio {
  mode: AudioMode;
  url?: string; // 페이지 통합 오디오(기존 녹음 경로)
}

export interface ShadowingPage {
  page: number;
  audio: ShadowingPageAudio;
  sentences: ShadowingSentence[];
}

/** 스탬프를 대체하는 단일 산출물 */
export interface ShadowingManifest {
  bookId: string;
  language: ShadowingLanguage;
  pages: ShadowingPage[];
}
