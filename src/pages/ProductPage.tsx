import { Link, useParams, Navigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'
import { pct, rupee } from '../utils/format'
import { getStockStatus } from '../utils/stock'

export default function ProductPage() {
  const { categoryId, brandId, productId } = useParams()
  const { categories } = useInventory()
  const { open } = useModalController()
  const cat = categories.find(c => c.id === categoryId)
  const brand = cat?.brands.find(b => b.id === brandId)
  const product = brand?.products.find(p => p.id === productId)
  if (!cat || !brand || !product) return <Navigate to="/catalog" replace />

  const totalShop = product.variants.reduce((s, v) => s + v.shop, 0)
  const totalGod = product.variants.reduce((s, v) => s + v.godown, 0)
  const totalVal = product.variants.reduce((s, v) => s + (v.shop + v.godown) * v.price, 0)
  const avgPrice = product.variants.reduce((s, v) => s + v.price, 0) / product.variants.length

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="text-[12px] mt-7 mb-2 flex gap-1.5 items-center flex-wrap" style={{ color: 'var(--ink-soft)' }}>
        <Link to="/catalog" className="font-semibold" style={{ color: 'var(--teal-ink)' }}>All categories</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <Link to={`/catalog/${cat.id}`} className="font-semibold" style={{ color: 'var(--teal-ink)' }}>{cat.name}</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <Link to={`/catalog/${cat.id}/${brand.id}`} className="font-semibold" style={{ color: 'var(--teal-ink)' }}>{brand.name}</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <span className="font-semibold" style={{ color: 'var(--ink)' }}>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mt-6 mb-8 items-stretch">
        <div className="pd-swatch" style={{ '--pdcolor1': brand.chip, '--pdcolor2': cat.colors[1] } as React.CSSProperties}>
          <div className="text-[10.5px] tracking-wide uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.85)' }}>{cat.name}</div>
          <div className="font-display-italic text-[16px]" style={{ color: '#fff' }}>{brand.name}</div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[26px] md:text-[28px] mb-4">{product.name}</h1>
          <div className="flex flex-wrap gap-0 flex-1" style={{ border: '1px solid var(--rule)', background: 'var(--card)' }}>
            <div className="flex-1 min-w-[130px] p-4" style={{ borderRight: '1px solid var(--rule)' }}>
              <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-faint)' }}>Total stock value</div>
              <div className="font-mono text-[20px] font-semibold mt-1.5">{rupee(totalVal)}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>{totalShop + totalGod} units on hand</div>
            </div>
            <div className="flex-1 min-w-[110px] p-4" style={{ borderRight: '1px solid var(--rule)' }}>
              <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-faint)' }}>At shop</div>
              <div className="font-mono text-[20px] font-semibold mt-1.5" style={{ color: 'var(--shop)' }}>{totalShop}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>{cat.unit} · {rupee(totalShop * avgPrice)}</div>
            </div>
            <div className="flex-1 min-w-[110px] p-4" style={{ borderRight: '1px solid var(--rule)' }}>
              <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-faint)' }}>At godown</div>
              <div className="font-mono text-[20px] font-semibold mt-1.5" style={{ color: 'var(--godown)' }}>{totalGod}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>{cat.unit} · {rupee(totalGod * avgPrice)}</div>
            </div>
            <div className="flex-1 min-w-[90px] p-4">
              <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--ink-faint)' }}>Variants</div>
              <div className="font-mono text-[20px] font-semibold mt-1.5">{product.variants.length}</div>
              <div className="text-[11px] mt-1" style={{ color: 'var(--ink-soft)' }}>sizes tracked</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid var(--rule)' }}>
        {product.variants.map(v => {
          const maxBar = Math.max(v.shop, v.godown, 1)
          const label = `${product.name} — ${v.size}`
          const status = getStockStatus(v.shop, v.godown, v.limit)
          return (
            <div key={v.id} className="p-4" style={{ borderBottom: '1px solid var(--rule-soft)', background: 'var(--card)' }}>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 items-center">
                <div className="font-display font-semibold text-[16px] col-span-2 sm:col-span-1">{v.size}</div>
                <div>
                  <div className="vlabel">Shop</div>
                  <div className="vval">{v.shop}</div>
                  <div className="vbar"><div style={{ width: `${pct(v.shop, maxBar)}%`, background: 'var(--shop)', height: '100%' }} /></div>
                </div>
                <div>
                  <div className="vlabel">Godown</div>
                  <div className="vval">{v.godown}</div>
                  <div className="vbar"><div style={{ width: `${pct(v.godown, maxBar)}%`, background: 'var(--godown)', height: '100%' }} /></div>
                </div>
                <div>
                  <div className="vlabel">Purchase price</div>
                  <div className="vval">{rupee(v.price)}</div>
                </div>
                <div>
                  <div className="vlabel">Stock value</div>
                  <div className="vval">{rupee((v.shop + v.godown) * v.price)}</div>
                </div>
                <div className="flex gap-2 items-center justify-start sm:justify-end col-span-2 sm:col-span-1">
                  {status.status === 'healthy' && <span className="tag ok">Healthy</span>}
                  {status.status === 'move' && <span className="tag" style={{ color: '#3C5D78', borderColor: '#3C5D78', background: 'rgba(60,93,120,0.08)' }}>Move needed</span>}
                  {status.status === 'purchase' && <span className="tag low">Purchase</span>}
                  <button
                    onClick={() => open({ type: 'editVariant', variantId: v.id, label, currentLimit: v.limit })}
                    aria-label="Edit variant"
                    style={{
                      width: 28, height: 28, borderRadius: 5, border: '1px solid var(--ink)', background: 'var(--card)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        <div className="p-3.5">
          <button
            className="w-full text-[12px] font-semibold py-2.5"
            style={{ border: '1px dashed var(--ink-faint)', color: 'var(--ink-soft)' }}
            onClick={() => open({ type: 'addVariant', categoryId: cat.id, brandId: brand.id, productId: product.id, productLabel: product.name })}
          >
            + Add variant to {product.name}
          </button>
        </div>
      </div>
    </div>
  )
}