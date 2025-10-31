import { Github, Mail, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              학습 문제 생성기
            </h3>
            <p className="text-sm text-gray-600">
              한문, 중국어, 일본어 학습을 위한 AI 기반 문제 생성 플랫폼
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Help
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Contact
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:contact@example.com"
                className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                contact@example.com
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
              <a
                href="https://example.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                <Globe className="w-4 h-4 mr-2" />
                Website
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} Learning Quiz Generator. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
