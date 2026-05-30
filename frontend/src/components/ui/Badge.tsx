import type { ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
}: BadgeProps) {
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClass}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Dot Badge for notifications
export interface DotBadgeProps {
  count?: number;
  show?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  max?: number;
  className?: string;
}

const dotVariantClasses = {
  primary: 'bg-primary-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  danger: 'bg-red-600',
};

export function DotBadge({
  count,
  show = true,
  variant = 'danger',
  max = 99,
  className = '',
}: DotBadgeProps) {
  if (!show) return null;

  const displayCount = count !== undefined && count > max ? `${max}+` : count;

  return (
    <span
      className={`
        absolute -top-1 -right-1 flex items-center justify-center
        ${dotVariantClasses[variant]}
        ${count !== undefined ? 'min-w-[20px] h-5 px-1 rounded-full' : 'w-2 h-2 rounded-full'}
        text-white text-xs font-bold
        ${className}
      `}
    >
      {displayCount}
    </span>
  );
}
