import { apiMutateAuth, apiPost } from '@/lib/api/client';

export function requestPasswordReset(email: string) {
  return apiPost<{ message?: string }>('/customer/password-reset/request', { email });
}

export function confirmPasswordReset(email: string, otp: string, newPassword: string) {
  return apiPost<{ message?: string }>('/customer/password-reset/confirm', { email, otp, newPassword });
}

export function requestEmailChange(newEmail: string, accessToken: string) {
  return apiMutateAuth<{ message?: string }>('POST', '/customer/email-change/request', { newEmail }, accessToken);
}

export function confirmEmailChange(otp: string, accessToken: string) {
  return apiMutateAuth('POST', '/customer/email-change/confirm', { otp }, accessToken) as Promise<{
    customer: { id: number; email: string; isEmailVerified: boolean };
  }>;
}

export function requestEmailVerification(accessToken: string) {
  return apiMutateAuth<{ message?: string }>('POST', '/customer/verify-email/request', {}, accessToken);
}

export function confirmEmailVerification(otp: string, accessToken: string) {
  return apiMutateAuth('POST', '/customer/verify-email/confirm', { otp }, accessToken) as Promise<{
    customer: { id: number; email: string; isEmailVerified: boolean };
  }>;
}
