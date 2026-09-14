import { useNavigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { getStockStatus } from '../utils/stock'

export default function Alerts() {
  const { allVariants } = useInventory()
  const navigate = useNavigate()

  const flagged = allVariants
    .map(v => ({ v, status: getStockStatus(v.shop, v.godown, v.limit) }))
    .filter(x => x.status.status !== 'healthy')

  const moveList = flagged.filter(x => x.status.status === 'move').sort((a, b) => b.status.shortfall - a.status.shortfall)
  const purchaseList = flagged.filter(x => x.status.status === 'purchase').sort((a, b) => b.status.shortfall - a.status.shortfall)

  function goMove(variantId: string, qty: number, label: string, categoryId: string, brandId: string, productId: string) {
    navigate('/move', { state: { prefill: { variantId, qty, label, categoryId, brandId, productId } } })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Low stock alerts</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>Checked against the Shop's reorder limit — split by what actually fixes it.</p>
      </div>

      <div className="flex items-baseline gap-4 mb-3 mt-2">
        <h2 className="text-[15px]">Can move from Godown</h2>
        <div className="rule-line" />
        <span className="text-[11.5px] font-mono" style={{ color: 'var(--ink-soft)' }}>{moveList.length}</span>
      </div>
      <div className="mb-8">
        {moveList.map(({ v, status }) => {
          const label = `${v.productName} — ${v.size}`
          return (
            <div key={v.id} className="flex items-center justify-between gap-3 py-3.5" style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] truncate">{label}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                  {v.categoryName} · {v.brandName} · Shop {v.shop} (needs {status.shortfall} more) · Godown has {v.godown}
                </div>
              </div>
              <button
                className="mini-btn solid flex-shrink-0"
                onClick={() => goMove(v.id, status.moveQty, label, v.categoryId, v.brandId, v.productId)}
              >
                Move {status.moveQty}
              </button>
            </div>
          )
        })}
        {moveList.length === 0 && <p className="text-[13px] py-3" style={{ color: 'var(--ink-soft)' }}>Nothing here — Godown can't fix anything right now, or nothing needs it.</p>}
      </div>

      <div className="flex items-baseline gap-4 mb-3">
        <h2 className="text-[15px]">Needs purchase</h2>
        <div className="rule-line" />
        <span className="text-[11.5px] font-mono" style={{ color: 'var(--ink-soft)' }}>{purchaseList.length}</span>
      </div>
      <div>
        {purchaseList.map(({ v, status }) => {
          const label = `${v.productName} — ${v.size}`
          return (
            <div key={v.id} className="flex items-center justify-between gap-3 py-3.5" style={{ borderBottom: '1px solid var(--rule-soft)' }}>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[14px] truncate">{label}</div>
                <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                  {v.categoryName} · {v.brandName} · Shop {v.shop} + Godown {v.godown} still short by {status.shortfall - status.moveQty}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {status.moveQty > 0 && (
                  <button
                    className="mini-btn"
                    onClick={() => goMove(v.id, status.moveQty, label, v.categoryId, v.brandId, v.productId)}
                  >
                    Move {status.moveQty} now
                  </button>
                )}
                <span className="tag low">Purchase</span>
              </div>
            </div>
          )
        })}
        {purchaseList.length === 0 && <p className="text-[13px] py-3" style={{ color: 'var(--ink-soft)' }}>Nothing needs a supplier order right now.</p>}
      </div>
    </div>
  )
}