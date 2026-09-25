import { Link } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'
import { fmt, pct, rupee, timeAgo } from '../utils/format'
import { getStockStatus } from '../utils/stock'

const logDotColor: Record<string, string> = {
  purchase: '#8A6A3C',
  transfer: '#3C5D78',
  sale: 'var(--barn)',
  adjustment: 'var(--marigold)',
  'new-item': 'var(--teal)',
}

export default function Dashboard() {
  const { categories, allVariants, log, resetDemo } = useInventory()
  const { open } = useModalController()

  const low = allVariants.filter(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy')
  const shopVal = allVariants.reduce((s, v) => s + v.shop * v.price, 0)
  const godownVal = allVariants.reduce((s, v) => s + v.godown * v.price, 0)

  const byCat = categories.map(c => {
    const vs = allVariants.filter(v => v.categoryId === c.id)
    return { name: c.name, val: vs.reduce((s, v) => s + v.total, 0), color: c.colors[0] }
  })
  const maxVal = Math.max(...byCat.map(b => b.val), 1)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-16">
      <div className="ledger-hero grid grid-cols-1 md:grid-cols-2 mt-6 mb-8">
        <div className="p-6 md:p-8" style={{ borderBottom: '1px solid var(--rule)' }}>
          <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>Welcome back,</p>
          <h1 className="text-[22px] mt-0.5 mb-5">Hyderi Enterprises <span style={{ fontSize: 17 }}>👋</span></h1>

          <div className="grid grid-cols-2 gap-x-5 gap-y-4 pb-5" style={{ borderBottom: '1px dotted var(--rule)' }}>
            <div>
              <div className="sn">{allVariants.length}</div>
              <div className="sl">Total SKUs</div>
            </div>
            <div>
              <div className="sn" style={{ color: low.length > 0 ? 'var(--barn-ink)' : 'var(--ink)' }}>{low.length}</div>
              <div className="sl">Need reorder</div>
            </div>
            <div>
              <div className="sn">{rupee(shopVal + godownVal)}</div>
              <div className="sl">Stock value</div>
            </div>
            <div>
              <div className="sn">{categories.length}</div>
              <div className="sl">Categories</div>
            </div>
          </div>

          <div className="mt-1">
            <div className="ledger-row"><div className="ll"><span className="sw" style={{ background: 'var(--shop)' }} />Value at Shop</div><div className="lv">{rupee(shopVal)}</div></div>
            <div className="ledger-row"><div className="ll"><span className="sw" style={{ background: 'var(--godown)' }} />Value at Godown</div><div className="lv">{rupee(godownVal)}</div></div>
          </div>
        </div>
        <div className="p-6 md:p-8 flex flex-col" style={{ borderTop: '1px solid var(--rule)' }}>
          <div className="text-[11px] tracking-wide uppercase mb-3.5" style={{ color: 'var(--ink-faint)' }}>Browse by category</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(c => {
              const count = allVariants.filter(v => v.categoryId === c.id).length
              return (
                <Link key={c.id} to={`/catalog/${c.id}`} className="cat-tile" style={{ '--tilecolor': c.colors[0] } as React.CSSProperties}>
                  <div className="strip"><span className="emoji">{c.emoji}</span></div>
                  <div className="px-3.5 py-3">
                    <div className="font-semibold text-[13.5px]">{c.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{count} variants</div>
                  </div>
                </Link>
              )
            })}
          </div>
          <button
            className="mt-4 self-start text-[12px] font-semibold px-3.5 py-2"
            style={{ border: '1px dashed var(--ink-faint)', color: 'var(--ink-soft)' }}
            onClick={() => open({ type: 'addCategory' })}
          >
            + Add category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <Link
          to="/purchase"
          className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3.5 sm:p-4 text-center sm:text-left"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#8A6A3C', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8V21H3V8" /><path d="M1 3H23V8H1z" /><path d="M10 12h4" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[13.5px]">Purchase</div>
            <div className="text-[10.5px] hidden sm:block" style={{ color: 'var(--ink-soft)' }}>Stock arriving in</div>
          </div>
        </Link>
        <Link
          to="/sale"
          className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3.5 sm:p-4 text-center sm:text-left"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--barn)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[13.5px]">Sale</div>
            <div className="text-[10.5px] hidden sm:block" style={{ color: 'var(--ink-soft)' }}>Stock going out</div>
          </div>
        </Link>
        <Link
          to="/move"
          className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 p-3.5 sm:p-4 text-center sm:text-left"
          style={{ border: '1px solid var(--ink)', background: 'var(--card)' }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#3C5D78', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3 4 7l4 4" /><path d="M4 7h11a4 4 0 0 1 4 4v1" /><path d="M16 21l4-4-4-4" /><path d="M20 17H9a4 4 0 0 1-4-4v-1" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-[13.5px]">Move</div>
            <div className="text-[10.5px] hidden sm:block" style={{ color: 'var(--ink-soft)' }}>Godown ↔ Shop</div>
          </div>
        </Link>
      </div>

      <div className="flex items-baseline gap-4 mb-4 mt-11">
        <h2 className="text-[18px]">Where the stock sits</h2>
        <div className="rule-line" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-5">
        <div className="panel">
          <h3 className="text-[14.5px] mb-3.5">Units by category</h3>
          {byCat.map(b => (
            <div key={b.name} className="flex items-center gap-2.5 mb-2.5">
              <div className="w-[110px] text-[12px] flex-shrink-0" style={{ color: 'var(--ink-soft)' }}>{b.name}</div>
              <div className="flex-1 h-2" style={{ background: 'var(--paper-deep)' }}>
                <div className="h-full" style={{ width: `${pct(b.val, maxVal)}%`, background: b.color }} />
              </div>
              <div className="w-[66px] text-right font-mono text-[11px] flex-shrink-0" style={{ color: 'var(--ink-soft)' }}>{fmt(b.val)} units</div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3 className="text-[14.5px] mb-3.5">Recent activity</h3>
          {log.slice(0, 6).map(e => (
            <div key={e.id} className="log-row">
              <div className="log-dot" style={{ background: logDotColor[e.method] || 'var(--ink-faint)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px]">{e.description}</p>
                <p className="text-[10.5px] font-mono mt-0.5" style={{ color: 'var(--ink-faint)' }}>{timeAgo(e.ts)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <button
          className="text-[11.5px]"
          style={{ color: 'var(--ink-faint)' }}
          onClick={() => { if (confirm('Reset all demo data back to the starting state?')) resetDemo() }}
        >
          ↺ Reset demo data
        </button>
      </div>
    </div>
  )
}