import { useState, useEffect, useRef } from 'react'
import DepartureBoard from './DepartureBoard'
import './App.css'

const POLL_INTERVAL_MS = 15 * 60 * 1000

async function fetchSchedule() {
  const res = await fetch(`/schedule.json?_=${Date.now()}`)
  if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`)
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

function getActiveIndex(schedule, now) {
  for (let i = 0; i < schedule.length; i++) {
    const start = new Date(schedule[i].start_time_utc).getTime()
    const end = new Date(schedule[i].end_time_utc).getTime()
    if (now >= start && now < end) return i
  }
  if (schedule.length > 0 && now < new Date(schedule[0].start_time_utc).getTime()) return -1
  return schedule.length > 0 ? schedule.length : -1
}

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
    </div>
  )
}
