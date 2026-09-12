import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'

export default function LimitModal({ variantId, label, currentLimit, onClose }: { variantId: string; label: string; currentLimit: number; onClose: () => void }) {
  const { setLimit } = useInventory()
  const { showToast } = useToast()
  const [limit, setLimitVal] = useState(String(currentLimit))

  function submit() {
    const l = parseFloat(limit)
    if (isNaN(l)) return
    setLimit(variantId, l)
    showToast('Reorder limit updated')
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Set reorder limit</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>{label}</p>
      <div className="field">
        <label>Alert when total stock falls below</label>
        <input type="number" value={limit} onChange={e => setLimitVal(e.target.value)} />
      </div>
      <div className="flex gap-2.5 mt-5">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Save limit</button>
      </div>
    </Modal>
  )
}
