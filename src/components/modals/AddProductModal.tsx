import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useToast } from '../../utils/ToastContext'
import { SWATCH_OPTIONS } from '../../data/seedData'

export default function AddProductModal({ categoryId, brandId, onClose }: { categoryId: string; brandId: string | null; onClose: () => void }) {
  const { categories, addProduct } = useInventory()
  const { showToast } = useToast()
  const category = categories.find(c => c.id === categoryId)!
  const [selectedBrand, setSelectedBrand] = useState<string>(brandId || category.brands[0]?.id || '__new__')
  const [newBrandName, setNewBrandName] = useState('')
  const [productName, setProductName] = useState('')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [limit, setLimitVal] = useState('')
  const [error, setError] = useState(false)

  function submit() {
    const p = parseFloat(price)
    const l = parseFloat(limit)
    if (!productName.trim() || !size.trim() || !p || p <= 0 || isNaN(l)) { setError(true); return }
    if (selectedBrand === '__new__' && !newBrandName.trim()) { setError(true); return }

    const brandChip = SWATCH_OPTIONS[Math.floor(Math.random() * SWATCH_OPTIONS.length)]
    addProduct(
      categoryId,
      selectedBrand === '__new__' ? null : selectedBrand,
      selectedBrand === '__new__' ? newBrandName.trim() : null,
      brandChip,
      productName.trim(),
      size.trim(),
      p,
      l
    )
    showToast(`Product "${productName.trim()}" created`)
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Add product</h3>
      <p className="text-[12.5px] mb-5" style={{ color: 'var(--ink-soft)' }}>Adding to {category.name}</p>
      <div className="field">
        <label>Sub-category / brand</label>
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
          {category.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          <option value="__new__">+ New sub-category…</option>
        </select>
      </div>
      {selectedBrand === '__new__' && (
        <div className="field">
          <label>New sub-category name</label>
          <input type="text" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} placeholder="e.g. Dulux" />
        </div>
      )}
      <div className="field">
        <label>Product name</label>
        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Weathershield Max" />
      </div>
      <div className="field">
        <label>First variant — size / metric</label>
        <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="e.g. 1L, 4L, 2 inch" />
      </div>
      <div className="flex gap-2.5">
        <div className="field flex-1">
          <label>Purchase price</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Rs." />
        </div>
        <div className="field flex-1">
          <label>Reorder limit (Shop)</label>
          <input type="number" value={limit} onChange={e => setLimitVal(e.target.value)} placeholder="e.g. 10" />
        </div>
      </div>
      {error && <div className="text-[11.5px] mb-2" style={{ color: 'var(--barn-ink)' }}>Fill in product name, variant size, price, and limit.</div>}
      <div className="flex gap-2.5 mt-3">
        <button className="mini-btn flex-1 !py-2.5" onClick={onClose}>Cancel</button>
        <button className="mini-btn solid flex-1 !py-2.5" onClick={submit}>Create product</button>
      </div>
    </Modal>
  )
}