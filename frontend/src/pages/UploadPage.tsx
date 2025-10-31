import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../utils/subjects';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import FileUpload from '../components/ui/FileUpload';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';
import Modal, { ModalFooter } from '../components/ui/Modal';
import { ArrowLeft, FileText, CheckCircle, Download, Sparkles } from 'lucide-react';

type UploadMode = 'select' | 'file' | 'json';

export default function UploadPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = subjectId ? getSubjectById(subjectId) : null;

  const [uploadMode, setUploadMode] = useState<UploadMode>('select');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 페이지 로드 시 기존 데이터 확인
  useEffect(() => {
    const uploadDataStr = localStorage.getItem('currentUpload');
    if (uploadDataStr) {
      const uploadData = JSON.parse(uploadDataStr);
      // 다른 과목의 데이터라면 리셋
      if (uploadData.subjectId !== subjectId) {
        localStorage.removeItem('currentUpload');
      }
    }
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card padding="lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            과목을 찾을 수 없습니다
          </h2>
          <Button variant="primary" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleStartAnalysis = () => {
    if (selectedFiles.length === 0) {
      return;
    }

    setIsProcessing(true);
    
    // 업로드된 파일 정보를 localStorage에 저장
    const uploadData = {
      subjectId,
      fileCount: selectedFiles.length,
      fileNames: selectedFiles.map(f => f.name),
      uploadMode,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('currentUpload', JSON.stringify(uploadData));
    
    // 시뮬레이션: 실제로는 서버에 파일을 업로드
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/analysis/${subjectId}`);
    }, 1500);
  };

  const handleDownloadSchema = () => {
    // JSON 스키마 예시 다운로드
    const schema = {
      subject: subjectId,
      pages: [
        {
          pageNumber: 1,
          originalText: "원문 텍스트",
          translation: "번역 (선택사항)"
        }
      ],
      vocabulary: [
        {
          word: "단어",
          reading: "읽기/발음",
          meaning: "의미",
          partOfSpeech: "품사",
          level: "난이도"
        }
      ]
    };

    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subjectId}-schema-example.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Mode: Select
  if (uploadMode === 'select') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
          className="mb-6"
        >
          과목 선택으로 돌아가기
        </Button>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Step 2</span>
          </div>
          <div className="text-6xl mb-4">{subject.icon}</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {subject.name.ko}
          </h1>
          <p className="text-xl text-gray-600">
            {subject.description.ko}
          </p>
        </div>

        {/* Upload Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* File Upload Option */}
          <Card 
            hover 
            padding="lg"
            onClick={() => setUploadMode('file')}
            className="cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                파일 업로드
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PDF 또는 이미지 파일을 업로드하여<br />AI가 자동으로 분석합니다
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="primary">PDF</Badge>
                <Badge variant="primary">JPG</Badge>
                <Badge variant="primary">PNG</Badge>
              </div>
              <Button variant="primary" size="lg" className="w-full">
                파일 업로드 시작 →
              </Button>
            </div>
          </Card>

          {/* JSON Upload Option */}
          <Card 
            hover 
            padding="lg"
            onClick={() => setUploadMode('json')}
            className="cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                JSON 업로드
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                구조화된 JSON 데이터로<br />빠르게 문제를 생성합니다
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="info">JSON</Badge>
                <Badge variant="success">구조화</Badge>
              </div>
              <Button variant="secondary" size="lg" className="w-full">
                JSON 업로드 시작 →
              </Button>
            </div>
          </Card>
        </div>

        {/* Features */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="flex items-start gap-4 mb-6">
            <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {subject.name.ko} 분석 기능
              </h3>
              <ul className="space-y-2">
                {subject.features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Mode: File Upload
  if (uploadMode === 'file') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => {
            setUploadMode('select');
            setSelectedFiles([]);
          }}
          className="mb-6"
        >
          뒤로 가기
        </Button>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{subject.icon}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            파일 업로드
          </h1>
          <p className="text-gray-600">
            {subject.name.ko} 학습 자료를 업로드하세요
          </p>
        </div>

        <Alert variant="info" className="mb-6">
          <strong>지원 형식:</strong> PDF, JPG, PNG 파일 (최대 10MB)
        </Alert>

        <FileUpload
          label="학습 자료 파일"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          maxSize={10}
          onFilesSelected={handleFilesSelected}
          helperText="여러 파일을 동시에 업로드할 수 있습니다"
        />

        {selectedFiles.length > 0 && (
          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleStartAnalysis}
              loading={isProcessing}
            >
              {isProcessing ? '처리 중...' : `분석 시작 (${selectedFiles.length}개 파일)`}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Mode: JSON Upload
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button
        variant="ghost"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => {
          setUploadMode('select');
          setSelectedFiles([]);
        }}
        className="mb-6"
      >
        뒤로 가기
      </Button>

      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{subject.icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          JSON 데이터 업로드
        </h1>
        <p className="text-gray-600">
          {subject.name.ko} 구조화된 JSON 파일을 업로드하세요
        </p>
      </div>

      <Alert variant="info" className="mb-6">
        <div className="flex items-center justify-between">
          <span>
            <strong>JSON 스키마:</strong> 올바른 형식으로 작성해주세요
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={() => setShowSchemaModal(true)}
          >
            예시 보기
          </Button>
        </div>
      </Alert>

      <FileUpload
        label="JSON 파일"
        accept=".json"
        multiple={false}
        maxSize={5}
        onFilesSelected={handleFilesSelected}
        helperText="JSON 형식의 학습 데이터를 업로드하세요"
      />

      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleStartAnalysis}
            loading={isProcessing}
          >
            {isProcessing ? '처리 중...' : '분석 시작'}
          </Button>
        </div>
      )}

      {/* Schema Modal */}
      <Modal
        isOpen={showSchemaModal}
        onClose={() => setShowSchemaModal(false)}
        title="JSON 스키마 예시"
        size="lg"
        footer={
          <ModalFooter
            onCancel={() => setShowSchemaModal(false)}
            onConfirm={handleDownloadSchema}
            cancelText="닫기"
            confirmText="예시 다운로드"
          />
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            다음 형식에 맞춰 JSON 파일을 작성해주세요:
          </p>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "subject": "${subjectId}",
  "pages": [
    {
      "pageNumber": 1,
      "originalText": "원문 텍스트",
      "translation": "번역 (선택사항)"
    }
  ],
  "vocabulary": [
    {
      "word": "단어",
      "reading": "읽기/발음",
      "meaning": "의미",
      "partOfSpeech": "품사",
      "level": "난이도"
    }
  ]
}`}
          </pre>
        </div>
      </Modal>
    </div>
  );
}
