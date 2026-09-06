import { useState, useEffect, useRef } from 'react'
import { Presets, SplitFlap } from 'react-split-flap'
import './App.css'
import TwitchPlayer from './TwitchPlayer'
import DepartureBoard from './DepartureBoard'

const POLL_INTERVAL_MS = 15 * 60 * 1000 // 15 minutes

async function fetchSchedule() {
  // Cache-bust so we always get the latest version during an event
  const res = await fetch(`/schedule.json?_=${Date.now()}`)
  if (!res.ok) throw new Error(`Failed to fetch schedule: ${res.status}`)
  const data = await res.json()
  // Schedule is a bare array
  return Array.isArray(data) ? data : []
}

/**
 * Given a schedule array and the current UTC timestamp, return the index of
 * the active slot (startTimeUtc <= now < endTimeUtc).  Returns -1 if the
 * event hasn't started yet, and schedule.length - 1 when it has ended.
 */
function getActiveIndex(schedule, now) {
  for (let i = 0; i < schedule.length; i++) {
    const start = new Date(schedule[i].start_time_utc).getTime()
    const end = new Date(schedule[i].end_time_utc).getTime()
    if (now >= start && now < end) return i
  }
  // Before event starts
  if (schedule.length > 0 && now < new Date(schedule[0].start_time_utc).getTime()) return -1
  // After event ends (or past the last slot)
  return schedule.length > 0 ? schedule.length : -1
}

function formatCountdown(end_time_utc, now) {
  const distance = new Date(end_time_utc).getTime() - now
  if (distance <= 0) return '00:00:00'
  const hours = Math.floor(distance / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function App() {
  const [schedule, setSchedule] = useState([])
  const [scheduleError, setScheduleError] = useState(null)
  const [timeString, setTimeString] = useState('')
  const [countdownString, setCountdownString] = useState('00:00:00')
  const [activeIndex, setActiveIndex] = useState(-1)

  // Keep a ref to the latest schedule so the tick callback doesn't stale-close over it
  const scheduleRef = useRef([])
  useEffect(() => {
    scheduleRef.current = schedule
  }, [schedule])

  // ── Schedule fetching (on mount + every 15 minutes) ──────────────────────
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

  // ── 1-second clock + active-slot derivation ───────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()

      setTimeString(new Date().toLocaleTimeString())

      const sched = scheduleRef.current
      if (sched.length === 0) return

      const idx = getActiveIndex(sched, now)
      setActiveIndex(idx)

      if (idx >= 0 && idx < sched.length) {
        setCountdownString(formatCountdown(sched[idx].end_time_utc, now))
      } else {
        setCountdownString('00:00:00')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, []) // no deps – reads schedule via ref

  // ── Derive display values ─────────────────────────────────────────────────
  const activeSlot =
    activeIndex >= 0 && activeIndex < schedule.length ? schedule[activeIndex] : null

  const displayName = (activeSlot?.streamer_name || 'RAID TRAIN').toUpperCase()
  const displayChannel = activeSlot?.twitch_channel || ''

  return (
    <>
      <div className="train-station-container">
        <header>
          <h1>RAID TRAIN</h1>
          {scheduleError && (
            <div className="schedule-error">⚠ Could not load schedule: {scheduleError}</div>
          )}
          <div id="clock">
            {timeString && (
              <SplitFlap
                value={timeString}
                presets={Presets.NUM}
                width={100}
                height={100}
              />
            )}
          </div>
        </header>

        <div className="now-panel">
          <div className="now-info">
            <div className="now-label">NOW DEPARTING</div>
            <div id="now-name">
              <SplitFlap
                value={displayName}
                presets={Presets.ALPHA}
                width={300}
                height={100}
              />
            </div>
            <div className="next-label">NEXT DEPARTURE IN</div>
            <div id="countdown">
              <SplitFlap
                value={countdownString}
                presets={Presets.NUM}
                width={300}
                height={100}
              />
            </div>
          </div>
          <div id="twitch-wrap">
            <TwitchPlayer channel={displayChannel} />
          </div>
        </div>

        <DepartureBoard schedule={schedule} activeIndex={activeIndex} />
      </div>
    </>
  )
}

export default App
