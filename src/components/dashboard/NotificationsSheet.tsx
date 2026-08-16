import { CloseIcon } from '@/components/icons'

export function NotificationsSheet({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-[18px] bg-surface-3 px-5 pt-3 pb-5">
      <div aria-hidden className="mx-auto h-[4px] w-10 rounded-full bg-white/70" />

      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[24px] leading-none font-extrabold text-white uppercase">
            Notifications
          </h2>
          <p className="mt-2 text-[15px] text-white/70">
            Stay in the loop about parties, invites &amp; more.
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notifications prompt"
          className="shrink-0 text-white transition-opacity hover:opacity-70"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
