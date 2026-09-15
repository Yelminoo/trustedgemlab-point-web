import { apiPost } from '@/lib/api/client';

export interface CustomerUser {
  id: number;
  email: string;
  // Grants real admin access through THIS SAME session — there is no
  // separate admin login. The backend checks this flag (via a DB lookup, not
  // the JWT payload) on every /admin/* request.
  isAdmin: boolean;
  // Whether the account-creation OTP (sent automatically at registration)
  // has been confirmed. Informational only — doesn't gate login/access.
  isEmailVerified: boolean;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  customer: CustomerUser;
}

export function registerCustomer(email: string, password: string): Promise<AuthResult> {
  return apiPost('/customer/register', { email, password });
}

export function loginCustomer(email: string, password: string): Promise<AuthResult> {
  return apiPost('/customer/login', { email, password });
}
