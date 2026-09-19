import { QueryClientProvider } from '@tanstack/react-query';
import { navigate } from 'astro:transitions/client';
import { useState } from 'react';

import { loginCustomer, registerCustomer } from '@/lib/api/auth';
import { AddressContent, TermsContent } from '@/components/account/StaticContent';
import { ChangeEmailSection } from '@/components/account/ChangeEmailSection';
import { ForgotPasswordFlow } from '@/components/account/ForgotPasswordFlow';
import { VerifyEmailBanner } from '@/components/account/VerifyEmailBanner';
import { Modal } from '@/components/shared/Modal';
import { Button, Card, ErrorText, TextField } from '@/components/shared/ui';
import { getQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/lib/stores/auth-store';

function AccountInner() {
  const { customer, accessToken, hydrated, setSession, updateCustomer, logout } = useAuthStore();
  // The landing page's "Get Started" CTA links here with ?mode=register so
  // a new visitor lands straight on the signup form instead of login-first;
  // "Sign In" links here with no param, keeping the existing default.
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'register'
      ? 'register'
      : 'login'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login' ? await loginCustomer(email.trim(), password) : await registerCustomer(email.trim(), password);
      setSession(result.customer, result.accessToken);
      setPassword('');
      // Landing into the dashboard right after signing in (rather than
      // staying on /account) matches what the gate does everywhere else —
      // /account itself stays reachable afterward from the nav for
      // profile/settings, it's just not where a fresh sign-in should land.
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="h-40" />;
  }

  if (customer && accessToken) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-18 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-on-primary">
            {customer.email.charAt(0).toUpperCase()}
          </div>
          <p className="text-lg font-semibold">{customer.email}</p>
        </div>

        {!customer.isEmailVerified && (
          <VerifyEmailBanner
            email={customer.email}
            accessToken={accessToken}
            onVerified={() => updateCustomer({ isEmailVerified: true })}
          />
        )}

        <Card className="w-full divide-y divide-bg-selected p-0">
          <div className="p-4">
            <ChangeEmailSection
              accessToken={accessToken}
              onEmailChanged={(newEmail) => updateCustomer({ email: newEmail, isEmailVerified: true })}
            />
          </div>
          <button onClick={() => setShowAddress(true)} className="block w-full p-4 text-left text-sm">
            Location & Contact
          </button>
          <button onClick={() => setShowTerms(true)} className="block w-full p-4 text-left text-sm">
            Terms & Conditions
          </button>
          <button onClick={() => logout()} className="block w-full p-4 text-center text-sm font-semibold text-danger">
            Log Out
          </button>
        </Card>

        <Modal open={showAddress} onClose={() => setShowAddress(false)} title="Location & Contact">
          <AddressContent />
        </Modal>
        <Modal open={showTerms} onClose={() => setShowTerms(false)} title="Terms & Conditions">
          <TermsContent />
        </Modal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <Card className="flex flex-col gap-3">
        {mode === 'forgot' ? (
          <ForgotPasswordFlow onBackToLogin={() => setMode('login')} />
        ) : (
          <>
            <p className="mb-1 text-sm text-text-secondary">
              {mode === 'login' ? 'Sign in to see your points' : 'Create an account to start earning points'}
            </p>
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" />
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            <ErrorText>{error}</ErrorText>
            <Button onClick={handleSubmit} disabled={loading || !email || !password}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
            {mode === 'login' && (
              <button onClick={() => setMode('forgot')} className="text-center text-sm font-medium text-primary">
                Forgot password?
              </button>
            )}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-center text-sm font-medium text-primary">
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </>
        )}
      </Card>
    </div>
  );
}

export function AccountApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AccountInner />
    </QueryClientProvider>
  );
}
