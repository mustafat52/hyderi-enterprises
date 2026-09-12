import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'
import { pct } from '../utils/format'

export default function Alerts() {
  const { allVariants } = useInventory()
  const { open } = useModalController()
  const low = allVariants
    .filter(v => v.total < v.limit)
    .sort((a, b) => a.total / a.limit - b.total / b.limit)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Low stock alerts</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>Items that have fallen below the limit set for them.</p>
      </div>
      <div>
        {low.map(v => {
          const label = `${v.productName} — ${v.size}`
          return (
            <div key={v.id} className="flex items-center justify-between gap-3 py-3.5" style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] truncate">{label}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{v.categoryName} · {v.brandName} · {v.total} in stock, limit is {v.limit}</div>
              </div>
              <div className="hidden sm:block w-[110px] h-1.5 flex-shrink-0" style={{ background: 'var(--paper-deep)' }}>
                <div className="h-full" style={{ width: `${pct(v.total, v.limit)}%`, background: 'var(--barn)' }} />
              </div>
              <button className="mini-btn solid flex-shrink-0" onClick={() => open({ type: 'transfer', variantId: v.id, label })}>Restock</button>
            </div>
          )
        })}
        {low.length === 0 && <p className="text-[13.5px] py-5" style={{ color: 'var(--ink-soft)' }}>Nothing below its limit right now.</p>}
      </div>
    </div>
  )
}
