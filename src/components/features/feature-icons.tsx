import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props
  };
}

export function IconFees(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  );
}

export function IconExecution(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" />
    </svg>
  );
}

export function IconSlippage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 18l4-6 4 3 5-8 3 5" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function IconPrices(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15l3-4 3 2 4-6" />
    </svg>
  );
}

export function IconCharts(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 14l3-3 3 2 4-5" />
    </svg>
  );
}

export function IconAlerts(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M10 20a2 2 0 004 0" />
    </svg>
  );
}

export function IconDevices(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
      <rect x="3" y="7" width="6" height="10" rx="1" />
    </svg>
  );
}

export function IconApi(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 6l-4 4 4 4" />
      <path d="M16 6l4 4-4 4" />
      <path d="M14 4l-4 16" />
    </svg>
  );
}

export function IconOrderBook(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h10M4 18h14" />
      <path d="M18 10v8" />
    </svg>
  );
}

export function IconQuickTrade(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconLeverage(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 18l5-8 4 4 7-10" />
      <path d="M16 4h4v4" />
    </svg>
  );
}

export function IconSip(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="M12 14v3M10 16h4" />
    </svg>
  );
}

export function IconPacks(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="10" r="3" />
      <circle cx="16" cy="10" r="3" />
      <circle cx="12" cy="16" r="3" />
      <path d="M6 19h12" />
    </svg>
  );
}

export function IconEarn(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9 11h6" />
      <path d="M9 15h6" strokeWidth={1.25} />
    </svg>
  );
}

export function IconAi(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="6" cy="18" r="2" />
    </svg>
  );
}

export function IconPortfolio(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 19V9l8-4 8 4v10" />
      <path d="M9 19v-6h6v6" />
    </svg>
  );
}

export function IconRisk(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l8 4v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" />
      <path d="M12 8v5M12 16h.01" />
    </svg>
  );
}

export function IconWallet(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 11h18M16 15h2" />
      <path d="M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2" />
    </svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 11h16" />
    </svg>
  );
}

export const FEATURE_ICONS = {
  fees: IconFees,
  execution: IconExecution,
  slippage: IconSlippage,
  prices: IconPrices,
  charts: IconCharts,
  alerts: IconAlerts,
  devices: IconDevices,
  api: IconApi,
  orderBook: IconOrderBook,
  quickTrade: IconQuickTrade,
  leverage: IconLeverage,
  sip: IconSip,
  packs: IconPacks,
  earn: IconEarn,
  ai: IconAi,
  portfolio: IconPortfolio,
  risk: IconRisk,
  wallet: IconWallet,
  calendar: IconCalendar
} as const;

export type FeatureIconName = keyof typeof FEATURE_ICONS;
