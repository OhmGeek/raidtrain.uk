import { useState, useEffect, useRef } from 'react'
import DepartureBoard from './DepartureBoard'
import SiteFooter from './SiteFooter'
import { POLL_INTERVAL_MS, fetchSchedule, getActiveIndex } from './schedule'
import './App.css'

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([])
  const [scheduleError, setScheduleError] = useState(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const scheduleRef = useRef([])
  useEffect(() => {
    scheduleRef.current = schedule
  }, [schedule])

  useEffect(() => {
    let pollTimer

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
    pollTimer = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(pollTimer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const sched = scheduleRef.current
      if (sched.length === 0) return
      setActiveIndex(getActiveIndex(sched, Date.now()))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="train-station-container">
      <header>
        <h1>RAID TRAIN</h1>
        {scheduleError && (
          <div className="schedule-error">⚠ Could not load schedule: {scheduleError}</div>
        )}
      </header>
      <DepartureBoard schedule={schedule} activeIndex={activeIndex} />
      <SiteFooter />
    </div>
  )
}
