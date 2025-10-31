import type { Subject } from '../types/index.js';

export const SUBJECTS: Record<string, Subject> = {
  hanmun: {
    id: 'hanmun',
    name: {
      ko: '한문',
      en: 'Classical Chinese',
      zh: '汉文',
      ja: '漢文',
    },
    icon: '📜',
    description: {
      ko: '고전 한자 문헌 학습',
      en: 'Study classical Chinese texts',
      zh: '学习古典汉字文献',
      ja: '古典漢字文献の学習',
    },
    features: [
      '원문 해석',
      '한자 음훈 분석',
      '문법 구조 파악',
    ],
    color: '#8B4513',
  },
  chinese: {
    id: 'chinese',
    name: {
      ko: '중국어',
      en: 'Chinese',
      zh: '中文',
      ja: '中国語',
    },
    icon: '🇨🇳',
    description: {
      ko: '현대 중국어 학습',
      en: 'Learn modern Chinese',
      zh: '学习现代汉语',
      ja: '現代中国語の学習',
    },
    features: [
      '병음 분석',
      '성조 표기',
      'HSK 등급 평가',
    ],
    color: '#DC143C',
  },
  japanese: {
    id: 'japanese',
    name: {
      ko: '일본어',
      en: 'Japanese',
      zh: '日语',
      ja: '日本語',
    },
    icon: '🇯🇵',
    description: {
      ko: '현대 일본어 학습',
      en: 'Learn modern Japanese',
      zh: '学习现代日语',
      ja: '現代日本語の学習',
    },
    features: [
      '문법 분석',
      '한자 읽기',
      'JLPT 등급 평가',
    ],
    color: '#3B82F6',
  },
};

export const getSubject = (id: string): Subject | undefined => {
  return SUBJECTS[id];
};

export const getSubjectById = (id: string): Subject | undefined => {
  return SUBJECTS[id];
};

export const getAllSubjects = (): Subject[] => {
  return Object.values(SUBJECTS);
};
