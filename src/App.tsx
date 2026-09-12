import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import FAB from './components/FAB'
import ModalHost from './components/ModalHost'
import Dashboard from './pages/Dashboard'
import CatalogRoot from './pages/CatalogRoot'
import CategoryPage from './pages/CategoryPage'
import BrandPage from './pages/BrandPage'
import ProductPage from './pages/ProductPage'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import StockLog from './pages/StockLog'
import { InventoryProvider } from './state/InventoryContext'
import { ModalControllerProvider } from './state/ModalController'
import { ToastProvider } from './utils/ToastContext'

export default function App() {
  return (
    <InventoryProvider>
      <ToastProvider>
        <ModalControllerProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalog" element={<CatalogRoot />} />
              <Route path="/catalog/:categoryId" element={<CategoryPage />} />
              <Route path="/catalog/:categoryId/:brandId" element={<BrandPage />} />
              <Route path="/catalog/:categoryId/:brandId/:productId" element={<ProductPage />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/log" element={<StockLog />} />
            </Routes>
            <BottomNav />
            <FAB />
            <ModalHost />
          </BrowserRouter>
        </ModalControllerProvider>
      </ToastProvider>
    </InventoryProvider>
  )
}
