import type { ShadowingLanguage, ShadowingSentence } from '../types/shadowing';

/**
 * 페이지 텍스트를 문장 단위로 분할한다.
 *
 * 입력 교재는 대부분 영어 readers이므로 정확한 문장 경계가 중요하다.
 * 1순위: Intl.Segmenter(granularity:'sentence') — ICU 기반으로 영어 약어/소수점,
 *        일·중국어 전각 부호까지 표준 규칙으로 처리한다.
 * 2순위(폴백): 구두점 기반 분할 (Intl.Segmenter 미지원 환경)
 */

const LOCALE: Record<ShadowingLanguage, string> = {
  en: 'en',
  ja: 'ja',
  zh: 'zh',
  ko: 'ko',
};

// 폴백용 종결 부호. 일/중국어는 전각 부호 포함.
const TERMINATORS_CJK = /([。．！？!?…]+|\n+)/;
const TERMINATORS_LATIN = /([.!?…]+|\n+)/;

// lib 타입에 의존하지 않도록 Intl.Segmenter의 최소 형태만 선언한다.
interface SentenceSegmenter {
  segment(input: string): Iterable<{ segment: string }>;
}
type SegmenterCtor = new (
  locale: string,
  options: { granularity: 'sentence' },
) => SentenceSegmenter;

function getSegmenterCtor(): SegmenterCtor | null {
  if (typeof Intl === 'undefined' || !('Segmenter' in Intl)) return null;
  return (Intl as unknown as { Segmenter: SegmenterCtor }).Segmenter;
}

function segmentWithIntl(
  Segmenter: SegmenterCtor,
  text: string,
  language: ShadowingLanguage,
): string[] {
  const seg = new Segmenter(LOCALE[language], { granularity: 'sentence' });
  const out: string[] = [];
  for (const { segment } of seg.segment(text)) {
    // 줄바꿈은 문장 경계로도 취급하여 추가 분할
    for (const line of segment.split(/\n+/)) {
      const s = line.trim();
      if (s) out.push(s);
    }
  }
  return out;
}

function segmentWithPunctuation(text: string, language: ShadowingLanguage): string[] {
  const TERMINATORS = language === 'en' || language === 'ko' ? TERMINATORS_LATIN : TERMINATORS_CJK;
  const parts = text.split(TERMINATORS);
  const sentences: string[] = [];
  let buffer = '';

  for (const part of parts) {
    if (part === undefined || part === '') continue;
    if (TERMINATORS.test(part)) {
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
  return sentences;
}

// 거의 항상 뒤에 이름/단어가 오는 영어 약어(문장 끝일 수 없음).
// a.m./p.m./e.g. 등 모호한 약어는 잘못된 병합을 피하려 제외한다.
const EN_TITLE_ABBR = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'st', 'mt', 'rev', 'sr', 'jr',
  'messrs', 'mmes', 'gen', 'col', 'capt', 'sgt', 'lt', 'hon', 'pres', 'gov',
]);

function endsWithSafeAbbrev(s: string): boolean {
  const t = s.trimEnd();
  // 단일 대문자 이니셜: "J." "A."
  if (/(?:^|\s)[A-Z]\.$/.test(t)) return true;
  const m = t.match(/([A-Za-z]+)\.$/);
  return !!m && EN_TITLE_ABBR.has(m[1].toLowerCase());
}

/** 약어/이니셜로 끝나 잘못 분리된 영어 문장을 다음 조각과 병합 */
function mergeEnglishAbbreviations(sentences: string[]): string[] {
  const out: string[] = [];
  for (const s of sentences) {
    const prev = out[out.length - 1];
    if (prev && endsWithSafeAbbrev(prev)) {
      out[out.length - 1] = `${prev} ${s}`;
    } else {
      out.push(s);
    }
  }
  return out;
}

export function splitIntoSentences(
  rawText: string,
  language: ShadowingLanguage = 'en',
): ShadowingSentence[] {
  const text = rawText.replace(/\r\n?/g, '\n').trim();
  if (!text) return [];

  const Segmenter = getSegmenterCtor();
  let sentences = Segmenter
    ? segmentWithIntl(Segmenter, text, language)
    : segmentWithPunctuation(text, language);

  if (language === 'en') {
    sentences = mergeEnglishAbbreviations(sentences);
  }

  return sentences
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s, i) => ({ id: `s${i + 1}`, text: s }));
}
