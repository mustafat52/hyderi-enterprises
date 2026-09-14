import { NavLink } from 'react-router-dom'
import { getStockStatus } from '../utils/stock'
import { useInventory } from '../state/InventoryContext'

const items = [
  {
    to: '/', label: 'Home', end: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
    ),
  },
  {
    to: '/catalog', label: 'Catalog', end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v4H4z" /><path d="M4 12h16v8H4z" /></svg>
    ),
  },
  {
    to: '/bill', label: 'Bill', end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="11" x2="12" y2="11" /></svg>
    ),
  },
  {
    to: '/alerts', label: 'Alerts', end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
    ),
  },
  {
    to: '/reports', label: 'Reports', end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18" /><path d="M7 15l4-6 4 3 5-8" /></svg>
    ),
  },
  {
    to: '/log', label: 'Log', end: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>
    ),
  },
]

export default function BottomNav() {
  const { allVariants } = useInventory()
  const lowCount = allVariants.filter(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy').length

  return (
    <nav className="bottom-nav md:hidden">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <span style={{ position: 'relative' }}>
            {item.icon}
            {item.label === 'Alerts' && lowCount > 0 && (
              <span
                className="absolute flex items-center justify-center font-bold font-mono"
                style={{ top: -4, right: -6, background: 'var(--barn)', color: '#fff', fontSize: 8, minWidth: 13, height: 13, borderRadius: 8, padding: '0 2px' }}
              >
                {lowCount}
              </span>
            )}
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}