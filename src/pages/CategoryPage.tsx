import { Link, useParams, Navigate } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const { categories } = useInventory()
  const { open } = useModalController()
  const cat = categories.find(c => c.id === categoryId)
  if (!cat) return <Navigate to="/catalog" replace />

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="text-[12px] mt-7 mb-2 flex gap-1.5 items-center flex-wrap" style={{ color: 'var(--ink-soft)' }}>
        <Link to="/catalog" className="font-semibold" style={{ color: 'var(--teal-ink)' }}>All categories</Link>
        <span style={{ opacity: 0.45 }}>/</span>
        <span className="font-semibold" style={{ color: 'var(--ink)' }}>{cat.name}</span>
      </div>
      <div className="flex items-end justify-between gap-2.5 mb-5 flex-wrap">
        <div>
          <h1 className="text-[25px]">{cat.name}</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>Unit of measure: {cat.unit} · {cat.brands.length} sub-categories</p>
        </div>
        <button
          className="text-[12.5px] font-semibold px-3.5 py-2"
          style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}
          onClick={() => open({ type: 'addProduct', categoryId: cat.id, brandId: null })}
        >
          + Add product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {cat.brands.map(b => (
          <Link key={b.id} to={`/catalog/${cat.id}/${b.id}`} className="brand-tile">
            <div className="brand-swatch" style={{ background: b.chip }} />
            <div>
              <div className="font-semibold text-[13.5px]">{b.name}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color: 'var(--ink-soft)' }}>{b.products.length} products</div>
            </div>
          </Link>
        ))}
        {cat.brands.length === 0 && (
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>No sub-categories yet — add a product to create one.</p>
        )}
      </div>
    </div>
  )
}
