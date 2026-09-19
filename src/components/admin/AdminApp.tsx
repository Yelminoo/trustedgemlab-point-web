import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ActivityLogView } from '@/components/admin/ActivityLogView';
import { MembersView } from '@/components/admin/MembersView';
import { NotifyView } from '@/components/admin/NotifyView';
import { RequestsView } from '@/components/admin/RequestsView';
import { GateLoading } from '@/components/shared/GateLoading';
import { getQueryClient } from '@/lib/query-client';
import { useAuthGate } from '@/lib/use-auth-gate';

type View = 'members' | 'requests' | 'activity' | 'notify';
const TABS: { key: View; label: string }[] = [
  { key: 'members', label: 'Members' },
  { key: 'requests', label: 'Requests' },
  { key: 'activity', label: 'Activity' },
  { key: 'notify', label: 'Notify' },
];

function AdminInner() {
  const { customer, accessToken, ready } = useAuthGate();
  const [view, setView] = useState<View>('members');

  if (!ready || !customer) return <GateLoading />;

  // Signed in, but not an admin — this is an authorization message, not a
  // redirect: unlike "not signed in at all" (handled by useAuthGate above),
  // this person IS legitimately signed in, just not for this page.
  if (!customer.isAdmin) {
    return <p className="text-center text-sm text-text-secondary">This isn't available on your account.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit overflow-hidden rounded-xl border border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`px-4 py-1.5 text-sm font-medium ${view === tab.key ? 'bg-primary text-on-primary' : 'text-text-secondary'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'members' && <MembersView accessToken={accessToken} />}
      {view === 'requests' && <RequestsView accessToken={accessToken} />}
      {view === 'activity' && <ActivityLogView accessToken={accessToken} />}
      {view === 'notify' && <NotifyView accessToken={accessToken} />}
    </div>
  );
}

export function AdminApp() {
  return (
    <QueryClientProvider client={getQueryClient()}>
      <AdminInner />
    </QueryClientProvider>
  );
}
