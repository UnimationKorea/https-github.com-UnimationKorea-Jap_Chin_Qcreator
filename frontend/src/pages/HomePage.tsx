import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SUBJECTS, getAllSubjects } from '../utils/subjects';
import { BookOpen, Upload, FileText, Download } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const subjects = getAllSubjects();

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/upload/${subjectId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          학습 문제 생성기
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          한문, 중국어, 일본어 학습 자료를 업로드하고 AI가 생성한 문제로 학습하세요
        </p>
      </div>

      {/* How it works */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          사용 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card padding="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. 과목 선택
              </h3>
              <p className="text-sm text-gray-600">
                학습할 언어를 선택합니다
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                2. 자료 업로드
              </h3>
              <p className="text-sm text-gray-600">
                PDF, 이미지 또는 JSON 파일을 업로드합니다
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. AI 분석
              </h3>
              <p className="text-sm text-gray-600">
                AI가 자동으로 문제를 생성합니다
              </p>
            </div>
          </Card>

          <Card padding="md">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                4. 결과 다운로드
              </h3>
              <p className="text-sm text-gray-600">
                생성된 문제를 검토하고 다운로드합니다
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Subject Selection */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          과목 선택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              hover
              padding="lg"
              onClick={() => handleSubjectSelect(subject.id)}
            >
              <CardHeader>
                <div className="text-4xl mb-3 text-center">{subject.icon}</div>
                <CardTitle className="text-center">
                  {subject.name.ko}
                </CardTitle>
                <CardDescription className="text-center">
                  {subject.description.ko}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {subject.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectSelect(subject.id);
                  }}
                >
                  시작하기
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          주요 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                과목별 맞춤 분석
              </h3>
              <p className="text-sm text-gray-600">
                한문, 중국어, 일본어 각 언어의 특성에 맞는 분석 제공
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                다양한 파일 형식 지원
              </h3>
              <p className="text-sm text-gray-600">
                PDF, 이미지(JPG, PNG), JSON 파일 업로드 가능
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                AI 기반 문제 생성
              </h3>
              <p className="text-sm text-gray-600">
                자동으로 어휘, 문법, 독해 문제 생성
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                편리한 편집 및 내보내기
              </h3>
              <p className="text-sm text-gray-600">
                생성된 문제를 수정하고 JSON 또는 PDF로 다운로드
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
