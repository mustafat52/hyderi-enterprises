# Hyderi Enterprises — Stock Ledger (Demo)

A frontend-only inventory tracking demo for Hyderi Enterprises, built with React, TypeScript, Vite, and Tailwind CSS. Installable as a PWA on phones (Add to Home Screen) and desktop.

This is a **pitch demo**: all data lives in the browser (seeded on first load, then persisted to `localStorage`), and nothing talks to Tally or any backend yet. It exists to show the client the intended look, structure, and workflow before the real build (with the actual Tally sync) is scoped.

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

## What's in the demo

- **Dashboard** — stock value ledger (Shop vs Godown), category browser, recent activity.
- **Catalog** — Category → Sub-category (brand) → Product → Variant drill-down, with "Add category / product / variant" flows.
- **Product page** — per-variant Shop/Godown quantities, purchase price, computed stock value, reorder limit, and Transfer / Adjust / Set limit actions.
- **Alerts** — anything below its reorder limit.
- **Reports** — stock value ledger table, fast/slow movers (30-day), Shop-vs-Godown tally-mark split.
- **Stock log** — full audit trail of every transfer, adjustment, and new item added, with actor and timestamp. Filterable by type.
- **Bottom nav + FAB** (mobile) — quick navigation and a "Quick update" search-to-transfer/adjust flow, matching how this would actually be used on a phone at the counter.

## Resetting demo data

A "Reset demo data" link at the bottom of the Dashboard clears anything added during a demo session and restores the original seed data — handy before showing it to the client again.

## Next step (real build)

This demo has no backend and does not talk to Tally. The real version will need:
- A local sync agent reading Tally's XML-over-HTTP interface (see project notes) and pushing parsed purchase/sales data to a real backend (e.g. Supabase).
- The one-time stock-item mapping step (Tally item name → Category/Sub-category/Product/Variant) discussed with the client.
- Real authentication instead of the open demo state.
