/**
 * Local dataset backing the state → city → college cascade.
 *
 * Deliberately small but real: four states, a handful of cities each, and
 * colleges that actually exist in those cities. Enough to demonstrate dependent
 * filtering and the reset behaviour without pretending to be a complete list.
 */

export interface CityRecord {
  name: string
  colleges: string[]
}

export interface StateRecord {
  name: string
  cities: CityRecord[]
}

export const STATES: StateRecord[] = [
  {
    name: 'Delhi',
    cities: [
      {
        name: 'New Delhi',
        colleges: [
          'Hindu College',
          'Lady Shri Ram College for Women',
          'Shri Ram College of Commerce',
          'St. Stephen’s College',
        ],
      },
      {
        name: 'North Delhi',
        colleges: ['Hansraj College', 'Kirori Mal College', 'Ramjas College'],
      },
      {
        name: 'South Delhi',
        colleges: ['Gargi College', 'Jamia Millia Islamia', 'Kamala Nehru College'],
      },
    ],
  },
  {
    name: 'Karnataka',
    cities: [
      {
        name: 'Bengaluru',
        colleges: [
          'Christ University',
          'Mount Carmel College',
          'National Law School of India University',
          'RV College of Engineering',
        ],
      },
      { name: 'Mysuru', colleges: ['JSS Science and Technology University', 'Maharaja’s College'] },
      { name: 'Mangaluru', colleges: ['NITK Surathkal', 'St. Aloysius College'] },
    ],
  },
  {
    name: 'Maharashtra',
    cities: [
      {
        name: 'Mumbai',
        colleges: [
          'IIT Bombay',
          'St. Xavier’s College',
          'Sydenham College of Commerce & Economics',
          'Veermata Jijabai Technological Institute',
        ],
      },
      { name: 'Pune', colleges: ['College of Engineering Pune', 'Fergusson College', 'Symbiosis'] },
      { name: 'Nagpur', colleges: ['IIM Nagpur', 'VNIT Nagpur'] },
    ],
  },
  {
    name: 'Tamil Nadu',
    cities: [
      {
        name: 'Chennai',
        colleges: [
          'Anna University',
          'IIT Madras',
          'Loyola College',
          'Madras Christian College',
        ],
      },
      { name: 'Coimbatore', colleges: ['Amrita Vishwa Vidyapeetham', 'PSG College of Technology'] },
      { name: 'Vellore', colleges: ['VIT Vellore'] },
    ],
  },
]

const toOption = (value: string) => ({ value, label: value })

export const stateOptions = STATES.map((s) => toOption(s.name))

export function citiesIn(stateName: string) {
  const state = STATES.find((s) => s.name === stateName)
  return (state?.cities ?? []).map((c) => toOption(c.name))
}

export function collegesIn(stateName: string, cityName: string) {
  const city = STATES.find((s) => s.name === stateName)?.cities.find((c) => c.name === cityName)
  return (city?.colleges ?? []).map(toOption)
}
