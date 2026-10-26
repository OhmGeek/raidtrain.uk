import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SchedulePage from './SchedulePage.jsx'
import CommandsPage from './CommandsPage.jsx'
import OverlaysPage from './overlays/OverlaysPage.jsx'
import TotalOverlay from './overlays/TotalOverlay.jsx'
import RecentOverlay from './overlays/RecentOverlay.jsx'
import TopOverlay from './overlays/TopOverlay.jsx'

// Keep old hash links (e.g. /#/schedule) working after the move to real paths
if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

// New routes also need adding to STATIC_ROUTES in vite.config.js
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/commands" element={<CommandsPage />} />
        <Route path="/overlays" element={<OverlaysPage />} />
        <Route path="/overlay/total" element={<TotalOverlay />} />
        <Route path="/overlay/recent" element={<RecentOverlay />} />
        <Route path="/overlay/top" element={<TopOverlay />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
