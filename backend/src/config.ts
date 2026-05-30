import 'dotenv/config';
import path from 'path';

export const config = {
  port: Number(process.env.PORT ?? 8787),

  ttsProvider: (process.env.TTS_PROVIDER ?? 'mock').toLowerCase(),
  alignProvider: (process.env.ALIGN_PROVIDER ?? 'mock').toLowerCase(),

  azure: {
    key: process.env.AZURE_SPEECH_KEY ?? '',
    region: process.env.AZURE_SPEECH_REGION ?? 'eastus',
  },

  openaiKey: process.env.OPENAI_API_KEY ?? '',

  cacheDir: path.resolve(process.env.CACHE_DIR ?? '.cache'),
};

export type AppConfig = typeof config;
