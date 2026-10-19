type IconProps = { className?: string };

export function TractorFlatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke="#1f2937" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <rect x="8.5" y="10" width="3" height="8" rx="1" fill="#166534" />
        <path d="M8 18h12v-2a2 2 0 0 1 2-2h4l6 6h5a2 2 0 0 1 2 2v6H8z" fill="#4ade80" />
        <path d="M24 14l6 6h-6z" fill="#bbf7d0" />
        <rect x="10" y="20" width="9" height="6" rx="1" fill="#22c55e" />
        <rect x="8" y="27" width="26" height="4" rx="1.5" fill="#166534" />
        <circle cx="32" cy="34" r="8" fill="#1f2937" />
        <circle cx="32" cy="34" r="4.6" fill="#4b5563" stroke="none" />
        <circle cx="32" cy="34" r="2" fill="#d1d5db" stroke="none" />
        <circle cx="13" cy="34" r="5.5" fill="#1f2937" />
        <circle cx="13" cy="34" r="3" fill="#4b5563" stroke="none" />
        <circle cx="13" cy="34" r="1.3" fill="#d1d5db" stroke="none" />
      </g>
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M8 9h4l3.6 19h20"
        stroke="#c2410c"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M15 14h25l-2.6 13H17.5z" fill="#fb923c" />
      <g stroke="#c2410c" strokeWidth="1" opacity="0.5">
        <path d="M18 17h21" />
        <path d="M19 21h19.5" />
        <path d="M19.8 25h18" />
      </g>
      <circle cx="20" cy="36" r="3.2" fill="#1f2937" />
      <circle cx="20" cy="36" r="1.2" fill="#9ca3af" />
      <circle cx="33" cy="36" r="3.2" fill="#1f2937" />
      <circle cx="33" cy="36" r="1.2" fill="#9ca3af" />
      <path d="M25 14c0-4 2.4-6.4 6-6.6-.2 4-2.4 6.4-6 6.6" fill="#22c55e" />
    </svg>
  );
}

export function GradCapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 10 44 19 24 28 4 19z" fill="#db2777" />
      <path d="M14 22.5V31c0 3 4.5 6 10 6s10-3 10-6v-8.5l-10 4.5z" fill="#f472b6" />
      <path d="M44 19v9" stroke="#db2777" strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="30" r="2" fill="#db2777" />
    </svg>
  );
}
