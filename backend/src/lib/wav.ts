/**
 * WAV(PCM) 유틸. 프로바이더 음성 길이를 헤더에서 바로 계산하므로
 * 문장 단위 start/end 누적에 외부 디코더가 필요 없다(전략 문서 섹션 2).
 */

/** 지정 길이의 무음 WAV(8kHz mono 16-bit) 생성 — mock TTS/검증용 */
export function makeSilentWav(durationSec: number, sampleRate = 8000): Buffer {
  const bytesPerSample = 2;
  const numSamples = Math.max(1, Math.round(durationSec * sampleRate));
  const dataSize = numSamples * bytesPerSample;
  const buf = Buffer.alloc(44 + dataSize);

  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); // fmt chunk size (PCM)
  buf.writeUInt16LE(1, 20); // audioFormat = PCM
  buf.writeUInt16LE(1, 22); // channels = mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * bytesPerSample, 28); // byteRate
  buf.writeUInt16LE(bytesPerSample, 32); // blockAlign
  buf.writeUInt16LE(16, 34); // bitsPerSample
  buf.write('data', 36);
  buf.writeUInt32LE(dataSize, 40);
  // 본문은 0(무음)으로 이미 채워짐
  return buf;
}

/** WAV 버퍼의 재생 길이(초)를 헤더로 계산. WAV가 아니면 null */
export function parseWavDuration(buf: Buffer): number | null {
  if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF') return null;
  const byteRate = buf.readUInt32LE(28);
  if (!byteRate) return null;

  let offset = 12;
  while (offset + 8 <= buf.length) {
    const id = buf.toString('ascii', offset, offset + 4);
    const size = buf.readUInt32LE(offset + 4);
    if (id === 'data') return size / byteRate;
    offset += 8 + size + (size % 2);
  }
  return null;
}
