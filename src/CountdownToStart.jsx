import { useState, useEffect } from 'react'

function calcParts(targetMs) {
  const diff = targetMs - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, past: true }
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs  = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, mins, secs, past: false }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

/**
 * Renders a DD:HH:MM:SS countdown until `startTimeUtc`.
 * If no startTimeUtc is provided it shows a generic waiting message.
 */
export default function CountdownToStart({ startTimeUtc }) {
  const targetMs = startTimeUtc ? new Date(startTimeUtc).getTime() : null

  const [parts, setParts] = useState(() =>
    targetMs ? calcParts(targetMs) : null
  )

  useEffect(() => {
    if (!targetMs) return
    const timer = setInterval(() => setParts(calcParts(targetMs)), 1000)
    return () => clearInterval(timer)
  }, [targetMs])

  if (!targetMs || !parts || parts.past) {
    return (
      <div className="countdown-to-start">
        <span className="fallback-text">[ WAITING FOR TRAIN DEPARTURE ]</span>
      </div>
    )
  }

  const startDate = new Date(startTimeUtc).toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const startTime = new Date(startTimeUtc).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="countdown-to-start">
      <div className="countdown-label">TRAIN DEPARTS IN</div>
      <div className="countdown-digits" aria-live="polite" aria-atomic="true">
        <div className="countdown-unit">
          <span className="countdown-number">{pad(parts.days)}</span>
          <span className="countdown-unit-label">DAYS</span>
        </div>
        <span className="countdown-colon">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(parts.hours)}</span>
          <span className="countdown-unit-label">HRS</span>
        </div>
        <span className="countdown-colon">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(parts.mins)}</span>
          <span className="countdown-unit-label">MIN</span>
        </div>
        <span className="countdown-colon">:</span>
        <div className="countdown-unit">
          <span className="countdown-number">{pad(parts.secs)}</span>
          <span className="countdown-unit-label">SEC</span>
        </div>
      </div>
      <div className="countdown-date">
        {startDate} &bull; {startTime}
      </div>
    </div>
  )
}
