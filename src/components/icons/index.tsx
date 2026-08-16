import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function BellIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M5.5 17c0-.7.3-1.3.8-1.8.7-.7 1.2-1.6 1.2-2.6V10a4.5 4.5 0 0 1 9 0v2.6c0 1 .5 1.9 1.2 2.6.5.5.8 1.1.8 1.8Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  )
}

export function ChatIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M20 12a7.5 7.5 0 0 1-10.9 6.7L4.5 20l1.3-4.4A7.5 7.5 0 1 1 20 12Z" />
      <circle cx="9" cy="12" r=".9" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="12" r=".9" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r=".9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M12 8.5V12l2.4 1.6" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 9.5h17M8 3.5V6M16 3.5V6" />
      <circle cx="8.5" cy="13.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="13.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="17" r=".9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r=".9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M12 21c4-4.2 6-7.4 6-10a6 6 0 1 0-12 0c0 2.6 2 5.8 6 10Z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  )
}

export function StarBadgeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" {...props}>
      <circle cx="12" cy="12" r="11" fill="#EAA216" />
      <path
        d="m12 6.2 1.75 3.55 3.92.57-2.84 2.76.67 3.9L12 15.15l-3.5 1.84.67-3.9-2.84-2.76 3.92-.57Z"
        fill="#fff"
      />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

/** The faceted silver hexagon that marks club tier on every party card. */
export function ClubGemIcon({ size = 34, ...props }: IconProps & { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} fill="none" {...props}>
      <defs>
        <linearGradient id="gem-body" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F4F6F8" />
          <stop offset="0.45" stopColor="#B9C2CC" />
          <stop offset="1" stopColor="#7E8A97" />
        </linearGradient>
        <linearGradient id="gem-face" x1="12" y1="10" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C6CFD8" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 35.5 11v18L20 37.5 4.5 29V11Z" fill="url(#gem-body)" />
      <path d="M20 8.5 29.5 14v11L20 30.5 10.5 25V14Z" fill="url(#gem-face)" opacity="0.95" />
      <path d="M20 8.5 25 20l-5 10.5L15 20Z" fill="#E8EDF2" opacity="0.9" />
      <path d="M10.5 14 20 20l9.5-6" stroke="#8D98A5" strokeWidth="0.9" opacity="0.7" />
      <path d="M20 2.5 35.5 11v18L20 37.5 4.5 29V11Z" stroke="#6F7A87" strokeWidth="0.9" />
    </svg>
  )
}

/** The outlined "VIP" ticket badge in the header pill. */
export function VipTicketIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 34 20" width="34" height="20" fill="none" {...props}>
      <rect
        x="0.9"
        y="0.9"
        width="32.2"
        height="18.2"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text
        x="17"
        y="14"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="currentColor"
        fontFamily="Poppins, sans-serif"
      >
        VIP
      </text>
    </svg>
  )
}
