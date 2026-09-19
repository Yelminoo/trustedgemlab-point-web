import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ApiError } from '@/lib/api/client';
import { useCertificateLookup, useMyCertificates } from '@/lib/api/certificates';
import { CertificateCard } from '@/components/shared/CertificateCard';
import { GateLoading } from '@/components/shared/GateLoading';
import { Button, TextField } from '@/components/shared/ui';
import { getQueryClient } from '@/lib/query-client';
import { useAuthGate } from '@/lib/use-auth-gate';

function CertificatesInner() {
  const { customer, accessToken, ready } = useAuthGate();
  const [certNo, setCertNo] = useState('');
  const [searched, setSearched] = useState('');
  const { data: found, error, isFetching } = useCertificateLookup(searched, accessToken);
  const { data: mine } = useMyCertificates(accessToken);
  const notFound = error instanceof ApiError && error.status === 404;

  if (!ready || !customer) return <GateLoading />;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8">
      <div>
        <h1 className="mb-3 text-lg font-semibold">Find a report</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(certNo.trim());
          }}
          className="flex gap-2">
          <div className="flex-1">
            <TextField value={certNo} onChange={(e) => setCertNo(e.target.value)} placeholder="Report number" />
          </div>
          <Button type="submit" disabled={!certNo.trim() || isFetching}>
            {isFetching ? '…' : 'Search'}
          </Button>
        </form>

        {searched && (
          <div className="mt-4">
            {notFound && <p className="text-sm text-danger">Report not found for "{searched}".</p>}
            {error && !notFound && <p className="text-sm text-danger">{error.message}</p>}
            {found && <CertificateCard certificate={found} />}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">My Reports</h2>
        {!mine ? (
          <p className="text-sm text-text-secondary">Loading…</p>
        ) : mine.certificates.length === 0 ? (
          <p className="text-sm text-text-secondary">No reports yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {mine.certificates.map((c) => (
              <CertificateCard key={c.id} certificate={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CertificatesApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <CertificatesInner />
    </QueryClientProvider>
  );
}
