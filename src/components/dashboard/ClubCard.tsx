import { ClubGemIcon, StarBadgeIcon } from '@/components/icons'

interface ClubCardProps {
  tier: string
  /** 0–1. Drives the meter welded to the bottom edge of the card. */
  progress: number
  tokens: number
}

export function ClubCard({ tier, progress, tokens }: ClubCardProps) {
  const pct = Math.round(Math.min(Math.max(progress, 0), 1) * 100)

  return (
    <section className="px-5">
      <p className="text-[15px] tracking-[0.04em] text-white/85 uppercase">Your club</p>

      <div className="mt-2 rounded-[12px] border-[1.6px] border-white pt-3">
        <div className="flex items-center justify-between gap-3 px-4 pb-3">
          <span className="text-[19px] font-bold text-white">{tier}</span>
          <ClubGemIcon size={34} className="shrink-0" />
        </div>

        {/* Meter is inset and clipped by the card's own radius. */}
        <div
          className="mx-1 mb-1 h-[13px] overflow-hidden rounded-[8px] bg-[#0a0a0a]"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${tier} progress`}
        >
          <div className="h-full rounded-[8px] bg-white" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <p className="mt-3 flex items-center gap-3 text-[15px] font-bold tracking-[0.01em] text-white uppercase">
        <StarBadgeIcon className="h-6 w-6 shrink-0" />
        You have {tokens} honorary vibe tokens!
      </p>
    </section>
  )
}
