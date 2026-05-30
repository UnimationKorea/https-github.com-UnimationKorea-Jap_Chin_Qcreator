import { useMemo, useState } from 'react';
import { FileText, Wand2, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import ShadowingViewer from '../components/shadowing/ShadowingViewer';
import ProjectPanel from '../components/shadowing/ProjectPanel';
import { splitIntoSentences } from '../utils/sentenceSplitter';
import type { ProjectPage } from '../utils/shadowingStore';
import type { ShadowingLanguage } from '../types/shadowing';

// PDF는 무거우므로(pdfjs) 업로드 시에만 동적 로드한다.
const isLikelyPdf = (file: File) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

/** 한 페이지의 텍스트. pageNumber는 PDF 원본 페이지 번호(텍스트 입력 시 1) */
type PageText = ProjectPage;

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
 * 텍스트/PDF(여러 페이지) → 문장 분할 → 노래방식 하이라이트 재생.
 * 연속 재생 모드에서는 한 페이지가 끝나면 다음 페이지로 자동 진행한다.
 */
export default function ShadowingLabPage() {
  const [language, setLanguage] = useState<ShadowingLanguage>('ko');
  const [text, setText] = useState('');
  const [pages, setPages] = useState<PageText[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [continuous, setContinuous] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  const total = pages.length;
  const page = pages[currentPage];

  // 현재 페이지 텍스트를 문장으로 분할
  const sentences = useMemo(
    () => (page ? splitIntoSentences(page.text, language) : []),
    [page, language],
  );

  // 새 입력(생성/샘플/PDF): 저장 연결을 끊어 새 프로젝트로 다룬다
  const loadPages = (next: PageText[]) => {
    setShouldAutoPlay(false);
    setPages(next);
    setCurrentPage(0);
    setProjectId(null);
  };

  // 저장된 프로젝트/가져온 내용을 에디터에 적용 (projectId는 ProjectPanel이 관리)
  const applyLoaded = ({ language: lng, pages: pgs }: { language: ShadowingLanguage; pages: PageText[] }) => {
    setShouldAutoPlay(false);
    setLanguage(lng);
    setPages(pgs);
    setCurrentPage(0);
    setText(pgs[0]?.text ?? '');
  };

  const handleGenerate = () => {
    setNotice(null);
    loadPages(text.trim() ? [{ pageNumber: 1, text }] : []);
  };

  const handleSample = () => {
    setNotice(null);
    setText(SAMPLE[language]);
    loadPages([{ pageNumber: 1, text: SAMPLE[language] }]);
  };

  const handlePdf = async (file: File) => {
    setNotice(null);
    if (!isLikelyPdf(file)) {
      setNotice('PDF 파일을 선택해 주세요.');
      return;
    }
    setPdfBusy(true);
    try {
      const { extractPdfText } = await import('../utils/pdfText');
      // 전체 페이지 추출 후, 텍스트가 있는 페이지만 보관
      const { pages: raw } = await extractPdfText(file);
      const extracted: PageText[] = raw
        .map((t, i) => ({ pageNumber: i + 1, text: t }))
        .filter((p) => p.text.trim().length > 0);

      if (extracted.length === 0) {
        setNotice('텍스트를 추출하지 못했습니다(스캔본일 수 있음). 텍스트를 직접 붙여넣어 주세요.');
        loadPages([]);
      } else {
        if (extracted.length < raw.length) {
          setNotice(
            `${raw.length}페이지 중 텍스트가 있는 ${extracted.length}페이지를 불러왔습니다. (이미지/스캔 페이지 제외)`,
          );
        }
        setText(extracted[0].text);
        loadPages(extracted);
      }
    } catch {
      setNotice('PDF 처리 중 오류가 발생했습니다. 텍스트를 직접 붙여넣어 주세요.');
    } finally {
      setPdfBusy(false);
    }
  };

  const goToPage = (index: number, autoPlay = false) => {
    if (index < 0 || index >= total) return;
    setShouldAutoPlay(autoPlay);
    setCurrentPage(index);
  };

  // 한 페이지 재생 완료: 연속 모드면 다음 페이지로 자동 진행
  const handlePageComplete = () => {
    if (continuous && currentPage < total - 1) {
      goToPage(currentPage + 1, true);
    } else {
      setShouldAutoPlay(false);
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
          수동 스탬프 없이, 텍스트/PDF(여러 페이지)에서 문장을 자동 분할하고 노래방 자막처럼 따라읽기로 재생합니다.
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
              {pdfBusy ? 'PDF 처리 중…' : 'PDF 업로드 (전체 페이지)'}
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. 프로젝트 저장 · 재사용</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectPanel
            language={language}
            pages={pages}
            projectId={projectId}
            onProjectIdChange={setProjectId}
            onLoad={applyLoaded}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              3. Shadowing 재생{' '}
              {sentences.length > 0 && (
                <span className="text-sm font-normal text-gray-500">({sentences.length}문장)</span>
              )}
            </CardTitle>

            {/* 페이지 네비게이션 */}
            {total > 0 && (
              <div className="flex items-center gap-2">
                <label className="mr-2 inline-flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={continuous}
                    onChange={(e) => setContinuous(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  연속 재생
                </label>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  icon={<ChevronLeft className="h-4 w-4" />}
                >
                  이전
                </Button>

                <select
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  value={currentPage}
                  onChange={(e) => goToPage(Number(e.target.value))}
                >
                  {pages.map((p, i) => (
                    <option key={i} value={i}>
                      {i + 1} / {total}
                      {p.pageNumber !== i + 1 ? ` (원본 p.${p.pageNumber})` : ''}
                    </option>
                  ))}
                </select>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= total - 1}
                  icon={<ChevronRight className="h-4 w-4" />}
                >
                  다음
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ShadowingViewer
            // 페이지가 바뀌면 뷰어를 새로 마운트해 상태를 깔끔히 초기화
            key={`${currentPage}-${language}`}
            sentences={sentences}
            language={language}
            autoPlay={shouldAutoPlay}
            onComplete={handlePageComplete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
