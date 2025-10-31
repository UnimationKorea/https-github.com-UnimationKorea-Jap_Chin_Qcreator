import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubjectById } from '../utils/subjects';
import Card from '../components/ui/Card';
import Progress, { CircularProgress } from '../components/ui/Progress';
import { Loader2, CheckCircle, Sparkles } from 'lucide-react';

interface AnalysisStep {
  id: number;
  label: string;
  description: string;
  completed: boolean;
}

export default function AnalysisPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const subject = subjectId ? getSubjectById(subjectId) : null;
  
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { id: 1, label: '파일 처리', description: '텍스트 추출 및 전처리', completed: false },
    { id: 2, label: '내용 분석', description: '문법, 어휘 분석 진행', completed: false },
    { id: 3, label: '문제 생성', description: '다양한 유형의 문제 생성', completed: false },
    { id: 4, label: '결과 준비', description: '최종 검토 및 포맷팅', completed: false },
  ]);

  useEffect(() => {
    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // 완료 후 결과 페이지로 이동
          setTimeout(() => {
            navigate(`/results/${subjectId}/demo-result`);
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [navigate, subjectId]);

  useEffect(() => {
    // 단계별 업데이트
    const newCurrentStep = Math.floor(progress / 25);
    if (newCurrentStep !== currentStep && newCurrentStep <= 3) {
      setCurrentStep(newCurrentStep);
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: index < newCurrentStep
      })));
    }
  }, [progress, currentStep]);

  if (!subject) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-primary-600 animate-pulse" />
          <span className="text-sm font-medium text-primary-700">AI 분석 중</span>
        </div>
        <div className="text-5xl mb-4">{subject.icon}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {subject.name.ko} 자료 분석
        </h1>
        <p className="text-gray-600">
          AI가 업로드하신 자료를 분석하고 있습니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Circle */}
        <div className="lg:col-span-1">
          <Card padding="lg" className="text-center">
            <CircularProgress 
              value={progress} 
              size={160} 
              strokeWidth={12}
              color="primary"
            />
            <p className="text-sm text-gray-600 mt-4">분석 진행률</p>
          </Card>
        </div>

        {/* Analysis Steps */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              분석 단계
            </h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = index === currentStep && !step.completed;
                const isCompleted = step.completed;
                
                return (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                      ${isCompleted ? 'bg-green-500' : isActive ? 'bg-primary-600 animate-pulse' : 'bg-gray-300'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <span className="text-white font-semibold">{step.id}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className={`font-semibold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm ${isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                        {step.description}
                      </p>
                      
                      {isActive && (
                        <div className="mt-2">
                          <Progress 
                            value={(progress % 25) * 4} 
                            size="sm" 
                            color="primary"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-8">
        <Card padding="md">
          <Progress 
            value={progress} 
            label="전체 진행률" 
            showLabel 
            color="primary"
            size="lg"
          />
        </Card>
      </div>

      {/* Info Card */}
      <Card padding="md" className="mt-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              분석이 완료되면 자동으로 결과 페이지로 이동합니다
            </p>
            <p className="text-xs text-blue-700 mt-1">
              AI가 {subject.features.join(', ')} 등을 수행하고 있습니다
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
