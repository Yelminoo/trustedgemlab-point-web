interface Props {
  name: 'points' | 'card' | 'search' | 'gift';
}

// A React port of FeatureIcon.astro's same paths — needed because this icon
// is rendered inside FeaturesSection, a client:load island (an .astro
// component can't be rendered from within a React tree).
export function FeatureIcon({ name }: Props) {
  if (name === 'points') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  if (name === 'card') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M2 10h20" />
        <rect x="14" y="13" width="4" height="4" rx="0.5" />
      </svg>
    );
  }
  if (name === 'search') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M20 20l-4.35-4.35" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7C10 7 8 5.5 8 4a2 2 0 0 1 4 0c0-1.5 2-3 4-3a2.5 2.5 0 0 1 0 5c-1 1-4 1-4 1z" />
    </svg>
  );
}
