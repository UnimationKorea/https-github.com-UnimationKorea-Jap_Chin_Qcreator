import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Download, FileJson, FileText, ArrowLeft, Edit } from 'lucide-react';

export default function ResultsPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate('/')}
        className="mb-6"
      >
        처음으로 돌아가기
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          분석 결과
        </h1>
        <p className="text-gray-600">
          생성된 학습 자료를 확인하고 편집하거나 다운로드하세요
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant="primary"
          icon={<Download className="w-4 h-4" />}
        >
          JSON 다운로드
        </Button>
        <Button
          variant="secondary"
          icon={<FileText className="w-4 h-4" />}
        >
          PDF 다운로드
        </Button>
        <Button
          variant="secondary"
          icon={<Edit className="w-4 h-4" />}
        >
          편집 모드
        </Button>
      </div>

      {/* Results Content */}
      <div className="space-y-6">
        {/* Summary Card */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>요약 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">총 페이지</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">어휘</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">문법 포인트</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">연습 문제</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>어휘 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      단어
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      발음/독음
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      의미
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      난이도
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-900" colSpan={4}>
                      <p className="text-center text-gray-500 py-4">
                        분석된 어휘가 여기에 표시됩니다
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grammar Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>문법 포인트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-gray-500 py-8">
                분석된 문법 포인트가 여기에 표시됩니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Exercises Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>연습 문제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-center text-gray-500 py-8">
                생성된 연습 문제가 여기에 표시됩니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
