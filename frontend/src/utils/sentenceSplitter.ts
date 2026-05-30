import type { ShadowingLanguage, ShadowingSentence } from '../types/shadowing';

/**
 * 페이지 텍스트를 문장 단위로 분할한다.
 *
 * 전략 문서(섹션 2)대로 PoC는 "구두점 기반 분할"을 사용한다.
 * - 일본어/중국어: 。．！？ 등 전각 구두점
 * - 공통: . ! ? 와 줄바꿈
 * 일본어 형태소(kuromoji) 정밀 분절은 Phase 1에서 도입한다.
 */

// 문장 종결 부호(전각/반각). 줄바꿈도 경계로 취급.
// 일/중국어는 전각 부호(。．！？)와 반각을 모두, 한국어는 반각 위주로 처리한다.
const TERMINATORS_CJK = /([。．！？!?…]+|\n+)/;
const TERMINATORS_KO = /([.!?…]+|\n+)/;

export function splitIntoSentences(
  rawText: string,
  language: ShadowingLanguage = 'ja',
): ShadowingSentence[] {
  const TERMINATORS = language === 'ko' ? TERMINATORS_KO : TERMINATORS_CJK;
  const text = rawText.replace(/\r\n?/g, '\n').trim();
  if (!text) return [];

  // 종결 부호를 유지하면서 분할
  const parts = text.split(TERMINATORS);
  const sentences: string[] = [];
  let buffer = '';

  for (const part of parts) {
    if (part === undefined || part === '') continue;
    if (TERMINATORS.test(part)) {
      // 부호/줄바꿈: 줄바꿈은 버리고, 구두점은 앞 문장에 붙인다
      if (/^\n+$/.test(part)) {
        if (buffer.trim()) {
          sentences.push(buffer.trim());
          buffer = '';
        }
      } else {
        buffer += part;
        sentences.push(buffer.trim());
        buffer = '';
      }
    } else {
      buffer += part;
    }
  }
  if (buffer.trim()) sentences.push(buffer.trim());

  // 너무 짧은(빈) 조각 제거 후 ShadowingSentence로 변환
  return sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s, i) => ({
      id: `s${i + 1}`,
      text: s,
    }));
}
