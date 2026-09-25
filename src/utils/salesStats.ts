// Real sales-history helpers, replacing the old hashSeed-based mock `sold30`
// figure. Anything reporting on "what sold" now reads real PurchaseSlipRecord[]
// / SaleSlipRecord[] history instead of a deterministic fake number.
import type { PurchaseSlipRecord, SaleSlipRecord } from '../types'

export type StatsPeriod = 'last30' | 'thisMonth' | 'lastMonth'

export const PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: 'last30', label: 'Last 30 days' },
  { value: 'thisMonth', label: 'This month' },
  { value: 'lastMonth', label: 'Last month' },
]

export function periodRange(period: StatsPeriod): { start: number; end: number } {
  const now = new Date()
  if (period === 'last30') {
    const end = now.getTime()
    const start = end - 30 * 24 * 60 * 60 * 1000
    return { start, end }
  }
  if (period === 'thisMonth') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    return { start, end: now.getTime() }
  }
  // lastMonth
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
  const end = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  return { start, end }
}

/** Total units sold per variant, within [start, end], across every sale line item. */
export function soldQtyByVariant(sales: SaleSlipRecord[], start: number, end: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (const sale of sales) {
    if (sale.ts < start || sale.ts > end) continue
    for (const item of sale.items) {
      out[item.variantId] = (out[item.variantId] || 0) + item.qty
    }
  }
  return out
}

/** Total units purchased per variant, within [start, end], across every purchase line item. */
export function purchasedQtyByVariant(purchases: PurchaseSlipRecord[], start: number, end: number): Record<string, number> {
  const out: Record<string, number> = {}
  for (const purchase of purchases) {
    if (purchase.ts < start || purchase.ts > end) continue
    for (const item of purchase.items) {
      out[item.variantId] = (out[item.variantId] || 0) + item.totalQty
    }
  }
  return out
}