import { config } from '../../config';
import { MockAlignProvider } from './mock';
import { WhisperAlignProvider } from './whisper';
import type { AlignProvider } from './types';

let cached: AlignProvider | null = null;

/** 환경설정(ALIGN_PROVIDER)에 따라 선택. 실패 시 mock으로 폴백 */
export function getAlignProvider(): AlignProvider {
  if (cached) return cached;
  try {
    switch (config.alignProvider) {
      case 'whisper':
        cached = new WhisperAlignProvider();
        break;
      default:
        cached = new MockAlignProvider();
    }
  } catch (e) {
    console.warn(
      `[align] '${config.alignProvider}' 초기화 실패 → mock 사용:`,
      e instanceof Error ? e.message : e,
    );
    cached = new MockAlignProvider();
  }
  return cached;
}

export type { AlignProvider } from './types';
