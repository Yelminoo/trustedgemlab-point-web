import { useTranslation } from 'react-i18next';

// Address/contact and Terms & Conditions text — kept in sync with
// mobile-point's src/i18n/locales/*.json ("address"/"terms" keys); wording
// stays identical between the two apps.

export function AddressContent() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 text-sm text-text">
      <p>
        {t('address.line1')}
        <br />
        {t('address.line2')}
      </p>
      <a
        href="https://maps.google.com/?q=No(647),+Room+No(006),+(3)+Ward,+Merchant+Road,+Pabedan+Township,+Yangon,+Myanmar"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary">
        {t('address.openInMaps')}
      </a>
      <div>
        <p className="mb-1 font-semibold">{t('address.contactTitle')}</p>
        <p className="text-text-secondary">noreply@trustedgemlab.com</p>
      </div>
    </div>
  );
}

// Each clause's own translation already includes its leading "(1)"/"(2)"/…
// numbering (matches mobile-point's terms.clauseN keys exactly) — don't
// re-add numbering here.
const CLAUSE_KEYS = Array.from({ length: 10 }, (_, i) => `terms.clause${i + 1}`);

export function TermsContent() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3 text-sm text-text-secondary">
      {CLAUSE_KEYS.map((key) => (
        <p key={key}>{t(key)}</p>
      ))}
    </div>
  );
}
