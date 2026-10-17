import { formatMoney } from './justgiving'
import './overlays/overlays.css'

// Progress bar towards the fundraising target, e.g. "£3,924.85 (98.1%)"
export default function DonationProgress({ totals, color, className = '', targetLabel = '' }) {
  const { raised, target, currencyCode } = totals
  const percent = target > 0 ? (raised / target) * 100 : 0

  return (
    <div className={`jg-total ${className}`}>
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
      {target > 0 && (
        <div className="jg-total__target">
          {targetLabel}
          {formatMoney(target, currencyCode)}
        </div>
      )}
    </div>
  )
}
