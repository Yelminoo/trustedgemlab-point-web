import { QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useWallet } from '@/lib/api/wallet';
import { FreeCertificateRequestSection } from '@/components/home/FreeCertificateRequestSection';
import { GateLoading } from '@/components/shared/GateLoading';
import { getQueryClient } from '@/lib/query-client';
import { useAuthGate } from '@/lib/use-auth-gate';

function RedeemInner() {
  const { t } = useTranslation();
  const { customer, accessToken, ready } = useAuthGate();
  const { data: wallet } = useWallet(accessToken);

  if (!ready || !customer || !accessToken) return <GateLoading />;

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-4 text-lg font-semibold">{t('home.freeGemReport')}</h1>
      {wallet ? (
        <FreeCertificateRequestSection balance={wallet.balance} cost={wallet.freeCertificateCost} accessToken={accessToken} />
      ) : (
        <p className="text-sm text-text-secondary">{t('reports.loading')}</p>
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
