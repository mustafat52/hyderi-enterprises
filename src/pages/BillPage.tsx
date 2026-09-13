import { useState } from 'react'
import { useInventory, type FlatVariant } from '../state/InventoryContext'
import { useToast } from '../utils/ToastContext'
import { rupee } from '../utils/format'
import type { BillLineItem } from '../types'

export default function BillPage() {
  const { allVariants, submitBill, bills } = useInventory()
  const { showToast } = useToast()
  const [customerName, setCustomerName] = useState('')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<BillLineItem[]>([])

  const matches: FlatVariant[] = query.trim().length >= 2
    ? allVariants.filter(v =>
        (v.productName.toLowerCase().includes(query.toLowerCase()) || v.brandName.toLowerCase().includes(query.toLowerCase())) &&
        !items.some(i => i.variantId === v.id)
      ).slice(0, 6)
    : []

  function addItem(v: FlatVariant) {
    const label = `${v.productName} — ${v.size}`
    setItems(prev => [...prev, {
      variantId: v.id, categoryId: v.categoryId, brandId: v.brandId, productId: v.productId,
      label, qty: 1, price: v.sellingPrice, lineTotal: v.sellingPrice,
    }])
    setQuery('')
  }

  function updateItem(variantId: string, field: 'qty' | 'price', raw: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const num = raw === '' ? 0 : parseFloat(raw)
      const next = { ...i, [field]: isNaN(num) ? 0 : num }
      next.lineTotal = next.qty * next.price
      return next
    }))
  }

  function clampItem(variantId: string, field: 'qty' | 'price') {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const minVal = field === 'qty' ? 1 : 0
      if (i[field] < minVal) {
        const next = { ...i, [field]: minVal }
        next.lineTotal = next.qty * next.price
        return next
      }
      return i
    }))
  }

  function removeItem(variantId: string) {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }

  const total = items.reduce((s, i) => s + i.lineTotal, 0)

  function complete() {
    if (items.length === 0) return
    submitBill(customerName, items)
    showToast(`Cash bill recorded — ${rupee(total)}`)
    setItems([])
    setCustomerName('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">New Bill</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>
          For cash / no-GST walk-in sales that never go through Tally. Submitting deducts stock from the Shop automatically and keeps a full record — separate from GST sales.
        </p>
      </div>

      <div className="field">
        <label>Customer name (optional)</label>
        <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Walk-in Customer" />
      </div>

      <div className="field" style={{ position: 'relative' }}>
        <label>Add products</label>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search product or brand…" />
        {matches.length > 0 && (
          <div style={{ border: '1px solid var(--rule)', background: 'var(--card)', marginTop: 4 }}>
            {matches.map(m => (
              <button
                key={m.id}
                onClick={() => addItem(m)}
                className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2"
                style={{ borderBottom: '1px solid var(--rule-soft)' }}
              >
                <span className="text-[13px]">{m.productName} — {m.size}</span>
                <span className="font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>{rupee(m.sellingPrice)} · {m.shop} in shop</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {items.length === 0 && (
          <div className="panel text-center py-10">
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No items added yet. Search above to build the bill.</p>
          </div>
        )}
        {items.map(item => (
          <div key={item.variantId} className="panel mb-2.5 !py-3.5">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <p className="text-[13.5px] font-medium">{item.label}</p>
              <button onClick={() => removeItem(item.variantId)} className="text-[11px] font-semibold" style={{ color: 'var(--barn-ink)' }}>Remove</button>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex-1 min-w-[70px]">
                <div className="vlabel">Qty</div>
                <input
                  type="number" inputMode="numeric" min={1}
                  value={item.qty === 0 ? '' : item.qty}
                  onChange={e => updateItem(item.variantId, 'qty', e.target.value)}
                  onBlur={() => clampItem(item.variantId, 'qty')}
                  className="w-full"
                  style={{ padding: '7px 9px' }}
                />
              </div>
              <div className="flex-1 min-w-[85px]">
                <div className="vlabel">Price / unit</div>
                <input
                  type="number" inputMode="numeric"
                  value={item.price === 0 ? '' : item.price}
                  onChange={e => updateItem(item.variantId, 'price', e.target.value)}
                  onBlur={() => clampItem(item.variantId, 'price')}
                  className="w-full"
                  style={{ padding: '7px 9px' }}
                />
              </div>
              <div className="flex-1 min-w-[70px] text-right">
                <div className="vlabel">Line total</div>
                <div className="vval">{rupee(item.lineTotal)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="ledger-hero grid grid-cols-1 mt-2 mb-5">
          <div className="p-5">
            <div className="ledger-row"><div className="ll">Items</div><div className="lv">{items.length}</div></div>
            <div className="ledger-row"><div className="ll font-display-italic">Total amount</div><div className="lv">{rupee(total)}</div></div>
          </div>
        </div>
      )}

      <button
        className="mini-btn solid w-full !py-3 !text-[14px]"
        disabled={items.length === 0}
        style={{ opacity: items.length === 0 ? 0.5 : 1 }}
        onClick={complete}
      >
        Complete bill — {rupee(total)}
      </button>

      {bills.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-[16px]">Recent cash bills</h2>
            <div className="rule-line" />
          </div>
          {bills.slice(0, 5).map(b => (
            <div key={b.id} className="log-row">
              <div className="log-dot" style={{ background: 'var(--marigold)' }} />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium">{b.billNo} · {b.customerName}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>{b.items.length} item{b.items.length === 1 ? '' : 's'}</p>
                </div>
                <p className="font-mono text-[13px] font-semibold">{rupee(b.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}