import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import FAB from './components/FAB'
import ModalHost from './components/ModalHost'
import WelcomeOverlay from './components/WelcomeOverlay'
import Dashboard from './pages/Dashboard'
import CatalogRoot from './pages/CatalogRoot'
import CategoryPage from './pages/CategoryPage'
import BrandPage from './pages/BrandPage'
import ProductPage from './pages/ProductPage'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import StockLog from './pages/StockLog'
import MovePage from './pages/MovePage'
import PurchasePage from './pages/PurchasePage'
import Login from './pages/Login'
import { InventoryProvider } from './state/InventoryContext'
import { ModalControllerProvider } from './state/ModalController'
import { ToastProvider } from './utils/ToastContext'
import { AuthProvider, useAuth } from './state/AuthContext'

function AuthedApp() {
  const { isAuthenticated, currentUser } = useAuth()
  const [showWelcome, setShowWelcome] = useState(false)
  const prevAuth = useRef(isAuthenticated)

  useEffect(() => {
    if (!prevAuth.current && isAuthenticated) {
      setShowWelcome(true)
      const t = setTimeout(() => setShowWelcome(false), 1700)
      return () => clearTimeout(t)
    }
    prevAuth.current = isAuthenticated
  }, [isAuthenticated])

  if (!isAuthenticated) return <Login />

  const firstName = currentUser?.name.split(' ')[0]

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/catalog" element={<CatalogRoot />} />
        <Route path="/catalog/:categoryId" element={<CategoryPage />} />
        <Route path="/catalog/:categoryId/:brandId" element={<BrandPage />} />
        <Route path="/catalog/:categoryId/:brandId/:productId" element={<ProductPage />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/move" element={<MovePage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/log" element={<StockLog />} />
      </Routes>
      <BottomNav />
      <FAB />
      <ModalHost />
      {showWelcome && <WelcomeOverlay name={firstName} />}
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <ToastProvider>
          <ModalControllerProvider>
            <AuthedApp />
          </ModalControllerProvider>
        </ToastProvider>
      </InventoryProvider>
    </AuthProvider>
  )
}