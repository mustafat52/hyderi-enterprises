export interface Variant {
  id: string
  size: string
  shop: number
  godown: number
  price: number // purchase price per unit
  sellingPrice: number // selling price per unit (for cash/no-bill sales)
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

export interface BillLineItem {
  variantId: string
  categoryId: string
  brandId: string
  productId: string
  label: string
  qty: number
  price: number
  lineTotal: number
}

export interface Bill {
  id: string
  billNo: string
  ts: number
  customerName: string
  items: BillLineItem[]
  total: number
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