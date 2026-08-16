import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/cn'
import { CATEGORY_META, type Party } from '@/data/parties'
import { Button } from '@/components/ui/Button'
import { CalendarIcon, ChevronRightIcon, ClockIcon, ClubGemIcon, PinIcon } from '@/components/icons'

/** Diagonal repeating hatch used wherever a members-only value is masked. */
const HATCH =
  'repeating-linear-gradient(115deg,transparent 0 6px,rgba(255,255,255,0.55) 6px 8px)'

function ConfidentialRibbon() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute top-[62%] -left-[10%] w-[130%] -rotate-[9deg] bg-white/12 py-2">
        <p className="text-center text-[26px] font-extrabold tracking-[0.02em] whitespace-nowrap text-black/45 uppercase">
          Confidential Confidential Confidential
        </p>
      </div>
    </div>
  )
}

interface PartyCardProps {
  party: Party
  /** Slot rendered between the masked-location block and the title, matching the app. */
  banner?: ReactNode
}

export function PartyCard({ party, banner }: PartyCardProps) {
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const meta = CATEGORY_META[party.category]
  const isConfidential = party.location === null

  async function handleJoin() {
    setJoining(true)
    await new Promise((r) => setTimeout(r, 1100))
    setJoining(false)
    setJoined(true)
    toast.success(`You're in — ${party.title}`)
  }

  return (
    <article className="relative overflow-hidden rounded-[var(--radius-card)] bg-card p-4">
      {isConfidential && <ConfidentialRibbon />}

      {party.cover && (
        <div
          className="mb-4 h-[190px] w-full rounded-[12px]"
          style={{ backgroundImage: party.cover }}
          role="img"
          aria-label={`${party.title} cover`}
        />
      )}

      {isConfidential && (
        // Masked venue block shown to non-members, dimmed as in the app.
        <div className="mb-4 opacity-35">
          <div className="flex items-center gap-1 text-[15px] text-fg-muted">
            <span>Location Privacy</span>
            <span className="text-fg-subtle">Party Members Only</span>
            <ChevronRightIcon className="ml-auto h-4 w-4" />
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-[10px] border border-line px-3 py-3">
            <div className="h-4 flex-1 rounded-sm" style={{ backgroundImage: HATCH }} />
            <PinIcon className="h-5 w-5 shrink-0 text-fg-muted" />
          </div>
          <p className="mt-2 text-[13px] leading-snug text-fg-subtle">
            CONFIDENTIAL — Location visible only to members
          </p>
        </div>
      )}

      {banner && <div className="relative mb-5">{banner}</div>}

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[26px] leading-tight font-bold text-white">{party.title}</h3>
          <p className="mt-0.5 text-[15px] tracking-wide text-white/85 uppercase">{party.kind}</p>
        </div>
        <ClubGemIcon size={36} className="shrink-0" />
      </div>

      <p className="relative mt-4 text-[15px] text-fg-muted">{party.description}</p>

      <div className="relative mt-3 flex items-center justify-between gap-3">
        <span className="text-[17px] font-bold text-white">{party.host}</span>
        <span
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] font-bold whitespace-nowrap text-white"
          style={{ backgroundImage: meta.bg }}
        >
          <span aria-hidden>{meta.emoji}</span>
          {meta.label}
        </span>
      </div>

      {/* Time / date / location share one bordered block with internal dividers. */}
      <div className="relative mt-4 overflow-hidden rounded-[10px] border border-line">
        <div className="grid grid-cols-2">
          <div className="flex items-center justify-between gap-2 border-r border-line px-3 py-3">
            <span className="text-[17px] text-white">{party.time}</span>
            <ClockIcon className="h-5 w-5 shrink-0 text-white/80" />
          </div>
          <div className="flex items-center justify-between gap-2 px-3 py-3">
            <span className="text-[17px] text-white">{party.date}</span>
            <CalendarIcon className="h-5 w-5 shrink-0 text-white/80" />
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line px-3 py-3">
          {isConfidential ? (
            <div className="h-4 flex-1 rounded-sm" style={{ backgroundImage: HATCH }} />
          ) : (
            <p className="flex-1 text-[17px] leading-snug text-white">{party.location}</p>
          )}
          <PinIcon className="h-5 w-5 shrink-0 text-white/80" />
        </div>
      </div>

      {isConfidential && (
        <p className="relative mt-2 text-[13px] text-fg-subtle">
          CONFIDENTIAL — Location visible only to members
        </p>
      )}

      <Button
        className={cn('relative mt-4', joined && 'bg-success text-black hover:bg-success')}
        loading={joining}
        disabled={joined}
        onClick={handleJoin}
      >
        {joined ? 'Joined' : 'Join'}
      </Button>
    </article>
  )
}
