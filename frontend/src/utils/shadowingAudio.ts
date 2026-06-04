import type { ShadowingPlayerCallbacks } from './shadowingTTS';

/**
 * Web Speech 재생기와 오디오 클립 재생기가 공유하는 최소 인터페이스.
 * 뷰어는 이 인터페이스로만 엔진을 다루므로 두 경로를 동일하게 제어한다.
 */
export interface ShadowingEngine {
  play(fromIndex?: number): void;
  pause(): void;
  stop(): void;
  next(): void;
  prev(): void;
  setRate(rate: number): void;
  setVoice?(voice: SpeechSynthesisVoice | null): void;
}

/**
 * 백엔드가 합성한 문장별 오디오 클립(clipUrl[])을 순차 재생한다.
 * 클립 종료(onended) 시 다음 문장으로 → "재생 중 클립 = 하이라이트 문장".
 * 클라우드 TTS 음질을 그대로 들려주는 경로(전략 문서 §2 TTS 경로).
 */
export class AudioClipPlayer implements ShadowingEngine {
  private clips: string[];
  private rate: number;
  private cb: ShadowingPlayerCallbacks;
  private audio: HTMLAudioElement;
  private index = 0;
  private playing = false;
  private stopped = true;

  constructor(opts: { clips: string[]; rate?: number; callbacks?: ShadowingPlayerCallbacks }) {
    this.clips = opts.clips;
    this.rate = opts.rate ?? 1;
    this.cb = opts.callbacks ?? {};
    this.audio = new Audio();
    this.audio.playbackRate = this.rate;

    this.audio.onended = () => {
      if (this.stopped || !this.playing) return;
      this.index += 1;
      this.playCurrent();
    };
    this.audio.onerror = () => {
      if (this.stopped) return;
      this.playing = false;
      this.cb.onError?.('오디오 클립 재생 오류');
    };
  }

  play(fromIndex?: number) {
    if (typeof fromIndex === 'number') this.index = fromIndex;
    this.stopped = false;
    this.playing = true;
    this.playCurrent();
  }

  private playCurrent() {
    if (this.stopped) return;
    if (this.index >= this.clips.length) {
      this.playing = false;
      this.cb.onEnd?.();
      return;
    }
    this.cb.onSentenceStart?.(this.index);
    this.audio.src = this.clips[this.index];
    this.audio.playbackRate = this.rate;
    this.audio.currentTime = 0;
    void this.audio.play().catch((e: unknown) => {
      this.playing = false;
      this.cb.onError?.(`재생 실패: ${e instanceof Error ? e.message : ''}`);
    });
  }

  pause() {
    this.playing = false;
    this.audio.pause();
  }

  stop() {
    this.stopped = true;
    this.playing = false;
    this.index = 0;
    this.audio.pause();
  }

  next() {
    if (this.index < this.clips.length - 1) this.play(this.index + 1);
  }
  prev() {
    if (this.index > 0) this.play(this.index - 1);
  }
  setRate(rate: number) {
    this.rate = rate;
    this.audio.playbackRate = rate;
  }
}
