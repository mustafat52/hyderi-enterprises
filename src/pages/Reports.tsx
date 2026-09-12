import { useInventory } from '../state/InventoryContext'
import { fmt, rupee } from '../utils/format'

export default function Reports() {
  const { categories, allVariants } = useInventory()

  const fast = [...allVariants].sort((a, b) => b.sold30 - a.sold30).slice(0, 6)
  const slow = [...allVariants].sort((a, b) => a.sold30 - b.sold30).slice(0, 6)

  const catRows = categories.map(c => {
    const vs = allVariants.filter(v => v.categoryId === c.id)
    const units = vs.reduce((s, v) => s + v.total, 0)
    const shopVal = vs.reduce((s, v) => s + v.shop * v.price, 0)
    const godVal = vs.reduce((s, v) => s + v.godown * v.price, 0)
    return { name: c.name, color: c.colors[0], units, shopVal, godVal, total: shopVal + godVal }
  })

  const splitRows = categories.map(c => {
    const vs = allVariants.filter(v => v.categoryId === c.id)
    const shop = vs.reduce((s, v) => s + v.shop, 0)
    const godown = vs.reduce((s, v) => s + v.godown, 0)
    const tot = shop + godown || 1
    const shopTicks = Math.max(0, Math.min(10, Math.round((shop / tot) * 10)))
    return { name: c.name, color: c.colors[0], shop, godown, shopTicks }
  })

  function RankList({ items, colorVar }: { items: typeof fast; colorVar: string }) {
    return (
      <div>
        {items.map((m, i) => (
          <div key={m.id} className="rank-row">
            <div className="rank-num">{i + 1}.</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium truncate">{m.productName} — {m.size}</div>
              <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName}</div>
            </div>
            <div className="font-mono text-[12.5px] font-semibold flex-shrink-0" style={{ color: colorVar }}>{fmt(m.sold30)} sold</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Reports</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>A first look at the kind of reporting the full system will surface.</p>
      </div>

      <div className="panel overflow-x-auto">
        <h3 className="text-[14.5px] mb-3.5">Stock value ledger</h3>
        <table className="ledger-table min-w-[520px]">
          <thead><tr><th>Category</th><th className="num">Units</th><th className="num">Shop value</th><th className="num">Godown value</th><th className="num">Total value</th></tr></thead>
          <tbody>
            {catRows.map(r => (
              <tr key={r.name} className="cat-row" style={{ '--rowcolor': r.color } as React.CSSProperties}>
                <td>{r.name}</td>
                <td className="num">{fmt(r.units)}</td>
                <td className="num">{rupee(r.shopVal)}</td>
                <td className="num">{rupee(r.godVal)}</td>
                <td className="num">{rupee(r.total)}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td className="num">{fmt(catRows.reduce((s, r) => s + r.units, 0))}</td>
              <td className="num">{rupee(catRows.reduce((s, r) => s + r.shopVal, 0))}</td>
              <td className="num">{rupee(catRows.reduce((s, r) => s + r.godVal, 0))}</td>
              <td className="num">{rupee(catRows.reduce((s, r) => s + r.total, 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Fast movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— highest 30-day sales</span></h3>
          <RankList items={fast} colorVar="var(--sage)" />
        </div>
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Slow movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— lowest 30-day sales</span></h3>
          <RankList items={slow} colorVar="var(--barn-ink)" />
        </div>
      </div>

      <div className="panel mt-5 overflow-x-auto">
        <h3 className="text-[14.5px] mb-3.5">Shop vs Godown ledger</h3>
        <table className="ledger-table min-w-[480px]">
          <thead><tr><th>Category</th><th className="num">Shop</th><th className="num">Godown</th><th className="num">Total</th><th style={{ textAlign: 'right' }}>Split</th></tr></thead>
          <tbody>
            {splitRows.map(r => (
              <tr key={r.name} className="cat-row" style={{ '--rowcolor': r.color } as React.CSSProperties}>
                <td>{r.name}</td>
                <td className="num">{fmt(r.shop)}</td>
                <td className="num">{fmt(r.godown)}</td>
                <td className="num">{fmt(r.shop + r.godown)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="tally-meter">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="tally-tick" style={{ background: i < r.shopTicks ? 'var(--shop)' : 'var(--godown)' }} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-[11px] mt-3" style={{ color: 'var(--ink-soft)' }}>
          <span style={{ color: 'var(--shop)', fontWeight: 700 }}>■</span> Shop &nbsp;&nbsp;
          <span style={{ color: 'var(--godown)', fontWeight: 700 }}>■</span> Godown &nbsp; · &nbsp; each tick ≈ 10% of category stock
        </div>
      </div>
    </div>
  )
}
