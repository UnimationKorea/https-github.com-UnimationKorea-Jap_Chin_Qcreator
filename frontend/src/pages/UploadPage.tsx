import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../utils/subjects';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ArrowLeft, Upload, FileJson } from 'lucide-react';

export default function UploadPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = subjectId ? getSubjectById(subjectId) : null;

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">{subject.icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {subject.name.ko}
        </h1>
        <p className="text-gray-600">
          {subject.description.ko}
        </p>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* File Upload */}
        <Card hover padding="lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              파일 업로드
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              PDF 또는 이미지 파일을 업로드하세요
            </p>
            <Button variant="primary" size="lg" className="w-full">
              파일 선택
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              지원 형식: PDF, JPG, PNG
            </p>
          </div>
        </Card>

        {/* JSON Upload */}
        <Card hover padding="lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileJson className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              JSON 업로드
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              구조화된 JSON 데이터를 업로드하세요
            </p>
            <Button variant="secondary" size="lg" className="w-full">
              JSON 선택
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              스키마 예시 다운로드
            </p>
          </div>
        </Card>
      </div>

      {/* Subject Features */}
      <Card padding="lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          분석 기능
        </h3>
        <ul className="space-y-3">
          {subject.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-primary-600 mr-3 mt-0.5">✓</span>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
