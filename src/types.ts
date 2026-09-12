export interface Variant {
  id: string
  size: string
  shop: number
  godown: number
  price: number // purchase price per unit
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

export type LogMethod = 'sync' | 'transfer' | 'adjustment' | 'new-item'

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
