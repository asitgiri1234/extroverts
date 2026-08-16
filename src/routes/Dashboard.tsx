import { useState } from 'react'
import { Screen, Container } from '@/components/layout/Screen'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { ClubCard } from '@/components/dashboard/ClubCard'
import { NotificationsSheet } from '@/components/dashboard/NotificationsSheet'
import { PartyCard } from '@/components/dashboard/PartyCard'
import { PARTIES } from '@/data/parties'

const APP_VERSION = 'v1.8.5'

export function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(true)

  return (
    <Screen background="app" className="pb-10">
      <Container size="xl">
        <DashboardHeader vipCount={0} />
        <ClubCard tier="Silver Club Member" progress={0.7} tokens={160} />

        {/*
         * The feed is a single column on the phone, as in the app, but a wide
         * screen fits two or three cards abreast — a lone column of cards down
         * the middle of a desktop wastes most of the page.
         */}
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

        <p className="mt-10 text-center text-[14px] text-fg-subtle">
          Extroverts 2026 | {APP_VERSION} | Himanshu
        </p>
      </Container>
    </Screen>
  )
}
