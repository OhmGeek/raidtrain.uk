import { formatMoney, useFundraiser, useOverlayOptions, useTransparentBackground } from '../justgiving'
import OverlayError from './OverlayError'
import './overlays.css'

// Progress bar towards the fundraising target, e.g. "£3,924.85 (98.1%)"
export default function TotalOverlay() {
  useTransparentBackground()
  const { page, intervalMs, color } = useOverlayOptions()
  const { totals, error } = useFundraiser({ page, intervalMs })

  if (!totals) return <OverlayError error={error} />

  const { raised, target, currencyCode } = totals
  const percent = target > 0 ? (raised / target) * 100 : 0

  return (
    <div className="jg-total">
      <div className="jg-total__track">
        <div
          className="jg-total__fill"
          style={{ width: `${Math.min(percent, 100)}%`, ...(color && { background: color }) }}
        />
        <div className="jg-total__label">
          {formatMoney(raised, currencyCode)}
          {target > 0 && ` (${percent.toFixed(1)}%)`}
        </div>
      </div>
      {target > 0 && <div className="jg-total__target">{formatMoney(target, currencyCode)}</div>}
    </div>
  )
}
