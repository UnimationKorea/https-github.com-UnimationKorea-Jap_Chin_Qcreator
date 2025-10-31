import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  FileUpload,
  Input,
  Modal,
  ModalFooter,
  Progress,
  CircularProgress,
  Select,
} from '../components/ui';
import { Search, Mail } from 'lucide-react';

export default function ComponentShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        UI 컴포넌트 쇼케이스
      </h1>

      <div className="space-y-12">
        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Buttons</h2>
          <Card>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="primary" loading>
                  Loading
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Button variant="primary" icon={<Search className="w-4 h-4" />}>
                  With Icon
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inputs</h2>
          <Card>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <Input
                  label="기본 입력"
                  placeholder="텍스트를 입력하세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="이메일"
                  type="email"
                  placeholder="email@example.com"
                  leftIcon={<Mail className="w-5 h-5" />}
                  helperText="이메일 주소를 입력하세요"
                />
                <Input
                  label="에러 상태"
                  placeholder="입력"
                  error="올바른 값을 입력해주세요"
                />
                <Input
                  label="비활성화"
                  placeholder="입력 불가"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Select */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select</h2>
          <Card>
            <CardContent>
              <div className="space-y-4 max-w-md">
                <Select
                  label="과목 선택"
                  placeholder="과목을 선택하세요"
                  value={selectValue}
                  onChange={(e) => setSelectValue(e.target.value)}
                  options={[
                    { value: 'hanmun', label: '한문' },
                    { value: 'chinese', label: '중국어' },
                    { value: 'japanese', label: '일본어' },
                  ]}
                  helperText="학습할 과목을 선택하세요"
                />
                <Select
                  label="에러 상태"
                  options={[{ value: '1', label: '옵션 1' }]}
                  error="선택이 필요합니다"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* File Upload */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            File Upload
          </h2>
          <Card>
            <CardContent>
              <FileUpload
                label="파일 업로드"
                accept=".pdf,.jpg,.png,.json"
                multiple
                maxSize={10}
                onFilesSelected={setFiles}
                helperText="PDF, JPG, PNG, JSON 파일을 업로드하세요"
              />
            </CardContent>
          </Card>
        </section>

        {/* Progress */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Progress</h2>
          <Card>
            <CardContent>
              <div className="space-y-6">
                <Progress value={30} label="기본" showLabel />
                <Progress value={60} color="success" label="성공" showLabel />
                <Progress value={80} color="warning" label="경고" showLabel />
                <Progress value={100} color="danger" label="위험" showLabel />
                <div className="flex gap-4 justify-center mt-8">
                  <CircularProgress value={30} />
                  <CircularProgress value={60} color="success" />
                  <CircularProgress value={100} color="warning" size={100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Badges</h2>
          <Card>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="primary" size="sm">
                  Small
                </Badge>
                <Badge variant="primary" size="lg">
                  Large
                </Badge>
                <Badge variant="primary" rounded>
                  Rounded
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Alerts</h2>
          <div className="space-y-4">
            <Alert variant="info" title="정보">
              이것은 정보 알림입니다.
            </Alert>
            <Alert variant="success" title="성공">
              작업이 성공적으로 완료되었습니다.
            </Alert>
            <Alert variant="warning" title="경고">
              주의가 필요한 상황입니다.
            </Alert>
            <Alert variant="error" title="오류" onClose={() => {}}>
              오류가 발생했습니다. 다시 시도해주세요.
            </Alert>
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modal</h2>
          <Card>
            <CardContent>
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                모달 열기
              </Button>
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="모달 제목"
                footer={
                  <ModalFooter
                    onCancel={() => setModalOpen(false)}
                    onConfirm={() => setModalOpen(false)}
                  />
                }
              >
                <p className="text-gray-700">
                  이것은 모달 컨텐츠입니다. 여기에 원하는 내용을 넣을 수
                  있습니다.
                </p>
              </Modal>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>기본 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">카드 컨텐츠가 들어갑니다.</p>
              </CardContent>
            </Card>
            <Card hover>
              <CardHeader>
                <CardTitle>Hover 효과</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  마우스를 올려보세요. hover 효과가 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
