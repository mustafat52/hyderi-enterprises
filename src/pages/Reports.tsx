import {
  ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { useInventory } from '../state/InventoryContext'
import { fmt, rupee } from '../utils/format'

function RTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--ink)', color: 'var(--card)', padding: '8px 11px', fontSize: 12, borderRadius: 4 }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: {rupee(p.value)}</div>
      ))}
    </div>
  )
}

export default function Reports() {
  const { categories, allVariants } = useInventory()

  const fast = [...allVariants].sort((a, b) => b.sold30 - a.sold30).slice(0, 6)
  const slow = [...allVariants].sort((a, b) => a.sold30 - b.sold30).slice(0, 6)

  const pieData = categories.map(c => {
    const vs = allVariants.filter(v => v.categoryId === c.id)
    const value = vs.reduce((s, v) => s + (v.shop + v.godown) * v.price, 0)
    return { name: c.name, value, color: c.colors[0] }
  }).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  const totalStockValue = pieData.reduce((s, d) => s + d.value, 0)

  const splitData = categories.map(c => {
    const vs = allVariants.filter(v => v.categoryId === c.id)
    return {
      name: c.name,
      Shop: vs.reduce((s, v) => s + v.shop, 0),
      Godown: vs.reduce((s, v) => s + v.godown, 0),
    }
  })

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Reports</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>A first look at the kind of reporting the full system will surface.</p>
      </div>

      {/* Stock value bar chart */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-5 mb-5">
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Stock value by category</h3>
          <p className="text-[11.5px] mb-2" style={{ color: 'var(--ink-faint)' }}>Total: {rupee(totalStockValue)}</p>
          <ResponsiveContainer width="100%" height={Math.max(200, pieData.length * 44)}>
            <BarChart data={pieData} layout="vertical" margin={{ top: 0, right: 16, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rule-soft)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--ink-soft)' }} axisLine={{ stroke: 'var(--rule)' }} tickLine={false} tickFormatter={v => `${Math.round(v / 1000)}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink)' }} axisLine={false} tickLine={false} width={95} />
              <Tooltip content={<RTooltip />} />
              <Bar dataKey="value" name="Stock value" radius={[0, 3, 3, 0]}>
                {pieData.map(d => <Cell key={d.name} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3 className="text-[14.5px] mb-3.5">Shop vs Godown (units)</h3>
          <ResponsiveContainer width="100%" height={Math.max(220, splitData.length * 46)}>
            <BarChart data={splitData} layout="vertical" margin={{ top: 0, right: 12, left: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--rule-soft)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--ink-soft)' }} axisLine={{ stroke: 'var(--rule)' }} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--ink)' }} axisLine={false} tickLine={false} width={95} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 4 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Shop" stackId="loc" fill="var(--shop)" />
              <Bar dataKey="Godown" stackId="loc" fill="var(--godown)" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Fast movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— highest 30-day activity</span></h3>
          {fast.map((m, i) => (
            <div key={m.id} className="rank-row">
              <div className="rank-num">{i + 1}.</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{m.productName} — {m.size}</div>
                <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName}</div>
              </div>
              <div className="font-mono text-[12.5px] font-semibold flex-shrink-0" style={{ color: 'var(--sage)' }}>{fmt(m.sold30)} units</div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Slow movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— lowest 30-day activity</span></h3>
          {slow.map((m, i) => (
            <div key={m.id} className="rank-row">
              <div className="rank-num">{i + 1}.</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{m.productName} — {m.size}</div>
                <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName}</div>
              </div>
              <div className="font-mono text-[12.5px] font-semibold flex-shrink-0" style={{ color: 'var(--barn-ink)' }}>{fmt(m.sold30)} units</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}