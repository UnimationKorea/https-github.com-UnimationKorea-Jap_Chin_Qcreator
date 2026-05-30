import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../utils/subjects';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import { Download, FileText, ArrowLeft, CheckCircle, BookOpen, Sparkles } from 'lucide-react';

// Mock data - 실제로는 백엔드에서 받아옵니다
const mockVocabulary = [
  { word: '學習', reading: 'がくしゅう', meaning: '학습, 공부', level: 'N3' },
  { word: '文法', reading: 'ぶんぽう', meaning: '문법', level: 'N4' },
  { word: '理解', reading: 'りかい', meaning: '이해', level: 'N3' },
  { word: '練習', reading: 'れんしゅう', meaning: '연습', level: 'N4' },
  { word: '復習', reading: 'ふくしゅう', meaning: '복습', level: 'N3' },
];

const mockGrammar = [
  { pattern: '〜ている', explanation: '진행형/상태 표현', examples: ['勉強している', '住んでいる'] },
  { pattern: '〜たことがある', explanation: '경험 표현', examples: ['日本に行ったことがある', '寿司を食べたことがある'] },
  { pattern: '〜と思う', explanation: '생각/의견 표현', examples: ['難しいと思う', '面白いと思う'] },
];

const mockExercises = [
  {
    id: 1,
    type: '선택형',
    question: '次の単語の読み方として正しいものを選んでください：「学習」',
    options: ['がくしゅう', 'がくしゅ', 'がくじゅう', 'がくじゅ'],
    answer: 0
  },
  {
    id: 2,
    type: '선택형',
    question: '正しい文法を選んでください：私は日本に___。',
    options: ['行ったことがある', '行くことがある', '行っていることがある', '行くことだ'],
    answer: 0
  },
  {
    id: 3,
    type: '단답형',
    question: '「理解」の意味を書いてください。',
    answer: '이해'
  },
];

export default function ResultsPage() {
  const { subjectId } = useParams<{ subjectId: string; resultId?: string }>();
  const navigate = useNavigate();
  const subject = subjectId ? getSubjectById(subjectId) : null;
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  
  // localStorage에서 업로드 정보 가져오기
  const uploadDataStr = localStorage.getItem('currentUpload');
  const uploadData = uploadDataStr ? JSON.parse(uploadDataStr) : null;
  const totalPages = uploadData?.fileCount || 3;

  if (!subject) {
    navigate('/');
    return null;
  }

  const handleDownloadJSON = () => {
    const data = {
      subject: subjectId,
      generatedAt: new Date().toISOString(),
      uploadInfo: uploadData,
      summary: {
        totalPages,
        vocabularyCount: mockVocabulary.length,
        grammarCount: mockGrammar.length,
        exerciseCount: mockExercises.length,
      },
      vocabulary: mockVocabulary,
      grammar: mockGrammar,
      exercises: mockExercises,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subjectId}-learning-material-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setDownloadStatus('JSON 파일이 다운로드되었습니다!');
    setTimeout(() => setDownloadStatus(null), 3000);
  };

  const handleDownloadPDF = () => {
    setDownloadStatus('PDF 다운로드 기능은 백엔드 연동 후 지원됩니다');
    setTimeout(() => setDownloadStatus(null), 3000);
  };
  
  const handleNewAnalysis = () => {
    // 기존 데이터 리셋
    localStorage.removeItem('currentUpload');
    // 업로드 페이지로 이동
    navigate(`/upload/${subjectId}`);
  };

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
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{subject.icon}</div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">
                분석 결과
              </h1>
              <Badge variant="success">
                <CheckCircle className="w-3 h-3 mr-1" />
                완료
              </Badge>
            </div>
            <p className="text-gray-600">
              {subject.name.ko} 학습 자료가 생성되었습니다
            </p>
          </div>
        </div>
      </div>

      {/* Download Status Alert */}
      {downloadStatus && (
        <Alert variant="success" className="mb-6" onClose={() => setDownloadStatus(null)}>
          {downloadStatus}
        </Alert>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant="primary"
          icon={<Download className="w-4 h-4" />}
          onClick={handleDownloadJSON}
        >
          JSON 다운로드
        </Button>
        <Button
          variant="secondary"
          icon={<FileText className="w-4 h-4" />}
          onClick={handleDownloadPDF}
        >
          PDF 다운로드 (준비중)
        </Button>
        <Button
          variant="secondary"
          icon={<BookOpen className="w-4 h-4" />}
          onClick={handleNewAnalysis}
        >
          새로운 자료 분석
        </Button>
      </div>

      {/* Results Content */}
      <div className="space-y-6">
        {/* Summary Card */}
        <Card padding="lg" className="bg-gradient-to-br from-primary-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <CardTitle>요약 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <span className="text-2xl">📄</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">총 페이지</p>
                <p className="text-3xl font-bold text-gray-900">{totalPages}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">어휘</p>
                <p className="text-3xl font-bold text-gray-900">{mockVocabulary.length}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">문법</p>
                <p className="text-3xl font-bold text-gray-900">{mockGrammar.length}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <span className="text-2xl">✍️</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">문제</p>
                <p className="text-3xl font-bold text-gray-900">{mockExercises.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vocabulary Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>어휘 목록 ({mockVocabulary.length}개)</CardTitle>
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
                  {mockVocabulary.map((vocab, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {vocab.word}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {vocab.reading}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {vocab.meaning}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info">{vocab.level}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grammar Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>문법 포인트 ({mockGrammar.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockGrammar.map((grammar, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start gap-3">
                    <Badge variant="primary" className="mt-1">{index + 1}</Badge>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">
                        {grammar.pattern}
                      </h4>
                      <p className="text-gray-600 mb-3">
                        {grammar.explanation}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {grammar.examples.map((example, exIdx) => (
                          <span key={exIdx} className="px-3 py-1 bg-white rounded border border-gray-200 text-sm text-gray-700">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exercises Section */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>연습 문제 ({mockExercises.length}개)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockExercises.map((exercise) => (
                <div key={exercise.id} className="p-5 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="primary">문제 {exercise.id}</Badge>
                    <Badge variant="info">{exercise.type}</Badge>
                  </div>
                  
                  <p className="text-gray-900 font-medium mb-4">
                    {exercise.question}
                  </p>
                  
                  {exercise.options && (
                    <div className="space-y-2">
                      {exercise.options.map((option, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            idx === exercise.answer 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <span className="font-medium text-gray-700">
                            {idx + 1}. {option}
                            {idx === exercise.answer && (
                              <CheckCircle className="inline-block w-4 h-4 ml-2 text-green-600" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {!exercise.options && (
                    <div className="p-3 bg-green-50 border-2 border-green-500 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">정답:</p>
                      <p className="font-medium text-gray-900">{exercise.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        <Alert variant="success">
          <strong>분석 완료!</strong> 모든 학습 자료가 성공적으로 생성되었습니다. 
          위의 "JSON 다운로드" 버튼을 클릭하여 결과를 저장하세요.
        </Alert>
      </div>
    </div>
  );
}
