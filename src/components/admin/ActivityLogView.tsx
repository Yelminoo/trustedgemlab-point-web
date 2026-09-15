import { useActivityLog } from '@/lib/api/admin';
import { Badge, Card } from '@/components/shared/ui';

export function ActivityLogView({ accessToken }: { accessToken: string | null }) {
  const { data, isLoading } = useActivityLog(accessToken);
  const entries = data?.entries ?? [];

  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-text-secondary">A log of what you've done — points issued/deducted and requests you've reviewed.</p>

      {isLoading && <p className="text-sm text-text-secondary">Loading…</p>}
      {!isLoading && entries.length === 0 && <p className="text-sm text-text-secondary">No activity yet.</p>}

      <div className="flex flex-col divide-y divide-bg-selected">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{entry.member.email}</p>
              <p className="font-mono text-xs text-text-secondary">{entry.member.memberId}</p>
              <p className="text-sm text-text-secondary">
                {entry.kind === 'points'
                  ? entry.note
                  : `Free certificate request ${entry.status}${entry.adminNote ? ` — "${entry.adminNote}"` : ''}`}
              </p>
              <p className="text-xs text-text-secondary">{new Date(entry.createdAt).toLocaleString()}</p>
            </div>
            <Badge tone={entry.kind === 'points' ? (entry.type === 'credit' ? 'primary' : 'danger') : entry.status === 'approved' ? 'danger' : 'neutral'}>
              {entry.kind === 'points'
                ? `${entry.type === 'credit' ? '+' : '-'}${entry.amount}`
                : entry.status === 'approved'
                  ? `-${entry.pointsCost}`
                  : '—'}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
