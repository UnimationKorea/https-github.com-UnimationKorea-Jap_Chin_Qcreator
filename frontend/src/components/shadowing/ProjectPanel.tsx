import { useEffect, useState } from 'react';
import { Save, FolderOpen, Trash2, Download, Upload, Pencil } from 'lucide-react';
import { Button } from '../ui';
import type { ShadowingLanguage } from '../../types/shadowing';
import {
  type ProjectPage,
  type ShadowingProject,
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  toProjectExport,
  toManifest,
  parseImport,
  downloadJson,
} from '../../utils/shadowingStore';

interface ProjectPanelProps {
  language: ShadowingLanguage;
  pages: ProjectPage[];
  projectId: string | null;
  onProjectIdChange: (id: string | null) => void;
  /** 프로젝트/가져오기 내용을 에디터에 적용 */
  onLoad: (data: { language: ShadowingLanguage; pages: ProjectPage[] }) => void;
}

const safeName = (s: string) => s.replace(/[^\w가-힣\-\s.]/g, '_').trim() || 'shadowing';

export default function ProjectPanel({
  language,
  pages,
  projectId,
  onProjectIdChange,
  onLoad,
}: ProjectPanelProps) {
  const [projects, setProjects] = useState<ShadowingProject[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = () => setProjects(listProjects());
  useEffect(refresh, []);

  const canSave = pages.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (projectId && getProject(projectId)) {
      updateProject(projectId, { name, language, pages });
      setMsg('저장했습니다(덮어쓰기).');
    } else {
      const p = createProject({ name, language, pages });
      onProjectIdChange(p.id);
      setMsg('새 프로젝트로 저장했습니다.');
    }
    refresh();
  };

  const handleSaveAsNew = () => {
    if (!canSave) return;
    const p = createProject({ name, language, pages });
    onProjectIdChange(p.id);
    setMsg('다른 이름으로 저장했습니다.');
    refresh();
  };

  const handleOpen = (p: ShadowingProject) => {
    setName(p.name);
    onProjectIdChange(p.id);
    onLoad({ language: p.language, pages: p.pages });
    setMsg(`'${p.name}'을(를) 불러왔습니다.`);
  };

  const handleRename = (p: ShadowingProject) => {
    const next = window.prompt('새 이름', p.name);
    if (next == null) return;
    updateProject(p.id, { name: next.trim() || p.name });
    if (p.id === projectId) setName(next.trim() || p.name);
    refresh();
  };

  const handleDelete = (p: ShadowingProject) => {
    if (!window.confirm(`'${p.name}'을(를) 삭제할까요?`)) return;
    deleteProject(p.id);
    if (p.id === projectId) onProjectIdChange(null);
    refresh();
  };

  const handleImport = async (file: File) => {
    try {
      const txt = await file.text();
      const parsed = parseImport(txt);
      setName(parsed.name);
      onProjectIdChange(null); // 가져온 직후엔 미저장 상태
      onLoad({ language: parsed.language, pages: parsed.pages });
      setMsg(`가져왔습니다: ${parsed.pages.length}페이지. 저장하려면 '저장'을 누르세요.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : '가져오기에 실패했습니다.');
    }
  };

  return (
    <div className="space-y-4">
      {/* 저장 영역 */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="프로젝트 이름"
          className="min-w-[200px] flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <Button size="sm" onClick={handleSave} disabled={!canSave} icon={<Save className="h-4 w-4" />}>
          {projectId ? '저장(덮어쓰기)' : '저장'}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleSaveAsNew}
          disabled={!canSave}
        >
          다른 이름으로
        </Button>

        <label className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Upload className="h-4 w-4" />
          가져오기(JSON)
          <input
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      {msg && <p className="text-sm text-primary-700">{msg}</p>}

      {/* 저장된 프로젝트 목록 */}
      {projects.length === 0 ? (
        <p className="text-sm text-gray-400">저장된 프로젝트가 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
          {projects.map((p) => (
            <li
              key={p.id}
              className={
                'flex flex-wrap items-center gap-2 px-3 py-2 ' +
                (p.id === projectId ? 'bg-primary-50' : '')
              }
            >
              <div className="min-w-[160px] flex-1">
                <div className="text-sm font-medium text-gray-800">{p.name}</div>
                <div className="text-xs text-gray-400">
                  {p.pages.length}페이지 · {new Date(p.updatedAt).toLocaleString()}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleOpen(p)} icon={<FolderOpen className="h-4 w-4" />}>
                불러오기
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleRename(p)} icon={<Pencil className="h-4 w-4" />}>
                이름
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadJson(`${safeName(p.name)}.shadowing.json`, toProjectExport(p))}
                icon={<Download className="h-4 w-4" />}
              >
                프로젝트
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => downloadJson(`${safeName(p.name)}.manifest.json`, toManifest(p))}
                icon={<Download className="h-4 w-4" />}
              >
                Manifest
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(p)} icon={<Trash2 className="h-4 w-4 text-red-500" />}>
                삭제
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
