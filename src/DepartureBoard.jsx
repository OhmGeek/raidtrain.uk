function formatDuration(startUtc, endUtc) {
  const hours = (new Date(endUtc) - new Date(startUtc)) / (1000 * 60 * 60)
  const rounded = Math.round(hours * 10) / 10
  return `${rounded} ${rounded === 1 ? 'HR' : 'HRS'}`
}

// e.g. "GMT" or "BST" for the viewer, at the time of the event
function timeZoneName(dateUtc) {
  const parts = new Intl.DateTimeFormat([], { timeZoneName: 'short' }).formatToParts(new Date(dateUtc))
  return parts.find((p) => p.type === 'timeZoneName')?.value
}

/**
 * DepartureBoard – shows upcoming slots from the JSON schedule, grouped by day.
 *
 * Props:
 *   schedule    – array of { twitch_channel, streamer_name, start_time_utc, end_time_utc }
 *   activeIndex – index of the currently-live slot (-1 = not started yet,
 *                 >= schedule.length = finished)
 */
export default function DepartureBoard({ schedule, activeIndex }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="schedule-board">
        <h2>UPCOMING DEPARTURES</h2>
        <p className="board-empty">Loading schedule…</p>
      </div>
    )
  }

  // Only hide past slots when we're mid-event (activeIndex points to a live slot).
  // If activeIndex is -1 (before event) or >= schedule.length (after event),
  // show everything so the board is never blank.
  const midEvent = activeIndex >= 0 && activeIndex < schedule.length
  const tz = timeZoneName(schedule[0].start_time_utc)

  const rows = []
  let lastDay = null
  schedule.forEach((item, index) => {
    if (midEvent && index < activeIndex) return

    const startDate = new Date(item.start_time_utc)
    const day = startDate.toDateString()
    if (day !== lastDay) {
      lastDay = day
      rows.push(
        <div key={`day-${day}`} className="board-day">
          {startDate
            .toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
            .replace(',', '')
            .toUpperCase()}
        </div>
      )
    }

    const isCurrent = index === activeIndex
    const status = isCurrent ? 'ALL ABOARD' : index < activeIndex ? 'DEPARTED' : 'ON TIME'
    const name = (item.streamer_name || '(TBA)').toUpperCase()

    rows.push(
      <div
        key={index}
        className={`board-row ${isCurrent ? 'active-row' : ''} ${status === 'DEPARTED' ? 'departed-row' : ''}`}
      >
        <span className="row-time">
          <span className="row-time-clock">
            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })}
          </span>
          <span className="row-time-duration">{formatDuration(item.start_time_utc, item.end_time_utc)}</span>
        </span>
        <span className="row-name" style={{ '--name-chars': name.length }}>
          <span className="row-name-text">
            {item.twitch_channel
              ? <a href={`https://twitch.tv/${item.twitch_channel}`} target="_blank" rel="noopener noreferrer" className="row-twitch-link">{name}</a>
              : name}
          </span>
        </span>
        <span className="row-status">{status}</span>
      </div>
    )
  })

  return (
    <div className="schedule-board">
      <h2>UPCOMING DEPARTURES</h2>
      {tz && <p className="board-tz">Times shown in your local time ({tz})</p>}
      <div className="board-header">
        <span>TIME</span>
        <span>DESTINATION</span>
        <span>STATUS</span>
      </div>
      <div className="board-rows">{rows}</div>
    </div>
  )
}
