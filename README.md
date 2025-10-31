# 일본어 학습 문제 생성기 🇯🇵

AI 기반 일본어 학습 문제 자동 생성 도구

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)

## 📖 프로젝트 소개

일본어 학습 교재(PDF, 이미지)를 업로드하면 AI가 자동으로 다음을 생성합니다:

- 📚 **학습 목표 및 방향성 분석**
- 📄 **페이지별 본문 및 어휘 추출**
- ✏️ **맞춤형 학습 문제 생성**
- 📥 **다양한 형식으로 다운로드** (PDF, DOCX, Markdown)

### 주요 특징

✨ **AI 기반 자동 분석**
- OpenAI/Claude API를 활용한 지능형 텍스트 분석
- 페이지별 내용 구조화 및 문제 생성

🌍 **다국어 지원**
- 한국어, 영어, 일본어 인터페이스
- 자동 번역 영역 분리

🎨 **직관적인 UI/UX**
- 드래그 앤 드롭 파일 업로드
- 실시간 진행 상황 표시
- 인라인 편집기로 결과 수정

📱 **반응형 디자인**
- 모바일, 태블릿, 데스크톱 지원
- 터치 친화적 인터페이스

---

## 🎯 사용 예시

### 1. 파일 업로드
```
일본어 교재 PDF 파일을 드래그 앤 드롭
또는 클릭하여 업로드
```

### 2. 자동 분석
```
AI가 다음을 자동으로 분석:
- 학습 목표 파악
- 본문 텍스트 추출
- 문제 유형 식별
- 어휘 및 문법 요소 분석
```

### 3. 결과 생성
```
생성된 컨텐츠:
✓ 학습 방향과 목표
✓ 페이지별 본문 및 해석
✓ Comprehension Check 문제
✓ 맞춤형 연습 문제
✓ 어휘 및 표현 리스트
```

### 4. 편집 및 다운로드
```
- 생성된 내용을 직접 편집
- 원하는 형식으로 다운로드
  (PDF, DOCX, Markdown)
```

---

## 📁 프로젝트 구조

```
japanese-quiz-generator/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # UI 컴포넌트
│   │   ├── pages/           # 페이지
│   │   ├── hooks/           # Custom Hooks
│   │   ├── stores/          # 상태 관리
│   │   └── i18n/            # 다국어 지원
│   └── package.json
│
├── backend/                  # Express 백엔드
│   ├── src/
│   │   ├── controllers/     # API 컨트롤러
│   │   ├── services/        # 비즈니스 로직
│   │   ├── routes/          # API 라우트
│   │   └── utils/           # 유틸리티
│   └── package.json
│
├── docs/                     # 문서
│   ├── WIREFRAME_AND_UI_DESIGN.md
│   ├── TECHNICAL_SPECIFICATION.md
│   └── japanese_learning_analysis.md
│
└── README.md                 # 이 파일
```

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **i18n**: react-i18next

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **AI**: OpenAI API / Claude API

### DevOps
- **Container**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Frontend) + Railway (Backend)

자세한 기술 스택은 [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md) 참조

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 20.x 이상
- Docker & Docker Compose (선택)
- PostgreSQL 16.x (Docker 사용 시 불필요)
- Redis 7.x (Docker 사용 시 불필요)

### 설치 방법

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
# 프론트엔드 환경 변수
cp frontend/.env.example frontend/.env

# 백엔드 환경 변수
cp backend/.env.example backend/.env
```

필수 환경 변수:
```env
# backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/quizgen
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret

# frontend/.env
VITE_API_URL=http://localhost:3000
```

4. **데이터베이스 설정 (Docker 사용)**
```bash
docker-compose up -d postgres redis
```

또는 로컬 PostgreSQL 사용:
```bash
createdb quizgen
cd backend
npm run migrate
```

5. **개발 서버 시작**
```bash
# 터미널 1 - 프론트엔드
cd frontend
npm run dev
# → http://localhost:5173

# 터미널 2 - 백엔드
cd backend
npm run dev
# → http://localhost:3000
```

---

## 📚 문서

- **[Wireframe & UI 설계](./WIREFRAME_AND_UI_DESIGN.md)** - 상세한 UI/UX 설계 및 컴포넌트 가이드
- **[기술 사양서](./TECHNICAL_SPECIFICATION.md)** - 전체 아키텍처 및 기술 스택
- **[분석 샘플](./japanese_learning_analysis.md)** - 실제 문제 생성 결과 예시

---

## 🎨 UI 미리보기

### 홈페이지 - 파일 업로드
```
┌────────────────────────────────────────┐
│  📚 일본어 학습 문제 자동 생성기          │
│                                        │
│  🖼️  파일을 여기에 드래그하거나         │
│      클릭하여 업로드하세요               │
│                                        │
│  지원 형식: PDF, PNG, JPG              │
└────────────────────────────────────────┘
```

### 분석 진행 중
```
┌────────────────────────────────────────┐
│  📊 파일 분석 중...                     │
│                                        │
│  ████████████░░░░░░░░  60%            │
│                                        │
│  ✅ 파일 업로드 완료                    │
│  ✅ 텍스트 추출 완료                    │
│  🔄 문제 생성 중...                     │
│  ⏳ 결과 포맷팅 대기                    │
└────────────────────────────────────────┘
```

### 결과 편집
```
┌─────────┬──────────────────────────────┐
│ 📑 목차  │  ✏️ 편집 영역                 │
│         │                              │
│ □ 학습목표│  ## 1. 학습방향과 목표         │
│ □ 본문 1 │                              │
│ □ 본문 2 │  ### 학습목표                 │
│ □ 문제 1 │  - 읽기력 향상: ...          │
│ □ 문제 2 │                              │
│         │  [💾 저장]  [📥 다운로드]      │
└─────────┴──────────────────────────────┘
```

---

## 🔌 API 엔드포인트

### 파일 업로드
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "file": <binary>
}

Response: 200 OK
{
  "id": "doc_123",
  "filename": "worksheet.pdf",
  "status": "uploaded"
}
```

### 문서 분석
```http
POST /api/analyze
Content-Type: application/json

{
  "documentId": "doc_123"
}

Response: 200 OK
{
  "analysisId": "analysis_456",
  "status": "processing"
}
```

### 분석 상태 확인
```http
GET /api/analyze/analysis_456/status

Response: 200 OK
{
  "status": "processing",
  "progress": 60,
  "currentStep": "generating_questions"
}
```

### 결과 조회
```http
GET /api/quiz/quiz_789

Response: 200 OK
{
  "id": "quiz_789",
  "title": "サーカスのライオン 学習文書",
  "content": "...",
  "metadata": { ... }
}
```

자세한 API 문서는 백엔드 서버 실행 후 `/api-docs`에서 확인 가능

---

## 🧪 테스트

### 단위 테스트
```bash
# 프론트엔드
cd frontend
npm run test

# 백엔드
cd backend
npm run test
```

### E2E 테스트
```bash
npm run test:e2e
```

### 테스트 커버리지
```bash
npm run test:coverage
```

---

## 🤝 기여하기

기여를 환영합니다! 다음 절차를 따라주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드, 설정 변경
```

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

## 👥 팀

- **개발자**: [Your Name]
- **이메일**: your.email@example.com
- **GitHub**: [@your-username](https://github.com/your-username)

---

## 🙏 감사의 말

- OpenAI API를 제공해주신 OpenAI
- React 및 오픈소스 커뮤니티
- 일본어 학습 교재 제공 - KUMON

---

## 📞 지원

문제가 발생하거나 질문이 있으시면:

- **Issues**: [GitHub Issues](https://github.com/your-org/japanese-quiz-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/japanese-quiz-generator/discussions)
- **Email**: support@quizgen.com

---

## 🗺️ 로드맵

### Phase 1 (현재) - MVP
- [x] 파일 업로드 기능
- [x] AI 기반 분석
- [x] 문제 생성
- [x] 결과 다운로드
- [x] 다국어 지원

### Phase 2 (계획 중)
- [ ] 사용자 계정 시스템
- [ ] 생성 이력 관리
- [ ] 템플릿 시스템
- [ ] 협업 기능

### Phase 3 (미래)
- [ ] 음성 읽기 기능
- [ ] 대화형 문제 풀이
- [ ] 학습 진도 추적
- [ ] 모바일 앱

---

## 📊 프로젝트 상태

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

**마지막 업데이트**: 2025-10-31

---

**Made with ❤️ for Japanese Language Learners**
