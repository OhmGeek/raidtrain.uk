import { useState, useEffect } from 'react'
import { Presets, SplitFlap } from 'react-split-flap'
import './App.css'
import TwitchPlayer from './TwitchPlayer'
import DepartureBoard from './DepartureBoard'

// 1. Define your schedule configuration here
const RAID_SCHEDULE = [
  { name: 'SONIC STYLE', channel: 'Sonic_STYLE1', durationMinutes: 15 },
  { name: 'STREAMER TWO', channel: 'ohmgeek', durationMinutes: 15 },
  { name: 'STREAMER THREE', channel: 'foxandkoala', durationMinutes: 30 },
  { name: 'TRAIN END', channel: 'twitch', durationMinutes: 0 } // Terminal stop
]

function App() {
  const [timeString, setTimeString] = useState('')
  const [countdownString, setCountdownString] = useState('00:00:00')

  // Track indices and scheduling reference anchors
  const [scheduleIndex, setScheduleIndex] = useState(0)
  const [trainStartTime] = useState(() => Date.now())

  // Process active streamer state dynamically
  const activeStreamer = RAID_SCHEDULE[scheduleIndex] || RAID_SCHEDULE[RAID_SCHEDULE.length - 1]

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const elapsedMs = now - trainStartTime

      // 1. Sync live system clock
      setTimeString(new Date().toLocaleTimeString())

      // 2. Determine active streamer block based on elapsed time
      let accumulatedMs = 0
      let currentIdx = RAID_SCHEDULE.length - 1

      for (let i = 0; i < RAID_SCHEDULE.length; i++) {
        const blockMs = RAID_SCHEDULE[i].durationMinutes * 60 * 1000
        if (elapsedMs >= accumulatedMs && elapsedMs < accumulatedMs + blockMs) {
          currentIdx = i
          break
        }
        accumulatedMs += blockMs
      }

      if (currentIdx !== scheduleIndex) {
        setScheduleIndex(currentIdx)
      }

      // 3. Compute remaining time for current block
      const currentBlockEnd = trainStartTime + accumulatedMs + (RAID_SCHEDULE[currentIdx]?.durationMinutes * 60 * 1000 || 0)
      const distance = currentBlockEnd - now

      if (distance <= 0 || currentIdx === RAID_SCHEDULE.length - 1) {
        setCountdownString('00:00:00')
      } else {
        const hours = Math.floor(distance / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setCountdownString(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        )
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [scheduleIndex, trainStartTime])

  return (
    <>
      <div className="train-station-container">
        <header>
          <h1>RAID TRAIN</h1>
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
                value={activeStreamer.name}
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
            <TwitchPlayer channel={activeStreamer.channel} />
          </div>
        </div>

        {/* 2. THE UPCOMING DEPARTURES SCHEDULE BOARD */}
        <DepartureBoard schedule={RAID_SCHEDULE} currentIndex={scheduleIndex} trainStartTime={trainStartTime} />
      </div>
    </>
  )
}

export default App
