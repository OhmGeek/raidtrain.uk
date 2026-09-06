/**
 * DepartureBoard – shows upcoming slots from the JSON schedule.
 *
 * Props:
 *   schedule    – array of { display, twitch, startTimeUtc, endTimeUtc }
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

  return (
    <div className="schedule-board">
      <h2>UPCOMING DEPARTURES</h2>
      <div className="board-header">
        <span>TIME</span>
        <span>DESTINATION</span>
        <span>DURATION</span>
        <span>STATUS</span>
      </div>
      <div className="board-rows">
        {schedule.map((item, index) => {
          // Only hide past slots when we're mid-event (activeIndex points to a live slot).
          // If activeIndex is -1 (before event) or >= schedule.length (after event),
          // show everything so the board is never blank.
          const midEvent = activeIndex >= 0 && activeIndex < schedule.length
          if (midEvent && index < activeIndex) return null

          const isCurrent = index === activeIndex

          const startMs = new Date(item.start_time_utc).getTime()
          const endMs = new Date(item.end_time_utc).getTime()
          const durationMinutes = Math.round((endMs - startMs) / (1000 * 60))

          // Display the scheduled start time in local time
          const startDate = new Date(item.start_time_utc)
          const departureTime = startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
          const departureDate = startDate.toLocaleDateString([], {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })

          const name = (item.streamer_name || '(TBA)').toUpperCase()

          return (
            <div key={index} className={`board-row ${isCurrent ? 'active-row' : ''}`}>
              <span className="row-time">
                <span className="row-time-clock">{departureTime}</span>
                <span className="row-time-date">{departureDate}</span>
              </span>
              <span className="row-name">
                {item.twitch_channel
                  ? <a href={`https://twitch.tv/${item.twitch_channel}`} target="_blank" rel="noopener noreferrer" className="row-twitch-link">{name}</a>
                  : name}
              </span>
              <span className="row-duration">
                {durationMinutes > 0 ? `${durationMinutes} MIN` : '--'}
              </span>
              <span className="row-status">{isCurrent ? 'ALL ABOARD' : 'ON TIME'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
