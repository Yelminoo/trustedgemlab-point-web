import { QRCodeSVG } from 'qrcode.react';

import { formatMemberId } from '@/lib/member-id';

// A membership-card visual (not just a bare QR) — brand-maroon card, email,
// member ID, and a QR for staff to scan. Mirrors mobile-point's MemberCard.
export function MemberCard({ customerId, email, size = 'full' }: { customerId: number; email: string; size?: 'full' | 'compact' }) {
  const memberId = formatMemberId(customerId);
  const qrSize = size === 'full' ? 96 : 72;

  return (
    <div className={`flex flex-col rounded-3xl bg-primary text-white shadow-lg ${size === 'compact' ? 'gap-6 p-5' : 'gap-8 p-6'}`}>
      <div>
        <p className="text-sm font-semibold">Trusted Gemological Laboratory</p>
        <p className="mt-0.5 text-xs tracking-widest text-white/70">CUSTOMER MEMBER</p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm">{email}</p>
          <p className="mt-0.5 font-mono text-base tracking-wide text-white/90">{memberId}</p>
        </div>
        <div className="shrink-0 rounded-lg bg-white p-1.5">
          <QRCodeSVG value={memberId} size={qrSize} fgColor="#8d1b20" bgColor="#ffffff" />
        </div>
      </div>
    </div>
  );
}
