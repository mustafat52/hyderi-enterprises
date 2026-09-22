import { useState } from 'react'
import { useInventory, type FlatVariant } from '../state/InventoryContext'
import { useToast } from '../utils/ToastContext'
import { fmt } from '../utils/format'
import type { SaleLineItem } from '../types'

export default function SalePage() {
  const { allVariants, submitSale, sales } = useInventory()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<SaleLineItem[]>([])

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
      label, qty: 1, source: 'shop',
    }])
    setQuery('')
  }

  function updateQty(variantId: string, raw: string) {
    setItems(prev => prev.map(i => {
      if (i.variantId !== variantId) return i
      const num = raw === '' ? 0 : parseFloat(raw)
      return { ...i, qty: isNaN(num) ? 0 : num }
    }))
  }

  function clampQty(variantId: string) {
    setItems(prev => prev.map(i => (i.variantId === variantId && i.qty < 1 ? { ...i, qty: 1 } : i)))
  }

  function updateSource(variantId: string, source: 'shop' | 'godown') {
    setItems(prev => prev.map(i => (i.variantId === variantId ? { ...i, source } : i)))
  }

  function removeItem(variantId: string) {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }

  function complete() {
    if (items.length === 0) return
    submitSale(items)
    showToast(`Sale recorded — ${items.length} item${items.length === 1 ? '' : 's'}`)
    setItems([])
  }

  function availableFor(item: SaleLineItem): number {
    const v = allVariants.find(x => x.id === item.variantId)
    if (!v) return 0
    return item.source === 'shop' ? v.shop : v.godown
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Sale</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>
          For stock going out to a customer. Add everything sold, pick where each item came from, and submit once.
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
                <span className="font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>{m.shop} shop · {m.godown} godown</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {items.length === 0 && (
          <div className="panel text-center py-10">
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No items added yet. Search above to add what's being sold.</p>
          </div>
        )}
        {items.map(item => {
          const available = availableFor(item)
          const short = item.qty > available
          return (
            <div key={item.variantId} className="panel mb-2.5 !py-3.5">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="text-[13.5px] font-medium">{item.label}</p>
                <button onClick={() => removeItem(item.variantId)} className="text-[11px] font-semibold" style={{ color: 'var(--barn-ink)' }}>Remove</button>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex-1 min-w-[90px]">
                  <div className="vlabel">From</div>
                  <select
                    value={item.source}
                    onChange={e => updateSource(item.variantId, e.target.value as 'shop' | 'godown')}
                    style={{ padding: '7px 9px' }}
                  >
                    <option value="shop">Shop</option>
                    <option value="godown">Godown</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[80px]">
                  <div className="vlabel">Qty</div>
                  <input
                    type="number" inputMode="numeric" min={1}
                    value={item.qty === 0 ? '' : item.qty}
                    onChange={e => updateQty(item.variantId, e.target.value)}
                    onBlur={() => clampQty(item.variantId)}
                    className="w-full"
                    style={{ padding: '7px 9px' }}
                  />
                </div>
                <div className="flex-1 min-w-[80px] text-right">
                  <div className="vlabel">Available</div>
                  <div className="vval" style={{ color: short ? 'var(--barn-ink)' : 'var(--ink)' }}>{available}</div>
                </div>
              </div>
              {short && (
                <p className="text-[11px] mt-2" style={{ color: 'var(--barn-ink)' }}>
                  Only {available} available at {item.source === 'shop' ? 'Shop' : 'Godown'} — this will go to 0, not negative.
                </p>
              )}
            </div>
          )
        })}
      </div>

      <button
        className="mini-btn solid w-full !py-3 !text-[14px] mt-2"
        disabled={items.length === 0}
        style={{ opacity: items.length === 0 ? 0.5 : 1 }}
        onClick={complete}
      >
        Submit sale {items.length > 0 ? `— ${items.length} item${items.length === 1 ? '' : 's'}` : ''}
      </button>

      {sales.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-[16px]">Recent sales</h2>
            <div className="rule-line" />
          </div>
          {sales.slice(0, 5).map(s => (
            <div key={s.id} className="log-row">
              <div className="log-dot" style={{ background: 'var(--barn)' }} />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium">{s.saleNo}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>{s.items.length} item{s.items.length === 1 ? '' : 's'}</p>
                </div>
                <p className="font-mono text-[13px] font-semibold">{fmt(s.items.reduce((sum, i) => sum + i.qty, 0))} units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}