/**
 * PDF 페이지별 텍스트 추출 (선택 기능).
 *
 * 전략 문서(섹션 4)대로 pdfjs-dist를 사용하되, PoC에서는 "선택적 의존성"으로 둔다.
 * - 설치되어 있으면: PDF 업로드 → 페이지별 텍스트 추출
 * - 미설치(또는 스캔본)면: 사용자에게 텍스트 직접 입력을 안내
 *
 * pdfjs-dist가 없을 때도 앱 빌드가 깨지지 않도록, 정적 import 대신
 * 런타임 동적 import(계산된 specifier)로 로드한다.
 */

export interface PdfExtractResult {
  pages: string[]; // 페이지별 텍스트
}

export class PdfNotAvailableError extends Error {
  constructor() {
    super(
      'PDF 추출 모듈(pdfjs-dist)이 설치되어 있지 않습니다. ' +
        '`npm i pdfjs-dist` 후 사용하거나, 텍스트를 직접 붙여넣어 주세요.',
    );
    this.name = 'PdfNotAvailableError';
  }
}

// TS의 정적 모듈 해석을 피하기 위해 specifier를 런타임에 구성한다.
const PDFJS_SPECIFIER = 'pdfjs' + '-dist';

// 선택적·동적 import 모듈이라 타입 정의가 없어 any를 허용한다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadPdfjs(): Promise<any> {
  try {
    const mod = await import(/* @vite-ignore */ PDFJS_SPECIFIER);
    const pdfjs = mod.default ?? mod;
    if (pdfjs?.GlobalWorkerOptions && pdfjs?.version) {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
    }
    return pdfjs;
  } catch {
    throw new PdfNotAvailableError();
  }
}

export function isLikelyPdf(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/** PDF 파일에서 페이지별 텍스트를 추출한다. (특정 페이지만 원하면 onlyPage 지정) */
export async function extractPdfText(
  file: File,
  onlyPage?: number,
): Promise<PdfExtractResult> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;

  const pages: string[] = [];
  const start = onlyPage ?? 1;
  const end = onlyPage ?? doc.numPages;

  for (let p = start; p <= end; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((it: any) => ('str' in it ? it.str : ''))
      .join(' ')
      .replace(/\s+\n/g, '\n')
      .trim();
    pages.push(text);
  }

  return { pages };
}
