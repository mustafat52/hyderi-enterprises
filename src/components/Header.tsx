import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useInventory } from '../state/InventoryContext'
import { useAuth } from '../state/AuthContext'
import { getStockStatus } from '../utils/stock'
import SummarySheet from './SummarySheet'

const tabs = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/catalog', label: 'Catalog' },
  { to: '/purchase', label: 'Purchase' },
  { to: '/sale', label: 'Sale' },
  { to: '/move', label: 'Move' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/reports', label: 'Reports' },
  { to: '/log', label: 'Stock Log' },
]

export default function Header() {
  const { allVariants } = useInventory()
  const { currentUser, logout } = useAuth()
  const lowCount = allVariants.filter(v => getStockStatus(v.shop, v.godown, v.limit).status !== 'healthy').length
  const [summaryOpen, setSummaryOpen] = useState(false)

  return (
    <>
      <div className="headband sticky top-0 z-40 px-4 md:px-7">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-[60px]">
          <div className="flex items-center gap-3">
            <div className="brand-mark" />
            <div>
              <div className="font-display text-[16px] font-semibold leading-none" style={{ color: '#F5F1E4' }}>Hyderi Enterprises</div>
              <div className="text-[9px] tracking-[0.14em] mt-0.5" style={{ color: '#B7AE8E' }}>STOCK LEDGER</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-0.5">
            {tabs.map(t => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) => `tab-btn ${isActive ? 'active' : ''}`}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="hidden sm:flex items-center gap-1.5 text-[10.5px]" style={{ color: '#9C936F' }}>
                <span className="inline-block w-[5px] h-[5px] rounded-full" style={{ background: '#7FAE7F' }} />
                {currentUser.name} · {currentUser.role === 'owner' ? 'Owner' : 'Employee'}
              </span>
            )}
            <button
              onClick={() => setSummaryOpen(true)}
              className="relative p-1.5"
              style={{ color: '#C6BC9C' }}
              aria-label="Today's summary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {lowCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center font-bold font-mono"
                  style={{ background: 'var(--marigold)', color: '#2C2410', fontSize: 9, minWidth: 14, height: 14, borderRadius: 8, padding: '0 3px' }}
                >
                  {lowCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { if (confirm('Sign out?')) logout() }}
              className="hidden sm:block text-[11px] font-semibold"
              style={{ color: '#9C936F' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
      {summaryOpen && <SummarySheet onClose={() => setSummaryOpen(false)} />}
    </>
  )
}