import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'

export default function AdjustModal({ variantId, label, onClose }: { variantId: string; label: string; onClose: () => void }) {
  const { adjustStock } = useInventory()
  const { showToast } = useToast()
  const [location, setLocation] = useState<'shop' | 'godown'>('shop')
  const [sign, setSign] = useState<1 | -1>(1)
  const [qty, setQty] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    const q = parseFloat(qty)
    if (!q || q <= 0 || !reason.trim()) { setError(true); return }
    adjustStock(variantId, location, sign, q, reason.trim(), label)
    showToast(`Adjustment recorded — ${reason.trim()}`)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Adjust quantity</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>{label} · for cash / no-bill transactions</p>
      <div className="field">
        <label>Location</label>
        <select value={location} onChange={e => setLocation(e.target.value as 'shop' | 'godown')}>
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
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Cash sale, no bill" />
        {error && <div className="text-[11.5px] mt-1" style={{ color: 'var(--barn-ink)' }}>Enter a quantity and reason.</div>}
      </div>
      <div className="flex gap-2.5 mt-5">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Confirm adjustment</button>
      </div>
    </Modal>
  )
}
