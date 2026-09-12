import { useState } from 'react'
import Modal from '../Modal'
import { useInventory } from '../../state/InventoryContext'
import { useModalController } from '../../state/ModalController'

export default function QuickUpdateModal({ onClose }: { onClose: () => void }) {
  const { allVariants } = useInventory()
  const { open } = useModalController()
  const [query, setQuery] = useState('')

  const matches = query.trim().length >= 2
    ? allVariants.filter(v =>
        v.productName.toLowerCase().includes(query.toLowerCase()) ||
        v.brandName.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  function pick(variantId: string, label: string, action: 'transfer' | 'adjust') {
    onClose()
    setTimeout(() => open(action === 'transfer' ? { type: 'transfer', variantId, label } : { type: 'adjust', variantId, label }), 10)
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="text-[19px] mb-1">Quick update</h3>
      <p className="text-[12.5px] mb-4" style={{ color: 'var(--ink-soft)' }}>Search a product to transfer or adjust its stock.</p>
      <div className="field">
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Type product or brand name…" autoFocus
        />
      </div>
      {query.trim().length >= 2 && matches.length === 0 && (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>No matches found.</p>
      )}
      <div>
        {matches.map(m => {
          const label = `${m.productName} — ${m.size}`
          return (
            <div key={m.id} className="flex items-center justify-between gap-2 py-2.5" style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <div className="min-w-0">
                <p className="text-[13px] font-medium truncate">{label}</p>
                <p className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName} · Shop {m.shop} / Godown {m.godown}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="mini-btn" onClick={() => pick(m.id, label, 'adjust')}>Adjust</button>
                <button className="mini-btn solid" onClick={() => pick(m.id, label, 'transfer')}>Transfer</button>
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
