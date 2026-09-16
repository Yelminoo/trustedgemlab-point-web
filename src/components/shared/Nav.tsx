import { useState } from 'react';

import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { useAuthStore } from '@/lib/stores/auth-store';

const links = [
  { href: '/', label: 'Home' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/redeem', label: 'Redeem' },
];

export function Nav() {
  const { customer, hydrated, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const isAdmin = customer?.isAdmin ?? false;

  return (
    <header className="sticky top-0 z-40 border-b border-bg-selected bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="/" className="flex items-baseline gap-1.5">
          <span className="font-mono text-lg font-bold text-primary">Trusted</span>
          <span className="text-xs text-text-secondary">Gemological Laboratory</span>
        </a>

        <nav className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-text-secondary hover:text-text">
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <a href="/admin" className="text-sm font-medium text-text-secondary hover:text-text">
              Admin
            </a>
          )}
          {!hydrated ? null : customer ? (
            <div className="flex items-center gap-3">
              <a href="/account" className="text-sm font-medium text-text-secondary hover:text-text">
                {customer.email}
              </a>
              <button
                onClick={() => logout()}
                className="rounded-lg bg-bg-selected px-3 py-1.5 text-sm font-medium text-text hover:opacity-80">
                Log Out
              </button>
            </div>
          ) : (
            <a
              href="/account"
              className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-pressed">
              Sign In
            </a>
          )}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-1 sm:hidden">
          <ThemeToggle />
          <button className="rounded-lg p-2 text-text" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-bg-selected px-4 py-3 sm:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg px-2 py-2 text-sm font-medium text-text hover:bg-bg-element">
              {l.label}
            </a>
          ))}
          {isAdmin && (
            <a href="/admin" className="rounded-lg px-2 py-2 text-sm font-medium text-text hover:bg-bg-element">
              Admin
            </a>
          )}
          {hydrated && customer ? (
            <>
              <a href="/account" className="rounded-lg px-2 py-2 text-sm font-medium text-text hover:bg-bg-element">
                {customer.email}
              </a>
              <button onClick={() => logout()} className="rounded-lg px-2 py-2 text-left text-sm font-medium text-text hover:bg-bg-element">
                Log Out
              </button>
            </>
          ) : hydrated ? (
            <a href="/account" className="rounded-lg px-2 py-2 text-sm font-medium text-primary">
              Sign In
            </a>
          ) : null}
        </nav>
      )}
    </header>
  );
}
