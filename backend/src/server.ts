import express from 'express';
import cors from 'cors';
import { config } from './config';
import { audioCache } from './lib/cache';
import { ttsRouter } from './routes/tts';
import { alignRouter } from './routes/align';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// 합성된 오디오 클립 정적 서빙 (cache.urlFor 와 정합: /api/audio/<key>.wav)
app.use('/api/audio', express.static(audioCache.directory, { maxAge: '1d', immutable: true }));

// 상태 확인 — 어떤 프로바이더로 동작 중인지 노출
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    ttsProvider: config.ttsProvider,
    alignProvider: config.alignProvider,
  });
});

app.use('/api', ttsRouter);
app.use('/api', alignRouter);

app.listen(config.port, () => {
  console.log(`[shadowing-backend] http://localhost:${config.port}`);
  console.log(`  TTS provider:   ${config.ttsProvider}`);
  console.log(`  Align provider: ${config.alignProvider}`);
  console.log(`  Cache dir:      ${config.cacheDir}`);
});
