type IconProps = { className?: string };

export function DroneSprayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke="#166534" strokeWidth="3" strokeLinecap="round">
        <path d="M18 16 9 8" />
        <path d="M30 16 39 8" />
        <path d="M18 21 8 21" />
        <path d="M30 21 40 21" />
      </g>
      <g fill="#94a3b8" opacity="0.55">
        <ellipse cx="8" cy="7" rx="7" ry="2.2" />
        <ellipse cx="40" cy="7" rx="7" ry="2.2" />
        <ellipse cx="7" cy="21" rx="7" ry="2.2" />
        <ellipse cx="41" cy="21" rx="7" ry="2.2" />
      </g>
      <rect x="6.5" y="5.5" width="7" height="5" rx="2" fill="#16a34a" />
      <rect x="34.5" y="5.5" width="7" height="5" rx="2" fill="#16a34a" />
      <rect x="15.5" y="16" width="17" height="10.5" rx="3.5" fill="#22c55e" />
      <rect x="15.5" y="16" width="17" height="5" rx="3" fill="#4ade80" />
      <circle cx="24" cy="21" r="2.6" fill="#f0fdf4" />
      <path d="M22 27v3M26 27v3" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
      <g fill="#38bdf8" opacity="0.85">
        <circle cx="19" cy="33" r="1.6" />
        <circle cx="24" cy="37" r="1.8" />
        <circle cx="29" cy="33" r="1.6" />
      </g>
      <path
        d="M9 41c3-3 8-3 11 0M28 41c3-3 8-3 11 0"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function TractorFlatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="9" y="10" width="3" height="8" rx="1" fill="#166534" />
      <rect x="8.5" y="8.5" width="4" height="2.5" rx="1" fill="#0f3d20" />
      <path d="M8 18h12v-2a2 2 0 0 1 2-2h4l6 6h5a2 2 0 0 1 2 2v6H8z" fill="#22c55e" />
      <path d="M24 14l6 6h-6z" fill="#bbf7d0" opacity="0.7" />
      <rect x="10" y="20" width="9" height="6" rx="1" fill="#15803d" />
      <rect x="8" y="27" width="26" height="4" rx="1.5" fill="#166534" />
      <circle cx="32" cy="34" r="8" fill="#1f2937" />
      <circle cx="32" cy="34" r="4.6" fill="#374151" />
      <circle cx="32" cy="34" r="2" fill="#9ca3af" />
      <circle cx="13" cy="34" r="5.5" fill="#1f2937" />
      <circle cx="13" cy="34" r="3" fill="#374151" />
      <circle cx="13" cy="34" r="1.3" fill="#9ca3af" />
    </svg>
  );
}

export function SproutPotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M13 26h22l-2.6 12.5a3 3 0 0 1-2.9 2.4H18.5a3 3 0 0 1-2.9-2.4z"
        fill="#b45309"
      />
      <path d="M13 26h22l-.7 3.4H13.7z" fill="#92400e" />
      <ellipse cx="24" cy="26" rx="11" ry="2.4" fill="#78350f" />
      <path d="M24 26v-9" stroke="#15803d" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M24 20c0-6-5-8-11-8 0 6.5 5 9.3 11 9.3" fill="#22c55e" />
      <path d="M24 18c0-6 5-8 11-8 0 6.5-5 9.3-11 9.3" fill="#4ade80" />
      <path
        d="M17 15c3 .5 5.4 2.4 6.3 5"
        stroke="#166534"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <circle cx="10" cy="30" r="1.6" fill="#a16207" />
      <circle cx="14" cy="34" r="1.3" fill="#a16207" />
    </svg>
  );
}

export function BasketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M14 20c0-5 4.5-9 10-9s10 4 10 9"
        stroke="#a16207"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M13 18c0-2.5 2-4.5 4.5-4.5S22 15.5 22 18c0 2.8-2 4-4.5 4S13 20.8 13 18z"
        fill="#dc2626"
      />
      <path
        d="M16.5 13.2c.4-1 1.4-1.6 2.4-1.4"
        stroke="#16a34a"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M23 21l4-9 3 1.3-3.5 8.7z" fill="#f97316" />
      <path d="M27 12.3l1.6-2.6" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M30 19c1-3 4-4.5 6.5-3.6-.6 3-3 5-6.5 3.6z" fill="#4ade80" />
      <path d="M9 22h30l-3 15.5a3 3 0 0 1-3 2.5H15a3 3 0 0 1-3-2.5z" fill="#eab308" />
      <path d="M7.5 22h33l1.3 3.6H6.2z" fill="#ca8a04" />
      <g stroke="#a16207" strokeWidth="1" opacity="0.55">
        <path d="M11 27h26" />
        <path d="M12 32h24" />
        <path d="M13 37h22" />
      </g>
    </svg>
  );
}

export function FarmerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="13" rx="13" ry="3.2" fill="#a16207" />
      <path d="M15 12.5c0-4.5 4-7.5 9-7.5s9 3 9 7.5z" fill="#ca8a04" />
      <circle cx="24" cy="18.5" r="5.6" fill="#fbbf9a" />
      <path
        d="M19 17c1.5-1.6 8.5-1.6 10 0"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M13 41v-3.5c0-6.2 5-10.5 11-10.5s11 4.3 11 10.5V41z"
        fill="#16a34a"
      />
      <path d="M20 27.5v13.5M28 27.5v13.5" stroke="#15803d" strokeWidth="1.6" opacity="0.6" />
      <path d="M20 27.5l1.5 4h5l1.5-4" fill="#f0fdf4" opacity="0.9" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="41" rx="7" ry="2" fill="#166534" opacity="0.25" />
      <path
        d="M24 6c-7.7 0-14 6.3-14 14 0 10.5 14 22 14 22s14-11.5 14-22c0-7.7-6.3-14-14-14z"
        fill="#16a34a"
      />
      <path
        d="M24 6c-7.7 0-14 6.3-14 14 0 1 .07 2 .2 3C11 14 16.7 8 24 8z"
        fill="#4ade80"
        opacity="0.55"
      />
      <circle cx="24" cy="20" r="5.6" fill="#f0fdf4" />
      <circle cx="24" cy="20" r="2.4" fill="#16a34a" />
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

export function VideoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="7" y="10" width="30" height="26" rx="6" fill="#e11d48" />
      <rect x="7" y="10" width="30" height="7" rx="6" fill="#fb7185" opacity="0.55" />
      <path d="M32 20.5 41 15v18l-9-5.5z" fill="#be123c" />
      <path d="M18 17.5v11l10-5.5z" fill="#fff1f2" />
    </svg>
  );
}

export function MegaphoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M6 20v8a3 3 0 0 0 3 3h3l15 8V9L12 17H9a3 3 0 0 0-3 3z" fill="#f59e0b" />
      <path d="M6 20v8a3 3 0 0 0 3 3h3v-14H9a3 3 0 0 0-3 3z" fill="#d97706" />
      <path d="M27 8v33l11 6V2z" fill="#fbbf24" />
      <path d="M12 34v5a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-2.3" fill="#92400e" />
      <g stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.8" fill="none">
        <path d="M41 15c2 2.5 2 7.5 0 10" />
        <path d="M44.5 12c3 4 3 12.5 0 16.5" />
      </g>
    </svg>
  );
}

export function NewsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M11 6h19l7 7v29a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="#2563eb" />
      <path d="M30 6v7h7z" fill="#1d4ed8" />
      <rect x="14" y="14" width="9" height="4.5" rx="1" fill="#93c5fd" />
      <g stroke="#dbeafe" strokeWidth="2.2" strokeLinecap="round">
        <path d="M14 22h20" />
        <path d="M14 27.5h20" />
        <path d="M14 33h13" />
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
