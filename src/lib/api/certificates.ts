import { useQuery } from '@tanstack/react-query';

import { apiGetAuth } from '@/lib/api/client';

// Mirrors the certificate shape web-internal's API returns — mobile-point's
// src/types/certificate.ts is the reference. Keep field names identical;
// this and mobile-point read/write the same `certificates` table.
export interface Certificate {
  id: number;
  certificateNo: string;
  issueDate: string;
  identification: string;
  pieces?: string | null;
  weight: string;
  dimensions?: string | null;
  cut?: string | null;
  shape?: string | null;
  color?: string | null;
  comment1?: string | null;
  comment2?: string | null;
  origin?: string | null;
  verifiedBy?: string | null;
  certifiedBy?: string | null;
  imageUrl?: string | null;
  signatureUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /customer/certificates?certNo= — authenticated, owner-scoped only. A
// certNo that exists but belongs to a different customer 404s exactly like
// one that doesn't exist at all.
export function useCertificateLookup(certNo: string, accessToken: string | null) {
  return useQuery<Certificate>({
    queryKey: ['certificate', certNo, accessToken],
    queryFn: () =>
      apiGetAuth<Certificate>(`/customer/certificates?certNo=${encodeURIComponent(certNo)}`, accessToken as string),
    enabled: !!accessToken && certNo.length > 0,
    retry: false,
  });
}

// GET /customer/certificates — "My Certificates" (no certNo — full list)
export function useMyCertificates(accessToken: string | null) {
  return useQuery<{ certificates: Certificate[] }>({
    queryKey: ['my-certificates', accessToken],
    queryFn: () => apiGetAuth<{ certificates: Certificate[] }>('/customer/certificates', accessToken as string),
    enabled: !!accessToken,
  });
}
