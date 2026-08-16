import { Logo } from '@/components/brand/Logo'
import { BellIcon, ChatIcon, VipTicketIcon } from '@/components/icons'

export function DashboardHeader({ vipCount = 0 }: { vipCount?: number }) {
  return (
    <header className="flex items-center justify-between px-5 pt-4 pb-3">
      <Logo className="text-[34px] text-white" />

      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border-[1.6px] border-white px-3 py-1.5 text-white">
          <VipTicketIcon className="h-[18px] w-[30px]" />
          <span className="text-[17px] leading-none font-semibold">{vipCount}</span>
        </span>

        <button
          type="button"
          aria-label="Notifications"
          className="text-white transition-opacity hover:opacity-70"
        >
          <BellIcon className="h-7 w-7" />
        </button>

        <button
          type="button"
          aria-label="Messages"
          className="text-white transition-opacity hover:opacity-70"
        >
          <ChatIcon className="h-7 w-7" />
        </button>
      </div>
    </header>
  )
}
