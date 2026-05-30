/**
 * Shadowing 백엔드 클라이언트 (선택적).
 *
 * 백엔드(backend/)가 켜져 있으면 클라우드 TTS/Whisper 경로를 사용하고,
 * 꺼져 있으면 호출부에서 기존 Web Speech API로 폴백한다.
 * Vite dev proxy가 `/api` → 백엔드로 전달한다(vite.config.ts).
 */
import axios from 'axios';
import type { ShadowingLanguage, ShadowingSentence } from '../types/shadowing';

export interface TimedSentence extends ShadowingSentence {
  start: number;
  end: number;
  clipUrl?: string;
}

export interface ManifestPage {
  page: number;
  audio: { mode: 'tts' | 'file'; url?: string };
  provider: string;
  sentences: TimedSentence[];
}

const api = axios.create({ baseURL: '/api' });

/** 백엔드 가동 여부 + 활성 프로바이더 확인 */
export async function getBackendHealth(): Promise<{
  ok: boolean;
  ttsProvider: string;
  alignProvider: string;
} | null> {
  try {
    const { data } = await axios.get('/health', { timeout: 1500 });
    return data;
  } catch {
    return null;
  }
}

/** 문장 배열을 서버 TTS로 합성하고 타임스탬프가 담긴 ManifestPage를 받는다 */
export async function synthesizePage(input: {
  language: ShadowingLanguage;
  sentences: ShadowingSentence[];
  page?: number;
  voice?: string;
  rate?: number;
}): Promise<ManifestPage> {
  const { data } = await api.post<ManifestPage>('/tts', input);
  return data;
}

/** 기존 녹음 + 문장 → 강제정렬된 ManifestPage */
export async function alignRecording(input: {
  audio: File;
  language: ShadowingLanguage;
  sentences: ShadowingSentence[];
  page?: number;
  durationSec?: number;
}): Promise<ManifestPage> {
  const form = new FormData();
  form.append('audio', input.audio);
  form.append('language', input.language);
  form.append('sentences', JSON.stringify(input.sentences));
  if (input.page != null) form.append('page', String(input.page));
  if (input.durationSec != null) form.append('durationSec', String(input.durationSec));
  const { data } = await api.post<ManifestPage>('/align', form);
  return data;
}
