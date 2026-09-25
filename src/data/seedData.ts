import type { Category, LogEntry } from '../types'

export const SWATCH_OPTIONS = [
  '#99372A', '#B97A1C', '#1F5C58', '#3C5D78',
  '#55703F', '#6E2419', '#8A6A3C', '#4A5A6E',
]

export const EMOJI_OPTIONS = ['🎨', '🖌️', '🧱', '🧪', '💧', '🔩', '🧴', '🪣', '🧹', '🧽']

interface VariantSeed { id: string; size: string; shop: number; godown: number; price: number; limit: number }
interface ProductSeed { id: string; name: string; variants: VariantSeed[] }
interface BrandSeed { id: string; name: string; chip: string; products: ProductSeed[] }
interface CategorySeed { id: string; name: string; unit: string; emoji: string; colors: [string, string]; brands: BrandSeed[] }

const rawCategories: CategorySeed[] = [
  {
    id: 'paints', name: 'Paints', unit: 'L', emoji: '🎨', colors: ['#99372A', '#B97A1C'],
    brands: [
      {
        id: 'asian', name: 'Asian Paints', chip: '#99372A',
        products: [
          { id: 'p1', name: 'Apcolite Premium Emulsion', variants: [
            { id: 'v1', size: '1L', shop: 18, godown: 42, price: 210, limit: 15 },
            { id: 'v2', size: '4L', shop: 6, godown: 20, price: 780, limit: 8 },
            { id: 'v3', size: '10L', shop: 2, godown: 11, price: 1850, limit: 5 },
            { id: 'v4', size: '20L', shop: 1, godown: 6, price: 3500, limit: 3 },
          ]},
          { id: 'p2', name: 'Tractor Emulsion', variants: [
            { id: 'v5', size: '1L', shop: 24, godown: 60, price: 140, limit: 20 },
            { id: 'v6', size: '4L', shop: 9, godown: 28, price: 520, limit: 10 },
            { id: 'v7', size: '20L', shop: 3, godown: 14, price: 2400, limit: 5 },
          ]},
          { id: 'p3', name: 'Ace Exterior Emulsion', variants: [
            { id: 'v8', size: '4L', shop: 3, godown: 9, price: 640, limit: 8 },
            { id: 'v9', size: '10L', shop: 1, godown: 4, price: 1520, limit: 5 },
            { id: 'v10', size: '20L', shop: 0, godown: 3, price: 2900, limit: 4 },
          ]},
        ],
      },
      {
        id: 'berger', name: 'Berger', chip: '#8A6A3C',
        products: [
          { id: 'p4', name: 'Bison Acrylic Distemper', variants: [
            { id: 'v11', size: '1L', shop: 14, godown: 33, price: 120, limit: 12 },
            { id: 'v12', size: '4L', shop: 5, godown: 17, price: 450, limit: 8 },
            { id: 'v13', size: '20L', shop: 2, godown: 8, price: 2100, limit: 4 },
          ]},
          { id: 'p5', name: 'WeatherCoat Long Life', variants: [
            { id: 'v14', size: '4L', shop: 4, godown: 10, price: 890, limit: 6 },
            { id: 'v15', size: '20L', shop: 1, godown: 5, price: 3800, limit: 3 },
          ]},
        ],
      },
      {
        id: 'nerolac', name: 'Nerolac', chip: '#3C5D78',
        products: [
          { id: 'p6', name: 'Impressions HC', variants: [
            { id: 'v16', size: '1L', shop: 11, godown: 26, price: 195, limit: 10 },
            { id: 'v17', size: '4L', shop: 3, godown: 12, price: 710, limit: 6 },
          ]},
          { id: 'p7', name: 'Excel Total+', variants: [
            { id: 'v18', size: '10L', shop: 2, godown: 7, price: 1680, limit: 5 },
            { id: 'v19', size: '20L', shop: 1, godown: 4, price: 3200, limit: 3 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'brushroller', name: 'Rollers & Brushes', unit: 'pc', emoji: '🖌️', colors: ['#3C5D78', '#B97A1C'],
    brands: [
      {
        id: 'ppl', name: 'PPL', chip: '#3C5D78',
        products: [
          { id: 'p8', name: 'Nylon Paint Brush', variants: [
            { id: 'v20', size: '1 inch', shop: 22, godown: 40, price: 35, limit: 15 },
            { id: 'v21', size: '2 inch', shop: 18, godown: 35, price: 55, limit: 15 },
            { id: 'v22', size: '4 inch', shop: 9, godown: 20, price: 95, limit: 10 },
          ]},
          { id: 'p9', name: 'Foam Roller Set', variants: [
            { id: 'v23', size: '4 inch', shop: 12, godown: 24, price: 65, limit: 10 },
            { id: 'v24', size: '9 inch', shop: 5, godown: 14, price: 120, limit: 8 },
          ]},
        ],
      },
      {
        id: 'ashirwad', name: 'Ashirwad', chip: '#B97A1C',
        products: [
          { id: 'p10', name: 'Bristle Wall Brush', variants: [
            { id: 'v25', size: '2 inch', shop: 14, godown: 22, price: 48, limit: 10 },
            { id: 'v26', size: '3 inch', shop: 7, godown: 15, price: 72, limit: 8 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'putty', name: 'Putty & Fillers', unit: 'kg', emoji: '🧱', colors: ['#B97A1C', '#55703F'],
    brands: [
      {
        id: 'jk', name: 'JK Wall Putty', chip: '#B97A1C',
        products: [
          { id: 'p11', name: 'Wall Putty Powder', variants: [
            { id: 'v27', size: '1kg', shop: 20, godown: 45, price: 28, limit: 18 },
            { id: 'v28', size: '5kg', shop: 8, godown: 22, price: 130, limit: 10 },
            { id: 'v29', size: '20kg', shop: 2, godown: 9, price: 480, limit: 5 },
          ]},
        ],
      },
      {
        id: 'birla', name: 'Birla White', chip: '#55703F',
        products: [
          { id: 'p12', name: 'Wallcare Putty', variants: [
            { id: 'v30', size: '5kg', shop: 3, godown: 13, price: 145, limit: 8 },
            { id: 'v31', size: '20kg', shop: 1, godown: 6, price: 540, limit: 4 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'thinner', name: 'Thinners & Solvents', unit: 'L', emoji: '🧪', colors: ['#6E2419', '#99372A'],
    brands: [
      {
        id: 'generic', name: 'Standard Range', chip: '#6E2419',
        products: [
          { id: 'p13', name: 'NC Thinner', variants: [
            { id: 'v32', size: '1L', shop: 16, godown: 30, price: 110, limit: 12 },
            { id: 'v33', size: '5L', shop: 4, godown: 11, price: 500, limit: 6 },
          ]},
          { id: 'p14', name: 'Turpentine Oil', variants: [
            { id: 'v34', size: '1L', shop: 9, godown: 19, price: 95, limit: 8 },
          ]},
        ],
      },
    ],
  },
  {
    id: 'waterproof', name: 'Waterproofing', unit: 'kg', emoji: '💧', colors: ['#1F5C58', '#3C5D78'],
    brands: [
      {
        id: 'dr-fixit', name: 'Dr. Fixit', chip: '#1F5C58',
        products: [
          { id: 'p15', name: 'Pidiproof LW+', variants: [
            { id: 'v35', size: '1kg', shop: 5, godown: 14, price: 210, limit: 8 },
            { id: 'v36', size: '5kg', shop: 2, godown: 7, price: 980, limit: 4 },
          ]},
        ],
      },
    ],
  },
]

export const seedCategories: Category[] = rawCategories.map(cat => ({
  ...cat,
  brands: cat.brands.map(b => ({
    ...b,
    products: b.products.map(p => ({
      ...p,
      variants: p.variants.map(v => ({
        ...v,
        // Original limits were tuned against combined (shop+godown) stock. Alerts now
        // check Shop stock alone, so scale them down to a realistic shop-only threshold.
        limit: Math.max(2, Math.round(v.limit * 0.4)),
      })),
    })),
  })),
}))

const now = Date.now()
const HR = 3600_000
export const seedLog: LogEntry[] = [
  { id: 'l5', ts: now - 2 * HR, actor: 'Owner', method: 'adjustment', description: 'Tractor Emulsion 1L (+3, cash sale)', qtyDelta: 3 },
]