import { useState, useEffect } from 'react'
import DepartureBoard from './DepartureBoard'
import SiteFooter from './SiteFooter'
import { POLL_INTERVAL_MS, fetchSchedule } from './schedule'
import './App.css'

// The /schedule page always shows the full list, regardless of the current
// time, so no slot is ever hidden or marked as live/departed.
export default function SchedulePage() {
  const [schedule, setSchedule] = useState([])
  const [scheduleError, setScheduleError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const entries = await fetchSchedule()
        setSchedule(entries)
        setScheduleError(null)
      } catch (err) {
        console.error(err)
        setScheduleError(err.message)
      }
    }

    load()
    const pollTimer = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(pollTimer)
  }, [])

  return (
    <div className="train-station-container">
      <header>
        <h1>RAID TRAIN</h1>
        {scheduleError && (
          <div className="schedule-error">⚠ Could not load schedule: {scheduleError}</div>
        )}
      </header>
      <DepartureBoard schedule={schedule} activeIndex={-1} />
      <SiteFooter />
    </div>
  )
}
