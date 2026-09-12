import { useMemo, useState } from 'react'
import {
  ResponsiveContainer, Tooltip,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { useInventory } from '../state/InventoryContext'
import { fmt, rupee } from '../utils/format'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
  const { categories, allVariants, monthlyRevenue } = useInventory()
  const [revenueView, setRevenueView] = useState<'month' | 'year'>('month')

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

  const monthlyChartData = monthlyRevenue.map(p => ({
    label: `${MONTH_LABELS[p.month]} '${String(p.year).slice(2)}`,
    GST: p.gst,
    'Non-GST': p.nonGst,
  }))

  const yearlyChartData = useMemo(() => {
    const byYear = new Map<number, { GST: number; 'Non-GST': number }>()
    for (const p of monthlyRevenue) {
      const cur = byYear.get(p.year) || { GST: 0, 'Non-GST': 0 }
      cur.GST += p.gst
      cur['Non-GST'] += p.nonGst
      byYear.set(p.year, cur)
    }
    return [...byYear.entries()].sort((a, b) => a[0] - b[0]).map(([year, v]) => ({ label: String(year), ...v }))
  }, [monthlyRevenue])

  const revenueChartData = revenueView === 'month' ? monthlyChartData : yearlyChartData
  const totalGst = monthlyRevenue.reduce((s, p) => s + p.gst, 0)
  const totalNonGst = monthlyRevenue.reduce((s, p) => s + p.nonGst, 0)
  const thisMonth = monthlyRevenue[monthlyRevenue.length - 1]

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="mt-7 mb-5">
        <h1 className="text-[25px]">Reports</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>A first look at the kind of reporting the full system will surface.</p>
      </div>

      {/* Revenue section */}
      <div className="panel mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="text-[14.5px]">Revenue</h3>
          <div className="flex gap-1.5">
            {(['month', 'year'] as const).map(v => (
              <button
                key={v}
                onClick={() => setRevenueView(v)}
                className="text-[11.5px] font-semibold px-3 py-1.5"
                style={{
                  border: '1px solid var(--ink)',
                  background: revenueView === v ? 'var(--ink)' : 'var(--card)',
                  color: revenueView === v ? 'var(--card)' : 'var(--ink)',
                }}
              >
                {v === 'month' ? 'Monthly' : 'Yearly'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>This month · GST</div>
            <div className="font-mono text-[15px] sm:text-[17px] font-semibold mt-1" style={{ color: 'var(--sage)' }}>{rupee(thisMonth?.gst || 0)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>This month · Non-GST</div>
            <div className="font-mono text-[15px] sm:text-[17px] font-semibold mt-1" style={{ color: 'var(--barn)' }}>{rupee(thisMonth?.nonGst || 0)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-faint)' }}>14-month total</div>
            <div className="font-mono text-[15px] sm:text-[17px] font-semibold mt-1">{rupee(totalGst + totalNonGst)}</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueChartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--rule-soft)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--ink-soft)' }} axisLine={{ stroke: 'var(--rule)' }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v / 1000)}k`} width={42} />
            <Tooltip content={<RTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="GST" stackId="rev" fill="var(--sage)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Non-GST" stackId="rev" fill="var(--barn)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock value pie */}
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
          <h3 className="text-[14.5px] mb-1">Fast movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— highest 30-day sales</span></h3>
          {fast.map((m, i) => (
            <div key={m.id} className="rank-row">
              <div className="rank-num">{i + 1}.</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{m.productName} — {m.size}</div>
                <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName}</div>
              </div>
              <div className="font-mono text-[12.5px] font-semibold flex-shrink-0" style={{ color: 'var(--sage)' }}>{fmt(m.sold30)} sold</div>
            </div>
          ))}
        </div>
        <div className="panel">
          <h3 className="text-[14.5px] mb-1">Slow movers <span className="text-[11.5px] font-normal" style={{ color: 'var(--ink-faint)' }}>— lowest 30-day sales</span></h3>
          {slow.map((m, i) => (
            <div key={m.id} className="rank-row">
              <div className="rank-num">{i + 1}.</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium truncate">{m.productName} — {m.size}</div>
                <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{m.categoryName} · {m.brandName}</div>
              </div>
              <div className="font-mono text-[12.5px] font-semibold flex-shrink-0" style={{ color: 'var(--barn-ink)' }}>{fmt(m.sold30)} sold</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}