import { useState } from 'react';

import { requestFreeCertificate, useMyCertificateRequests } from '@/lib/api/certificate-requests';
import { Badge, Button, ErrorText } from '@/components/shared/ui';

const STATUS_TONE = { pending: 'neutral', approved: 'primary', rejected: 'danger' } as const;

// A customer with enough points can request a free certificate; points are
// only deducted when an admin approves it (see Admin → Requests).
export function FreeCertificateRequestSection({ balance, cost, accessToken }: { balance: number; cost: number; accessToken: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { data, refetch } = useMyCertificateRequests(accessToken);

  const requests = data?.requests ?? [];
  const hasPending = requests.some((r) => r.status === 'pending');
  const canRequest = balance >= cost && !hasPending;

  async function handleRequest() {
    setError('');
    setSubmitting(true);
    try {
      await requestFreeCertificate(null, accessToken);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-secondary">Redeem {cost.toLocaleString()} pts for a free gem report</p>

      {hasPending && <p className="text-sm text-text-secondary">You already have a request pending review.</p>}
      {!hasPending && balance < cost && (
        <p className="text-sm text-text-secondary">You need {(cost - balance).toLocaleString()} more points to request one.</p>
      )}
      <ErrorText>{error}</ErrorText>

      <Button onClick={handleRequest} disabled={!canRequest || submitting} className="mt-1">
        {submitting ? 'Requesting…' : 'Request Free Report'}
      </Button>

      {requests.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {new Date(r.createdAt).toLocaleDateString()} — {r.pointsCost} pts
              </span>
              <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
