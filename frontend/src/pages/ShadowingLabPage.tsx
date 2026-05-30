import { useState } from 'react';
import { FileText, Wand2, Upload } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import ShadowingViewer from '../components/shadowing/ShadowingViewer';
import { splitIntoSentences } from '../utils/sentenceSplitter';
import { extractPdfText, isLikelyPdf, PdfNotAvailableError } from '../utils/pdfText';
import type { ShadowingLanguage, ShadowingSentence } from '../types/shadowing';

const SAMPLE: Record<ShadowingLanguage, string> = {
  ja: '今日はいい天気です。公園へ散歩に行きましょう。猫が木の下で寝ています。',
  zh: '今天天气很好。我们去公园散步吧。猫在树下睡觉。',
  ko: '오늘은 날씨가 좋습니다. 공원에 산책하러 갑시다. 고양이가 나무 아래에서 자고 있습니다.',
};

const LANG_LABEL: Record<ShadowingLanguage, string> = {
  ja: '일본어',
  zh: '중국어',
  ko: '한국어',
};

/**
 * Phase 0 PoC: 페이지별 자동 Shadowing 실험실.
 * 텍스트 입력 또는 PDF 업로드 → 문장 분할 → 노래방식 하이라이트 재생.
 */
export default function ShadowingLabPage() {
  const [language, setLanguage] = useState<ShadowingLanguage>('ja');
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState<ShadowingSentence[]>([]);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleGenerate = () => {
    setNotice(null);
    setSentences(splitIntoSentences(text, language));
  };

  const handleSample = () => {
    setText(SAMPLE[language]);
    setSentences(splitIntoSentences(SAMPLE[language], language));
    setNotice(null);
  };

  const handlePdf = async (file: File) => {
    setNotice(null);
    if (!isLikelyPdf(file)) {
      setNotice('PDF 파일을 선택해 주세요.');
      return;
    }
    setPdfBusy(true);
    try {
      // PoC: 1페이지만 추출 (1권·1페이지 범위)
      const { pages } = await extractPdfText(file, 1);
      const pageText = pages[0] ?? '';
      if (!pageText.trim()) {
        setNotice(
          '텍스트를 추출하지 못했습니다(스캔본일 수 있음). 텍스트를 직접 붙여넣어 주세요.',
        );
      } else {
        setText(pageText);
        setSentences(splitIntoSentences(pageText, language));
      }
    } catch (e) {
      if (e instanceof PdfNotAvailableError) {
        setNotice(e.message);
      } else {
        setNotice('PDF 처리 중 오류가 발생했습니다. 텍스트를 직접 붙여넣어 주세요.');
      }
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2">
          <Badge variant="primary">PoC</Badge>
          <span className="text-sm text-gray-500">ebook_upgrade0529 · Phase 0</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">페이지별 자동 Shadowing 실험실</h1>
        <p className="text-gray-600">
          수동 스탬프 없이, 텍스트/PDF에서 문장을 자동 분할하고 노래방 자막처럼 따라읽기로 재생합니다.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. 입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 언어 선택 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">언어</span>
            {(['ja', 'zh', 'ko'] as ShadowingLanguage[]).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                className={
                  'rounded-full px-3 py-1 text-sm transition-colors ' +
                  (language === lng
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                }
              >
                {LANG_LABEL[lng]}
              </button>
            ))}
          </div>

          {/* 텍스트 입력 */}
          <textarea
            className="h-36 w-full resize-y rounded-lg border border-gray-300 p-3 text-base focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="페이지 텍스트를 붙여넣거나, 아래에서 PDF를 업로드하세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleGenerate} icon={<Wand2 className="h-4 w-4" />}>
              문장 분할 → 생성
            </Button>
            <Button variant="secondary" onClick={handleSample} icon={<FileText className="h-4 w-4" />}>
              샘플 불러오기
            </Button>

            <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <Upload className="h-4 w-4" />
              {pdfBusy ? 'PDF 처리 중…' : 'PDF 업로드 (1페이지)'}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={pdfBusy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePdf(f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {notice && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              {notice}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            2. Shadowing 재생{' '}
            {sentences.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({sentences.length}문장)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShadowingViewer sentences={sentences} language={language} />
        </CardContent>
      </Card>
    </div>
  );
}
