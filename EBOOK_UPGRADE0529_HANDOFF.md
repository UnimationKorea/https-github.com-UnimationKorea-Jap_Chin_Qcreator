# Shadowing 기능 핸드오프 (`ebook_upgrade0529`)

> 다른 개발자가 **다른 플랫폼/프레임워크**에서 이 기능을 재구현하거나 확장할 수 있도록 정리한 문서입니다.
> 데이터 계약(타입), 재생 엔진 인터페이스, 백엔드 API 계약, 배포 방식을 포함합니다.

---

## 1. 라이브 데모 URL

| 항목 | URL |
|---|---|
| 앱 홈 | `https://unimationkorea.github.io/https-github.com-UnimationKorea-Jap_Chin_Qcreator/` |
| **Shadowing 실험실** | `https://unimationkorea.github.io/https-github.com-UnimationKorea-Jap_Chin_Qcreator/shadowing` |

- 정적(프론트엔드 전용) 배포라 **백엔드 없이 브라우저 음성(Web Speech)** 으로 동작합니다.
- 배포 파이프라인: `ebook_upgrade0529` 푸시 → GitHub Actions → `gh-pages` 브랜치 게시(§9).

---

## 2. 이 브랜치에서 개발된 것 (기능 요약)

페이지 단위 텍스트/PDF를 **문장으로 자동 분할**하고, 문장을 **노래방 자막식(현재 문장·단어 하이라이트)** 으로 따라읽기 재생하는 PoC.

- **입력**: 텍스트 붙여넣기 / 내장 샘플 / 이솝우화 샘플(영어, 4페이지) / **실제 PDF 업로드**(여러 페이지) / **다중 PDF 일괄 업로드**(책 라이브러리 대량생산)
- **언어**: 영어(en) · 일본어(ja) · 중국어(zh) · 한국어(ko)
- **문장 분할**: `Intl.Segmenter`(문장 granularity) 우선, 미지원 시 구두점 기반 폴백. 영어는 대화문+서술 병합 보정.
- **재생 엔진(2종, 자동 선택)**:
  - 백엔드 가동 시 → **클라우드 TTS 클립 + 타임스탬프**(문장 단위 하이라이트)
  - 백엔드 미가동 시 → **Web Speech API**(문장 + 단어 단위 하이라이트)
- **연속 재생**: 한 페이지가 끝나면 다음 페이지로 자동 진행.
- **재생 컨트롤**: 이전/재생/다음/정지, 속도(0.5~1.5x), 음성 선택.
- **라이브러리**: 프로젝트 저장/재사용(localStorage), JSON 내보내기/가져오기.
- **안정성**: 온라인 음성(`synthesis-failed`) 실패 시 로컬 음성으로 자동 폴백·재시도(§10).

개발 단계(커밋 기준)는 §11 참고.

---

## 3. 기술 스택

- **프론트엔드**: React 19 + TypeScript, Vite 7, React Router 7, Tailwind CSS 3, `pdfjs-dist`(PDF 텍스트 추출), `lucide-react`(아이콘), `axios`. 상태는 로컬 state + `localStorage`.
- **백엔드(선택)**: Node + Express(TypeScript). TTS/정렬 **프로바이더 패턴**(`mock` 기본, `azure`/`whisper` 승급). API 키를 서버에 보관·프록시.
- **재생**: 브라우저 `SpeechSynthesis`(Web Speech API) 또는 백엔드 합성 클립(`HTMLAudioElement`).

---

## 4. 저장소 레이아웃 (Shadowing 관련)

```
frontend/
  src/
    pages/ShadowingLabPage.tsx          실험실 페이지(입력→분할→재생 오케스트레이션)
    components/shadowing/
      ShadowingViewer.tsx               재생 UI + 엔진 선택/하이라이트 렌더
      BatchUpload.tsx                   다중 PDF 일괄 업로드(대량생산)
      ProjectPanel.tsx                  라이브러리(저장/불러오기/내보내기)
    utils/
      sentenceSplitter.ts               텍스트 → 문장 배열
      pdfText.ts                        PDF → 페이지별 텍스트(pdfjs-dist)
      shadowingTTS.ts                   Web Speech 재생 엔진(ShadowingPlayer)
      shadowingAudio.ts                 백엔드 클립 재생 엔진(AudioClipPlayer) + 공통 인터페이스
      shadowingApi.ts                   백엔드 클라이언트(/api/health,/tts,/align)
      shadowingStore.ts                 localStorage 프로젝트 저장/내보내기/가져오기
    types/shadowing.ts                  ★ 데이터 계약(Shadowing Manifest 스키마)
backend/
  src/
    server.ts                           Express 부트스트랩 + /api/audio 정적 서빙
    routes/tts.ts                       POST /api/tts
    routes/align.ts                     POST /api/align
    providers/tts/   (mock|azure|index) 문장 → 오디오 클립(+길이)
    providers/align/ (mock|whisper|index) 기존 녹음 → 문장별 start/end
    lib/ (hash|wav|cache)               콘텐츠 해시·WAV 길이·클립 캐시
EBOOK_SHADOWING_STRATEGY.md             원 설계 전략 문서
```

---

## 5. 라우팅

`frontend/src/App.tsx` — `BrowserRouter basename={import.meta.env.BASE_URL}` (서브경로 배포 대응).

| 경로 | 페이지 |
|---|---|
| `/shadowing` | ShadowingLabPage (이 기능의 진입점) |
| `/`, `/upload/:subjectId`, `/analysis/:subjectId`, `/results/:subjectId/:resultId?`, `/showcase` | 기존 문제생성기 영역 |

> 다른 플랫폼 이식 시 핵심은 `/shadowing` 한 화면(ShadowingLabPage + ShadowingViewer)입니다.

---

## 6. 핵심 데이터 계약 — Shadowing Manifest (★ 가장 중요)

`frontend/src/types/shadowing.ts` (백엔드 `backend/src/types.ts`와 정합). **수동 타임스탬프(스탬프)를 대체하는 단일 산출물**입니다. 다른 플랫폼에서도 이 스키마만 맞추면 호환됩니다.

```ts
type ShadowingLanguage = 'en' | 'ja' | 'zh' | 'ko';
type AudioMode = 'tts' | 'file';

interface ShadowingSentence {
  id: string;
  text: string;
  reading?: string;   // 후리가나/병음 등(옵션)
  start?: number;     // 페이지 오디오 내 시작(초). 없으면 순차 재생
  end?: number;       // 페이지 오디오 내 종료(초)
  clipUrl?: string;   // 문장별 개별 TTS 클립(옵션)
}

interface ShadowingPage {
  page: number;
  audio: { mode: AudioMode; url?: string };
  sentences: ShadowingSentence[];
}

interface ShadowingManifest {
  bookId: string;
  language: ShadowingLanguage;
  pages: ShadowingPage[];
}
```

**설계 원칙**: "문장 단위"가 핵심 단순화. `start/end`가 있으면 정밀 싱크, 없으면 문장이 끝날 때 다음 문장으로 넘어가는 순차 재생으로 동작 → 강제정렬 없이도 노래방식 하이라이트가 성립.

---

## 7. 프론트엔드 모듈별 책임 & 주요 시그니처

### 7.1 문장 분할 — `sentenceSplitter.ts`
```ts
splitIntoSentences(text: string, language: ShadowingLanguage = 'en'): ShadowingSentence[]
```
- `Intl.Segmenter`(sentence) 우선 → 폴백: 구두점 기반(`. ! ?` / CJK `。！？`).
- 영어는 약어(`Mr.` 등)·소문자 시작 보정 후 대화문+서술 병합(`mergeEnglishSentences`).

### 7.2 PDF 텍스트 추출 — `pdfText.ts`
- `pdfjs-dist` 사용. 워커는 `pdf.worker.min.mjs?url`로 번들(Vite `base` 자동 반영).
- 페이지별 텍스트 배열을 반환 → 각 페이지를 `splitIntoSentences`에 투입.

### 7.3 재생 엔진 공통 인터페이스 — `shadowingAudio.ts`
```ts
interface ShadowingEngine {
  play(fromIndex?: number): void;
  pause(): void;
  stop(): void;
  setRate(rate: number): void;
  setVoice?(voice: SpeechSynthesisVoice | null): void;
}
interface ShadowingPlayerCallbacks {
  onSentenceStart?: (index: number) => void;
  onWordBoundary?: (sentenceIndex: number, charIndex: number, charLength: number) => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
  onVoiceFallback?: () => void;   // 온라인 음성 실패 → 로컬 음성 자동 전환 알림
}
```
- `AudioClipPlayer`(백엔드 클립) / `ShadowingPlayer`(Web Speech) 둘 다 이 인터페이스 구현 → **UI는 엔진을 몰라도 됨**.

### 7.4 Web Speech 엔진 — `shadowingTTS.ts`
- `new ShadowingPlayer({ sentences, lang, rate, voice, callbacks })`.
- 문장마다 `SpeechSynthesisUtterance` 발화 → `onend`에 다음 문장 → 순차 하이라이트.
- `onboundary('word')`로 **단어 단위 하이라이트**(지원 브라우저: Chrome/Edge).
- BCP-47 매핑: `en-US / ja-JP / zh-CN / ko-KR`.

### 7.5 백엔드 클라이언트 — `shadowingApi.ts`
```ts
getBackendHealth(force?): Promise<BackendHealth | null>   // GET /api/health (1.5s 타임아웃, 세션 캐시)
synthesizePage({ language, sentences, page?, voice?, rate? }): Promise<ManifestPage>  // POST /api/tts
alignRecording({ audio, language, sentences, page?, durationSec? }): Promise<ManifestPage> // POST /api/align
```
- `baseURL: '/api'`. 백엔드 미응답이면 `null` → 호출부가 Web Speech로 폴백.

### 7.6 라이브러리/영속화 — `shadowingStore.ts`
- `localStorage` 키 `shadowing.projects.v1`.
- `listProjects/getProject/createProject/updateProject/deleteProject`.
- `toProjectExport`(JSON 내보내기) / `parseImport`(가져오기 검증) / `toManifest`(§6 스키마로 변환) / `downloadJson`.

### 7.7 재생 UI — `ShadowingViewer.tsx`
```ts
<ShadowingViewer
  sentences={ShadowingSentence[]}
  language={ShadowingLanguage}
  autoPlay?={boolean}        // 연속 재생용: 문장 세트 로드 시 자동 시작
  onComplete?={() => void}   // 페이지 종료 → 다음 페이지로
/>
```
- 마운트 시 `getBackendHealth()`로 엔진 결정(클립 vs Web Speech) → 배지로 표시.
- 현재 문장 하이라이트 + (Web Speech 시) 단어 하이라이트 렌더.

---

## 8. 백엔드 API 계약 (다른 플랫폼에서 동일 서버 재사용 가능)

기본 포트 `8787`. 프론트는 Vite proxy(`/api` → `VITE_BACKEND_URL`)로 연결.

### `GET /api/health` (= `/health`)
```json
{ "ok": true, "ttsProvider": "mock|azure", "alignProvider": "mock|whisper" }
```

### `POST /api/tts`
요청:
```json
{ "language": "en", "voice": "...", "rate": 1, "page": 1,
  "sentences": [{ "id": "s1", "text": "Hello." }] }
```
응답(`ManifestPage`): 문장별 합성 클립을 만들고 **길이를 누적**해 `start/end`와 `clipUrl`을 채워 반환.
```json
{ "page": 1, "audio": { "mode": "tts" }, "provider": "mock",
  "sentences": [{ "id": "s1", "text": "Hello.", "start": 0, "end": 1.2, "clipUrl": "/api/audio/<hash>.wav" }] }
```

### `POST /api/align` (multipart/form-data)
- 필드: `audio`(File), `language`, `sentences`(JSON 문자열), `page?`, `durationSec?`.
- 기존 녹음 + 문장 → 문장별 `start/end`가 정렬된 `ManifestPage` 반환.

### 프로바이더 / 환경변수 (`backend/.env.example`)
- TTS: `mock`(기본, 무음 WAV + 비례 타임스탬프) → 키 입력 시 `azure`.
- Align: `mock`(비례 추정) → `whisper`(OpenAI transcriptions).
- 키 없이도 **응답 형태 그대로 검증 가능**(개발/이식 시 유용).
- 비용 절감: 문장 콘텐츠 해시(`lib/hash.ts`)로 클립 캐시(`lib/cache.ts`, `/api/audio/<key>.wav` 정적 서빙).

---

## 9. 배포 (GitHub Actions → gh-pages)

- 워크플로: `.github/workflows/deploy-pages.yml` — `ebook_upgrade0529` 푸시 시 트리거.
- 동작: `frontend`에서 `npm ci` → `npm run build -- --base=/<repo>/` → `dist/`에 `404.html`(SPA 딥링크 폴백) + `.nojekyll` 추가 → 순정 git으로 `gh-pages` 브랜치에 force-push.
- 최초 1회: 저장소 **Settings → Pages → Source = Deploy from a branch → `gh-pages` / `(root)`** 설정 필요.
- 서브경로 배포이므로 라우터 `basename`과 Vite `--base`를 저장소명으로 맞춤.

---

## 10. 알려진 한계 & 주의사항 (이식 시 체크)

- **온라인 음성 실패**: `Microsoft ... Online (Natural)` 등 네트워크 음성은 외부 호스팅에서 `synthesis-failed` 발생. → 기본은 **로컬(`localService`) 음성 우선**, 실패 시 기본 음성으로 자동 폴백·재시도(`shadowingTTS.ts` `onerror`, `ShadowingViewer` `onVoiceFallback`).
- **단어 단위 하이라이트**는 `SpeechSynthesisUtterance.onboundary` 지원 브라우저에서만(미지원 시 문장 단위로 자연 폴백).
- **정적 호스팅**에는 백엔드가 없어 `GET /api/health`가 404 → 의도된 동작(콘솔 404는 무해, Web Speech로 폴백).
- `Intl.Segmenter` 미지원 환경에서는 구두점 폴백 분할(정확도 저하 가능).
- localStorage 라이브러리는 **브라우저/도메인 종속**(서버 동기화 아님).

---

## 11. 개발 히스토리 (단계)

| 단계 | 내용 | 커밋 |
|---|---|---|
| 설계 | 페이지 단위 자동 Shadowing 전략 문서 | `8f06123` |
| P0 | 페이지 단위 Shadowing PoC | `68137c8` |
| P0 | 실제 PDF 업로드(pdfjs) | `b61e2b4` |
| P0 | 멀티 페이지 + 연속 재생 | `8086541` |
| P0 | 프로젝트 저장/재사용 + JSON 내보내기/가져오기 | `16cb03b` |
| P0 | 영어 지원 + 이솝우화 샘플 + 영어 분할 보정 | `a114517`,`aa44a42`,`d611930` |
| P1 | 다중 PDF 일괄 업로드 + 책 라이브러리 | `ed74276` |
| P2 | 단어 단위 노래방 하이라이트 | `83d945b` |
| P2 | 백엔드 스캐폴드(클라우드 TTS + Whisper) + 뷰어 연동/폴백 | `9654b29`,`e0c5900` |
| 배포 | GitHub Pages(gh-pages) CI | `d503a05`,`a0f178c` |
| 안정화 | 온라인 음성 `synthesis-failed` 자동 복구 | `1831cda` |

---

## 12. 다른 플랫폼에서 기능 추가하기 — 레시피

1. **언어 추가**: `ShadowingLanguage` 유니온 + `sentenceSplitter`의 `LOCALE`/`TERMINATORS` + `shadowingTTS`의 BCP-47 맵에 항목 추가.
2. **다른 프레임워크로 재생 이식**: §7.3 `ShadowingEngine` + `ShadowingPlayerCallbacks` 계약만 구현하면 UI를 자유 교체 가능. Web Speech 로직은 `shadowingTTS.ts`를 그대로 포팅.
3. **클라우드 음질 적용**: §8 백엔드를 그대로 띄우고(키 입력) 프론트는 `synthesizePage()`로 `ManifestPage`(clipUrl+start/end)를 받아 `AudioClipPlayer`로 재생.
4. **기존 녹음 활용**: `POST /api/align`으로 문장별 `start/end`를 정렬해 동일 스키마(§6)로 싱크.
5. **데이터 상호운용**: §6 `ShadowingManifest` JSON만 맞추면 저장/전송/타 플랫폼 임포트가 호환(`toManifest`/`parseImport` 참고).
