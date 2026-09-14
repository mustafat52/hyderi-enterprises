import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useInventory, type FlatVariant } from '../state/InventoryContext'
import { useToast } from '../utils/ToastContext'
import { fmt } from '../utils/format'
import type { MoveLineItem } from '../types'

interface PrefillState {
  prefill?: { variantId: string; qty: number; label: string; categoryId: string; brandId: string; productId: string }
}

export default function MovePage() {
  const { allVariants, submitMove, moves } = useInventory()
  const { showToast } = useToast()
  const location = useLocation()
  const [direction, setDirection] = useState<'g2s' | 's2g'>('g2s')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState<MoveLineItem[]>([])

  useEffect(() => {
    const state = location.state as PrefillState | null
    if (state?.prefill) {
      const p = state.prefill
      setItems(prev => prev.some(i => i.variantId === p.variantId) ? prev : [...prev, {
        variantId: p.variantId, categoryId: p.categoryId, brandId: p.brandId, productId: p.productId,
        label: p.label, qty: p.qty,
      }])
      window.history.replaceState({}, '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sourceKey = direction === 'g2s' ? 'godown' : 'shop'
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
      label, qty: 1,
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

  function removeItem(variantId: string) {
    setItems(prev => prev.filter(i => i.variantId !== variantId))
  }

  function complete() {
    if (items.length === 0) return
    submitMove(direction, items)
    showToast(`Move slip recorded — ${items.length} item${items.length === 1 ? '' : 's'}`)
    setItems([])
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Move Stock</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>
          For physically moving stock between Godown and Shop. Write down everything on the trolley, submit once — quantities update automatically.
        </p>
      </div>

      <div className="field">
        <label>Direction</label>
        <select value={direction} onChange={e => setDirection(e.target.value as 'g2s' | 's2g')}>
          <option value="g2s">Godown → Shop</option>
          <option value="s2g">Shop → Godown</option>
        </select>
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
                <span className="font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {sourceKey === 'godown' ? m.godown : m.shop} in {sourceKey}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5">
        {items.length === 0 && (
          <div className="panel text-center py-10">
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No items on this slip yet. Search above to add what's being moved.</p>
          </div>
        )}
        {items.map(item => (
          <div key={item.variantId} className="panel mb-2.5 !py-3.5">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <p className="text-[13.5px] font-medium">{item.label}</p>
              <button onClick={() => removeItem(item.variantId)} className="text-[11px] font-semibold" style={{ color: 'var(--barn-ink)' }}>Remove</button>
            </div>
            <div className="w-[110px]">
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
          </div>
        ))}
      </div>

      <button
        className="mini-btn solid w-full !py-3 !text-[14px] mt-2"
        disabled={items.length === 0}
        style={{ opacity: items.length === 0 ? 0.5 : 1 }}
        onClick={complete}
      >
        Submit move slip {items.length > 0 ? `— ${items.length} item${items.length === 1 ? '' : 's'}` : ''}
      </button>

      {moves.length > 0 && (
        <div className="mt-10">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-[16px]">Recent moves</h2>
            <div className="rule-line" />
          </div>
          {moves.slice(0, 5).map(m => (
            <div key={m.id} className="log-row">
              <div className="log-dot" style={{ background: '#3C5D78' }} />
              <div className="flex-1 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-medium">{m.moveNo} · {m.direction === 'g2s' ? 'Godown → Shop' : 'Shop → Godown'}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-faint)' }}>{m.items.length} item{m.items.length === 1 ? '' : 's'}</p>
                </div>
                <p className="font-mono text-[13px] font-semibold">{fmt(m.items.reduce((s, i) => s + i.qty, 0))} units</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}