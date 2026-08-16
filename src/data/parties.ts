export type PartyCategory = 'coffee' | 'dinner' | 'music'

export interface Party {
  id: string
  title: string
  kind: string
  description: string
  host: string
  category: PartyCategory
  time: string
  date: string
  /** Null when the venue is members-only — the card renders the confidential treatment. */
  location: string | null
  /** CSS gradient standing in for the cover photo. */
  cover?: string
}

export const CATEGORY_META: Record<PartyCategory, { label: string; emoji: string; bg: string }> = {
  coffee: { label: 'Coffee Break', emoji: '☕', bg: 'linear-gradient(90deg,#E3AC28,#C9901B)' },
  dinner: { label: 'Dinner Event', emoji: '🍽️', bg: 'linear-gradient(90deg,#E68B45,#D06B2C)' },
  music: { label: 'Music Jam', emoji: '🎸', bg: 'linear-gradient(90deg,#B47CF0,#9560D4)' },
}

/** Transcribed from the reference dashboard screenshots in photo&vid/. */
export const PARTIES: Party[] = [
  {
    id: 'night',
    title: "Let's hang out at night",
    kind: 'PRIVATE PARTY',
    description: 'Bshhshsh',
    host: '@chetan',
    category: 'coffee',
    time: '6:35 AM',
    date: '11/09/26',
    location: null,
  },
  {
    id: 'jam',
    title: 'Party jam',
    kind: 'PRIVATE PARTY',
    description: 'Party',
    host: '@jatinraja',
    category: 'music',
    time: '9:24 PM',
    date: '03/09/26',
    location: 'The Grand New Delhi, Nelson Mandela Marg, Pocket 4, Vasant …',
  },
  {
    id: 'parttyyy',
    title: 'Parttyyy',
    kind: 'PRIVATE PARTY',
    description: 'Party',
    host: '@bhanuhu',
    category: 'dinner',
    time: '2:11 PM',
    date: '02/09/26',
    location: 'New Delhi, 2524 Ground Floor, Hudson Lane, GTB Nagar, Delhi, 11…',
    cover: 'linear-gradient(115deg,#B93E6E 0%,#C2426F 35%,#D0459C 70%,#E832F0 100%)',
  },
]
