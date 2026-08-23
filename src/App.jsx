import { useState } from 'react'
import { Presets, SplitFlap } from 'react-split-flap'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <header>
          <h1>RAID TRAIN</h1>
          <div id="clock">
            <SplitFlap
              value={new Date().toLocaleTimeString()}
              presets={Presets.NUM}
              width={100}
              height={100}
            />
          </div>
        </header>

        <div class="now-panel">
          <div class="now-info">
            <div class="now-label">NOW DEPARTING</div>
            <div id="now-name">
              <SplitFlap
                value="STAND BY"
                presets={Presets.ALPHA}
                width={300}
                height={100}
              />
            </div>
            <div class="next-label">NEXT DEPARTURE IN</div>
            <div id="countdown">
              <SplitFlap
                value="00:00:00"
                presets={Presets.NUM}
                width={300}
                height={100}
              />
            </div>
          </div>
          <div id="twitch-wrap"></div>
        </div>

     
      </div>
    </>
  )
}

export default App
