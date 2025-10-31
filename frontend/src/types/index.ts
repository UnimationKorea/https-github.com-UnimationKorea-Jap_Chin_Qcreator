// Subject types
export type SubjectId = 'hanmun' | 'chinese' | 'japanese';

export interface Subject {
  id: SubjectId;
  name: {
    ko: string;
    en: string;
    zh: string;
    ja: string;
  };
  icon: string;
  description: {
    ko: string;
    en: string;
    zh: string;
    ja: string;
  };
  features: string[];
  color: string;
}

// File upload types
export interface UploadFile {
  file: File;
  preview?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Analysis types
export interface AnalysisStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export interface AnalysisResult {
  id: string;
  subject: SubjectId;
  title: string;
  pages: PageContent[];
  vocabulary: VocabularyItem[];
  grammar?: GrammarPoint[];
  exercises: Exercise[];
  createdAt: string;
}

export interface PageContent {
  pageNumber: number;
  originalText: string;
  translation?: string;
  additionalData?: Record<string, any>;
}

export interface VocabularyItem {
  word: string;
  reading?: string;
  meaning: string;
  partOfSpeech?: string;
  level?: string;
}

export interface GrammarPoint {
  pattern: string;
  explanation: string;
  examples: string[];
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching' | 'translation';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

// App state types
export interface AppState {
  currentStep: 'subject' | 'upload' | 'analysis' | 'result';
  selectedSubject: SubjectId | null;
  uploadedFile: File | null;
  analysisId: string | null;
  result: AnalysisResult | null;
}

// Language type
export type Language = 'ko' | 'en' | 'zh' | 'ja';
