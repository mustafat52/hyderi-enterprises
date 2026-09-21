import { useState } from 'react'
import { useInventory, type FlatVariant } from '../state/InventoryContext'
import { useToast } from '../utils/ToastContext'
import { fmt, rupee } from '../utils/format'
import type { PurchaseLineItem } from '../types'

export default function PurchasePage() {
  const { allVariants, submitPurchase, purchases } = useInventory()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<PurchaseLineItem[]>([])

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
      label, totalQty: 1, shopQty: 1, godownQty: 0, price: v.price,
    }])
    setQuery('')
  }

  function updateTotal(variantId: string, raw: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const num = raw === '' ? 0 : parseFloat(raw)
      const totalQty = isNaN(num) ? 0 : num
      const shopQty = Math.min(i.shopQty, totalQty)
      return { ...i, totalQty, shopQty, godownQty: Math.max(0, totalQty - shopQty) }
    }))
  }

  function updateShop(variantId: string, raw: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const num = raw === '' ? 0 : parseFloat(raw)
      const shopQty = Math.max(0, Math.min(isNaN(num) ? 0 : num, i.totalQty))
      return { ...i, shopQty, godownQty: Math.max(0, i.totalQty - shopQty) }
    }))
  }

  function updatePrice(variantId: string, raw: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const num = raw === '' ? 0 : parseFloat(raw)
      return { ...i, price: isNaN(num) ? 0 : num }
    }))
  }

  function clampMin1Total(variantId: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId || i.totalQty >= 1) return i
      const totalQty = 1
      const shopQty = Math.min(i.shopQty, totalQty)
      return { ...i, totalQty, shopQty, godownQty: Math.max(0, totalQty - shopQty) }
    }))
  }

  function removeItem(variantId: string) {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }

  function complete() {
    if (items.length === 0) return
    submitPurchase(items)
    showToast(`Purchase recorded — ${items.length} item${items.length === 1 ? '' : 's'}`)
    setItems([])
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Purchase (Stock In)</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>
          For stock arriving from a supplier. Add everything on the delivery, split each item between Shop and Godown, and submit once.
        </p>
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
                <span className="font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>last price {rupee(m.price)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {items.length === 0 && (
          <div className="panel text-center py-10">
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No items added yet. Search above to add what's arrived.</p>
          </div>
        )}
        {items.map(item => (
          <div key={item.variantId} className="panel mb-2.5 !py-3.5">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <p className="text-[13.5px] font-medium">{item.label}</p>
              <button onClick={() => removeItem(item.variantId)} className="text-[11px] font-semibold" style={{ color: 'var(--barn-ink)' }}>Remove</button>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
              <div className="flex-1 min-w-[80px]">
                <div className="vlabel">Total qty</div>
                <input
                  type="number" inputMode="numeric" min={1}
                  value={item.totalQty === 0 ? '' : item.totalQty}
                  onChange={e => updateTotal(item.variantId, e.target.value)}
                  onBlur={() => clampMin1Total(item.variantId)}
                  className="w-full"
                  style={{ padding: '7px 9px' }}
                />
              </div>
              <div className="flex-1 min-w-[80px]">
                <div className="vlabel">To Shop</div>
                <input
                  type="number" inputMode="numeric" min={0}
                  value={item.shopQty}
                  onChange={e => updateShop(item.variantId, e.target.value)}
                  className="w-full"
                  style={{ padding: '7px 9px' }}
                />
              </div>
              <div className="flex-1 min-w-[80px]">
                <div className="vlabel">To Godown</div>
                <div className="vval" style={{ padding: '7px 0' }}>{item.godownQty}</div>
              </div>
            </div>
            <div className="w-[130px]">
              <div className="vlabel">Purchase price / unit</div>
              <input
                type="number" inputMode="numeric"
                value={item.price === 0 ? '' : item.price}
                onChange={e => updatePrice(item.variantId, e.target.value)}
                className="w-full"
                style={{ padding: '7px 9px' }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        className="mini-btn solid w-full !py-3 !text-[14px] mt-2"
        disabled={items.length === 0}
        style={{ opacity: items.length === 0 ? 0.5 : 1 }}
        onClick={complete}
      >
        Submit purchase {items.length > 0 ? `— ${items.length} item${items.length === 1 ? '' : 's'}` : ''}
      </button>

      {purchases.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-[16px]">Recent purchases</h2>
            <div className="rule-line" />
          </div>
          {purchases.slice(0, 5).map(p => (
            <div key={p.id} className="log-row">
              <div className="log-dot" style={{ background: 'var(--sage)' }} />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium">{p.purchaseNo}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>{p.items.length} item{p.items.length === 1 ? '' : 's'}</p>
                </div>
                <p className="font-mono text-[13px] font-semibold">{fmt(p.items.reduce((s, i) => s + i.totalQty, 0))} units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}