import { Link } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useAuth } from '../state/AuthContext'
import { getStockStatus } from '../utils/stock'
import { timeAgo } from '../utils/format'

const logDotColor: Record<string, string> = {
  purchase: '#8A6A3C',
  transfer: '#3C5D78',
  sale: 'var(--barn)',
  adjustment: 'var(--marigold)',
  'new-item': 'var(--teal)',
}

// Employee home: action-first, no stock-value or rupee figures anywhere, no
// Reports link. Just the three everyday actions front and center, plus a
// plain count of what needs attention. This is a deliberately separate
// component from the owner Dashboard rather than a role-conditional branch
// inside it — see the project notes on why (Task 6).
export default function EmployeeDashboard() {
  const { allVariants, log } = useInventory()
  const { currentUser } = useAuth()

  const low = allVariants.filter(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy')
  const firstName = currentUser?.name.split(' ')[0]

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-7">
        <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>Welcome back,</p>
        <h1 className="text-[24px] mt-0.5">{firstName || 'there'} <span style={{ fontSize: 18 }}>👋</span></h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <Link
          to="/purchase"
          className="flex flex-col items-center justify-center gap-2.5 py-7 text-center"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 10, background: '#8A6A3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8V21H3V8" /><path d="M1 3H23V8H1z" /><path d="M10 12h4" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[15px]">Purchase</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>Stock arriving in</div>
          </div>
        </Link>
        <Link
          to="/sale"
          className="flex flex-col items-center justify-center gap-2.5 py-7 text-center"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 10, background: 'var(--barn)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[15px]">Sale</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>Stock going out</div>
          </div>
        </Link>
        <Link
          to="/move"
          className="flex flex-col items-center justify-center gap-2.5 py-7 text-center"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 46, height: 46, borderRadius: 10, background: '#3C5D78', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3 4 7l4 4" /><path d="M4 7h11a4 4 0 0 1 4 4v1" /><path d="M16 21l4-4-4-4" /><path d="M20 17H9a4 4 0 0 1-4-4v-1" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[15px]">Move</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>Godown ↔ Shop</div>
          </div>
        </Link>
      </div>

      <Link
        to="/alerts"
        className="flex items-center justify-between gap-3 px-4 py-3.5 mb-8"
        style={{ border: '1px solid var(--rule)', background: 'var(--card)', borderLeft: low.length > 0 ? '3px solid var(--barn)' : '3px solid var(--sage)' }}
      >
        <div>
          <div className="font-semibold text-[13.5px]">{low.length === 0 ? 'Nothing needs attention' : `${low.length} item${low.length === 1 ? '' : 's'} need attention`}</div>
          <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{low.length === 0 ? 'All stock is above its reorder limit' : 'Tap to see what needs a move or a purchase'}</div>
        </div>
        <span style={{ color: 'var(--ink-faint)' }}>→</span>
      </Link>

      <div className="flex items-baseline gap-4 mb-4">
        <h2 className="text-[15px]">Recent activity</h2>
        <div className="rule-line" />
      </div>
      <div className="panel">
        {log.slice(0, 6).map(e => (
          <div key={e.id} className="log-row">
            <div className="log-dot" style={{ background: logDotColor[e.method] || 'var(--ink-faint)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px]">{e.description}</p>
              <p className="text-[10.5px] font-mono mt-0.5" style={{ color: 'var(--ink-faint)' }}>{timeAgo(e.ts)}</p>
            </div>
          </div>
        ))}
        {log.length === 0 && <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>No activity yet.</p>}
      </div>
    </div>
  )
}