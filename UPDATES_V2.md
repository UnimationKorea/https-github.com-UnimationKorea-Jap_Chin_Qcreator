# 프로젝트 업데이트 V2 - 다중 과목 지원

## 📅 업데이트 일자
2025-10-31

## 🎯 주요 변경사항

### 1. 다중 과목 지원 추가

기존의 일본어 전용 시스템에서 **한문, 중국어, 일본어** 3개 과목을 지원하는 시스템으로 확장되었습니다.

#### 지원 과목

| 과목 | 코드 | 주요 기능 |
|------|------|-----------|
| **한문 (漢文)** | `hanmun` | 원문 해석, 한자 음훈, 문법 구조 분석 |
| **중국어 (中文)** | `chinese` | 병음 생성, 성조 분석, HSK 등급 평가 |
| **일본어 (日本語)** | `japanese` | 후리가나, 문법 패턴, JLPT 등급 평가 |

### 2. JSON 파일 업로드 지원

PDF/이미지 외에 **구조화된 JSON 데이터**도 업로드할 수 있게 되었습니다.

#### JSON 스키마 예시

**한문 JSON**
```json
{
  "subject": "hanmun",
  "title": "논어 학이편",
  "pages": [
    {
      "pageNumber": 1,
      "originalText": "子曰 學而時習之 不亦說乎",
      "translation": "공자께서 말씀하시길...",
      "characters": [
        {"char": "子", "meaning": "아들", "sound": "자"}
      ]
    }
  ]
}
```

**중국어 JSON**
```json
{
  "subject": "chinese",
  "title": "日常会话",
  "pages": [
    {
      "pageNumber": 1,
      "text": "你好，很高兴认识你。",
      "pinyin": "Nǐ hǎo, hěn gāoxìng rènshi nǐ.",
      "vocabulary": [
        {"word": "高兴", "pinyin": "gāoxìng", "tone": "1-4"}
      ]
    }
  ]
}
```

**일본어 JSON**
```json
{
  "subject": "japanese",
  "title": "サーカスのライオン",
  "pages": [
    {
      "pageNumber": 1,
      "text": "町はずれの広場にサーカスがやって来た。",
      "furigana": "まち||はずれの|ひろば|に...",
      "vocabulary": [
        {"word": "町", "reading": "まち", "jlpt": "N5"}
      ]
    }
  ]
}
```

### 3. 새로운 UI 플로우

#### 기존 (V1)
```
홈 → 파일 업로드 → 분석 → 결과
```

#### 업데이트 (V2)
```
홈 → 과목 선택 → 파일/JSON 업로드 → 과목별 분석 → 과목별 결과
```

### 4. 과목별 특화 분석

각 과목에 맞는 특화된 분석 기능이 추가되었습니다.

#### 한문 분석
- ✅ 원문 한자 인식
- ✅ 현토(懸吐) 생성
- ✅ 한자 음훈 분석
- ✅ 문법 구조 도표
- ✅ 원문 해석 문제 생성

#### 중국어 분석
- ✅ 간체/번체 자동 판별
- ✅ 병음(拼音) 자동 생성
- ✅ 성조(声调) 분석 (1-4성)
- ✅ HSK 등급 평가
- ✅ 회화 상황 분석
- ✅ 어법 구조 분석

#### 일본어 분석
- ✅ 히라가나/가타카나/한자 구분
- ✅ 후리가나(ふりがな) 자동 추가
- ✅ 문법 패턴 식별
- ✅ 경어 레벨 판정
- ✅ JLPT 등급 평가
- ✅ 한자 음훈 분석

### 5. 과목별 색상 테마

각 과목마다 고유한 색상 테마가 적용됩니다.

```css
/* 한문 - 브라운 계열 */
한문: #8B4513 (Saddle Brown)

/* 중국어 - 레드 계열 */
중국어: #DC143C (Crimson)

/* 일본어 - 블루 계열 */
일본어: #4169E1 (Royal Blue)
```

### 6. 확장된 다국어 지원

UI 언어가 4개 언어로 확장되었습니다.

- 🇰🇷 한국어 (Korean)
- 🇺🇸 영어 (English)
- 🇨🇳 중국어 (Chinese)
- 🇯🇵 일본어 (Japanese)

---

## 📄 새로운 문서

### WIREFRAME_V2_MULTI_SUBJECT.md
- **크기**: 32KB
- **내용**: 
  - 과목 선택 페이지 와이어프레임
  - 과목별 파일 업로드 페이지
  - 과목별 분석 진행 페이지
  - 과목별 결과 편집 페이지
  - JSON 스키마 정의
  - 과목별 컴포넌트 상세
  - 반응형 디자인 가이드

---

## 🔄 변경된 워크플로우

### 사용자 플로우
```
1. 홈페이지 접속
   ↓
2. 과목 선택
   ├─ 📜 한문 (원문 해석, 한자 학습)
   ├─ 🇨🇳 중국어 (병음, 회화)
   └─ 🇯🇵 일본어 (문법, 경어)
   ↓
3. 업로드 방법 선택
   ├─ 📄 파일 업로드 (PDF, 이미지)
   └─ 📋 JSON 데이터 업로드
   ↓
4. 파일 업로드
   ↓
5. 과목별 특화 분석
   ├─ 한문: 원문 → 현토 → 해석 → 문제
   ├─ 중국어: 텍스트 → 병음 → 성조 → 문제
   └─ 일본어: 텍스트 → 후리가나 → 문법 → 문제
   ↓
6. 결과 확인 및 편집
   ↓
7. 다운로드 (PDF, DOCX, Markdown)
```

### 개발 플로우
```
1. 과목 선택 컴포넌트 구현
   ↓
2. JSON 업로드 기능 추가
   ↓
3. 과목별 분석 서비스 구현
   ├─ HanmunAnalyzer
   ├─ ChineseAnalyzer
   └─ JapaneseAnalyzer
   ↓
4. 과목별 결과 포맷터 구현
   ↓
5. 과목별 다운로드 옵션 구현
```

---

## 🆕 새로운 컴포넌트

### 1. SubjectSelector
과목 선택 카드 컴포넌트

**Props:**
```typescript
interface SubjectSelectorProps {
  subjects: Subject[];
  onSelect: (subjectId: string) => void;
}
```

### 2. JsonUploader
JSON 파일 업로드 및 검증 컴포넌트

**Props:**
```typescript
interface JsonUploaderProps {
  subject: string;
  schema: ZodSchema;
  onUpload: (data: any) => void;
}
```

### 3. SubjectAnalyzer
과목별 분석 진행 상황 표시

**Props:**
```typescript
interface SubjectAnalyzerProps {
  subject: string;
  progress: number;
  currentStep: string;
  steps: AnalysisStep[];
}
```

### 4. SubjectResultViewer
과목별 맞춤 결과 뷰어

**Props:**
```typescript
interface SubjectResultViewerProps {
  subject: string;
  data: AnalysisResult;
  filters: FilterOptions;
}
```

---

## 🔌 새로운 API 엔드포인트

### 과목 관련

```http
GET /api/subjects
# 지원 과목 목록 조회

GET /api/subjects/:subjectId/schema
# 과목별 JSON 스키마 조회

GET /api/subjects/:subjectId/features
# 과목별 지원 기능 조회
```

### 업로드 관련

```http
POST /api/upload/file
# 파일 업로드 (멀티파트)
Body: { subject, file }

POST /api/upload/json
# JSON 데이터 업로드
Body: { subject, data }

POST /api/upload/validate
# JSON 스키마 검증
Body: { subject, data }
```

### 분석 관련

```http
POST /api/analyze/:subject
# 과목별 분석 시작
Body: { uploadId, options }

GET /api/analyze/:subject/:id/status
# 과목별 분석 진행 상황

GET /api/analyze/:subject/:id/result
# 과목별 분석 결과
```

---

## 📊 데이터베이스 스키마 변경

### 기존 Documents 테이블 업데이트

```sql
ALTER TABLE documents 
ADD COLUMN subject VARCHAR(20) NOT NULL DEFAULT 'japanese';

CREATE INDEX idx_documents_subject ON documents(subject);
```

### 새로운 Subject_Settings 테이블

```sql
CREATE TABLE subject_settings (
  id SERIAL PRIMARY KEY,
  subject_id VARCHAR(20) UNIQUE NOT NULL,
  display_name JSONB NOT NULL, -- {"ko": "한문", "en": "Classical Chinese"}
  features JSONB NOT NULL,
  default_options JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터
INSERT INTO subject_settings (subject_id, display_name, features) VALUES
('hanmun', 
 '{"ko": "한문", "en": "Classical Chinese", "zh": "汉文", "ja": "漢文"}',
 '["interpretation", "character_analysis", "grammar_structure"]'
),
('chinese',
 '{"ko": "중국어", "en": "Chinese", "zh": "中文", "ja": "中国語"}',
 '["pinyin", "tone_analysis", "hsk_level", "conversation"]'
),
('japanese',
 '{"ko": "일본어", "en": "Japanese", "zh": "日语", "ja": "日本語"}',
 '["furigana", "grammar_patterns", "jlpt_level", "keigo"]'
);
```

---

## 🧪 테스트 시나리오 업데이트

### 1. 과목 선택 테스트
```typescript
describe('SubjectSelector', () => {
  it('should display all 3 subjects', () => {
    // 한문, 중국어, 일본어 카드 표시 확인
  });
  
  it('should navigate to upload page on selection', () => {
    // 과목 선택 시 올바른 페이지로 이동
  });
  
  it('should apply subject-specific theme', () => {
    // 과목별 색상 테마 적용 확인
  });
});
```

### 2. JSON 업로드 테스트
```typescript
describe('JsonUpload', () => {
  it('should validate hanmun JSON schema', () => {
    const validJson = { subject: 'hanmun', ... };
    expect(validateSchema(validJson, hanmunSchema)).toBe(true);
  });
  
  it('should reject invalid subject', () => {
    const invalidJson = { subject: 'english', ... };
    expect(validateSchema(invalidJson, hanmunSchema)).toBe(false);
  });
});
```

### 3. 과목별 분석 테스트
```typescript
describe('SubjectAnalyzer', () => {
  it('should use Chinese-specific analyzer', () => {
    const analyzer = getAnalyzer('chinese');
    expect(analyzer).toBeInstanceOf(ChineseAnalyzer);
  });
  
  it('should generate pinyin for Chinese text', async () => {
    const result = await chineseAnalyzer.analyze('你好');
    expect(result.pinyin).toBe('Nǐ hǎo');
  });
});
```

---

## 💻 기술 스택 업데이트

### 새로 추가된 라이브러리

```json
{
  "dependencies": {
    // 중국어 처리
    "pinyin": "^3.1.0",
    "hanzi-writer": "^3.5.0",
    
    // 일본어 처리
    "kuroshiro": "^1.2.0",
    "kuroshiro-analyzer-kuromoji": "^1.1.0",
    
    // 한문 처리 (한자 분석)
    "hanzi": "^2.1.0",
    
    // JSON 스키마 검증
    "zod": "^3.22.4"
  }
}
```

---

## 📈 예상 영향

### 긍정적 영향
- ✅ **사용자 기반 확대**: 한문, 중국어 학습자까지 포함
- ✅ **유연성 증가**: JSON 업로드로 자동화 가능
- ✅ **정확도 향상**: 과목별 특화 분석
- ✅ **확장성**: 향후 다른 과목 추가 용이

### 기술적 고려사항
- ⚠️ **복잡도 증가**: 과목별 로직 관리 필요
- ⚠️ **테스트 범위**: 3배 증가
- ⚠️ **유지보수**: 과목별 업데이트 필요
- ⚠️ **성능**: 과목별 분석 엔진 최적화 필요

---

## 🔮 향후 계획

### Phase 2.1 - 과목 추가
- [ ] 영어 (English)
- [ ] 스페인어 (Español)
- [ ] 프랑스어 (Français)

### Phase 2.2 - 고급 기능
- [ ] 음성 읽기 (TTS)
- [ ] 필기 인식
- [ ] 대화형 퀴즈
- [ ] 진도 추적

### Phase 2.3 - 협업 기능
- [ ] 교사 계정
- [ ] 학급 관리
- [ ] 과제 배포
- [ ] 성적 분석

---

## 📝 마이그레이션 가이드

### 기존 사용자 데이터

기존 일본어 데이터는 자동으로 `subject: 'japanese'`로 마이그레이션됩니다.

```sql
-- 마이그레이션 스크립트
UPDATE documents 
SET subject = 'japanese' 
WHERE subject IS NULL;

UPDATE generated_quizzes 
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'),
  '{subject}',
  '"japanese"'
)
WHERE metadata->>'subject' IS NULL;
```

### API 하위 호환성

기존 API는 `subject` 파라미터가 없으면 `japanese`를 기본값으로 사용합니다.

```typescript
// 기존 (V1)
POST /api/analyze
Body: { uploadId: '123' }

// V2에서 자동 변환
POST /api/analyze
Body: { 
  uploadId: '123',
  subject: 'japanese' // 자동 추가
}
```

---

## 🎓 학습 리소스

### 과목별 참고 자료

**한문**
- [國文訓詁學](http://www.guoxue.com/)
- [文言文翻譯](https://fanti.dugushici.com/)

**중국어**
- [HSK 공식 사이트](http://www.chinesetest.cn/)
- [Pinyin Guide](https://www.pinyinpractice.com/)

**일본어**
- [JLPT 공식 사이트](https://www.jlpt.jp/)
- [JapanDict](https://www.japandict.com/)

---

## 🤝 기여 가이드 업데이트

### 새로운 과목 추가 방법

1. **과목 정의 추가**
   ```typescript
   // src/types/subjects.ts
   export const SUBJECTS = {
     hanmun: { ... },
     chinese: { ... },
     japanese: { ... },
     newSubject: { ... } // 새 과목 추가
   };
   ```

2. **분석기 구현**
   ```typescript
   // src/services/analyzers/NewSubjectAnalyzer.ts
   export class NewSubjectAnalyzer implements SubjectAnalyzer {
     async analyze(text: string): Promise<AnalysisResult> {
       // 구현
     }
   }
   ```

3. **JSON 스키마 정의**
   ```typescript
   // src/schemas/newSubject.schema.ts
   export const newSubjectSchema = z.object({ ... });
   ```

4. **테스트 작성**
   ```typescript
   // src/__tests__/analyzers/newSubject.test.ts
   describe('NewSubjectAnalyzer', () => { ... });
   ```

---

## 📞 문의 및 피드백

이번 업데이트에 대한 문의사항이나 피드백은 다음을 통해 제출해주세요:

- **GitHub Issues**: [프로젝트 저장소]/issues
- **Email**: feedback@quizgen.com
- **Discord**: [커뮤니티 링크]

---

**업데이트 버전**: V2.0.0  
**문서 작성일**: 2025-10-31  
**다음 업데이트 예정**: 개발 환경 설정 및 초기 구현

---

## ✅ 체크리스트

### 문서화
- [x] Wireframe V2 작성
- [x] 업데이트 문서 작성
- [x] Git 커밋
- [ ] README 업데이트
- [ ] API 문서 업데이트

### 다음 단계
- [ ] 과목 선택 UI 구현
- [ ] JSON 업로드 기능 구현
- [ ] 과목별 분석기 구현
- [ ] 테스트 작성
- [ ] 문서 통합
