import { Router } from 'express';
import { audioCache } from '../lib/cache';
import { hashKey } from '../lib/hash';
import { parseWavDuration } from '../lib/wav';
import { getTtsProvider } from '../providers/tts';
import type { ManifestPage, SentenceInput, ShadowingLanguage, TimedSentence } from '../types';

export const ttsRouter = Router();

/**
 * POST /api/tts
 * body: { language, voice?, rate?, page?, sentences: [{id,text}] }
 * → 문장별 TTS 클립 합성(+캐시) 후 누적 타임스탬프가 담긴 ManifestPage 반환.
 */
ttsRouter.post('/tts', async (req, res) => {
  const {
    language = 'en',
    voice,
    rate = 1,
    page = 1,
    sentences = [],
  } = req.body as {
    language?: ShadowingLanguage;
    voice?: string;
    rate?: number;
    page?: number;
    sentences?: SentenceInput[];
  };

  if (!Array.isArray(sentences) || sentences.length === 0) {
    return res.status(400).json({ error: 'sentences 배열이 필요합니다.' });
  }

  const provider = getTtsProvider();
  const out: TimedSentence[] = [];
  let t = 0;

  try {
    for (const s of sentences) {
      if (!s?.text?.trim()) continue;
      const key = hashKey([provider.name, language, voice ?? '', rate, s.text]);

      let durationSec: number;
      if (audioCache.has(key)) {
        durationSec = parseWavDuration(audioCache.read(key)) ?? 0;
      } else {
        const clip = await provider.synthesize(s.text, { language, voice, rate });
        audioCache.write(key, clip.audio);
        durationSec = clip.durationSec || parseWavDuration(clip.audio) || 0;
      }

      const start = t;
      const end = t + durationSec;
      t = end;
      out.push({
        id: s.id,
        text: s.text,
        start: round(start),
        end: round(end),
        clipUrl: audioCache.urlFor(key),
      });
    }

    const result: ManifestPage = {
      page,
      audio: { mode: 'tts' },
      provider: provider.name,
      sentences: out,
    };
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : 'TTS 합성 실패' });
  }
});

const round = (n: number) => Math.round(n * 1000) / 1000;
