import { useRef, useState } from 'react';

import { issueMemberPoints, setMemberAdminStatus, useMemberDetail } from '@/lib/api/admin';
import { generateIdempotencyKey } from '@/lib/idempotency-key';
import { Badge, Button, Card, ErrorText, TextField } from '@/components/shared/ui';
import { useAuthStore } from '@/lib/stores/auth-store';

export function MemberDetail({ memberDbId, accessToken }: { memberDbId: number; accessToken: string | null }) {
  const currentCustomerId = useAuthStore((s) => s.customer?.id);
  const { data: detail, refetch } = useMemberDetail(memberDbId, accessToken);

  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminError, setAdminError] = useState('');

  // Tags this "attempt" at issuing points so a double-click or a retry after
  // a dropped response replays the same backend result instead of applying
  // the points twice — see withIdempotency() server-side. Reused across
  // retries of the same failed attempt; regenerated after a success.
  const pointsIdempotencyKey = useRef(generateIdempotencyKey());

  async function handleToggleAdmin() {
    if (!accessToken || !detail) return;
    const nextIsAdmin = !detail.isAdmin;
    const label = nextIsAdmin
      ? `${detail.email} will be able to sign in to the Admin area with their same email+password. Continue?`
      : `${detail.email} will lose Admin access immediately. Continue?`;
    if (!confirm(label)) return;

    setAdminError('');
    setAdminSubmitting(true);
    try {
      await setMemberAdminStatus(memberDbId, nextIsAdmin, accessToken);
      await refetch();
    } catch (err) {
      setAdminError(err instanceof Error ? err.message : 'Failed to update admin access');
    } finally {
      setAdminSubmitting(false);
    }
  }

  async function handleSubmit() {
    if (!accessToken) return;
    setError('');
    setSubmitting(true);
    try {
      await issueMemberPoints(memberDbId, type, Number(amount), note, accessToken, pointsIdempotencyKey.current);
      pointsIdempotencyKey.current = generateIdempotencyKey();
      setAmount('');
      setNote('');
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update points');
    } finally {
      setSubmitting(false);
    }
  }

  if (!detail) return null;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div>
          <p className="text-lg font-semibold">{detail.email}</p>
          <p className="font-mono text-sm text-text-secondary">{detail.memberId}</p>
        </div>
        <p className="font-mono text-xl font-semibold text-primary">{(detail.wallet?.balance ?? 0).toLocaleString()} pts</p>
        <p className="text-sm text-text-secondary">
          Lifetime earned: {(detail.wallet?.lifetimeEarned ?? 0).toLocaleString()} · Free report cost: {detail.effectiveFreeCertificateCost} pts
        </p>

        <div className="flex overflow-hidden rounded-xl border border-border">
          <button
            onClick={() => setType('credit')}
            className={`flex-1 py-2 text-sm font-medium ${type === 'credit' ? 'bg-primary text-on-primary' : 'text-text-secondary'}`}>
            Credit
          </button>
          <button
            onClick={() => setType('debit')}
            className={`flex-1 py-2 text-sm font-medium ${type === 'debit' ? 'bg-primary text-on-primary' : 'text-text-secondary'}`}>
            Debit
          </button>
        </div>

        <TextField value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" inputMode="numeric" />
        <TextField value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (required)" />

        <ErrorText>{error}</ErrorText>
        <Button onClick={handleSubmit} disabled={submitting || !amount || !note}>
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      </Card>

      <Card className="flex flex-col gap-2">
        <p className="font-semibold">Admin Access</p>
        <p className="text-sm text-text-secondary">
          {detail.isAdmin ? 'This member can sign in to the Admin area.' : "This member can't access the Admin area."}
        </p>
        <ErrorText>{adminError}</ErrorText>
        {currentCustomerId === detail.id ? (
          <p className="text-sm text-text-secondary">You can't remove your own admin access here.</p>
        ) : (
          <Button variant={detail.isAdmin ? 'danger' : 'primary'} onClick={handleToggleAdmin} disabled={adminSubmitting}>
            {adminSubmitting ? 'Updating…' : detail.isAdmin ? 'Revoke Admin Access' : 'Grant Admin Access'}
          </Button>
        )}
      </Card>

      {detail.wallet && detail.wallet.transactions.length > 0 && (
        <Card>
          <p className="mb-3 font-semibold">Member History</p>
          <div className="flex flex-col divide-y divide-bg-selected">
            {detail.wallet.transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between gap-3 py-2">
                <div>
                  <p className="text-sm">{t.note}</p>
                  <p className="text-xs text-text-secondary">{new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge tone={t.type === 'credit' ? 'primary' : 'danger'}>
                  {t.type === 'credit' ? '+' : '-'}
                  {t.amount}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
