import { useNavigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { fmt, timeAgo } from '../utils/format'
import { getStockStatus } from '../utils/stock'

const logDotColor: Record<string, string> = {
  purchase: '#8A6A3C',
  transfer: '#3C5D78',
  sale: 'var(--barn)',
  adjustment: 'var(--marigold)',
  'new-item': 'var(--teal)',
}

function isToday(ts: number): boolean {
  const d = new Date(ts)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

export default function SummarySheet({ onClose }: { onClose: () => void }) {
  const { log, allVariants, purchases, sales } = useInventory()
  const navigate = useNavigate()

  const lowCount = allVariants.filter(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy').length
  const purchasesToday = purchases.filter(p => isToday(p.ts)).length
  const salesToday = sales.filter(s => isToday(s.ts)).length
  const recent = log.slice(0, 6)

  function go(path: string) {
    onClose()
    navigate(path)
  }

  return (
    <div className="slideover-backdrop" onClick={onClose}>
      <div className="slideover-panel" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg">Today's summary</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', fontSize: 16, color: 'var(--ink-soft)' }}>✕</button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="panel !p-3">
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Purchases today</div>
            <div className="font-mono text-lg font-semibold mt-1">{purchasesToday}</div>
          </div>
          <div className="panel !p-3">
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Sales today</div>
            <div className="font-mono text-lg font-semibold mt-1">{salesToday}</div>
          </div>
          <div className="panel !p-3" style={{ borderTop: '3px solid var(--barn)' }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Alerts</div>
            <div className="font-mono text-lg font-semibold mt-1" style={{ color: 'var(--barn-ink)' }}>{lowCount}</div>
          </div>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ink-faint)' }}>Recent activity</div>
        <div className="mb-5">
          {recent.length === 0 && <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No activity yet.</p>}
          {recent.map(e => (
            <div key={e.id} className="log-row">
              <div className="log-dot" style={{ background: logDotColor[e.method] || 'var(--ink-faint)' }} />
              <div className="flex-1">
                <p className="text-[12.5px]" style={{ color: 'var(--ink)' }}>{e.description}</p>
                <p className="text-[10.5px] font-mono mt-0.5" style={{ color: 'var(--ink-faint)' }}>{timeAgo(e.ts)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button className="mini-btn solid !text-[13px] !py-2.5" onClick={() => go('/alerts')}>View {fmt(lowCount)} alert{lowCount === 1 ? '' : 's'}</button>
          <button className="mini-btn !text-[13px] !py-2.5" onClick={() => go('/log')}>View full stock log</button>
        </div>
      </div>
    </div>
  )
}