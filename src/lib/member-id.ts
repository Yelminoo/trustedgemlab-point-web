// Mirrors mobile-point/src/lib/memberId.ts and web-internal's/backend's
// memberId.ts exactly — kept in sync manually across all four copies.
const PREFIX = 'TGL-';
const PAD_LENGTH = 6;

export function formatMemberId(customerId: number): string {
  return `${PREFIX}${String(customerId).padStart(PAD_LENGTH, '0')}`;
}
