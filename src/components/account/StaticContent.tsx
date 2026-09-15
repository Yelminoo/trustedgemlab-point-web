// Address/contact and Terms & Conditions text — kept in sync with
// mobile-point's src/i18n/locales/en.json ("address"/"terms" keys). Ported
// as plain English (this web app doesn't have i18n yet, see decision note
// in the project README).

export function AddressContent() {
  return (
    <div className="flex flex-col gap-4 text-sm text-text">
      <p>
        No(647), Room No(006), (3) Ward,
        <br />
        Merchant Road, Pabedan Township, Yangon, Myanmar
      </p>
      <a
        href="https://maps.google.com/?q=No(647),+Room+No(006),+(3)+Ward,+Merchant+Road,+Pabedan+Township,+Yangon,+Myanmar"
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary">
        Open in Google Maps
      </a>
      <div>
        <p className="mb-1 font-semibold">Contact</p>
        <p className="text-text-secondary">noreply@trustedgemlab.com</p>
      </div>
    </div>
  );
}

const TERMS_CLAUSES = [
  'All information and assessments presented in this Report are professional opinions issued by Trusted Gemological Laboratory, based on standard scientific testing instruments, current professional expertise, reference data, and reference samples available at the time of examination.',
  'This Report is intended solely for the purpose of identifying the gemstone and does not constitute a guarantee, warranty, valuation, or appraisal.',
  "The color photograph included in the Report is provided only as a reference to the examined gemstone. The actual color and appearance of the stone may differ from the photograph due to lighting, surface condition, and photographic circumstances.",
  "This Trusted Gem Identification Report is issued solely for the personal use of the client who requested the Report. The laboratory bears no responsibility for the client's representations, advertising, or any other use of the Report.",
  'No amendment, addition, deletion, or alteration of any kind to this Report will be accepted.',
  'If, after this Report is issued, the gemstone undergoes treatment, alteration, or any other change, this Report automatically becomes void.',
  'Trusted Gemological Laboratory bears no responsibility for accidental damage that occurs unexpectedly during examination through standard testing methods.',
  "Opinions regarding a gemstone's authenticity, presence or absence of treatment, and country of origin are issued only upon the client's request, and such opinions are solely the professional opinion of the examiner, based on the scientific standards, reference samples, and published academic literature available at the time of examination. As gemstones may be treated or enhanced at any time, Trusted Gemological Laboratory reserves the right to decline to issue a Report if it deems it necessary.",
  'Differences in opinion may arise in Report results due to differences in examination methods, scientific techniques, or expert judgment. Trusted Gemological Laboratory and its staff bear no responsibility for such differences, or for results arising from subsequent re-examinations.',
  'Trusted Gemological Laboratory will not entertain any dispute regarding the opinions, conclusions, examination methods, or any other matter described in this Report.',
];

export function TermsContent() {
  return (
    <div className="flex flex-col gap-3 text-sm text-text-secondary">
      {TERMS_CLAUSES.map((clause, i) => (
        <p key={i}>
          ({i + 1}) {clause}
        </p>
      ))}
    </div>
  );
}
