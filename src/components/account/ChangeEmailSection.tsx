import { useState } from 'react';

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
      setMessage(res.message ?? 'Check your new email for a code.');
      setStep('confirm');
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
      setMessage(res.message ?? 'Check your new email for a code.');
      startCooldown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
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
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm font-medium text-primary">
        Change Email
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {step === 'request' ? (
        <TextField
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="New email"
          type="email"
          autoComplete="email"
        />
      ) : (
        <>
          <p className="text-sm text-text-secondary">{message}</p>
          <TextField
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <button
            onClick={handleResend}
            disabled={resending || !canResend}
            className="text-center text-sm font-medium text-primary disabled:text-text-secondary">
            {resending ? 'Please wait…' : canResend ? 'Resend code' : `Resend code in ${remainingSeconds}s`}
          </button>
        </>
      )}

      <ErrorText>{error}</ErrorText>

      <Button onClick={step === 'request' ? handleRequest : handleConfirm} disabled={loading || (step === 'request' ? !newEmail : !otp)}>
        {loading ? 'Please wait…' : step === 'request' ? 'Send Code' : 'Confirm'}
      </Button>

      <button onClick={() => setOpen(false)} className="text-center text-sm font-medium text-text-secondary">
        Cancel
      </button>
    </div>
  );
}
