# 일본어 학습 문제 생성기 - 기술 사양서

## 📋 프로젝트 개요

### 프로젝트 정보
- **프로젝트명**: Japanese Learning Quiz Generator (일본어 학습 문제 생성기)
- **버전**: 1.0.0
- **개발 시작일**: 2025-10-31
- **목표**: PDF/이미지 파일에서 일본어 학습 문제 자동 생성

---

## 🛠️ 기술 스택

### 프론트엔드

#### Core
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **Styling**: Tailwind CSS 3.x

#### 상태 관리
- **전역 상태**: Zustand 4.x
- **서버 상태**: TanStack Query (React Query) 5.x

#### UI 컴포넌트
- **컴포넌트 라이브러리**: Shadcn/ui (Radix UI 기반)
- **아이콘**: Lucide React
- **폼 관리**: React Hook Form + Zod

#### 에디터
- **Markdown 에디터**: Monaco Editor / CodeMirror 6
- **WYSIWYG 에디터**: Tiptap (선택사항)

#### 다국어
- **i18n**: react-i18next
- **번역 관리**: i18next

#### 파일 처리
- **파일 업로드**: React Dropzone
- **PDF 미리보기**: react-pdf
- **이미지 처리**: browser-image-compression

#### 유틸리티
- **날짜**: date-fns
- **HTTP 클라이언트**: Axios
- **파일 다운로드**: file-saver
- **PDF 생성**: jsPDF + html2canvas

### 백엔드

#### Core
- **Runtime**: Node.js 20.x LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x

#### AI/ML
- **AI SDK**: OpenAI API / Anthropic Claude API
- **이미지 처리**: Sharp
- **PDF 처리**: pdf-parse, pdf-lib
- **OCR**: Tesseract.js (보조)

#### 데이터베이스
- **Primary DB**: PostgreSQL 16.x
- **캐싱**: Redis 7.x
- **파일 저장소**: AWS S3 / MinIO

#### 인증 & 보안
- **인증**: JWT (jsonwebtoken)
- **비밀번호 해싱**: bcrypt
- **환경 변수**: dotenv
- **입력 검증**: Zod
- **보안 헤더**: helmet
- **CORS**: cors

#### 파일 처리
- **파일 업로드**: Multer
- **이미지 변환**: Sharp
- **PDF 생성**: PDFKit

#### 유틸리티
- **로깅**: Winston / Pino
- **작업 큐**: Bull (Redis 기반)
- **스케줄러**: node-cron

### 개발 도구

#### 코드 품질
- **Linter**: ESLint 8.x
- **Formatter**: Prettier 3.x
- **타입 체크**: TypeScript
- **Git Hooks**: Husky + lint-staged

#### 테스팅
- **프론트엔드 테스트**: Vitest + React Testing Library
- **백엔드 테스트**: Jest + Supertest
- **E2E 테스트**: Playwright
- **커버리지**: c8 / Istanbul

#### 문서화
- **API 문서**: Swagger / OpenAPI 3.0
- **컴포넌트 문서**: Storybook 7.x
- **프로젝트 문서**: Markdown

### 배포 & 인프라

#### 호스팅
- **프론트엔드**: Vercel / Netlify / Cloudflare Pages
- **백엔드**: Railway / Render / AWS EC2
- **데이터베이스**: Supabase / AWS RDS

#### CI/CD
- **CI**: GitHub Actions
- **컨테이너**: Docker
- **오케스트레이션**: Docker Compose (개발)

#### 모니터링
- **에러 트래킹**: Sentry
- **분석**: Google Analytics / Plausible
- **로그**: CloudWatch / Datadog

---

## 📁 프로젝트 구조

### 전체 구조

```
japanese-quiz-generator/
├── frontend/                 # React 프론트엔드
│   ├── public/
│   │   ├── locales/         # i18n 번역 파일
│   │   │   ├── en/
│   │   │   ├── ko/
│   │   │   └── ja/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   │   ├── ui/          # 재사용 가능한 UI 컴포넌트
│   │   │   ├── layout/      # 레이아웃 컴포넌트
│   │   │   ├── features/    # 기능별 컴포넌트
│   │   │   └── common/      # 공통 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   │   ├── Home.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── Analysis.tsx
│   │   │   └── Editor.tsx
│   │   ├── hooks/           # Custom Hooks
│   │   ├── stores/          # Zustand 스토어
│   │   ├── services/        # API 서비스
│   │   ├── utils/           # 유틸리티 함수
│   │   ├── types/           # TypeScript 타입
│   │   ├── styles/          # 글로벌 스타일
│   │   ├── i18n/            # i18n 설정
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                  # Express 백엔드
│   ├── src/
│   │   ├── controllers/     # 컨트롤러
│   │   ├── services/        # 비즈니스 로직
│   │   ├── models/          # 데이터 모델
│   │   ├── routes/          # API 라우트
│   │   ├── middleware/      # 미들웨어
│   │   ├── utils/           # 유틸리티
│   │   ├── config/          # 설정 파일
│   │   ├── types/           # TypeScript 타입
│   │   ├── validators/      # 입력 검증
│   │   └── app.ts           # Express 앱
│   ├── uploads/             # 임시 업로드 폴더
│   ├── tests/               # 테스트 파일
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                   # 공유 코드
│   ├── types/               # 공통 타입 정의
│   └── constants/           # 공통 상수
│
├── docs/                     # 문서
│   ├── api/                 # API 문서
│   ├── architecture/        # 아키텍처 문서
│   └── guides/              # 가이드
│
├── docker/                   # Docker 설정
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── docker-compose.yml
│
├── .github/                  # GitHub 설정
│   └── workflows/           # GitHub Actions
│       ├── ci.yml
│       └── deploy.yml
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🗄️ 데이터베이스 스키마

### Users 테이블
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  language VARCHAR(10) DEFAULT 'ko',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Documents 테이블
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  page_count INTEGER,
  status VARCHAR(50) DEFAULT 'uploaded',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Generated_Quizzes 테이블
```sql
CREATE TABLE generated_quizzes (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  metadata JSONB,
  status VARCHAR(50) DEFAULT 'generated',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Processing_Logs 테이블
```sql
CREATE TABLE processing_logs (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
  step VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  progress INTEGER DEFAULT 0,
  error_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API 엔드포인트

### 인증 API

```
POST   /api/auth/register          # 회원가입
POST   /api/auth/login             # 로그인
POST   /api/auth/logout            # 로그아웃
GET    /api/auth/me                # 현재 사용자 정보
POST   /api/auth/refresh           # 토큰 갱신
```

### 파일 업로드 API

```
POST   /api/upload                 # 파일 업로드
GET    /api/upload/:id             # 업로드 상태 확인
DELETE /api/upload/:id             # 업로드 취소/삭제
```

### 문서 분석 API

```
POST   /api/analyze                # 문서 분석 시작
GET    /api/analyze/:id/status     # 분석 진행 상황
GET    /api/analyze/:id/result     # 분석 결과 조회
DELETE /api/analyze/:id            # 분석 취소
```

### 문제 생성 API

```
POST   /api/quiz/generate          # 문제 생성
GET    /api/quiz/:id               # 생성된 문제 조회
PUT    /api/quiz/:id               # 문제 수정
DELETE /api/quiz/:id               # 문제 삭제
GET    /api/quiz/list              # 문제 목록 조회
```

### 다운로드 API

```
POST   /api/export/pdf             # PDF 다운로드
POST   /api/export/docx            # DOCX 다운로드
POST   /api/export/markdown        # Markdown 다운로드
```

### 사용자 API

```
GET    /api/user/profile           # 프로필 조회
PUT    /api/user/profile           # 프로필 수정
GET    /api/user/history           # 생성 이력
DELETE /api/user/history/:id       # 이력 삭제
```

---

## 🔐 보안

### 인증 흐름

```
1. 사용자 로그인
   ↓
2. 서버에서 JWT 토큰 발급
   - Access Token (15분)
   - Refresh Token (7일)
   ↓
3. 클라이언트에 저장
   - Access Token: 메모리
   - Refresh Token: HttpOnly Cookie
   ↓
4. API 요청 시 Access Token 포함
   ↓
5. Access Token 만료 시
   → Refresh Token으로 갱신
```

### 보안 조치

**입력 검증**
- Zod 스키마를 통한 입력 검증
- XSS 방지를 위한 입력 sanitization
- SQL Injection 방지 (Prepared Statements)

**파일 업로드 보안**
- 파일 크기 제한 (50MB)
- MIME 타입 검증
- 파일 확장자 화이트리스트
- 파일명 sanitization
- 업로드된 파일 격리 저장

**API 보안**
- Rate Limiting (IP별 제한)
- CORS 설정
- Helmet.js로 보안 헤더 설정
- HTTPS 강제

**데이터 보안**
- 비밀번호 bcrypt 해싱 (salt rounds: 12)
- 민감 정보 암호화
- 정기적인 보안 업데이트

---

## 🚀 배포 전략

### 환경 구성

**개발 환경 (Development)**
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
REDIS_HOST=localhost
LOG_LEVEL=debug
```

**스테이징 환경 (Staging)**
```env
NODE_ENV=staging
FRONTEND_URL=https://staging.quizgen.com
BACKEND_URL=https://api-staging.quizgen.com
DB_HOST=staging-db.example.com
REDIS_HOST=staging-redis.example.com
LOG_LEVEL=info
```

**프로덕션 환경 (Production)**
```env
NODE_ENV=production
FRONTEND_URL=https://quizgen.com
BACKEND_URL=https://api.quizgen.com
DB_HOST=prod-db.example.com
REDIS_HOST=prod-redis.example.com
LOG_LEVEL=error
```

### Docker 구성

**docker-compose.yml**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend.Dockerfile
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://backend:3000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend.Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/quizgen
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: quizgen
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD 파이프라인

**GitHub Actions - CI**
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
          
      - name: Lint
        run: |
          cd frontend && npm run lint
          cd ../backend && npm run lint
          
      - name: Type check
        run: |
          cd frontend && npm run type-check
          cd ../backend && npm run type-check
          
      - name: Test
        run: |
          cd frontend && npm run test
          cd ../backend && npm run test
          
      - name: Build
        run: |
          cd frontend && npm run build
          cd ../backend && npm run build
```

---

## 📊 성능 최적화

### 프론트엔드 최적화

**코드 스플리팅**
```typescript
// 라우트 기반 코드 스플리팅
const Home = lazy(() => import('./pages/Home'));
const Editor = lazy(() => import('./pages/Editor'));

// 컴포넌트 기반 코드 스플리팅
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

**이미지 최적화**
- WebP 포맷 사용
- 반응형 이미지 (srcset)
- Lazy loading
- 이미지 압축

**번들 최적화**
- Tree shaking
- Minification
- Compression (Gzip/Brotli)
- CDN 사용

### 백엔드 최적화

**캐싱 전략**
```typescript
// Redis 캐싱 예시
async function getCachedData(key: string) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetchFromDatabase();
  await redis.set(key, JSON.stringify(data), 'EX', 3600);
  return data;
}
```

**데이터베이스 최적화**
- 인덱스 생성
- 쿼리 최적화
- Connection pooling
- 읽기 복제본 사용

**API 최적화**
- 응답 압축
- Pagination
- Field selection
- 병렬 처리

---

## 🧪 테스트 전략

### 단위 테스트 (Unit Tests)

**프론트엔드**
```typescript
// src/__tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**백엔드**
```typescript
// src/__tests__/services/quizService.test.ts
import { generateQuiz } from '@/services/quizService';

describe('QuizService', () => {
  it('should generate quiz from text', async () => {
    const text = 'Sample Japanese text';
    const result = await generateQuiz(text);
    
    expect(result).toHaveProperty('questions');
    expect(result.questions).toBeInstanceOf(Array);
  });
});
```

### 통합 테스트 (Integration Tests)

```typescript
// backend/tests/integration/upload.test.ts
import request from 'supertest';
import app from '@/app';

describe('Upload API', () => {
  it('should upload a file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', 'tests/fixtures/sample.pdf')
      .expect(200);
      
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('filename');
  });
});
```

### E2E 테스트 (End-to-End Tests)

```typescript
// e2e/upload-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete upload and analysis flow', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // 파일 업로드
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles('tests/fixtures/sample.pdf');
  
  // 분석 완료 대기
  await page.waitForSelector('[data-testid="analysis-complete"]');
  
  // 결과 확인
  await expect(page.locator('[data-testid="quiz-result"]')).toBeVisible();
});
```

---

## 📈 모니터링 & 로깅

### 로깅 설정

```typescript
// backend/src/config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### 에러 트래킹

```typescript
// frontend/src/utils/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### 성능 모니터링

```typescript
// 프론트엔드 성능 측정
import { onCLS, onFID, onLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  navigator.sendBeacon('/api/analytics', body);
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
```

---

## 🔄 개발 워크플로우

### Git 브랜치 전략 (Git Flow)

```
main (프로덕션)
  └── develop (개발)
       ├── feature/upload-ui (기능 개발)
       ├── feature/ai-integration (기능 개발)
       ├── bugfix/file-validation (버그 수정)
       └── hotfix/critical-error (긴급 수정)
```

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 업무, 패키지 매니저 설정 등

예시:
feat: 파일 업로드 UI 구현
fix: PDF 파싱 오류 수정
docs: API 문서 업데이트
```

### Pull Request 템플릿

```markdown
## 변경 사항
- [ ] 기능 추가
- [ ] 버그 수정
- [ ] 문서 업데이트
- [ ] 리팩토링

## 설명
(변경 사항에 대한 상세 설명)

## 테스트
- [ ] 단위 테스트 추가
- [ ] 통합 테스트 통과
- [ ] 수동 테스트 완료

## 스크린샷
(UI 변경이 있는 경우)

## 체크리스트
- [ ] 코드 리뷰 요청
- [ ] 테스트 통과
- [ ] 문서 업데이트
- [ ] 버전 업데이트
```

---

## 📦 패키지 관리

### 프론트엔드 주요 의존성

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.12.0",
    "zustand": "^4.4.7",
    "axios": "^1.6.2",
    "react-i18next": "^13.5.0",
    "react-hook-form": "^7.48.2",
    "zod": "^3.22.4",
    "lucide-react": "^0.294.0",
    "react-dropzone": "^14.2.3",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1",
    "vitest": "^1.0.4"
  }
}
```

### 백엔드 주요 의존성

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "pg": "^8.11.3",
    "redis": "^4.6.11",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.0",
    "pdf-parse": "^1.1.1",
    "winston": "^3.11.0",
    "zod": "^3.22.4",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.5",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "nodemon": "^3.0.2",
    "ts-node": "^10.9.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 🎓 개발 가이드

### 로컬 개발 환경 설정

1. **저장소 클론**
```bash
git clone https://github.com/your-org/japanese-quiz-generator.git
cd japanese-quiz-generator
```

2. **의존성 설치**
```bash
# 프론트엔드
cd frontend
npm install

# 백엔드
cd ../backend
npm install
```

3. **환경 변수 설정**
```bash
# 프론트엔드
cp frontend/.env.example frontend/.env

# 백엔드
cp backend/.env.example backend/.env
```

4. **데이터베이스 설정**
```bash
# PostgreSQL 시작
docker-compose up -d postgres

# 마이그레이션 실행
cd backend
npm run migrate
```

5. **개발 서버 시작**
```bash
# 터미널 1 - 프론트엔드
cd frontend
npm run dev

# 터미널 2 - 백엔드
cd backend
npm run dev
```

### 코딩 스타일 가이드

**TypeScript**
```typescript
// ✅ Good
interface User {
  id: number;
  name: string;
  email: string;
}

export async function getUser(id: number): Promise<User> {
  const user = await db.users.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');
  return user;
}

// ❌ Bad
function getUser(id) {
  return db.users.findUnique({ where: { id } });
}
```

**React 컴포넌트**
```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn('btn', `btn-${variant}`)}
    >
      {children}
    </button>
  );
}

// ❌ Bad
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

---

## 📚 참고 자료

### 공식 문서
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### 학습 자료
- [Full Stack Open](https://fullstackopen.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://reactpatterns.com/)

### 도구 문서
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)

---

**문서 버전**: 1.0.0  
**최종 수정일**: 2025-10-31  
**작성자**: Development Team
