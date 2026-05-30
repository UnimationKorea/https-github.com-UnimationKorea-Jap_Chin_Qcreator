# Shadowing Backend (스캐폴드)

클라우드 TTS / Whisper 강제정렬을 **API 키를 서버에 안전하게 보관**하고 프록시하는 백엔드.
전략 문서(EBOOK_SHADOWING_STRATEGY.md) Phase 1·2의 품질·대량생산 토대.

> **키 없이도 바로 실행됩니다.** 기본 프로바이더가 `mock`이라 무음 WAV + 추정/비례 타임스탬프로
> API 응답 형태(Shadowing Manifest 페이지)를 그대로 검증할 수 있습니다.
> 키를 넣으면 `azure`(TTS) / `whisper`(정렬)로 승급합니다.

## 빠른 시작

```bash
cd backend
cp .env.example .env      # 필요 시 키 입력
npm install
npm run dev               # http://localhost:8787
```

확인:
```bash
curl localhost:8787/health
```

## 구조

```
src/
  server.ts                  Express 부트스트랩 + /api/audio 정적 서빙
  config.ts                  .env 로딩
  types.ts                   Shadowing Manifest 타입(프론트와 정합)
  lib/
    hash.ts                  문장 콘텐츠 해시(캐시 키 → 비용 절감)
    wav.ts                   WAV 생성/길이 계산(외부 디코더 불필요)
    cache.ts                 클립 파일 캐시 + 정적 URL
  providers/
    tts/    types|mock|azure|index     문장→오디오 클립(+길이)
    align/  types|mock|whisper|index   기존 녹음→문장별 start/end
  routes/
    tts.ts                   POST /api/tts
    align.ts                 POST /api/align
```

## API

### `POST /api/tts`
문장별 TTS 클립을 합성(캐시)하고 누적 타임스탬프를 반환.

```jsonc
// 요청
{ "language": "en", "rate": 1, "page": 1,
  "sentences": [{ "id": "s1", "text": "The race is not always to the swift." }] }

// 응답 (ManifestPage)
{ "page": 1, "audio": { "mode": "tts" }, "provider": "mock",
  "sentences": [{ "id": "s1", "text": "...", "start": 0, "end": 1.8,
                  "clipUrl": "/api/audio/<hash>.wav" }] }
```

### `POST /api/align`  (multipart/form-data)
기존 녹음 + 문장 목록 → 문장별 start/end.

- `audio`: 음원 파일
- `language`: en|ja|zh|ko
- `sentences`: `[{id,text}]` JSON 문자열
- `durationSec`(옵션): 오디오 길이

### `GET /api/audio/<hash>.wav`
캐시된 클립 정적 서빙.

## 프로바이더 승급

| 변수 | 값 | 설명 |
|---|---|---|
| `TTS_PROVIDER` | `mock` / `azure` | Azure는 `AZURE_SPEECH_KEY`,`AZURE_SPEECH_REGION` 필요 |
| `ALIGN_PROVIDER` | `mock` / `whisper` | Whisper는 `OPENAI_API_KEY` 필요 |

초기화 실패(키 없음 등) 시 자동으로 `mock`으로 폴백합니다.

## 확장 포인트
- **단어 단위 타임스탬프**: Azure Speech SDK의 `WordBoundary`(REST는 문장 길이만 제공).
- **정밀 정렬**: Whisper `word` granularity 또는 MFA로 매핑 고도화(현재는 길이 비례 분배).
- **Google/Polly TTS**: `providers/tts/`에 어댑터 추가 후 팩토리에 등록.
- **프론트 연동**: Vite dev proxy(`/api` → 8787) + `src/utils/shadowingApi.ts` 클라이언트.
