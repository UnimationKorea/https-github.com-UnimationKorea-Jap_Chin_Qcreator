import type { ShadowingLanguage, ShadowingSentence } from '../types/shadowing';

/**
 * Web Speech API 기반 문장 단위 TTS 재생기.
 *
 * 전략 문서(섹션 2)의 핵심: "문장 단위"이므로 문장마다 발화하고
 * 발화 종료(onend) 시 다음 문장으로 넘어가면 노래방식 하이라이트가 된다.
 * → 수동 스탬프/강제정렬 없이 동작. (PoC, 무백엔드)
 *
 * Phase 1에서 Web Speech API를 클라우드 TTS(오디오+타임스탬프)로 교체 가능하도록
 * 콜백 인터페이스(onSentenceStart/onEnd)를 안정적으로 유지한다.
 */

export interface ShadowingPlayerCallbacks {
  onSentenceStart?: (index: number) => void;
  /** 단어 발화 시작 시점(노래방 단어 하이라이트). charIndex/charLength는 문장 텍스트 기준 */
  onWordBoundary?: (sentenceIndex: number, charIndex: number, charLength: number) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
  /** 온라인 음성 실패로 기본(로컬) 음성으로 자동 전환됨을 알림 */
  onVoiceFallback?: () => void;
}

const BCP47: Record<ShadowingLanguage, string> = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
};

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** 사용 가능한 음성 목록을 (비동기 로딩 포함) 가져온다 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSupported()) return resolve([]);
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) return resolve(existing);
    // 일부 브라우저는 비동기로 voices를 로드
    const handler = () => {
      resolve(window.speechSynthesis.getVoices());
      window.speechSynthesis.removeEventListener('voiceschanged', handler);
    };
    window.speechSynthesis.addEventListener('voiceschanged', handler);
    // 안전장치: 1초 후 강제 resolve
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

export class ShadowingPlayer {
  private sentences: ShadowingSentence[];
  private lang: ShadowingLanguage;
  private rate: number;
  private voice: SpeechSynthesisVoice | null;
  private callbacks: ShadowingPlayerCallbacks;

  private index = 0;
  private playing = false;
  private stopped = true;

  constructor(opts: {
    sentences: ShadowingSentence[];
    lang: ShadowingLanguage;
    rate?: number;
    voice?: SpeechSynthesisVoice | null;
    callbacks?: ShadowingPlayerCallbacks;
  }) {
    this.sentences = opts.sentences;
    this.lang = opts.lang;
    this.rate = opts.rate ?? 1;
    this.voice = opts.voice ?? null;
    this.callbacks = opts.callbacks ?? {};
  }

  get currentIndex() {
    return this.index;
  }
  get isPlaying() {
    return this.playing;
  }

  setRate(rate: number) {
    this.rate = rate;
  }
  setVoice(voice: SpeechSynthesisVoice | null) {
    this.voice = voice;
  }

  /** index부터 순차 재생 시작 */
  play(fromIndex?: number) {
    if (!isSpeechSupported()) {
      this.callbacks.onError?.('이 브라우저는 음성 합성(Web Speech API)을 지원하지 않습니다.');
      return;
    }
    if (typeof fromIndex === 'number') this.index = fromIndex;
    this.stopped = false;
    this.playing = true;
    window.speechSynthesis.cancel();
    this.speakCurrent();
  }

  pause() {
    if (!isSpeechSupported()) return;
    this.playing = false;
    window.speechSynthesis.cancel();
  }

  stop() {
    if (!isSpeechSupported()) return;
    this.stopped = true;
    this.playing = false;
    this.index = 0;
    window.speechSynthesis.cancel();
  }

  next() {
    if (this.index < this.sentences.length - 1) {
      this.play(this.index + 1);
    }
  }
  prev() {
    if (this.index > 0) {
      this.play(this.index - 1);
    }
  }

  private speakCurrent(isRetry = false) {
    if (this.stopped) return;
    if (this.index >= this.sentences.length) {
      this.playing = false;
      this.callbacks.onEnd?.();
      return;
    }
    const sentence = this.sentences[this.index];
    this.callbacks.onSentenceStart?.(this.index);

    const utter = new SpeechSynthesisUtterance(sentence.text);
    utter.lang = BCP47[this.lang];
    utter.rate = this.rate;
    if (this.voice) utter.voice = this.voice;

    // 단어 경계 이벤트 → 단어 단위 하이라이트 (지원 브라우저: Chrome/Edge 등)
    const sentenceIndex = this.index;
    utter.onboundary = (e) => {
      if (this.stopped || !this.playing) return;
      if (e.name && e.name !== 'word') return;
      this.callbacks.onWordBoundary?.(sentenceIndex, e.charIndex, e.charLength ?? 0);
    };

    utter.onend = () => {
      if (this.stopped || !this.playing) return;
      this.index += 1;
      this.speakCurrent();
    };
    utter.onerror = (e) => {
      // 'canceled'/'interrupted'는 사용자 조작이므로 무시
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      // 온라인('Natural') 음성 등이 실패하면 기본(로컬) 음성으로 1회 자동 폴백 후 재시도
      const recoverable = e.error === 'synthesis-failed' || e.error === 'network' || e.error === 'audio-busy';
      if (!isRetry && recoverable && this.voice) {
        this.voice = null;
        this.callbacks.onVoiceFallback?.();
        window.speechSynthesis.cancel();
        setTimeout(() => {
          if (!this.stopped && this.playing) this.speakCurrent(true);
        }, 120);
        return;
      }
      this.playing = false;
      this.callbacks.onError?.(`음성 합성 오류: ${e.error}`);
    };

    window.speechSynthesis.speak(utter);
  }
}
