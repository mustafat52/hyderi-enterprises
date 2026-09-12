import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'

export default function TransferModal({ variantId, label, onClose }: { variantId: string; label: string; onClose: () => void }) {
  const { transferStock } = useInventory()
  const { showToast } = useToast()
  const [direction, setDirection] = useState<'g2s' | 's2g'>('g2s')
  const [qty, setQty] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    const q = parseFloat(qty)
    if (!q || q <= 0) { setError(true); return }
    transferStock(variantId, direction, q, label)
    showToast(`Moved ${q} units (${direction === 'g2s' ? 'Godown \u2192 Shop' : 'Shop \u2192 Godown'})`)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Transfer stock</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>{label}</p>
      <div className="field">
        <label>Direction</label>
        <select value={direction} onChange={e => setDirection(e.target.value as 'g2s' | 's2g')}>
          <option value="g2s">Godown → Shop</option>
          <option value="s2g">Shop → Godown</option>
        </select>
      </div>
      <div className="field">
        <label>Quantity</label>
        <input type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 10" />
        {error && <div className="text-[11.5px] mt-1" style={{ color: 'var(--barn-ink)' }}>Enter a quantity greater than 0.</div>}
      </div>
      <div className="flex gap-2.5 mt-5">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Confirm transfer</button>
      </div>
    </Modal>
  )
}
