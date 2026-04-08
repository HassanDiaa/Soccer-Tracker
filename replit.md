# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Soccer Gear Tracker (`artifacts/jersey-tracker`)
- React + Vite frontend — connects to shared API server for collaborative real-time inventory
- Mobile-optimized inventory tracker for soccer jersey and hoodie giveouts
- Three locations: Irvine (teal), Garden Grove (orange), Yorba Linda (golden/olive)
- Coach view: size selection buttons with confirmation drawer before recording; auto-refreshes every 10s
- Admin view (password stored in localStorage, default admin123): per-location + master totals, bulk order, given counter, change password
- Jersey sizes: 4XS, 3XS, 2XS, XS, S, M, L, XL, 2XL (3×3 grid)
- Hoodie sizes: S, M, L, XL, 2XL, 3XL (3×2 grid)
- Last selected location persisted per-device via localStorage

### API Server (`artifacts/api-server`)
- Express 5 + TypeScript, connects to PostgreSQL
- Routes: GET /api/inventory, GET /api/given, POST /api/inventory/confirm, PUT /api/inventory/set, POST /api/inventory/add
- DB tables: `inventory` and `given` (both keyed by location, gear_type, size)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
