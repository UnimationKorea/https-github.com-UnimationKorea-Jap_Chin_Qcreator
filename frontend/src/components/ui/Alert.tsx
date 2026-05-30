import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantConfig = {
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-800',
    IconComponent: Info,
  },
  success: {
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    title: 'text-green-900',
    text: 'text-green-800',
    IconComponent: CheckCircle,
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    text: 'text-yellow-800',
    IconComponent: AlertCircle,
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    title: 'text-red-900',
    text: 'text-red-800',
    IconComponent: XCircle,
  },
};

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
}: AlertProps) {
  const config = variantConfig[variant];
  const IconComponent = config.IconComponent;

  return (
    <div
      className={`
        flex gap-3 p-4 rounded-lg border
        ${config.container}
        ${className}
      `}
      role="alert"
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${config.icon}`} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-semibold mb-1 ${config.title}`}>{title}</h4>
        )}
        <div className={`text-sm ${config.text}`}>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.icon} hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
