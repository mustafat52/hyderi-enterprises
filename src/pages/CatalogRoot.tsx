import { Link } from 'react-router-dom'
import { useInventory } from '../state/InventoryContext'
import { useModalController } from '../state/ModalController'

export default function CatalogRoot() {
  const { categories, allVariants } = useInventory()
  const { open } = useModalController()

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-7 pb-24 md:pb-16">
      <div className="text-[12px] mt-7 mb-2" style={{ color: 'var(--ink-soft)' }}>All categories</div>
      <div className="flex items-end justify-between gap-2.5 mb-5 flex-wrap">
        <div>
          <h1 className="text-[25px]">Catalog</h1>
          <p className="text-[13px] mt-1" style={{ color: 'var(--ink-soft)' }}>Every product, organized the way the shop actually thinks about it.</p>
        </div>
        <button
          className="text-[12.5px] font-semibold px-3.5 py-2 flex items-center gap-1.5"
          style={{ border: '1px solid var(--ink)', color: 'var(--ink)' }}
          onClick={() => open({ type: 'addCategory' })}
        >
          + Add category
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {categories.map(c => {
          const count = allVariants.filter(v => v.categoryId === c.id).length
          return (
            <Link key={c.id} to={`/catalog/${c.id}`} className="cat-tile" style={{ '--tilecolor': c.colors[0] } as React.CSSProperties}>
              <div className="strip"><span className="emoji">{c.emoji}</span></div>
              <div className="px-4 py-3.5">
                <div className="font-semibold text-[14.5px]">{c.name}</div>
                <div className="text-[11.5px] mt-1" style={{ color: 'var(--ink-soft)' }}>{count} variants · {c.brands.length} brands</div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
