/**
 * PDF 페이지별 텍스트 추출 (pdfjs-dist).
 *
 * 전략 문서(섹션 4)대로 pdfjs-dist로 PDF 텍스트레이어를 추출한다.
 * Vite가 워커를 번들링하도록 `?url` import를 사용한다.
 * 텍스트레이어가 없는 스캔본은 빈 문자열이 반환되며, 호출부에서 OCR 안내로 분기한다.
 */
import * as pdfjsLib from 'pdfjs-dist';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
// Vite의 ?url 접미사는 모듈이 아니라 번들된 워커의 URL 문자열을 반환한다
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface PdfExtractResult {
  pages: string[]; // 페이지별 텍스트
  numPages: number;
}

export function isLikelyPdf(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/** PDF 파일에서 페이지별 텍스트를 추출한다. (특정 페이지만 원하면 onlyPage 지정) */
export async function extractPdfText(
  file: File,
  onlyPage?: number,
): Promise<PdfExtractResult> {
  const data = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data }).promise;

  const pages: string[] = [];
  const start = onlyPage ?? 1;
  const end = onlyPage ?? doc.numPages;

  for (let p = start; p <= Math.min(end, doc.numPages); p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((it) => ('str' in it ? (it as TextItem).str : ''))
      .join(' ')
      .replace(/\s+\n/g, '\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    pages.push(text);
  }

  return { pages, numPages: doc.numPages };
}
