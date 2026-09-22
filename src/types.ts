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

// 'sync' is kept for the historical seed log entries from when Tally was still part
// of the picture — safe to retire once those are cleaned up (a separate task).
// 'cash-sale' has been removed — Sale now has its own proper 'sale' method.
export type LogMethod = 'sync' | 'purchase' | 'transfer' | 'sale' | 'adjustment' | 'new-item'

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

export interface SaleLineItem {
  variantId: string
  categoryId: string
  brandId: string
  productId: string
  label: string
  qty: number
  source: 'shop' | 'godown'
}

export interface SaleSlipRecord {
  id: string
  saleNo: string
  ts: number
  items: SaleLineItem[]
}