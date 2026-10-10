import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomerUser } from '@/lib/api/auth';
import { VerifyEmailBanner } from '@/components/account/VerifyEmailBanner';
import { useAuthStore } from '@/lib/stores/auth-store';

// A real gate, not a nag — every page that calls useAuthGate() wraps its
// content in this right after the "signed in at all" check, so an
// unverified customer can't reach the dashboard/reports/redeem/admin by
// skipping past the banner (previously only /account showed the banner;
// everywhere else let them straight in regardless of isEmailVerified).
// Reuses VerifyEmailBanner as-is — it already carries the full
// send/resend/confirm flow, so an account that was abandoned mid-signup
// (or revisited later) lands on exactly the same "send code" starting
// point whether this is their first time here or a return visit; there is
// no separate resume state to track.
export function RequireVerifiedEmail({
  customer,
  accessToken,
  children,
}: {
  customer: CustomerUser;
  accessToken: string | null;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { updateCustomer, logout } = useAuthStore();

  if (customer.isEmailVerified) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-md">
      <VerifyEmailBanner
        email={customer.email}
        accessToken={accessToken as string}
        onVerified={() => updateCustomer({ isEmailVerified: true })}
      />
      <button onClick={() => logout()} className="mx-auto mt-4 block text-center text-sm text-text-secondary">
        {t('account.logOut')}
      </button>
    </div>
  );
}
