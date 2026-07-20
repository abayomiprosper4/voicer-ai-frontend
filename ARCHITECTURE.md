# Voicer Frontend Architecture & UX Guidelines

This document outlines the core architectural and user experience guidelines for the Voicer frontend.

## 1. UX & Layout: The "GitHub-Inspired" Approach
Voicer aggressively avoids the generic SaaS template (i.e., a massive, fixed left sidebar). Instead, we take heavy inspiration from **GitHub's layout patterns**:
- **No Global Sidebar**: Navigation is handled via a top-level, contextual navigation bar. 
- **Context-Switching**: The application context (Organization → Project) is managed through top-level dropdowns or breadcrumbs, rather than nesting everything inside a generic, persistent sidebar.
- **Content-First Layouts**: Dashboards and data tables span the full width of the main container, maximizing horizontal screen real estate for complex tasks like dataset review and management.
- **Repository-Style Navigation**: Within a specific project, sub-navigation (Tasks, Submissions, Reviews, Settings) is handled via a horizontal tab or sub-nav bar directly below the project header.

## 2. UI Aesthetics (The "Stark" Design System)
- **Shadcn UI & Tailwind v4**: All components are built strictly using standard Shadcn components and Tailwind v4 features.
- **Zero Gradients**: The design relies entirely on stark contrast, solid backgrounds (`bg-background`, `bg-muted`), and crisp 1px borders. Blobs, drop shadows with massive spreads, and text-gradients are strictly prohibited.
- **Standard Variables**: We stick exclusively to standard Shadcn `oklch()` design tokens (`text-foreground`, `bg-card`, etc.). We avoid legacy Figma-specific hex codes.

## 3. Data Architecture (The Single Source of Truth)
- **Backend-Driven**: The backend API is the absolute source of truth. We avoid duplicating complex business logic on the client.
- **TanStack Query**: `react-query` manages 95% of the application state. All server data is fetched, cached, and synchronized using Query keys organized by domain.
- **Client State**: Reduced to a minimum. React `useState` or lightweight stores are only used for ephemeral UI states (modal toggles, active audio player state).

## 4. Middleware Protection
- Next.js Edge Middleware (`middleware.ts`) is used to enforce strict route protection. Unauthenticated users attempting to access `/dashboard` or internal routes are aggressively bounced to `/login`, while authenticated users are bounced away from auth routes.
