import { config } from '../../config';
import { MockTtsProvider } from './mock';
import { AzureTtsProvider } from './azure';
import type { TtsProvider } from './types';

let cached: TtsProvider | null = null;

/** 환경설정(TTS_PROVIDER)에 따라 프로바이더를 선택. 실패 시 mock으로 폴백 */
export function getTtsProvider(): TtsProvider {
  if (cached) return cached;
  try {
    switch (config.ttsProvider) {
      case 'azure':
        cached = new AzureTtsProvider();
        break;
      default:
        cached = new MockTtsProvider();
    }
  } catch (e) {
    console.warn(
      `[tts] '${config.ttsProvider}' 초기화 실패 → mock 사용:`,
      e instanceof Error ? e.message : e,
    );
    cached = new MockTtsProvider();
  }
  return cached;
}

export type { TtsProvider } from './types';
