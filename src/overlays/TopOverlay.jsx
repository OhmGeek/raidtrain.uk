import { formatMoney, useFundraiser, useOverlayOptions, useTransparentBackground } from '../justgiving'
import OverlayError from './OverlayError'
import './overlays.css'

export default function TopOverlay() {
  useTransparentBackground()
  const { page, intervalMs, limit } = useOverlayOptions()
  const { totals, donations, error } = useFundraiser({ page, intervalMs, donations: true, allDonations: true })

  if (!totals) return <OverlayError error={error} />

  // Hidden amounts can't be ranked; ties go to whoever donated first
  const top = donations
    .filter((d) => d.amount !== null)
    .sort((a, b) => b.amount - a.amount || a.date - b.date)
    .slice(0, limit)

  return (
    <div className="jg-list">
      <div className="jg-list__title">Top donations</div>
      {top.map((d, i) => (
        <div key={d.id} className="jg-list__row">
          <span className="jg-list__rank">{i + 1}</span>
          <span className="jg-list__name">{d.name}</span>
          <span className="jg-list__amount">{formatMoney(d.amount, totals.currencyCode)}</span>
        </div>
      ))}
    </div>
  )
}
