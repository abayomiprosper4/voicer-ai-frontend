<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-ux-rules -->
# Frontend UI/UX rules (read before building any screen)

This is a Figma-driven build: screens are pasted in and must be reproduced
faithfully. These rules are non-negotiable — they keep every screen consistent,
responsive, accessible, and theme-correct.

## 1. Color & tokens — never hardcode
- **Never** write hex/rgb/named colors or arbitrary color classes
  (`bg-[#1089a0]`, `text-[rgb(...)]`). Use semantic tokens only:
  `bg-background text-foreground bg-primary text-primary-foreground
  bg-secondary text-muted-foreground border-border bg-card bg-sidebar
  bg-accent bg-destructive bg-cta text-cta-foreground bg-surface
  text-surface-foreground bg-panel text-panel-foreground shadow-glow
  shadow-glass`.
- `bg-cta text-cta-foreground` = high-emphasis dark CTA ("Start recording").
  `bg-surface text-surface-foreground` = desaturated teal prompt/recorder panel.
  `bg-panel text-panel-foreground` = muted teal card w/ dark text (submission /
  recent-activity cards).
  Rule: when a Figma element's bg/fg don't match an existing token pair, add a
  new `--token`/`--token-foreground` in `:root` + `.dark` + `@theme inline` —
  never inline the hex.
- Source of truth is **`app/globals.css`**: the `:root`/`.dark` HSL variables
  bridged into utilities by the `@theme inline` block. Tailwind v4 does **not**
  load `tailwind.config.ts` — that file is dead; editing it does nothing.
- A Figma color with no matching token → add a new variable in `:root` (and its
  `.dark` value) **and** map it in `@theme inline`. Don't inline the hex.
- Theming is automatic: tokens resolve through CSS vars, so `.dark` works for
  free. Don't add per-color `dark:` overrides.
- Pre-existing landing/login pages use legacy hex on purpose — leave them; do
  not "fix" them unless asked.

## 2. Responsiveness is mandatory
- Mobile-first. Default classes target small screens; layer up with
  `sm: md: lg: xl:`. Every screen must work from ~360px to wide desktop.
- The contributor persona is mobile-first (PRD §5.1) — recording/task flows
  must be fully usable on a phone.
- Verify no horizontal scroll; tap targets ≥ 44px; text stays readable
  (don't shrink below `text-sm` for body on mobile).

## 3. Layout & navigation
- Authenticated chrome is **`components/dashboard/DashboardShell.tsx`**:
  fixed sidebar on `md+`, top app-bar + slide-in drawer on mobile.
- To change nav, edit **`components/dashboard/nav-config.ts`** only
  (`NAV_ITEMS` per role). Don't fork the shell per role or hardcode links.
- Each role layout just renders `<DashboardShell role="…">`. The
  `(dashboards)/layout.tsx` is the auth-guard seam — keep auth logic there.
- New authenticated pages render *inside* the shell `<main>`; don't re-create
  sidebars/headers in pages.

## 4. Components & conventions
- Reuse `components/ui/button.tsx` (`Button` + `buttonVariants`, cva). Don't
  hand-roll buttons. Merge classes with `cn()` from `@/lib/utils`.
- Icons: `lucide-react` (pinned **1.14.0**). Confirm an icon name actually
  exists in the installed version before importing it.
- Server Components by default; add `"use client"` only when a file needs
  state, effects, or browser APIs. Keep client components small.
- Next 16: `params`/`searchParams` are Promises — `await` them. Check
  `node_modules/next/dist/docs/` for any Next-specific API before using it.

## 5. Accessibility & interaction states (every element)
- Semantic HTML (`button`, `nav`, `main`, `header`, headings in order).
  Icon-only controls need `aria-label`; active nav uses `aria-current="page"`.
- Every interactive element needs visible `hover` **and** `focus-visible`
  states, plus `disabled` styling where applicable.
- Overlays/drawers/modals: close on Escape and backdrop click, lock body
  scroll, `role="dialog"` + `aria-modal`.
- Provide loading, empty, and error states for any data-driven view — never a
  blank screen. Form inputs need associated labels.

## 6. Fidelity to Figma
- Match spacing, hierarchy, sizing, and radii to the design; use the Tailwind
  spacing scale and existing radius/shadow tokens rather than ad-hoc values.
- Reproduce the layout structure, but route all colors through tokens (§1) and
  make it responsive (§2) even if the Figma frame is desktop-only — collapse
  multi-column layouts sensibly on small screens.
<!-- END:ui-ux-rules -->
