import fs from 'fs';
import path from 'path';
import { config } from '../config';

/** 합성된 오디오 클립을 콘텐츠 해시로 파일 캐싱하고 정적 URL로 노출 */
class AudioCache {
  private dir: string;

  constructor(baseDir: string) {
    this.dir = path.join(baseDir, 'audio');
    fs.mkdirSync(this.dir, { recursive: true });
  }

  private pathFor(key: string): string {
    return path.join(this.dir, `${key}.wav`);
  }

  has(key: string): boolean {
    return fs.existsSync(this.pathFor(key));
  }

  read(key: string): Buffer {
    return fs.readFileSync(this.pathFor(key));
  }

  write(key: string, data: Buffer): void {
    fs.writeFileSync(this.pathFor(key), data);
  }

  /** 정적 서빙 경로(server.ts의 express.static과 정합) */
  urlFor(key: string): string {
    return `/api/audio/${key}.wav`;
  }

  get directory(): string {
    return this.dir;
  }
}

export const audioCache = new AudioCache(config.cacheDir);
