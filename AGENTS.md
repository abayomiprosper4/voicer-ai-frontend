<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:ui-ux-rules -->
# Frontend UI/UX rules

This project uses standard Shadcn UI components and Tailwind v4. 
Do not use legacy custom design tokens or Figma-specific CSS variables. 
Stick to standard Shadcn okLCH variables (bg-background, text-primary, bg-muted, etc).
<!-- END:ui-ux-rules -->

<!-- BEGIN:commit-push-strategy -->
## 🚢 Commit & Push Strategy

When the user says **"commit"**:

1. **Build first**: Always run the project build (`npm run build` or equivalent) before committing. If it fails, surface the error and stop — do not commit broken code.
2. **Audit uncommitted files**: Run `git status` and review everything untracked/modified.
3. **Respect gitignore**: Never force-add files that are gitignored. In particular, do NOT commit:
   - `*.m.md` files (e.g. `chat.m.md`)
   - Anything under `dev-utils/` unless the user explicitly asks for it
   - Any file matching an existing `.gitignore` rule
4. **Group commits atomically and sensibly**: Don't dump everything into one commit. Split by logical concern — one commit per feature/flow/fix. Examples:
   - DB migrations → their own commit
   - Admin-side feature → separate commit from agent-side
   - Refactor/cleanup → separate from feature work
   - Style-only token cleanup → separate from behavior changes
5. **Commit message style**: Follow the existing repo convention (scope prefixes like `feat(admin):`, `fix:`, `chore:`, `style(ui):`, `refactor:`). Short first line, no trailing period. Body only when the "why" is non-obvious.
6. **Push to main last**: After all atomic commits land locally, push to `main` in a single `git push`.
7. **Never** `--no-verify`, `--force`, `--amend` published commits, or skip hooks. If a pre-commit hook fails, fix the underlying issue and make a new commit — never bypass.
<!-- END:commit-push-strategy -->
