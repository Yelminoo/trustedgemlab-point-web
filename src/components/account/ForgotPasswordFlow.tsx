import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { confirmPasswordReset, requestPasswordReset } from '@/lib/api/account';
import { Button, ErrorText, TextField } from '@/components/shared/ui';
import { useResendCooldown } from '@/lib/use-resend-cooldown';

export function ForgotPasswordFlow({ onBackToLogin }: { onBackToLogin: () => void }) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { remainingSeconds, canResend, startCooldown } = useResendCooldown();

  async function handleRequest() {
    setError('');
    setLoading(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setMessage(res.message ?? t('forgotPassword.checkEmailForCode'));
      setStep('confirm');
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!canResend) return;
    setError('');
    setResending(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setMessage(res.message ?? t('forgotPassword.checkEmailForCode'));
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setResending(false);
    }
  }

  async function handleConfirm() {
    setError('');
    setLoading(true);
    try {
      await confirmPasswordReset(email.trim(), otp.trim(), newPassword);
      onBackToLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">{step === 'request' ? t('forgotPassword.resetYourPassword') : message}</p>

      {step === 'request' ? (
        <TextField
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('account.emailPlaceholder')}
          type="email"
          autoComplete="email"
        />
      ) : (
        <>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t('changeEmail.codePlaceholder')}
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <TextField
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('forgotPassword.newPasswordPlaceholder')}
            type="password"
            autoComplete="new-password"
          />
          <button
            onClick={handleResend}
            disabled={resending || !canResend}
            className="text-center text-sm font-medium text-primary disabled:text-text-secondary">
            {resending
              ? t('common.pleaseWait')
              : canResend
                ? t('verifyEmail.resendCode')
                : t('verifyEmail.resendCodeIn', { seconds: remainingSeconds })}
          </button>
        </>
      )}

      <ErrorText>{error}</ErrorText>

      <Button
        onClick={step === 'request' ? handleRequest : handleConfirm}
        disabled={loading || (step === 'request' ? !email : !otp || !newPassword)}>
        {loading ? t('common.pleaseWait') : step === 'request' ? t('forgotPassword.sendCode') : t('forgotPassword.resetPassword')}
      </Button>

      <button onClick={onBackToLogin} className="text-center text-sm font-medium text-primary">
        {t('forgotPassword.backToSignIn')}
      </button>
    </div>
  );
}
