import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { confirmEmailVerification, requestEmailVerification } from '@/lib/api/account';
import { Button, Card, ErrorText, SuccessText, TextField } from '@/components/shared/ui';
import { useResendCooldown } from '@/lib/use-resend-cooldown';

// Shown whenever customer.isEmailVerified is false. Doesn't assume a code
// already arrived (registration fires one automatically server-side, but
// that's an implementation detail this UI shouldn't lean on — email
// delivery is fallible and separate from account state). Shows the real
// "not verified" status first, with an explicit "Send code" action; only
// after that's tapped does the code-entry step appear.
export function VerifyEmailBanner({
  email,
  accessToken,
  onVerified,
}: {
  email: string;
  accessToken: string;
  onVerified: () => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState<'status' | 'code'>('status');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const { remainingSeconds, canResend, startCooldown } = useResendCooldown();

  async function handleRequest() {
    if (step === 'code' && !canResend) return;
    setError('');
    setMessage('');
    setRequesting(true);
    try {
      const res = await requestEmailVerification(accessToken);
      setMessage(res.message ?? t('verifyEmail.codeResent'));
      setStep('code');
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setRequesting(false);
    }
  }

  async function handleConfirm() {
    setError('');
    setMessage('');
    setConfirming(true);
    try {
      await confirmEmailVerification(otp.trim(), accessToken);
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 text-center">
      <p className="font-semibold">{t('verifyEmail.title')}</p>
      <p className="text-sm text-text-secondary">
        {step === 'status' ? t('verifyEmail.statusUnverified', { email }) : t('verifyEmail.body', { email })}
      </p>

      {step === 'code' && (
        <TextField
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={t('changeEmail.codePlaceholder')}
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
        />
      )}

      <ErrorText>{error}</ErrorText>
      <SuccessText>{message}</SuccessText>

      {step === 'status' ? (
        <Button onClick={handleRequest} disabled={requesting}>
          {requesting ? t('common.pleaseWait') : t('verifyEmail.sendCode')}
        </Button>
      ) : (
        <>
          <Button onClick={handleConfirm} disabled={confirming || !otp}>
            {confirming ? t('common.pleaseWait') : t('verifyEmail.confirm')}
          </Button>
          <button
            onClick={handleRequest}
            disabled={requesting || !canResend}
            className="text-sm font-medium text-primary disabled:text-text-secondary">
            {requesting
              ? t('common.pleaseWait')
              : canResend
                ? t('verifyEmail.resendCode')
                : t('verifyEmail.resendCodeIn', { seconds: remainingSeconds })}
          </button>
        </>
      )}
    </Card>
  );
}
