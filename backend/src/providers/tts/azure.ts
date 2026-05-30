import { config } from '../../config';
import { parseWavDuration } from '../../lib/wav';
import type { ShadowingLanguage } from '../../types';
import type { TtsClip, TtsOptions, TtsProvider } from './types';

/** 언어별 기본 음성(필요 시 voice 옵션으로 덮어씀) */
const DEFAULT_VOICE: Record<ShadowingLanguage, string> = {
  en: 'en-US-JennyNeural',
  ja: 'ja-JP-NanamiNeural',
  zh: 'zh-CN-XiaoxiaoNeural',
  ko: 'ko-KR-SunHiNeural',
};

const LOCALE: Record<ShadowingLanguage, string> = {
  en: 'en-US',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ko: 'ko-KR',
};

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string),
  );
}

/**
 * Azure Speech REST 기반 TTS. WAV(riff-8khz-16bit-mono-pcm)로 받아
 * 길이를 헤더에서 계산 → 문장 단위 타임스탬프에 사용.
 *
 * 참고: 단어 단위 타임스탬프(WordBoundary)는 Speech SDK/웹소켓 경로가 필요하다.
 * 문장 단위 PoC에는 클립 길이만으로 충분하다(전략 문서 섹션 2·7).
 */
export class AzureTtsProvider implements TtsProvider {
  readonly name = 'azure';

  constructor() {
    if (!config.azure.key) {
      throw new Error('AZURE_SPEECH_KEY 가 설정되지 않았습니다.');
    }
  }

  async synthesize(text: string, opts: TtsOptions): Promise<TtsClip> {
    const locale = LOCALE[opts.language];
    const voice = opts.voice || DEFAULT_VOICE[opts.language];
    const rate = opts.rate ?? 1;
    const ratePct = `${Math.round((rate - 1) * 100)}%`;

    const ssml =
      `<speak version="1.0" xml:lang="${locale}">` +
      `<voice name="${voice}"><prosody rate="${ratePct}">${escapeXml(text)}</prosody></voice>` +
      `</speak>`;

    const endpoint = `https://${config.azure.region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.azure.key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'riff-8khz-16bit-mono-pcm',
        'User-Agent': 'shadowing-backend',
      },
      body: ssml,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Azure TTS 실패 (${res.status}): ${detail.slice(0, 200)}`);
    }

    const audio = Buffer.from(await res.arrayBuffer());
    const durationSec = parseWavDuration(audio) ?? 0;
    return { audio, mime: 'audio/wav', durationSec };
  }
}
