import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'

export default function AddVariantModal({
  categoryId, brandId, productId, productLabel, onClose,
}: { categoryId: string; brandId: string; productId: string; productLabel: string; onClose: () => void }) {
  const { addVariant } = useInventory()
  const { showToast } = useToast()
  const [size, setSize] = useState('')
  const [shop, setShop] = useState('')
  const [godown, setGodown] = useState('')
  const [price, setPrice] = useState('')
  const [limit, setLimitVal] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    const p = parseFloat(price)
    const l = parseFloat(limit)
    if (!size.trim() || !p || p <= 0 || isNaN(l)) { setError(true); return }
    addVariant(categoryId, brandId, productId, size.trim(), parseFloat(shop) || 0, parseFloat(godown) || 0, p, l, productLabel)
    showToast(`Variant "${size.trim()}" added`)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Add variant</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>New size for {productLabel}</p>
      <div className="field">
        <label>Size / metric</label>
        <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. 15L, 6 inch" />
      </div>
      <div className="flex gap-2.5">
        <div className="field flex-1">
          <label>Shop qty</label>
          <input type="number" value={shop} onChange={e => setShop(e.target.value)} placeholder="0" />
        </div>
        <div className="field flex-1">
          <label>Godown qty</label>
          <input type="number" value={godown} onChange={e => setGodown(e.target.value)} placeholder="0" />
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="field flex-1">
          <label>Purchase price</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Rs." />
        </div>
        <div className="field flex-1">
          <label>Reorder limit</label>
          <input type="number" value={limit} onChange={e => setLimitVal(e.target.value)} placeholder="e.g. 10" />
        </div>
      </div>
      {error && <div className="text-[11.5px] mb-2" style={{ color: 'var(--barn-ink)' }}>Fill in size, price, and limit.</div>}
      <div className="flex gap-2.5 mt-3">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Add variant</button>
      </div>
    </Modal>
  )
}
