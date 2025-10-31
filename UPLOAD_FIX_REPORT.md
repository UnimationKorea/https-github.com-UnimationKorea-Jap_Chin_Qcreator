# 업로드 파일 수 추적 기능 수정 완료

## 📋 문제 상황
사용자가 20개의 PNG 파일을 업로드했으나, 결과 페이지에서 3페이지로 하드코딩된 값만 표시되었습니다.

## ✅ 수정 내용

### 1. UploadPage.tsx 수정
**변경 사항:**
- 파일 업로드 시 localStorage에 업로드 정보 저장
- 저장 정보: 파일 수, 파일 이름, 과목 ID, 업로드 모드, 타임스탬프
- 페이지 로드 시 다른 과목 데이터는 자동 리셋

**코드:**
```typescript
const handleStartAnalysis = () => {
  // 업로드된 파일 정보를 localStorage에 저장
  const uploadData = {
    subjectId,
    fileCount: selectedFiles.length,
    fileNames: selectedFiles.map(f => f.name),
    uploadMode,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('currentUpload', JSON.stringify(uploadData));
  
  setTimeout(() => {
    setIsProcessing(false);
    navigate(`/analysis/${subjectId}`);
  }, 1500);
};
```

### 2. AnalysisPage.tsx 수정
**변경 사항:**
- localStorage에서 업로드 정보 읽기
- 실제 파일 수를 분석 단계 설명에 표시
- 하단 정보 카드에 파일 수 표시

**코드:**
```typescript
// localStorage에서 업로드 정보 가져오기
const uploadDataStr = localStorage.getItem('currentUpload');
const uploadData = uploadDataStr ? JSON.parse(uploadDataStr) : null;
const fileCount = uploadData?.fileCount || 0;

const [steps, setSteps] = useState<AnalysisStep[]>([
  { id: 1, label: '파일 처리', description: `${fileCount}개 파일의 텍스트 추출 및 전처리`, completed: false },
  // ...
]);
```

### 3. ResultsPage.tsx 수정
**변경 사항:**
- localStorage에서 실제 업로드된 파일 수 읽기
- 요약 카드에 실제 파일 수 표시 (하드코딩된 3 대신)
- JSON 다운로드 시 업로드 정보 포함
- "새로운 자료 분석" 버튼 클릭 시 기존 데이터 자동 리셋

**코드:**
```typescript
// localStorage에서 업로드 정보 가져오기
const uploadDataStr = localStorage.getItem('currentUpload');
const uploadData = uploadDataStr ? JSON.parse(uploadDataStr) : null;
const totalPages = uploadData?.fileCount || 3;

const handleNewAnalysis = () => {
  // 기존 데이터 리셋
  localStorage.removeItem('currentUpload');
  // 업로드 페이지로 이동
  navigate(`/upload/${subjectId}`);
};
```

## 🔄 데이터 플로우

```
1. UploadPage
   ↓ (사용자가 20개 파일 업로드)
   ↓ localStorage.setItem('currentUpload', { fileCount: 20, ... })
   ↓
2. AnalysisPage
   ↓ localStorage.getItem('currentUpload')
   ↓ 분석 중 표시: "20개 파일의 텍스트 추출 및 전처리"
   ↓
3. ResultsPage
   ↓ localStorage.getItem('currentUpload')
   ↓ 결과 표시: "총 페이지: 20"
   ↓ "새로운 자료 분석" 버튼 클릭
   ↓ localStorage.removeItem('currentUpload')
   ↓ 기존 데이터 리셋 완료
```

## 📊 JSON 다운로드 포맷

이제 다운로드되는 JSON에 업로드 정보가 포함됩니다:

```json
{
  "subject": "japanese",
  "generatedAt": "2025-10-31T12:34:00.000Z",
  "uploadInfo": {
    "subjectId": "japanese",
    "fileCount": 20,
    "fileNames": ["page1.png", "page2.png", ..., "page20.png"],
    "uploadMode": "file",
    "timestamp": "2025-10-31T12:30:00.000Z"
  },
  "summary": {
    "totalPages": 20,
    "vocabularyCount": 5,
    "grammarCount": 3,
    "exerciseCount": 3
  },
  "vocabulary": [...],
  "grammar": [...],
  "exercises": [...]
}
```

## ✨ 기능 테스트 시나리오

### 테스트 1: 20개 파일 업로드
1. 일본어 과목 선택
2. 파일 업로드 모드 선택
3. 20개의 PNG 파일 선택
4. "분석 시작 (20개 파일)" 버튼 확인
5. 분석 페이지에서 "20개 파일의 텍스트 추출 및 전처리" 확인
6. 결과 페이지에서 "총 페이지: 20" 확인
7. JSON 다운로드하여 fileCount: 20 확인

### 테스트 2: 새로운 자료 분석
1. 결과 페이지에서 "새로운 자료 분석" 버튼 클릭
2. localStorage에서 기존 데이터 자동 삭제 확인
3. 업로드 페이지로 이동 확인
4. 새로운 파일 업로드 가능 확인

### 테스트 3: 다른 과목으로 전환
1. 일본어로 20개 파일 업로드 후 결과 확인
2. 홈으로 돌아가기
3. 중국어 과목 선택
4. 일본어 데이터가 자동으로 리셋되는지 확인

## 🎯 해결된 문제

✅ **문제 1**: 20개 파일 업로드 시 3페이지만 표시
- **해결**: localStorage를 통한 실제 파일 수 추적

✅ **문제 2**: 새로운 분석 시 이전 데이터 혼재
- **해결**: "새로운 자료 분석" 버튼으로 명시적 리셋

✅ **문제 3**: 다른 과목 전환 시 데이터 충돌
- **해결**: useEffect로 과목 변경 시 자동 리셋

## 🚀 다음 단계 (백엔드 연동 시)

현재는 프론트엔드에서 localStorage로 관리하지만, 백엔드 연동 시:

1. **파일 업로드 API**
   ```typescript
   POST /api/upload
   Body: FormData with files
   Response: { uploadId, fileCount, processingStatus }
   ```

2. **분석 진행 상황 API**
   ```typescript
   GET /api/analysis/{uploadId}/status
   Response: { progress, currentStep, processedPages }
   ```

3. **결과 조회 API**
   ```typescript
   GET /api/results/{uploadId}
   Response: { totalPages, vocabulary, grammar, exercises }
   ```

## 📝 변경된 파일 목록

- `/home/user/webapp/frontend/src/pages/UploadPage.tsx` ✅
- `/home/user/webapp/frontend/src/pages/AnalysisPage.tsx` ✅
- `/home/user/webapp/frontend/src/pages/ResultsPage.tsx` ✅

