type IconProps = { className?: string };

export function DroneSprayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke="#15803d" strokeWidth="3" strokeLinecap="round">
        <path d="M17 17 8 9" />
        <path d="M31 17 40 9" />
        <path d="M17 22 8 22" />
        <path d="M31 22 40 22" />
      </g>
      <rect x="7" y="6" width="8" height="6" rx="2" fill="#16a34a" />
      <rect x="33" y="6" width="8" height="6" rx="2" fill="#16a34a" />
      <rect x="16" y="17" width="16" height="10" rx="3" fill="#16a34a" />
      <circle cx="24" cy="22" r="2.6" fill="#dcfce7" />
      <g fill="#4ade80">
        <circle cx="17" cy="34" r="2.2" />
        <circle cx="24" cy="38" r="2.2" />
        <circle cx="31" cy="34" r="2.2" />
      </g>
    </svg>
  );
}

export function TractorFlatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="8" y="18" width="11" height="10" rx="1.5" fill="#15803d" />
      <rect x="19" y="24" width="14" height="6" rx="1" fill="#15803d" />
      <rect x="9" y="13" width="2.5" height="6" fill="#15803d" />
      <circle cx="9" cy="12" r="2" fill="#15803d" />
      <circle cx="15" cy="34" r="5.5" fill="#166534" />
      <circle cx="15" cy="34" r="2" fill="#dcfce7" />
      <circle cx="32" cy="34" r="7.5" fill="#166534" />
      <circle cx="32" cy="34" r="3" fill="#dcfce7" />
    </svg>
  );
}

export function SproutPotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M14 28h20l-2.5 10a3 3 0 0 1-2.9 2.3H19.4a3 3 0 0 1-2.9-2.3z" fill="#166534" />
      <path
        d="M24 28v-8"
        stroke="#22c55e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M24 22c0-5-4-7-9-7 0 5.5 4 8 9 8" fill="#22c55e" />
      <path d="M24 20c0-5 4-7 9-7 0 5.5-4 8-9 8" fill="#4ade80" />
    </svg>
  );
}

export function BasketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="16" cy="14" r="4.5" fill="#f97316" />
      <circle cx="24" cy="11" r="4" fill="#dc2626" />
      <circle cx="32" cy="14" r="4.5" fill="#22c55e" />
      <path d="M11 21h26l-3 15a3 3 0 0 1-3 2.5H17a3 3 0 0 1-3-2.5z" fill="#fbbf24" />
      <path d="M10 21h28l1.5 4H8.5z" fill="#f59e0b" />
    </svg>
  );
}

export function FarmerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 8c-6 0-10 3-11 7h22c-1-4-5-7-11-7z" fill="#166534" />
      <circle cx="24" cy="18" r="6" fill="#22c55e" />
      <path d="M13 40v-3c0-6 5-10 11-10s11 4 11 10v3z" fill="#16a34a" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 6c-7.7 0-14 6.3-14 14 0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z"
        fill="#166534"
      />
      <circle cx="24" cy="20" r="5.5" fill="#f0fdf4" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M8 10h4l3.5 18h19"
        stroke="#f97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M15 15h24l-2.5 12h-19z" fill="#fb923c" />
      <circle cx="19" cy="36" r="3" fill="#c2410c" />
      <circle cx="32" cy="36" r="3" fill="#c2410c" />
      <path d="M24 15c0-4 2.5-6 6-6-.3 4-2.5 6-6 6" fill="#22c55e" />
    </svg>
  );
}

export function NewsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M12 6h18l6 6v30a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#2563eb" />
      <path d="M30 6v6h6z" fill="#1d4ed8" />
      <g stroke="#dbeafe" strokeWidth="2" strokeLinecap="round">
        <path d="M15 22h18" />
        <path d="M15 27h18" />
        <path d="M15 32h11" />
      </g>
    </svg>
  );
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M24 6 40 15H8z" fill="#7c3aed" />
      <rect x="10" y="18" width="4" height="16" fill="#7c3aed" />
      <rect x="18" y="18" width="4" height="16" fill="#7c3aed" />
      <rect x="26" y="18" width="4" height="16" fill="#7c3aed" />
      <rect x="34" y="18" width="4" height="16" fill="#7c3aed" />
      <rect x="8" y="36" width="32" height="4" rx="1" fill="#6d28d9" />
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
