import { useState } from 'react';

import { getMemberByMemberId, useMemberSearch } from '@/lib/api/admin';
import { MemberDetail } from '@/components/admin/MemberDetail';
import { QrScanner } from '@/components/shared/QrScanner';
import { Badge, Button, Card, ErrorText, TextField } from '@/components/shared/ui';

export function MembersView({ accessToken }: { accessToken: string | null }) {
  const [search, setSearch] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [selectedMemberDbId, setSelectedMemberDbId] = useState<number | null>(null);

  const { data: searchData, isFetching: searching } = useMemberSearch(search, accessToken);

  async function handleScan(memberId: string) {
    setScanning(false);
    setScanError(false);
    if (!accessToken) return;
    try {
      const result = await getMemberByMemberId(memberId, accessToken);
      const member = result.members[0];
      if (member) {
        setSelectedMemberDbId(member.id);
      } else {
        setScanError(true);
      }
    } catch {
      setScanError(true);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        {scanning ? (
          <>
            <QrScanner elementId="admin-member-scanner" onScan={handleScan} />
            <Button variant="secondary" onClick={() => setScanning(false)}>
              Cancel Scan
            </Button>
          </>
        ) : (
          <>
            <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by email or member ID…" />
            <Button onClick={() => setScanning(true)}>Scan Member QR</Button>
            <ErrorText>{scanError ? 'No member found for that code.' : ''}</ErrorText>
            {searching && <p className="text-sm text-text-secondary">Searching…</p>}
            <div className="flex flex-col divide-y divide-bg-selected">
              {(searchData?.members ?? []).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberDbId(m.id)}
                  className="flex items-center justify-between gap-3 py-2.5 text-left">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{m.email}</p>
                    <p className="font-mono text-xs text-text-secondary">{m.memberId}</p>
                  </div>
                  <Badge tone="primary">{m.wallet?.balance ?? 0} pts</Badge>
                </button>
              ))}
            </div>
          </>
        )}
      </Card>

      {selectedMemberDbId != null && <MemberDetail memberDbId={selectedMemberDbId} accessToken={accessToken} />}
    </div>
  );
}
