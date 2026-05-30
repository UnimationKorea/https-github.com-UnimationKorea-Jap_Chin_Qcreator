import { useState } from 'react';
import { Layers, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { ShadowingLanguage } from '../../types/shadowing';
import { createProject, type ProjectPage } from '../../utils/shadowingStore';

interface BatchUploadProps {
  language: ShadowingLanguage;
  /** 책(프로젝트) 생성 후 라이브러리 새로고침 트리거 */
  onProjectsCreated: () => void;
}

type ItemStatus = 'pending' | 'processing' | 'done' | 'failed';

interface BatchItem {
  name: string;
  status: ItemStatus;
  pages?: number;
  error?: string;
}

/**
 * 여러 PDF를 한 번에 올려 각 파일을 책(프로젝트)으로 자동 생성한다. (P1 대량생산)
 * 파일별로 순차 처리하며 진행 상태를 표시한다.
 */
export default function BatchUpload({ language, onProjectsCreated }: BatchUploadProps) {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [busy, setBusy] = useState(false);

  const runBatch = async (files: File[]) => {
    const pdfs = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'),
    );
    if (pdfs.length === 0) return;

    setBusy(true);
    setItems(pdfs.map((f) => ({ name: f.name, status: 'pending' })));

    // pdfjs는 무거우므로 배치 시작 시 한 번만 동적 로드
    const { extractPdfText } = await import('../../utils/pdfText');

    let created = 0;
    for (let i = 0; i < pdfs.length; i++) {
      setItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'processing' } : it)),
      );
      try {
        const { pages: raw } = await extractPdfText(pdfs[i]);
        const pages: ProjectPage[] = raw
          .map((t, p) => ({ pageNumber: p + 1, text: t }))
          .filter((p) => p.text.trim().length > 0);

        if (pages.length === 0) {
          setItems((prev) =>
            prev.map((it, idx) =>
              idx === i ? { ...it, status: 'failed', error: '텍스트 없음(스캔본)' } : it,
            ),
          );
          continue;
        }

        createProject({
          name: pdfs[i].name.replace(/\.pdf$/i, ''),
          language,
          pages,
        });
        created++;
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'done', pages: pages.length } : it,
          ),
        );
      } catch {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'failed', error: '처리 실패' } : it,
          ),
        );
      }
    }

    setBusy(false);
    if (created > 0) onProjectsCreated();
  };

  const doneCount = items.filter((i) => i.status === 'done').length;
  const failCount = items.filter((i) => i.status === 'failed').length;

  return (
    <div className="space-y-3 rounded-lg border border-dashed border-gray-300 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <Layers className="h-5 w-5 text-primary-600" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">여러 PDF 일괄 업로드 (대량생산)</p>
          <p className="text-xs text-gray-500">
            선택한 PDF마다 책 1권으로 자동 생성됩니다. 현재 언어:{' '}
            <span className="font-medium">{language.toUpperCase()}</span>
          </p>
        </div>

        <label
          className={
            'inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ' +
            (busy ? 'pointer-events-none opacity-60' : '')
          }
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
          {busy ? '처리 중…' : 'PDF 여러 개 선택'}
          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const fs = Array.from(e.target.files ?? []);
              if (fs.length) runBatch(fs);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {items.length > 0 && (
        <>
          <div className="text-xs text-gray-500">
            완료 {doneCount} · 실패 {failCount} · 전체 {items.length}
          </div>
          <ul className="max-h-48 space-y-1 overflow-auto">
            {items.map((it, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                {it.status === 'done' && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />}
                {it.status === 'failed' && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                {it.status === 'processing' && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary-600" />
                )}
                {it.status === 'pending' && (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-gray-300" />
                )}
                <span className="flex-1 truncate text-gray-700">{it.name}</span>
                <span className="shrink-0 text-xs text-gray-400">
                  {it.status === 'done' && `${it.pages}페이지`}
                  {it.status === 'failed' && it.error}
                  {it.status === 'processing' && '처리 중'}
                  {it.status === 'pending' && '대기'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
