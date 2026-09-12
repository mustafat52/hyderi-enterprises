import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { Category, LogEntry, LogMethod, Variant } from '../types'
import { seedCategories, seedLog } from '../data/seedData'
import { hashSeed } from '../utils/format'

const STORAGE_KEY = 'hyderi-inventory-state-v1'

interface State {
  categories: Category[]
  log: LogEntry[]
}

function loadInitial(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as State
      if (parsed.categories?.length) return parsed
    }
  } catch {
    // fall through to seed
  }
  return { categories: seedCategories, log: seedLog }
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

type Action =
  | { type: 'TRANSFER'; variantId: string; direction: 'g2s' | 's2g'; qty: number; label: string }
  | { type: 'ADJUST'; variantId: string; location: 'shop' | 'godown'; sign: 1 | -1; qty: number; reason: string; label: string }
  | { type: 'SET_LIMIT'; variantId: string; limit: number }
  | { type: 'ADD_CATEGORY'; name: string; unit: string; emoji: string; colors: [string, string] }
  | { type: 'ADD_PRODUCT'; categoryId: string; brandId: string | null; newBrandName: string | null; brandChip: string; productName: string; size: string; price: number; limit: number }
  | { type: 'ADD_VARIANT'; categoryId: string; brandId: string; productId: string; size: string; shop: number; godown: number; price: number; limit: number; productLabel: string }
  | { type: 'RESET' }

function pushLog(log: LogEntry[], method: LogMethod, description: string, qtyDelta?: number): LogEntry[] {
  const entry: LogEntry = { id: newId('log'), ts: Date.now(), actor: 'Owner', method, description, qtyDelta }
  return [entry, ...log].slice(0, 200)
}

function mapVariant(state: State, variantId: string, fn: (v: Variant) => Variant): Category[] {
  return state.categories.map(cat => ({
    ...cat,
    brands: cat.brands.map(brand => ({
      ...brand,
      products: brand.products.map(product => ({
        ...product,
        variants: product.variants.map(v => (v.id === variantId ? fn(v) : v)),
      })),
    })),
  }))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TRANSFER': {
      const categories = mapVariant(state, action.variantId, v => {
        if (action.direction === 'g2s') return { ...v, godown: v.godown - action.qty, shop: v.shop + action.qty }
        return { ...v, shop: v.shop - action.qty, godown: v.godown + action.qty }
      })
      const dirLabel = action.direction === 'g2s' ? 'Godown \u2192 Shop' : 'Shop \u2192 Godown'
      const log = pushLog(state.log, 'transfer', `Transferred ${action.qty} units of ${action.label} (${dirLabel})`, action.qty)
      return { categories, log }
    }
    case 'ADJUST': {
      const categories = mapVariant(state, action.variantId, v => {
        if (action.location === 'shop') return { ...v, shop: Math.max(0, v.shop + action.sign * action.qty) }
        return { ...v, godown: Math.max(0, v.godown + action.sign * action.qty) }
      })
      const sign = action.sign === 1 ? '+' : '-'
      const log = pushLog(
        state.log,
        'adjustment',
        `${action.label} (${sign}${action.qty}, ${action.location}) \u2014 ${action.reason}`,
        action.sign * action.qty
      )
      return { categories, log }
    }
    case 'SET_LIMIT': {
      const categories = mapVariant(state, action.variantId, v => ({ ...v, limit: action.limit }))
      return { ...state, categories }
    }
    case 'ADD_CATEGORY': {
      const cat: Category = {
        id: newId('cat'), name: action.name, unit: action.unit, emoji: action.emoji,
        colors: action.colors, brands: [],
      }
      const log = pushLog(state.log, 'new-item', `Category "${action.name}" created`)
      return { categories: [...state.categories, cat], log }
    }
    case 'ADD_PRODUCT': {
      const variant: Variant = { id: newId('var'), size: action.size, shop: 0, godown: 0, price: action.price, limit: action.limit }
      const categories = state.categories.map(cat => {
        if (cat.id !== action.categoryId) return cat
        if (action.brandId) {
          return {
            ...cat,
            brands: cat.brands.map(b => b.id === action.brandId
              ? { ...b, products: [...b.products, { id: newId('prod'), name: action.productName, variants: [variant] }] }
              : b),
          }
        }
        const newBrand = { id: newId('brand'), name: action.newBrandName || 'New brand', chip: action.brandChip, products: [{ id: newId('prod'), name: action.productName, variants: [variant] }] }
        return { ...cat, brands: [...cat.brands, newBrand] }
      })
      const log = pushLog(state.log, 'new-item', `Product "${action.productName}" added`)
      return { categories, log }
    }
    case 'ADD_VARIANT': {
      const variant: Variant = { id: newId('var'), size: action.size, shop: action.shop, godown: action.godown, price: action.price, limit: action.limit }
      const categories = state.categories.map(cat => {
        if (cat.id !== action.categoryId) return cat
        return {
          ...cat,
          brands: cat.brands.map(b => {
            if (b.id !== action.brandId) return b
            return { ...b, products: b.products.map(p => p.id === action.productId ? { ...p, variants: [...p.variants, variant] } : p) }
          }),
        }
      })
      const log = pushLog(state.log, 'new-item', `Variant "${action.size}" added to ${action.productLabel}`)
      return { categories, log }
    }
    case 'RESET':
      return { categories: seedCategories, log: seedLog }
    default:
      return state
  }
}

export interface FlatVariant extends Variant {
  categoryId: string
  categoryName: string
  categoryColors: [string, string]
  brandId: string
  brandName: string
  brandChip: string
  productId: string
  productName: string
  total: number
  sold30: number
}

interface InventoryContextValue {
  categories: Category[]
  log: LogEntry[]
  allVariants: FlatVariant[]
  transferStock: (variantId: string, direction: 'g2s' | 's2g', qty: number, label: string) => void
  adjustStock: (variantId: string, location: 'shop' | 'godown', sign: 1 | -1, qty: number, reason: string, label: string) => void
  setLimit: (variantId: string, limit: number) => void
  addCategory: (name: string, unit: string, emoji: string, colors: [string, string]) => void
  addProduct: (categoryId: string, brandId: string | null, newBrandName: string | null, brandChip: string, productName: string, size: string, price: number, limit: number) => void
  addVariant: (categoryId: string, brandId: string, productId: string, size: string, shop: number, godown: number, price: number, limit: number, productLabel: string) => void
  resetDemo: () => void
}

const InventoryContext = createContext<InventoryContextValue | null>(null)

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const allVariants = useMemo<FlatVariant[]>(() => {
    const out: FlatVariant[] = []
    for (const cat of state.categories) {
      for (const brand of cat.brands) {
        for (const product of brand.products) {
          for (const v of product.variants) {
            out.push({
              ...v,
              categoryId: cat.id, categoryName: cat.name, categoryColors: cat.colors,
              brandId: brand.id, brandName: brand.name, brandChip: brand.chip,
              productId: product.id, productName: product.name,
              total: v.shop + v.godown,
              sold30: (hashSeed(v.id) % 78) + 6,
            })
          }
        }
      }
    }
    return out
  }, [state.categories])

  const value: InventoryContextValue = {
    categories: state.categories,
    log: state.log,
    allVariants,
    transferStock: (variantId, direction, qty, label) => dispatch({ type: 'TRANSFER', variantId, direction, qty, label }),
    adjustStock: (variantId, location, sign, qty, reason, label) => dispatch({ type: 'ADJUST', variantId, location, sign, qty, reason, label }),
    setLimit: (variantId, limit) => dispatch({ type: 'SET_LIMIT', variantId, limit }),
    addCategory: (name, unit, emoji, colors) => dispatch({ type: 'ADD_CATEGORY', name, unit, emoji, colors }),
    addProduct: (categoryId, brandId, newBrandName, brandChip, productName, size, price, limit) =>
      dispatch({ type: 'ADD_PRODUCT', categoryId, brandId, newBrandName, brandChip, productName, size, price, limit }),
    addVariant: (categoryId, brandId, productId, size, shop, godown, price, limit, productLabel) =>
      dispatch({ type: 'ADD_VARIANT', categoryId, brandId, productId, size, shop, godown, price, limit, productLabel }),
    resetDemo: () => dispatch({ type: 'RESET' }),
  }

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory(): InventoryContextValue {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error('useInventory must be used within InventoryProvider')
  return ctx
}
