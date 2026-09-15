import { useQuery } from '@tanstack/react-query';

import { apiGetAuth, apiMutateAuth } from '@/lib/api/client';

export interface CertificateRequestItem {
  id: number;
  pointsCost: number;
  status: 'pending' | 'approved' | 'rejected';
  customerNote: string | null;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

// GET/POST /customer/certificate-requests — free-certificate redemption.
// Points are deducted on admin approval, not on submission.
export function useMyCertificateRequests(accessToken: string | null) {
  return useQuery<{ requests: CertificateRequestItem[] }>({
    queryKey: ['my-certificate-requests', accessToken],
    queryFn: () => apiGetAuth('/customer/certificate-requests', accessToken as string),
    enabled: !!accessToken,
  });
}

export function requestFreeCertificate(customerNote: string | null, accessToken: string) {
  return apiMutateAuth('POST', '/customer/certificate-requests', { customerNote }, accessToken);
}
