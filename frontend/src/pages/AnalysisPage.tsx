import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import { Loader2 } from 'lucide-react';

export default function AnalysisPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card padding="lg">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            AI가 분석 중입니다...
          </h2>
          <p className="text-gray-600 mb-8">
            업로드하신 자료를 분석하고 문제를 생성하고 있습니다. 잠시만 기다려주세요.
          </p>

          {/* Progress Steps */}
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                ✓
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">파일 처리 완료</p>
                <p className="text-sm text-gray-500">텍스트 추출 완료</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">내용 분석 중</p>
                <p className="text-sm text-gray-500">문법, 어휘 분석 진행 중</p>
              </div>
            </div>

            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">문제 생성</p>
                <p className="text-sm text-gray-500">다양한 유형의 문제 생성</p>
              </div>
            </div>

            <div className="flex items-center opacity-50">
              <div className="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-gray-900">결과 준비</p>
                <p className="text-sm text-gray-500">최종 검토 및 포맷팅</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
