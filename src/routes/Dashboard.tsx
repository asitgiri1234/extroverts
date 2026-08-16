import { useState } from 'react'
import { PhoneFrame } from '@/components/layout/PhoneFrame'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ClubCard } from '@/components/dashboard/ClubCard'
import { NotificationsSheet } from '@/components/dashboard/NotificationsSheet'
import { PartyCard } from '@/components/dashboard/PartyCard'
import { PARTIES } from '@/data/parties'

const APP_VERSION = 'v1.8.5'

export function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(true)

  return (
    <PhoneFrame>
      <div className="min-h-dvh bg-app pb-8">
        <DashboardHeader vipCount={0} />
        <ClubCard tier="Silver Club Member" progress={0.7} tokens={160} />

        <div className="mt-5 space-y-5 px-5">
          {PARTIES.map((party, i) => (
            <PartyCard
              key={party.id}
              party={party}
              banner={
                i === 0 && showNotifications ? (
                  <NotificationsSheet onDismiss={() => setShowNotifications(false)} />
                ) : undefined
              }
            />
          ))}
        </div>

        <p className="mt-8 text-center text-[14px] text-fg-subtle">
          Extroverts 2026 | {APP_VERSION} | Himanshu
        </p>
      </div>
    </PhoneFrame>
  )
}
