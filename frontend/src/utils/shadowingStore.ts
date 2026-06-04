import type { ShadowingLanguage, ShadowingManifest } from '../types/shadowing';
import { splitIntoSentences } from './sentenceSplitter';

/**
 * Shadowing 프로젝트 저장소 (localStorage 기반, PoC).
 *
 * 전략 문서(섹션 3)의 "스탬프를 대체하는 단일 산출물" 개념을 구현한다.
 * - 작업 상태(프로젝트)는 원본 페이지 텍스트로 가볍게 보관 → 새로고침/재방문 시 복원
 * - 내보내기: 라운드트립용 프로젝트(.json) + 상호운용용 Manifest(.json)
 */

export interface ProjectPage {
  pageNumber: number;
  text: string;
}

export interface ShadowingProject {
  id: string;
  name: string;
  language: ShadowingLanguage;
  pages: ProjectPage[];
  createdAt: string;
  updatedAt: string;
}

/** 내보내기 파일 포맷(라운드트립). type/version으로 가져오기 시 식별한다. */
export interface ProjectExport {
  type: 'shadowing-project';
  version: 1;
  project: ShadowingProject;
}

const STORAGE_KEY = 'shadowing.projects.v1';

function readAll(): ShadowingProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ShadowingProject[]) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: ShadowingProject[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 최근 수정순 정렬된 프로젝트 목록 */
export function listProjects(): ShadowingProject[] {
  return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProject(id: string): ShadowingProject | undefined {
  return readAll().find((p) => p.id === id);
}

/** 새 프로젝트 저장. 반환된 프로젝트의 id로 이후 갱신한다. */
export function createProject(input: {
  name: string;
  language: ShadowingLanguage;
  pages: ProjectPage[];
}): ShadowingProject {
  const now = new Date().toISOString();
  const project: ShadowingProject = {
    id: uuid(),
    name: input.name.trim() || '제목 없음',
    language: input.language,
    pages: input.pages,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([project, ...readAll()]);
  return project;
}

/** 기존 프로젝트 갱신(부분 필드). 없으면 undefined */
export function updateProject(
  id: string,
  patch: Partial<Pick<ShadowingProject, 'name' | 'language' | 'pages'>>,
): ShadowingProject | undefined {
  const all = readAll();
  const idx = all.findIndex((p) => p.id === id);
  if (idx === -1) return undefined;
  const updated: ShadowingProject = {
    ...all[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  all[idx] = updated;
  writeAll(all);
  return updated;
}

export function deleteProject(id: string): void {
  writeAll(readAll().filter((p) => p.id !== id));
}

// ---- 내보내기 / 가져오기 -------------------------------------------------

/** 라운드트립용 프로젝트 JSON */
export function toProjectExport(project: ShadowingProject): ProjectExport {
  return { type: 'shadowing-project', version: 1, project };
}

/** 전략 문서(섹션 3) 스키마의 Shadowing Manifest로 변환(상호운용용) */
export function toManifest(project: ShadowingProject): ShadowingManifest {
  return {
    bookId: project.id,
    language: project.language,
    pages: project.pages.map((p) => ({
      page: p.pageNumber,
      audio: { mode: 'tts' },
      sentences: splitIntoSentences(p.text, project.language),
    })),
  };
}

/** 파일 텍스트를 파싱해 프로젝트로 복원. 프로젝트/Manifest 두 포맷 모두 허용 */
export function parseImport(jsonText: string): {
  name: string;
  language: ShadowingLanguage;
  pages: ProjectPage[];
} {
  const data = JSON.parse(jsonText);

  // 1) 우리 프로젝트 포맷
  if (data?.type === 'shadowing-project' && data?.project) {
    const p = data.project as ShadowingProject;
    return { name: p.name, language: p.language, pages: p.pages };
  }

  // 2) Shadowing Manifest 포맷
  if (Array.isArray(data?.pages) && data?.language) {
    const m = data as ShadowingManifest;
    const pages: ProjectPage[] = m.pages.map((pg, i) => ({
      pageNumber: pg.page ?? i + 1,
      text: (pg.sentences ?? []).map((s) => s.text).join(' '),
    }));
    return { name: `가져온 프로젝트 ${m.bookId ?? ''}`.trim(), language: m.language, pages };
  }

  throw new Error('알 수 없는 파일 형식입니다. shadowing 프로젝트 또는 Manifest JSON을 선택하세요.');
}

/** 브라우저에서 JSON 파일 다운로드 */
export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
