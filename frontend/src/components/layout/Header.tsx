import { BookOpen, Languages } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export default function Header({ currentLanguage = 'ko', onLanguageChange }: HeaderProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
  ];

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">학습 문제 생성기</h1>
              <p className="text-xs text-gray-500">AI-Powered Learning Tool</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Languages className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {currentLang.flag} {currentLang.name}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange?.(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      lang.code === currentLanguage ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
