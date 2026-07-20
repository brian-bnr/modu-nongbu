type IconProps = { className?: string };

const OUTLINE = "#1f2937";

export function DroneSprayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15 9 7" fill="none" />
        <path d="M30 15 39 7" fill="none" />
        <path d="M18 20 8 20" fill="none" />
        <path d="M30 20 40 20" fill="none" />
        <circle cx="8" cy="6.5" r="4.4" fill="#e5e7eb" />
        <circle cx="40" cy="6.5" r="4.4" fill="#e5e7eb" />
        <circle cx="7" cy="20" r="4.4" fill="#e5e7eb" />
        <circle cx="41" cy="20" r="4.4" fill="#e5e7eb" />
        <rect x="15.5" y="15" width="17" height="11" rx="3.5" fill="#4ade80" />
        <circle cx="24" cy="20.5" r="2.6" fill="#f0fdf4" />
        <path d="M20 26v4M28 26v4" fill="none" />
      </g>
      <g stroke={OUTLINE} strokeWidth="1.2" strokeLinejoin="round">
        <path d="M14 41c.5-4 1.6-6.5 1.6-6.5s1.1 2.5 1.4 6.5z" fill="#4ade80" />
        <path d="M20 41.5c.3-4.5 1.4-7 1.4-7s1.2 2.5 1 7z" fill="#22c55e" />
        <path d="M26 41.5c-.2-4.5-1.4-7-1.4-7s-1.2 2.5-1 7z" fill="#22c55e" />
        <path d="M34 41c-.5-4-1.6-6.5-1.6-6.5s-1.1 2.5-1.4 6.5z" fill="#4ade80" />
      </g>
    </svg>
  );
}

export function FarmerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M13 41v-3.2c0-6 4.9-10.3 11-10.3s11 4.3 11 10.3V41z"
          fill="#22c55e"
        />
        <path d="M19.5 27.8v13.2M28.5 27.8v13.2" stroke="#166534" strokeWidth="1.3" />
        <path d="M19.5 27.8l1.5 4h6l1.5-4" fill="#f8fafc" />
        <circle cx="24" cy="18" r="6" fill="#fbbf9a" />
        <path
          d="M19.3 16.6c1.6-1.7 8.8-1.7 10.4 0"
          fill="none"
          stroke="#78350f"
          strokeWidth="1"
          opacity="0.5"
        />
        <path d="M14.5 12.5c0-4.5 4.3-7.7 9.5-7.7s9.5 3.2 9.5 7.7z" fill="#22c55e" />
        <ellipse cx="24" cy="12.5" rx="13" ry="3" fill="#166534" />
      </g>
    </svg>
  );
}

export function SproutPotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M12 26h24v10.5a2.5 2.5 0 0 1-2.5 2.5h-19a2.5 2.5 0 0 1-2.5-2.5z"
          fill="#c2833f"
        />
        <path d="M12 30.3h24M12 34.6h24" stroke="#8a5a24" strokeWidth="1" opacity="0.7" />
        <ellipse cx="24" cy="26" rx="12" ry="2.4" fill="#78350f" />
        <path d="M24 26v-8.5" stroke="#15803d" strokeWidth="2.2" />
        <path d="M24 20c0-5.5-4.6-7.5-10-7.5 0 5.8 4.6 8.3 10 8.3" fill="#22c55e" />
        <path d="M24 18.3c0-5.5 4.6-7.5 10-7.5 0 5.8-4.6 8.3-10 8.3" fill="#4ade80" />
      </g>
    </svg>
  );
}

export function BottleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M20 6h8v5h-8z" fill="#f97316" />
        <path d="M19 11h10l2.5 6v21a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 16.5 38V17z" fill="#fefce8" />
        <path d="M16.5 24h15v14a2.5 2.5 0 0 1-2.5 2.5h-10a2.5 2.5 0 0 1-2.5-2.5z" fill="#f97316" />
        <rect x="19.5" y="19.5" width="9" height="3" rx="0.5" fill="#fde68a" stroke="none" />
      </g>
    </svg>
  );
}

export function TractorFlatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
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

export function HandshakeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M4 20h7l6 4v6l-6 3-7-3z" fill="#4ade80" />
        <path d="M44 20h-7l-6 4v6l6 3 7-3z" fill="#22c55e" />
        <path
          d="M17 24l6.3 3.7a2 2 0 0 0 2.4-.3l1.3-1.3a2 2 0 0 1 2.7-.1l3 2.6"
          fill="#fbbf9a"
        />
        <path d="M17 24v5.3l5 3a2.3 2.3 0 0 0 2.8-.3" fill="#fbbf9a" />
        <path d="M31 25l1.8 1.6a1.8 1.8 0 0 1-2.3 2.7l-1-.8" fill="#fbbf9a" />
      </g>
    </svg>
  );
}

export function RiceBagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M21 6h6l1.5 6h-9z" fill="#a16207" />
        <path
          d="M17 12h14l3 11.5a3 3 0 0 1 .1.8V38a3 3 0 0 1-3 3H16.9a3 3 0 0 1-3-3V24.3a3 3 0 0 1 .1-.8z"
          fill="#fef3c7"
        />
        <circle cx="24" cy="27" r="6.4" fill="#16a34a" />
        <text
          x="24"
          y="27.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="8"
          fontWeight="700"
          fill="#f0fdf4"
          stroke="none"
        >
          W
        </text>
      </g>
    </svg>
  );
}

export function BasketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M14 20c0-5 4.5-9 10-9s10 4 10 9" fill="none" />
        <path
          d="M13 18c0-2.5 2-4.5 4.5-4.5S22 15.5 22 18c0 2.8-2 4-4.5 4S13 20.8 13 18z"
          fill="#dc2626"
        />
        <path d="M23 21l4-9 3 1.3-3.5 8.7z" fill="#f97316" />
        <path d="M30 19c1-3 4-4.5 6.5-3.6-.6 3-3 5-6.5 3.6z" fill="#4ade80" />
        <path d="M9 22h30l-3 15.5a3 3 0 0 1-3 2.5H15a3 3 0 0 1-3-2.5z" fill="#eab308" />
        <path d="M7.5 22h33l1.3 3.6H6.2z" fill="#ca8a04" />
        <g stroke="#a16207" strokeWidth="1" opacity="0.6">
          <path d="M11 27h26" />
          <path d="M12 32h24" />
          <path d="M13 37h22" />
        </g>
      </g>
    </svg>
  );
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M24 5 41 15H7z" fill="#3b82f6" />
        <rect x="9" y="18" width="4.5" height="15" fill="#3b82f6" />
        <rect x="17.5" y="18" width="4.5" height="15" fill="#3b82f6" />
        <rect x="26" y="18" width="4.5" height="15" fill="#3b82f6" />
        <rect x="34.5" y="18" width="4.5" height="15" fill="#3b82f6" />
        <rect x="7" y="33" width="34" height="5.5" rx="1" fill="#2563eb" />
      </g>
      <text
        x="24"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="7"
        fontWeight="700"
        fill="#eff6ff"
      >
        W
      </text>
    </svg>
  );
}

export function ShieldWonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        d="M24 5c5 3 9 4 14 4v14c0 10-7 17-14 20-7-3-14-10-14-20V9c5 0 9-1 14-4z"
        fill="#3b82f6"
        stroke={OUTLINE}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <text
        x="24"
        y="23.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fill="#eff6ff"
      >
        W
      </text>
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
