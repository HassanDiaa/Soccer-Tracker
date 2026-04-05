# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Soccer Gear Tracker (`artifacts/jersey-tracker`)
- React + Vite frontend-only app (no backend — all data stored in localStorage)
- Mobile-optimized inventory tracker for soccer jersey and hoodie giveouts
- Three locations: Irvine (teal), Garden Grove (orange), Yorba Linda (golden/olive)
- Coach view: size selection buttons with confirmation drawer before recording
- Admin view (password: admin123): per-location inventory management + master totals view + bulk order entry
- Jersey sizes: 4XS, 3XS, 2XS, XS, S, M, L, XL, 2XL
- Hoodie sizes: S, M, L, XL, 2XL, 3XL
- Last selected location is persisted per-device

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
