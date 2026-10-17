import DonationProgress from './DonationProgress'
import { useFundraiser } from './justgiving'
import { CHARITY_EVENT_URL, JUSTGIVING_PAGE, JUSTGIVING_URL } from './fundraiser.config'

const TOTALS_INTERVAL_MS = 60 * 1000

function formatDay(date) {
  return date.toLocaleDateString([], { day: 'numeric', month: 'short' })
}

// "30 Oct – 2 Nov 2026", taken from the schedule so it stays current
function eventDates(schedule) {
  if (schedule.length === 0) return null
  const start = new Date(schedule[0].start_time_utc)
  // A slot ending at midnight belongs to the previous day
  const end = new Date(new Date(schedule[schedule.length - 1].end_time_utc).getTime() - 1)
  return `${formatDay(start)} – ${formatDay(end)} ${end.getFullYear()}`
}

export default function EventHero({ schedule }) {
  const { totals } = useFundraiser({ page: JUSTGIVING_PAGE, intervalMs: TOTALS_INTERVAL_MS })
  const dates = eventDates(schedule)

  return (
    <section className="event-hero">
      <img className="event-hero__emote" src="/emote-320.webp" alt="" width="160" height="160" />
      <div className="event-hero__body">
        <p className="event-hero__eyebrow">
          6th annual{dates && <> · <span className="event-hero__dates">{dates}</span></>}
        </p>
        <h2 className="event-hero__title">Twitch Charity Raid Train</h2>
        <p className="event-hero__text">
          Streamers raid from one channel to the next, around the clock, raising money for Royal
          Manchester Children&apos;s Hospital and, this year, MediCinema.
        </p>
        {totals && <DonationProgress totals={totals} className="jg-total--page" targetLabel="Target " />}
        <div className="event-hero__actions">
          <a className="btn btn--primary" href={JUSTGIVING_URL} target="_blank" rel="noopener noreferrer">
            Donate on JustGiving
          </a>
          <a className="btn btn--secondary" href={CHARITY_EVENT_URL} target="_blank" rel="noopener noreferrer">
            About the cause
          </a>
        </div>
      </div>
    </section>
  )
}
