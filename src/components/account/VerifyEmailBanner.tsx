import { useState } from 'react';

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
      setMessage(res.message ?? 'A new code has been sent.');
      setStep('code');
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setConfirming(false);
    }
  }

  return (
    <Card className="flex flex-col gap-3 text-center">
      <p className="font-semibold">Verify your email</p>
      <p className="text-sm text-text-secondary">
        {step === 'status' ? `${email} isn't verified yet.` : `Enter the code we sent to ${email}.`}
      </p>

      {step === 'code' && (
        <TextField
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          inputMode="numeric"
          maxLength={6}
          autoComplete="one-time-code"
        />
      )}

      <ErrorText>{error}</ErrorText>
      <SuccessText>{message}</SuccessText>

      {step === 'status' ? (
        <Button onClick={handleRequest} disabled={requesting}>
          {requesting ? 'Please wait…' : 'Send verification code'}
        </Button>
      ) : (
        <>
          <Button onClick={handleConfirm} disabled={confirming || !otp}>
            {confirming ? 'Please wait…' : 'Verify'}
          </Button>
          <button
            onClick={handleRequest}
            disabled={requesting || !canResend}
            className="text-sm font-medium text-primary disabled:text-text-secondary">
            {requesting ? 'Please wait…' : canResend ? 'Resend code' : `Resend code in ${remainingSeconds}s`}
          </button>
        </>
      )}
    </Card>
  );
}
