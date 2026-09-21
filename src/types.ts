export interface Variant {
  id: string
  size: string
  shop: number
  godown: number
  price: number // purchase price per unit — the only price we track now
  limit: number // reorder limit
}

export interface Product {
  id: string
  name: string
  variants: Variant[]
}

export interface Brand {
  id: string
  name: string
  chip: string
  products: Product[]
}

export interface Category {
  id: string
  name: string
  unit: string
  emoji: string
  colors: [string, string]
  brands: Brand[]
}

// 'cash-sale' is kept for now so StockLog.tsx (not touched yet) doesn't break on a
// missing union member. Purchase entries currently reuse 'transfer' for the same
// reason — see PurchasePage.tsx notes. Clean both up once StockLog.tsx is shared
// in Task 4 and dedicated 'purchase' / 'sale' methods can be added safely.
export type LogMethod = 'sync' | 'transfer' | 'adjustment' | 'new-item' | 'cash-sale'

export interface LogEntry {
  id: string
  ts: number // epoch ms
  actor: string
  method: LogMethod
  description: string
  qtyDelta?: number
}

export interface VariantRef {
  categoryId: string
  brandId: string
  productId: string
  variantId: string
}

export interface MoveLineItem {
  variantId: string
  categoryId: string
  brandId: string
  productId: string
  label: string
  qty: number
}

export interface MoveSlipRecord {
  id: string
  moveNo: string
  ts: number
  direction: 'g2s' | 's2g'
  items: MoveLineItem[]
}

export interface PurchaseLineItem {
  variantId: string
  categoryId: string
  brandId: string
  productId: string
  label: string
  totalQty: number
  shopQty: number
  godownQty: number
  price: number // price paid this delivery — becomes the variant's new stored price
}

export interface PurchaseSlipRecord {
  id: string
  purchaseNo: string
  ts: number
  items: PurchaseLineItem[]
}