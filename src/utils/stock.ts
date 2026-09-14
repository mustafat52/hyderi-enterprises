export type StockStatusKind = 'healthy' | 'move' | 'purchase'

export interface StockStatus {
  status: StockStatusKind
  shortfall: number   // units needed at Shop to reach its limit
  moveQty: number      // units to move from Godown right now (partial if Godown can't cover it all)
}

/**
 * The reorder limit is tracked against the Shop quantity only (that's the shelf
 * customers actually buy from). When Shop falls below its limit:
 *  - if Godown has enough to cover the shortfall, this is just a Move job
 *  - if Godown can't fully cover it, it's a genuine Purchase need (Godown's
 *    partial stock, if any, is still suggested as an interim move)
 */
export function getStockStatus(shop: number, godown: number, limit: number): StockStatus {
  if (shop >= limit) return { status: 'healthy', shortfall: 0, moveQty: 0 }
  const shortfall = limit - shop
  if (godown >= shortfall) {
    return { status: 'move', shortfall, moveQty: shortfall }
  }
  return { status: 'purchase', shortfall, moveQty: Math.min(godown, shortfall) }
}