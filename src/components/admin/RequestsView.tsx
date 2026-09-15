import { useRef, useState } from 'react';

import { reviewCertificateRequest, useCertificateRequests } from '@/lib/api/admin';
import { generateIdempotencyKey } from '@/lib/idempotency-key';
import { Badge, Button, Card, TextField } from '@/components/shared/ui';

const STATUS_TONE = { pending: 'neutral', approved: 'primary', rejected: 'danger' } as const;

export function RequestsView({ accessToken }: { accessToken: string | null }) {
  const [statusFilter, setStatusFilter] = useState<'pending' | 'all'>('pending');
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);
  const { data, refetch } = useCertificateRequests(statusFilter, accessToken);

  // One idempotency key per pending request id, so a double-click or retry
  // on THAT request replays its result instead of double-applying (e.g.
  // double-deducting points on approval). Dropped once the review succeeds.
  const reviewKeys = useRef<Map<number, string>>(new Map());
  function getReviewKey(id: number) {
    let key = reviewKeys.current.get(id);
    if (!key) {
      key = generateIdempotencyKey();
      reviewKeys.current.set(id, key);
    }
    return key;
  }

  async function review(id: number, decision: 'approved' | 'rejected') {
    if (!accessToken) return;
    setBusyId(id);
    try {
      await reviewCertificateRequest(id, decision, notes[id]?.trim() || null, accessToken, getReviewKey(id));
      reviewKeys.current.delete(id);
      await refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to review request');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex w-fit overflow-hidden rounded-xl border border-border">
        {(['pending', 'all'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 text-sm font-medium capitalize ${statusFilter === s ? 'bg-primary text-on-primary' : 'text-text-secondary'}`}>
            {s}
          </button>
        ))}
      </div>

      {(data?.requests ?? []).length === 0 && <p className="text-sm text-text-secondary">No requests.</p>}

      <div className="flex flex-col gap-3">
        {(data?.requests ?? []).map((r) => (
          <div key={r.id} className="rounded-xl border border-bg-selected bg-bg-element p-4">
            <p className="font-semibold">{r.customer.email}</p>
            <p className="font-mono text-xs text-text-secondary">{r.customer.memberId}</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              {r.pointsCost} pts <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
              <span className="text-text-secondary">{new Date(r.createdAt).toLocaleDateString()}</span>
            </p>

            {r.status === 'pending' && (
              <div className="mt-3 flex flex-col gap-2">
                <TextField
                  value={notes[r.id] ?? ''}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Admin note (optional)"
                />
                <div className="flex gap-2">
                  <Button onClick={() => review(r.id, 'approved')} disabled={busyId === r.id} className="flex-1">
                    Approve
                  </Button>
                  <Button variant="danger" onClick={() => review(r.id, 'rejected')} disabled={busyId === r.id} className="flex-1">
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
