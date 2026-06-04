import { Router } from 'express';
import multer from 'multer';
import { getAlignProvider } from '../providers/align';
import type { ManifestPage, SentenceInput, ShadowingLanguage } from '../types';

export const alignRouter = Router();

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

/**
 * POST /api/align  (multipart/form-data)
 * fields: audio(file), language, sentences(JSON 문자열 [{id,text}]), durationSec?
 * → 기존 녹음을 강제정렬해 문장별 start/end가 담긴 ManifestPage(mode:file) 반환.
 */
alignRouter.post('/align', upload.single('audio'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'audio 파일이 필요합니다.' });

  let sentences: SentenceInput[];
  try {
    sentences = JSON.parse(req.body.sentences ?? '[]');
  } catch {
    return res.status(400).json({ error: 'sentences 는 JSON 배열 문자열이어야 합니다.' });
  }
  if (!Array.isArray(sentences) || sentences.length === 0) {
    return res.status(400).json({ error: 'sentences 배열이 필요합니다.' });
  }

  const language = (req.body.language ?? 'en') as ShadowingLanguage;
  const durationSec = req.body.durationSec ? Number(req.body.durationSec) : undefined;

  const provider = getAlignProvider();
  try {
    const timed = await provider.align({
      audio: file.buffer,
      mime: file.mimetype,
      sentences,
      language,
      durationSec,
    });

    const result: ManifestPage = {
      page: req.body.page ? Number(req.body.page) : 1,
      audio: { mode: 'file' },
      provider: provider.name,
      sentences: timed,
    };
    res.json(result);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : '정렬 실패' });
  }
});
