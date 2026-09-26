import { useTranslation } from 'react-i18next';

import type { Certificate } from '@/lib/api/certificates';
import { Card } from '@/components/shared/ui';

const FIELDS: { labelKey: string; key: keyof Certificate }[] = [
  { labelKey: 'reportCard.fields.identification', key: 'identification' },
  { labelKey: 'reportCard.fields.weight', key: 'weight' },
  { labelKey: 'reportCard.fields.pieces', key: 'pieces' },
  { labelKey: 'reportCard.fields.dimensions', key: 'dimensions' },
  { labelKey: 'reportCard.fields.cut', key: 'cut' },
  { labelKey: 'reportCard.fields.shape', key: 'shape' },
  { labelKey: 'reportCard.fields.color', key: 'color' },
  { labelKey: 'reportCard.fields.origin', key: 'origin' },
  { labelKey: 'reportCard.fields.verifiedBy', key: 'verifiedBy' },
  { labelKey: 'reportCard.fields.certifiedBy', key: 'certifiedBy' },
];

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col gap-1">
      {certificate.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={certificate.imageUrl} alt={certificate.certificateNo} className="mb-3 h-44 w-full rounded-xl object-cover" />
      )}

      <p className="font-mono text-lg font-semibold text-primary">{certificate.certificateNo}</p>
      <p className="mb-2 text-sm text-text-secondary">{t('reportCard.issued', { date: certificate.issueDate })}</p>

      <div className="flex flex-col divide-y divide-bg-selected">
        {FIELDS.filter((f) => certificate[f.key]).map((f) => (
          <div key={f.key} className="flex justify-between gap-4 py-1.5 text-sm">
            <span className="text-text-secondary">{t(f.labelKey)}</span>
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
