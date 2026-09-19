import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ApiError } from '@/lib/api/client';
import { useCertificateLookup } from '@/lib/api/certificates';
import { useWallet } from '@/lib/api/wallet';
import { CertificateCard } from '@/components/shared/CertificateCard';
import { FreeCertificateRequestSection } from '@/components/home/FreeCertificateRequestSection';
import { MemberCard } from '@/components/home/MemberCard';
import { GateLoading } from '@/components/shared/GateLoading';
import { QrScanner } from '@/components/shared/QrScanner';
import { Button } from '@/components/shared/ui';
import { getQueryClient } from '@/lib/query-client';
import { useAuthGate } from '@/lib/use-auth-gate';

type View = 'dashboard' | 'scan' | 'card' | 'redeem';

function HomeInner() {
  const { customer, accessToken, ready } = useAuthGate();
  const [view, setView] = useState<View>('dashboard');
  const { data: wallet } = useWallet(accessToken);

  if (!ready || !customer) return <GateLoading />;

  if (view !== 'dashboard') {
    const titles: Record<Exclude<View, 'dashboard'>, string> = { scan: 'Scan QR', card: 'Member Card', redeem: 'Free GEM Report' };
    return (
      <div className="mx-auto max-w-md">
        <button onClick={() => setView('dashboard')} className="mb-4 flex items-center gap-1 text-sm font-medium text-text-secondary">
          ← Home
        </button>
        <h1 className="mb-4 text-lg font-semibold">{titles[view]}</h1>
        {view === 'scan' && <ScanView accessToken={accessToken} />}
        {view === 'card' && <MemberCard customerId={customer.id} email={customer.email} size="full" />}
        {view === 'redeem' && wallet && accessToken && (
          <FreeCertificateRequestSection balance={wallet.balance} cost={wallet.freeCertificateCost} accessToken={accessToken} />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div className="flex items-center gap-3">
        <a href="/account" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-on-primary">
          {customer.email.charAt(0).toUpperCase()}
        </a>
        <div>
          <p className="text-sm text-text-secondary">Trusted</p>
          <p className="font-mono text-xl font-semibold text-primary">{(wallet?.balance ?? 0).toLocaleString()} pts</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setView('scan')} className="flex flex-col items-center gap-2 rounded-2xl bg-bg-element p-5 hover:opacity-80">
          <QrIcon />
          <span className="text-sm font-medium">Scan QR</span>
        </button>
        <button onClick={() => setView('redeem')} className="flex flex-col items-center gap-2 rounded-2xl bg-bg-element p-5 hover:opacity-80">
          <GiftIcon />
          <span className="text-sm font-medium">Free Gem Report</span>
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">My Card</p>
        <button onClick={() => setView('card')} className="block w-full text-left">
          <MemberCard customerId={customer.id} email={customer.email} size="compact" />
        </button>
      </div>

      {wallet && wallet.transactions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Recent Activity</p>
          <div className="flex flex-col gap-2">
            {wallet.transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between text-sm">
                <span>{tx.note}</span>
                <span className={`font-semibold ${tx.type === 'credit' ? 'text-primary' : 'text-danger'}`}>
                  {tx.type === 'credit' ? '+' : '-'}
                  {tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ScanView({ accessToken }: { accessToken: string | null }) {
  const [scannedCertNo, setScannedCertNo] = useState('');
  const { data: certificate, error } = useCertificateLookup(scannedCertNo, accessToken);
  const notFound = error instanceof ApiError && error.status === 404;

  if (!scannedCertNo) {
    return <QrScanner elementId="home-cert-scanner" onScan={setScannedCertNo} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {notFound && <p className="text-center text-sm text-danger">Certificate not found for scanned code "{scannedCertNo}".</p>}
      {error && !notFound && <p className="text-center text-sm text-danger">{error.message}</p>}
      {certificate && <p className="text-center text-sm font-semibold text-primary">✓ This certificate is yours</p>}
      {certificate && <CertificateCard certificate={certificate} />}
      <Button onClick={() => setScannedCertNo('')}>Scan Another</Button>
    </div>
  );
}

function QrIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM19 14h2M14 19h2M19 19h2" strokeLinecap="round" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7C10 7 8 5.5 8 4a2 2 0 0 1 4 0c0-1.5 2-3 4-3a2.5 2.5 0 0 1 0 5c-1 1-4 1-4 1z" />
    </svg>
  );
}

export function HomeApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <HomeInner />
    </QueryClientProvider>
  );
}
