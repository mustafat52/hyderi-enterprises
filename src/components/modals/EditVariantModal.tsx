import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'

const REASON_OPTIONS = [
  'Customer return',
  'Damaged / expired',
  'Returned to supplier',
  'Stock count correction',
  'Other',
]

export default function EditVariantModal({
  variantId, label, currentLimit, onClose,
}: { variantId: string; label: string; currentLimit: number; onClose: () => void }) {
  const { adjustStock, setLimit } = useInventory()
  const { showToast } = useToast()

  const [location, setLocationVal] = useState<'shop' | 'godown'>('shop')
  const [sign, setSign] = useState<1 | -1>(1)
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState(REASON_OPTIONS[0])
  const [otherReason, setOtherReason] = useState('')
  const [adjustError, setAdjustError] = useState(false)

  const [limit, setLimitVal] = useState(String(currentLimit))

  const isOther = reason === 'Other'

  function submitAdjust() {
    const q = parseFloat(qty)
    const finalReason = isOther ? otherReason.trim() : reason
    if (!q || q <= 0 || !finalReason) { setAdjustError(true); return }
    adjustStock(variantId, location, sign, q, finalReason, label)
    showToast(`Adjustment recorded — ${finalReason}`)
    setQty('')
    setReason(REASON_OPTIONS[0])
    setOtherReason('')
    setAdjustError(false)
  }

  function submitLimit() {
    const l = parseFloat(limit)
    if (isNaN(l)) return
    setLimit(variantId, l)
    showToast('Reorder limit updated')
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Edit variant</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>{label}</p>

      <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: 'var(--ink-faint)' }}>Adjust quantity</div>
      <p className="text-[11.5px] mb-3" style={{ color: 'var(--ink-soft)' }}>For rare cases only — customer returns, damage, or count corrections. Use Purchase, Sale, or Move for everyday stock changes.</p>
      <div className="field">
        <label>Location</label>
        <select value={location} onChange={e => setLocationVal(e.target.value as 'shop' | 'godown')}>
          <option value="shop">Shop</option>
          <option value="godown">Godown</option>
        </select>
      </div>
      <div className="flex gap-2.5">
        <div className="field flex-1">
          <label>Change</label>
          <select value={sign} onChange={e => setSign(Number(e.target.value) as 1 | -1)}>
            <option value={1}>Increase (+)</option>
            <option value={-1}>Decrease (−)</option>
          </select>
        </div>
        <div className="field flex-1">
          <label>Quantity</label>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 3" />
        </div>
      </div>
      <div className="field">
        <label>Reason</label>
        <select value={reason} onChange={e => setReason(e.target.value)}>
          {REASON_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {isOther && (
        <div className="field">
          <label>Describe reason</label>
          <input type="text" value={otherReason} onChange={e => setOtherReason(e.target.value)} placeholder="e.g. Water damage during monsoon" />
        </div>
      )}
      {adjustError && <div className="text-[11.5px] mb-2 -mt-1" style={{ color: 'var(--barn-ink)' }}>Enter a quantity{isOther ? ' and describe the reason' : ''}.</div>}
      <button className="mini-btn solid w-full !py-2.5 mb-6" onClick={submitAdjust}>Save adjustment</button>

      <div style={{ borderTop: '1px solid var(--rule-soft)', paddingTop: 18 }}>
        <div className="text-[11px] font-semibold uppercase tracking-wide mb-2.5" style={{ color: 'var(--ink-faint)' }}>Reorder limit</div>
        <div className="field">
          <label>Alert when Shop stock falls below</label>
          <input type="number" value={limit} onChange={e => setLimitVal(e.target.value)} />
        </div>
        <button className="mini-btn w-full !py-2.5" onClick={submitLimit}>Save limit</button>
      </div>

      <button className="mini-btn w-full !py-2.5 mt-5" onClick={onClose}>Done</button>
    </Modal>
  )
}