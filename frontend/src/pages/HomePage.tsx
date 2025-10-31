import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { getAllSubjects } from '../utils/subjects';
import { BookOpen, Upload, FileText, Download, Sparkles, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const subjects = getAllSubjects();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/upload/${subjectId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with Animation */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
          <Sparkles className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-700">AI 기반 학습 도구</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
          학습 문제 생성기
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          한문, 중국어, 일본어 학습 자료를 업로드하고<br />
          AI가 생성한 맞춤형 문제로 효과적으로 학습하세요
        </p>
      </div>

      {/* How it works - Enhanced */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          사용 방법
        </h2>
        <p className="text-center text-gray-600 mb-12">
          4단계로 간편하게 학습 문제를 생성하세요
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 -z-10" />
          
          {[
            { icon: BookOpen, title: '과목 선택', desc: '학습할 언어를 선택합니다', step: 1 },
            { icon: Upload, title: '자료 업로드', desc: 'PDF, 이미지 또는 JSON 파일을 업로드합니다', step: 2 },
            { icon: FileText, title: 'AI 분석', desc: 'AI가 자동으로 문제를 생성합니다', step: 3 },
            { icon: Download, title: '결과 다운로드', desc: '생성된 문제를 검토하고 다운로드합니다', step: 4 },
          ].map(({ icon: Icon, title, desc, step }) => (
            <Card 
              key={step}
              padding="md" 
              hover
              className="group relative transition-all duration-300 hover:scale-105"
            >
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center mx-auto group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Subject Selection - Enhanced */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            과목 선택
          </h2>
          <p className="text-gray-600">
            학습하고 싶은 언어를 선택하세요
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {subjects.map((subject, index) => (
            <Card
              key={subject.id}
              hover
              padding="lg"
              onClick={() => handleSubjectSelect(subject.id)}
              onMouseEnter={() => setHoveredSubject(subject.id)}
              onMouseLeave={() => setHoveredSubject(null)}
              className={`relative cursor-pointer transition-all duration-300 ${
                hoveredSubject === subject.id ? 'ring-2 ring-primary-400 ring-offset-2' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Subject badge */}
              <div className="absolute -top-3 -right-3">
                <Badge variant="primary" rounded className="shadow-md">
                  {subject.name.en}
                </Badge>
              </div>

              <CardHeader>
                <div className={`text-6xl mb-4 text-center transition-transform duration-300 ${
                  hoveredSubject === subject.id ? 'scale-110' : 'scale-100'
                }`}>
                  {subject.icon}
                </div>
                <CardTitle className="text-center text-2xl">
                  {subject.name.ko}
                </CardTitle>
                <CardDescription className="text-center mt-2 text-base">
                  {subject.description.ko}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <ul className="space-y-3">
                  {subject.features.map((feature, idx) => (
                    <li 
                      key={idx} 
                      className="text-sm text-gray-700 flex items-start group/item"
                    >
                      <CheckCircle className="w-4 h-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <div className="mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className={`w-full transition-all duration-300 ${
                    hoveredSubject === subject.id ? 'shadow-lg' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectSelect(subject.id);
                  }}
                >
                  시작하기 →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section - Enhanced */}
      <div className="bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 rounded-3xl p-10 md:p-12 shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            주요 기능
          </h2>
          <p className="text-gray-600">
            강력한 AI 기술로 학습 효율을 극대화하세요
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: '과목별 맞춤 분석',
              desc: '한문, 중국어, 일본어 각 언어의 특성에 맞는 분석 제공',
              gradient: 'from-blue-500 to-cyan-500'
            },
            {
              title: '다양한 파일 형식 지원',
              desc: 'PDF, 이미지(JPG, PNG), JSON 파일 업로드 가능',
              gradient: 'from-purple-500 to-pink-500'
            },
            {
              title: 'AI 기반 문제 생성',
              desc: '자동으로 어휘, 문법, 독해 문제 생성',
              gradient: 'from-green-500 to-emerald-500'
            },
            {
              title: '편리한 편집 및 내보내기',
              desc: '생성된 문제를 수정하고 JSON 또는 PDF로 다운로드',
              gradient: 'from-orange-500 to-red-500'
            },
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="group flex items-start space-x-4 bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} text-white rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl shadow-xl text-white">
          <Sparkles className="w-8 h-8" />
          <p className="text-xl font-semibold">
            지금 바로 시작해보세요!
          </p>
          <p className="text-primary-100">
            위에서 과목을 선택하여 학습을 시작할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
