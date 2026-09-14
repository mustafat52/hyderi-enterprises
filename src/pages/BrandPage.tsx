import { Link, useParams, Navigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'
import { rupee } from '../utils/format'
import { getStockStatus } from '../utils/stock'
import ProductThumb from '../components/ProductThumb'

export default function BrandPage() {
  const { categoryId, brandId } = useParams()
  const { categories } = useInventory()
  const { open } = useModalController()
  const cat = categories.find(c => c.id === categoryId)
  const brand = cat?.brands.find(b => b.id === brandId)
  if (!cat || !brand) return <Navigate to="/catalog" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="text-[12px] mt-7 mb-2 flex gap-1.5 items-center flex-wrap" style={{ color: 'var(--ink-soft)' }}>
        <Link to="/catalog" className="font-semibold" style={{ color: 'var(--teal-ink)' }}>All categories</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <Link to={`/catalog/${cat.id}`} className="font-semibold" style={{ color: 'var(--teal-ink)' }}>{cat.name}</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <span className="font-semibold" style={{ color: 'var(--ink)' }}>{brand.name}</span>
      </div>
      <div className="flex items-end justify-between gap-2.5 mb-5 flex-wrap">
        <div>
          <h1 className="text-[25px]">{brand.name}</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>{cat.name} · {brand.products.length} products</p>
        </div>
        <button
          className="text-[12.5px] font-semibold px-3.5 py-2"
          style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}
          onClick={() => open({ type: 'addProduct', categoryId: cat.id, brandId: brand.id })}
        >
          + Add product
        </button>
      </div>
      <div>
        {brand.products.map(p => {
          const totalShop = p.variants.reduce((s, v) => s + v.shop, 0)
          const totalGod = p.variants.reduce((s, v) => s + v.godown, 0)
          const val = p.variants.reduce((s, v) => s + (v.shop + v.godown) * v.price, 0)
          const anyLow = p.variants.some(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy')
          return (
            <Link key={p.id} to={`/catalog/${cat.id}/${brand.id}/${p.id}`} className="product-row">
              <div className="flex items-center gap-3 min-w-0">
                <ProductThumb name={p.name} color={brand.chip} />
                <div className="min-w-0">
                  <div className="font-semibold text-[15px] font-display truncate">{anyLow && <span className="low-dot" />}{p.name}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{p.variants.length} variants</div>
                </div>
              </div>
              <div className="text-right font-mono text-[12.5px] flex-shrink-0" style={{ color: 'var(--ink-soft)' }}>
                <b className="block text-[15px]" style={{ color: 'var(--ink)', fontFamily: 'inherit' }}>{rupee(val)}</b>
                {totalShop} shop · {totalGod} godown
              </div>
            </Link>
          )
        })}
        {brand.products.length === 0 && <p className="text-[13px] py-4" style={{ color: 'var(--ink-soft)' }}>No products yet.</p>}
      </div>
    </div>
  )
}