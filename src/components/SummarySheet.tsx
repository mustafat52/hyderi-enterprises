import { useNavigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { fmt, rupee, timeAgo } from '../utils/format'

export default function SummarySheet({ onClose }: { onClose: () => void }) {
  const { log, allVariants } = useInventory()
  const navigate = useNavigate()

  const lowCount = allVariants.filter(v => v.total < v.limit).length
  const syncEntries = log.filter(l => l.method === 'sync').slice(0, 6)
  const todaysSalesValue = 40200 // illustrative — would come from real Tally sync totals

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
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Bills today</div>
            <div className="font-mono text-lg font-semibold mt-1">{syncEntries.filter(s => s.description.includes('bill')).length}</div>
          </div>
          <div className="panel !p-3">
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Today's sales</div>
            <div className="font-mono text-lg font-semibold mt-1">{rupee(todaysSalesValue)}</div>
          </div>
          <div className="panel !p-3" style={{ borderTop: '3px solid var(--barn)' }}>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>Alerts</div>
            <div className="font-mono text-lg font-semibold mt-1" style={{ color: 'var(--barn-ink)' }}>{lowCount}</div>
          </div>
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--ink-faint)' }}>Recent Tally activity</div>
        <div className="mb-5">
          {syncEntries.length === 0 && <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>No sync activity yet.</p>}
          {syncEntries.map(e => (
            <div key={e.id} className="log-row">
              <div className="log-dot" style={{ background: 'var(--sage)' }} />
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
