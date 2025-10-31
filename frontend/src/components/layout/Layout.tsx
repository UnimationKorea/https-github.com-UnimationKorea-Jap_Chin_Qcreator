import { ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [language, setLanguage] = useState<'ko' | 'en' | 'zh' | 'ja'>('ko');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header currentLanguage={language} onLanguageChange={setLanguage} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
