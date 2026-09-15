import type { Certificate } from '@/lib/api/certificates';
import { Card } from '@/components/shared/ui';

const FIELDS: { label: string; key: keyof Certificate }[] = [
  { label: 'Identification', key: 'identification' },
  { label: 'Weight', key: 'weight' },
  { label: 'Pieces', key: 'pieces' },
  { label: 'Dimensions', key: 'dimensions' },
  { label: 'Cut', key: 'cut' },
  { label: 'Shape', key: 'shape' },
  { label: 'Color', key: 'color' },
  { label: 'Origin', key: 'origin' },
  { label: 'Verified By', key: 'verifiedBy' },
  { label: 'Certified By', key: 'certifiedBy' },
];

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <Card className="flex flex-col gap-1">
      {certificate.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={certificate.imageUrl} alt={certificate.certificateNo} className="mb-3 h-44 w-full rounded-xl object-cover" />
      )}

      <p className="font-mono text-lg font-semibold text-primary">{certificate.certificateNo}</p>
      <p className="mb-2 text-sm text-text-secondary">Issued {certificate.issueDate}</p>

      <div className="flex flex-col divide-y divide-bg-selected">
        {FIELDS.filter((f) => certificate[f.key]).map((f) => (
          <div key={f.key} className="flex justify-between gap-4 py-1.5 text-sm">
            <span className="text-text-secondary">{f.label}</span>
            <span className="text-right font-medium">{String(certificate[f.key])}</span>
          </div>
        ))}
      </div>

      {(certificate.comment1 || certificate.comment2) && (
        <p className="mt-2 text-sm text-text-secondary">{[certificate.comment1, certificate.comment2].filter(Boolean).join(' — ')}</p>
      )}
    </Card>
  );
}
