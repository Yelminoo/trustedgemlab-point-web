import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

// Small shared primitives so every form/card across the app looks
// consistent without repeating Tailwind class strings everywhere. Kept
// deliberately minimal — this app doesn't need a full component library.

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-bg-element p-6 ${className}`}>{children}</div>;
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const base = 'rounded-xl px-4 py-2.5 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-pressed',
    secondary: 'bg-bg-selected text-text hover:opacity-80',
    danger: 'bg-danger text-white hover:opacity-90',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function TextField({ label, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
      <input
        className={`w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm text-text outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
        {...props}
      />
    </label>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-danger">{children}</p>;
}

export function SuccessText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="text-sm text-primary">{children}</p>;
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-label="Loading"
    />
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'primary' | 'danger' | 'success' }) {
  const tones = {
    neutral: 'bg-bg-selected text-text-secondary',
    primary: 'bg-primary/10 text-primary',
    danger: 'bg-danger/10 text-danger',
    success: 'bg-primary/10 text-primary',
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
