# Project: Ministry of Shorthand UI Overhaul

## Architecture
This project is a Next.js 16 (App Router) web application. The architecture includes:
- **Client Views (App Router)**: Organized under `app/(public)` for public pages and `app/dashboard` for private authenticated user pages.
- **UI Components**: Reusable interface elements located under `components/` (buttons, forms, layout elements).
- **Authentication**: NextAuth integration to separate public routes from dashboard practice paths.
- **Database & State**: Prisma mapping to PostgreSQL database.

## Code Layout
- `app/`: Routing pages and layout views.
- `components/`: UI components (using tailwind and lucide).
- `lib/`: Shared utility functions, DB client, and configurations.
- `public/`: Static assets (logos, images, illustrations).
- `scripts/`: Initialization and helper scripts.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Exploration & Design Spec (M1) | Exploration of codebase, tailwind style configs, library assets; creation of `DESIGN_SPEC.md` | None | DONE |
| 2 | E2E Testing Track (M5) | Independent design and creation of requirement-driven test cases (Tiers 1-4); creation of `TEST_INFRA.md` and `TEST_READY.md` | None | IN_PROGRESS |
| 3 | Landing Page Overhaul (M2) | Redesign public landing page with Framer Motion, animations, premium visuals | M1 | DONE |
| 4 | Dashboard Overhaul (M3) | Overhaul practice dashboard with hover states, layout transitions, premium aesthetics | M1 | IN_PROGRESS |
| 5 | Spacing & Usability Polish (M4) | Adjust paddings, margins, typography, mobile responsiveness across landing page & dashboard | M2, M3 | PLANNED |
| 6 | E2E Test Suite Pass & Adversarial Hardening (M6) | Phase 1: Pass 100% of E2E tests; Phase 2: Challenger-driven adversarial testing and coverage hardening | M2, M3, M4, M5 | PLANNED |

## Interface Contracts
### Public Components ↔ Theme Config
- Typography, custom spacing, custom color palettes, and global Tailwind configurations must be clean, modular, and defined either in `app/globals.css` or component files without breaking existing imports.
- Reusable UI animation behaviors (motion elements) should not impede functional elements like button clicks, input focus, or redirect transitions.
