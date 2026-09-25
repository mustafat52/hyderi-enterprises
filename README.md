# Hyderi Enterprises — Stock Ledger

An inventory tracking app for Hyderi Enterprises (paint retail — Asian Paints, Berger, Nerolac, JK Wall Putty, Dr. Fixit, etc.), built with React, TypeScript, Vite, and Tailwind CSS. Installable as a PWA on phones (Add to Home Screen) and desktop.

All stock movement — Purchase, Sale, and Move between the Shop and the Godown — is entered manually by staff directly in the app; the app is the sole source of truth for inventory. There is no revenue/GST tracking — only stock quantity and stock value (by purchase price).

## Run locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build for production

```bash
npm run build
npm run preview   # to sanity-check the production build locally
```

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Vite** (auto-detected). No environment variables needed.
4. Deploy. The included `vercel.json` handles client-side routing (so refreshing `/catalog/paints/asian/p1` works instead of 404ing).

## Installing as an app (PWA)

Once deployed, open the Vercel URL on a phone:
- **Android (Chrome)**: menu → "Add to Home screen" / "Install app".
- **iPhone (Safari)**: Share button → "Add to Home Screen".

It will then launch full-screen, without browser chrome, like a native app, and works offline for previously-visited screens (via the auto-generated service worker).

## What's in the app

- **Dashboard** — owner-only: stock value, category browser, recent activity. Employees land on a separate action-first home screen instead (three big Purchase/Sale/Move buttons, no rupee figures, no Reports link).
- **Catalog** — Category → Sub-category (brand) → Product → Variant drill-down. Adding categories/products/variants and editing a variant's quantity or reorder limit are owner-only actions.
- **Purchase** — stock arriving from a supplier: multi-item, auto-splitting Shop/Godown quantities, capturing the price paid per line (which becomes that variant's new stored purchase price).
- **Sale** — stock going out to a customer: multi-item, each line independently sourced from Shop or Godown.
- **Move** — Godown ↔ Shop, one direction per slip, multiple items.
- **Alerts** — reorder limits are checked against **Shop stock only** (Godown stock doesn't help a customer at the counter), split into "can move from Godown" vs. "needs purchase."
- **Reports** — owner-only: stock value by category, Shop vs Godown split, a selectable-period Stock In vs Stock Out summary, and fast/slow movers computed from real sale history.
- **Stock log** — full audit trail of every purchase, sale, move, adjustment, and new item added, with timestamp. Filterable by type.
- **Roles** — 4 owner logins and 1 employee login. Employees get the full daily-use workflow (Purchase/Sale/Move/Alerts) without stock-value figures, Reports, or catalog editing.

## Resetting demo data

A "Reset demo data" link at the bottom of the owner Dashboard clears anything added during a session and restores the original seed data.

## Known gaps / next steps

There is no backend yet — everything lives in the browser's `localStorage`, single-device, single-browser. The planned move is to Supabase (Postgres + Auth + Row Level Security), which is also what real per-user attribution in the Stock Log and real enforcement of the owner/employee split depend on — right now that split is a frontend convenience, not a security boundary. See the project handoff notes for the full migration plan.