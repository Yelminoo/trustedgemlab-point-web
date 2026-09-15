// A random id tagging a "logical attempt" at a mutating request (issuing
// points, reviewing a certificate request) so the backend can dedupe a
// double-click or a retried request instead of applying it twice — see
// withIdempotency() in the backend's src/index.ts. Doesn't need to be
// cryptographically strong (it's a dedup key, not a secret); prefers the
// Web Crypto API where available and falls back to Math.random() otherwise.
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  const hex = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
  return `${hex()}${hex()}-${hex()}-4${hex().slice(1)}-${((Math.random() * 4) | 8).toString(16)}${hex().slice(1)}-${hex()}${hex()}${hex()}`;
}
