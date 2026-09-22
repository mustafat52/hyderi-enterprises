import { useState } from 'react'
import { useInventory } from '../state/InventoryContext'
import type { LogMethod } from '../types'
import { timeAgo } from '../utils/format'

const filters: { key: LogMethod | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'purchase', label: 'Purchases' },
  { key: 'sale', label: 'Sales' },
  { key: 'transfer', label: 'Moves' },
  { key: 'adjustment', label: 'Adjustments' },
  { key: 'new-item', label: 'New items' },
  { key: 'sync', label: 'Tally sync (old)' },
]

const methodColor: Record<LogMethod, string> = {
  sync: 'var(--sage)',
  purchase: '#8A6A3C',
  transfer: '#3C5D78',
  sale: 'var(--barn)',
  adjustment: 'var(--marigold)',
  'new-item': 'var(--teal)',
}
const methodLabel: Record<LogMethod, string> = {
  sync: 'Tally sync',
  purchase: 'Purchase',
  transfer: 'Move',
  sale: 'Sale',
  adjustment: 'Adjustment',
  'new-item': 'New item',
}
const methodBg: Record<LogMethod, string> = {
  sync: 'rgba(85,112,63,0.12)',
  purchase: 'rgba(138,106,60,0.14)',
  transfer: 'rgba(60,93,120,0.12)',
  sale: 'rgba(153,55,42,0.12)',
  adjustment: 'rgba(185,122,28,0.15)',
  'new-item': 'rgba(31,92,88,0.12)',
}

export default function StockLog() {
  const { log } = useInventory()
  const [filter, setFilter] = useState<LogMethod | 'all'>('all')
  const filtered = filter === 'all' ? log : log.filter(l => l.method === filter)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Stock log</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>Every stock change — who, what, and how — for a full audit trail.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="text-[12px] font-semibold px-3 py-1.5"
            style={{
              border: '1px solid var(--ink)',
              background: filter === f.key ? 'var(--ink)' : 'var(--card)',
              color: filter === f.key ? 'var(--card)' : 'var(--ink)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="panel">
        {filtered.map(e => (
          <div key={e.id} className="log-row">
            <div className="log-dot" style={{ background: methodColor[e.method] }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[13.5px]">{e.description}</p>
                <span className="method-tag" style={{ background: methodBg[e.method], color: methodColor[e.method] }}>{methodLabel[e.method]}</span>
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--ink-faint)' }}>{e.actor} · {timeAgo(e.ts)}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-[13px] py-4" style={{ color: 'var(--ink-soft)' }}>No entries for this filter yet.</p>}
      </div>
    </div>
  )
}