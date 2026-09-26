import { QueryClientProvider } from '@tanstack/react-query';
import { navigate } from 'astro:transitions/client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { loginCustomer, registerCustomer } from '@/lib/api/auth';
import { AddressContent, TermsContent } from '@/components/account/StaticContent';
import { ChangeEmailSection } from '@/components/account/ChangeEmailSection';
import { ForgotPasswordFlow } from '@/components/account/ForgotPasswordFlow';
import { VerifyEmailBanner } from '@/components/account/VerifyEmailBanner';
import { Modal } from '@/components/shared/Modal';
import { Button, Card, Checkbox, ErrorText, TextField } from '@/components/shared/ui';
import { getQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/lib/stores/auth-store';

function AccountInner() {
  const { t } = useTranslation();
  const { customer, accessToken, hydrated, setSession, updateCustomer, logout } = useAuthStore();
  // The landing page's "Get Started" CTA links here with ?mode=register so
  // a new visitor lands straight on the signup form instead of login-first;
  // "Sign In" links here with no param, keeping the existing default.
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'register'
      ? 'register'
      : 'login'
  );
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dataConsent, setDataConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const canSubmitRegister = !!email && !!password && !!name.trim() && dataConsent;

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'login'
          ? await loginCustomer(email.trim(), password)
          : await registerCustomer(email.trim(), password, name.trim(), phone.trim() || null, dataConsent);
      setSession(result.customer, result.accessToken, result.refreshToken);
      setPassword('');
      // Landing into the dashboard right after signing in (rather than
      // staying on /account) matches what the gate does everywhere else —
      // /account itself stays reachable afterward from the nav for
      // profile/settings, it's just not where a fresh sign-in should land.
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="h-40" />;
  }

  return (
    <>
      {customer && accessToken ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-18 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-on-primary">
              {customer.email.charAt(0).toUpperCase()}
            </div>
            <p className="text-lg font-semibold">{customer.name ?? customer.email}</p>
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
              {t('account.address')}
            </button>
            <button onClick={() => setShowTerms(true)} className="block w-full p-4 text-left text-sm">
              {t('account.terms')}
            </button>
            <button onClick={() => logout()} className="block w-full p-4 text-center text-sm font-semibold text-danger">
              {t('account.logOut')}
            </button>
          </Card>
        </div>
      ) : (
        <div className="mx-auto max-w-md">
          <Card className="flex flex-col gap-3">
            {mode === 'forgot' ? (
              <ForgotPasswordFlow onBackToLogin={() => setMode('login')} />
            ) : (
              <>
                <p className="mb-1 text-sm text-text-secondary">
                  {mode === 'login' ? t('account.signInPrompt') : t('account.registerPrompt')}
                </p>
                {mode === 'register' && (
                  <TextField
                    label={t('account.nameLabel')}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('account.namePlaceholder')}
                    autoComplete="name"
                  />
                )}
                <TextField
                  label={t('account.emailLabel')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('account.emailPlaceholder')}
                  type="email"
                  autoComplete="email"
                />
                {mode === 'register' && (
                  <TextField
                    label={t('account.phoneLabel')}
                    optional
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('account.phonePlaceholder')}
                    type="tel"
                    autoComplete="tel"
                  />
                )}
                <TextField
                  label={t('account.passwordLabel')}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('account.passwordPlaceholder')}
                  type="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                {mode === 'register' && (
                  <Checkbox
                    checked={dataConsent}
                    onChange={setDataConsent}
                    label={
                      <>
                        {t('account.dataConsent')}{' '}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="font-medium text-primary underline underline-offset-2">
                          {t('account.terms')}
                        </button>
                      </>
                    }
                  />
                )}
                <ErrorText>{error}</ErrorText>
                <Button onClick={handleSubmit} disabled={loading || (mode === 'login' ? !email || !password : !canSubmitRegister)}>
                  {loading ? t('common.pleaseWait') : mode === 'login' ? t('account.signIn') : t('account.createAccount')}
                </Button>
                {mode === 'login' && (
                  <button onClick={() => setMode('forgot')} className="text-center text-sm font-medium text-primary">
                    {t('account.forgotPassword')}
                  </button>
                )}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-center text-sm font-medium text-primary">
                  {mode === 'login' ? t('account.noAccountSignUp') : t('account.haveAccountSignIn')}
                </button>
              </>
            )}
          </Card>
        </div>
      )}

      <Modal open={showAddress} onClose={() => setShowAddress(false)} title={t('account.address')}>
        <AddressContent />
      </Modal>
      <Modal open={showTerms} onClose={() => setShowTerms(false)} title={t('account.terms')}>
        <TermsContent />
      </Modal>
    </>
  );
}

export function AccountApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AccountInner />
    </QueryClientProvider>
  );
}
