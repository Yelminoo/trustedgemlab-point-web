import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { requestFreeCertificate, useMyCertificateRequests } from '@/lib/api/certificate-requests';
import { Badge, Button, ErrorText } from '@/components/shared/ui';

const STATUS_TONE = { pending: 'neutral', approved: 'primary', rejected: 'danger' } as const;

// A customer with enough points can request a free certificate; points are
// only deducted when an admin approves it (see Admin → Requests).
export function FreeCertificateRequestSection({ balance, cost, accessToken }: { balance: number; cost: number; accessToken: string }) {
  const { t } = useTranslation();
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
      setError(err instanceof Error ? err.message : t('common.somethingWrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-text-secondary">{t('freeReport.redeemFor', { cost: cost.toLocaleString() })}</p>

      {hasPending && <p className="text-sm text-text-secondary">{t('freeReport.pendingReview')}</p>}
      {!hasPending && balance < cost && (
        <p className="text-sm text-text-secondary">{t('freeReport.needMorePoints', { amount: (cost - balance).toLocaleString() })}</p>
      )}
      <ErrorText>{error}</ErrorText>

      <Button onClick={handleRequest} disabled={!canRequest || submitting} className="mt-1">
        {submitting ? t('freeReport.requesting') : t('freeReport.requestButton')}
      </Button>

      {requests.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {requests.map((r) => (
            <div key={r.id} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {new Date(r.createdAt).toLocaleDateString()} — {r.pointsCost} {t('home.pts')}
              </span>
              <Badge tone={STATUS_TONE[r.status]}>{t(`freeReport.status.${r.status}`)}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
