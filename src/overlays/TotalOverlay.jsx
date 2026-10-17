import { useFundraiser, useOverlayOptions, useTransparentBackground } from '../justgiving'
import DonationProgress from '../DonationProgress'
import OverlayError from './OverlayError'
import './overlays.css'

export default function TotalOverlay() {
  useTransparentBackground()
  const { page, intervalMs, color } = useOverlayOptions()
  const { totals, error } = useFundraiser({ page, intervalMs })

  if (!totals) return <OverlayError error={error} />
  return <DonationProgress totals={totals} color={color} />
}
