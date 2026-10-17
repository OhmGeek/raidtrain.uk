import { formatMoney, useFundraiser, useOverlayOptions, useTransparentBackground } from '../justgiving'
import OverlayError from './OverlayError'
import './overlays.css'

export default function RecentOverlay() {
  useTransparentBackground()
  const { page, intervalMs, limit, showMessages } = useOverlayOptions()
  const { totals, donations, error } = useFundraiser({ page, intervalMs, donations: true, pageSize: limit })

  if (!totals) return <OverlayError error={error} />

  return (
    <div className="jg-list">
      <div className="jg-list__title">Recent donations</div>
      {donations.slice(0, limit).map((d) => (
        // Keyed by id so only newly arrived donations play the entry animation
        <div key={d.id} className="jg-list__row">
          <span className="jg-list__name">{d.name}</span>
          {d.amount !== null && (
            <span className="jg-list__amount">{formatMoney(d.amount, totals.currencyCode)}</span>
          )}
          {showMessages && d.message && <div className="jg-list__message">{d.message}</div>}
        </div>
      ))}
    </div>
  )
}
