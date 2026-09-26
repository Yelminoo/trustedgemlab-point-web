import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { confirmEmailChange, requestEmailChange } from '@/lib/api/account';
import { Button, ErrorText, TextField } from '@/components/shared/ui';
import { useResendCooldown } from '@/lib/use-resend-cooldown';

export function ChangeEmailSection({
  accessToken,
  onEmailChanged,
}: {
  accessToken: string;
  onEmailChanged: (newEmail: string) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const { remainingSeconds, canResend, startCooldown } = useResendCooldown();

  async function handleRequest() {
    setError('');
    setLoading(true);
    try {
      const res = await requestEmailChange(newEmail.trim(), accessToken);
      setMessage(res.message ?? t('changeEmail.checkNewEmail'));
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
      const res = await requestEmailChange(newEmail.trim(), accessToken);
      setMessage(res.message ?? t('changeEmail.checkNewEmail'));
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
      const res = await confirmEmailChange(otp.trim(), accessToken);
      onEmailChanged(res.customer.email);
      setOpen(false);
      setStep('request');
      setNewEmail('');
      setOtp('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-medium text-primary">
        {t('changeEmail.changeEmail')}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {step === 'request' ? (
        <TextField
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder={t('changeEmail.newEmailPlaceholder')}
          type="email"
          autoComplete="email"
        />
      ) : (
        <>
          <p className="text-sm text-text-secondary">{message}</p>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={t('changeEmail.codePlaceholder')}
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
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

      <Button onClick={step === 'request' ? handleRequest : handleConfirm} disabled={loading || (step === 'request' ? !newEmail : !otp)}>
        {loading ? t('common.pleaseWait') : step === 'request' ? t('changeEmail.sendCode') : t('changeEmail.confirm')}
      </Button>

      <button onClick={() => setOpen(false)} className="text-center text-sm font-medium text-text-secondary">
        {t('common.cancel')}
      </button>
    </div>
  );
}
