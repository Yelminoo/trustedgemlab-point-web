import { useQuery } from '@tanstack/react-query';

import { apiGetAuth, apiMutateAuth } from '@/lib/api/client';

export interface Member {
  id: number;
  email: string;
  memberId: string;
  createdAt: string;
  isAdmin: boolean;
  wallet: { balance: number; lifetimeEarned: number } | null;
}

export interface MemberTransaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export interface MemberDetail {
  id: number;
  email: string;
  memberId: string;
  freeCertificateCost: number | null;
  effectiveFreeCertificateCost: number;
  isAdmin: boolean;
  wallet: { balance: number; lifetimeEarned: number; transactions: MemberTransaction[] } | null;
}

export interface CertificateRequestItem {
  id: number;
  pointsCost: number;
  status: 'pending' | 'approved' | 'rejected';
  customerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  customer: { id: number; email: string; memberId: string };
}

export function useMemberSearch(query: string, accessToken: string | null) {
  return useQuery<{ members: Member[] }>({
    queryKey: ['admin-members', query, accessToken],
    queryFn: () => apiGetAuth(`/admin/members?search=${encodeURIComponent(query)}`, accessToken as string),
    enabled: !!accessToken && query.length > 0,
  });
}

// Plain async lookup (not a query hook) for the QR-scan flow — a one-shot
// "scan, then act" sequence, not something that benefits from a
// cached/reactive query.
export function getMemberByMemberId(memberId: string, accessToken: string): Promise<{ members: Member[] }> {
  return apiGetAuth(`/admin/members?memberId=${encodeURIComponent(memberId)}`, accessToken);
}

export function useMemberDetail(memberDbId: number | null, accessToken: string | null) {
  return useQuery<MemberDetail>({
    queryKey: ['admin-member-detail', memberDbId, accessToken],
    queryFn: () => apiGetAuth(`/admin/members/${memberDbId}`, accessToken as string),
    enabled: !!accessToken && memberDbId != null,
  });
}

// Grants/revokes admin access through the member's SAME customer session.
// Any staff session can flip this for any other member; the backend blocks
// flipping your own off.
export function setMemberAdminStatus(memberDbId: number, isAdmin: boolean, accessToken: string) {
  return apiMutateAuth('PATCH', `/admin/members/${memberDbId}/admin-status`, { isAdmin }, accessToken) as Promise<{
    customer: { id: number; email: string; isAdmin: boolean; memberId: string };
  }>;
}

// idempotencyKey prevents a double-click (or a retried request) from
// applying the same points change twice — see withIdempotency() in the
// backend. Reuse the same key across retries of one failed attempt, and
// generate a new one after a success.
export function issueMemberPoints(
  memberDbId: number,
  type: 'credit' | 'debit',
  amount: number,
  note: string,
  accessToken: string,
  idempotencyKey: string
) {
  return apiMutateAuth('POST', `/admin/members/${memberDbId}/points`, { type, amount, note }, accessToken, {
    'Idempotency-Key': idempotencyKey,
  });
}

export function useCertificateRequests(status: 'pending' | 'all', accessToken: string | null) {
  return useQuery<{ requests: CertificateRequestItem[] }>({
    queryKey: ['admin-certificate-requests', status, accessToken],
    queryFn: () =>
      apiGetAuth(`/admin/certificate-requests${status === 'pending' ? '?status=pending' : ''}`, accessToken as string),
    enabled: !!accessToken,
  });
}

export function reviewCertificateRequest(
  requestId: number,
  decision: 'approved' | 'rejected',
  adminNote: string | null,
  accessToken: string,
  idempotencyKey: string
) {
  return apiMutateAuth('PATCH', `/admin/certificate-requests/${requestId}`, { decision, adminNote }, accessToken, {
    'Idempotency-Key': idempotencyKey,
  });
}

// Sends one push notification to every customer device that's ever
// registered for push (via the mobile app) — for announcing something new
// (a feature, a promotion) to the whole customer base.
export function broadcastNotification(title: string, body: string, accessToken: string) {
  return apiMutateAuth('POST', '/admin/notifications/broadcast', { title, body }, accessToken) as Promise<{
    sent: number;
  }>;
}

export interface ActivityLogEntry {
  id: string;
  kind: 'points' | 'certificate_request';
  type?: 'credit' | 'debit';
  amount?: number;
  note?: string;
  status?: 'approved' | 'rejected';
  pointsCost?: number;
  adminNote?: string | null;
  member: { id: number; email: string; memberId: string };
  createdAt: string;
}

// A log of what THIS admin has done — points issued/deducted and requests
// reviewed. Read-only.
export function useActivityLog(accessToken: string | null) {
  return useQuery<{ entries: ActivityLogEntry[] }>({
    queryKey: ['admin-activity-log', accessToken],
    queryFn: () => apiGetAuth('/admin/activity-log', accessToken as string),
    enabled: !!accessToken,
  });
}
