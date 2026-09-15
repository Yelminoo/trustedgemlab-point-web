import { useQuery } from '@tanstack/react-query';

import { apiGetAuth } from '@/lib/api/client';

export interface WalletTransaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  balanceAfter: number;
  note: string;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  lifetimeEarned: number;
  freeCertificateCost: number;
  transactions: WalletTransaction[];
}

export function useWallet(accessToken: string | null) {
  return useQuery<Wallet>({
    queryKey: ['wallet', accessToken],
    queryFn: () => apiGetAuth<Wallet>('/customer/wallet', accessToken as string),
    enabled: !!accessToken,
  });
}
