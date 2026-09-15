import { QueryClientProvider } from '@tanstack/react-query';

import { useWallet } from '@/lib/api/wallet';
import { FreeCertificateRequestSection } from '@/components/home/FreeCertificateRequestSection';
import { Card } from '@/components/shared/ui';
import { getQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/lib/stores/auth-store';

function RedeemInner() {
  const { customer, accessToken, hydrated } = useAuthStore();
  const { data: wallet } = useWallet(accessToken);

  if (!hydrated) return <div className="h-40" />;

  if (!customer || !accessToken) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <p className="mb-3 text-sm text-text-secondary">Sign in to redeem points for a free certificate.</p>
        <a href="/account" className="inline-block rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary">
          Go to Account
        </a>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-lg font-semibold">Free Gem Report</h1>
      {wallet ? (
        <FreeCertificateRequestSection balance={wallet.balance} cost={wallet.freeCertificateCost} accessToken={accessToken} />
      ) : (
        <p className="text-sm text-text-secondary">Loading…</p>
      )}
    </div>
  );
}

export function RedeemApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <RedeemInner />
    </QueryClientProvider>
  );
}
