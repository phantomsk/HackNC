# INTEGRATION_NOTES.md

## Stack Summary
- **Frontend:** Next.js (App Router, React 19, TypeScript)
- **UI:** Tailwind CSS, Radix UI, Lucide icons
- **State:** React hooks
- **Routing:** File-based, app directory
- **API:** No custom server; will add Python FastAPI backend
- **DB:** No ORM detected; will add SQLAlchemy/Alembic in backend
- **Auth:** Simulated login, no OAuth/SAML
- **Lint/Format:** TypeScript strict, Next.js plugin

## Entry Points
- **Sign Up/Get Started:** Found in `quickvest/app/page.tsx` as "Get Started" CTA
- **Login:** `quickvest/app/login/page.tsx`
- **Setup:** `quickvest/app/setup/page.tsx` (chatbot onboarding)
- **API:** Will add Python FastAPI backend in `backend/`

## Style Rules
- Use Tailwind utility classes, custom palette
- Use Radix UI and Lucide icons for components
- PascalCase for components, colocated in `components/ui/` or `components/onboarding/`

## Insertion Points for New Flow
- Patch "Get Started" CTA in `app/page.tsx` to route to `/onboarding?from=signup`
- Add `/onboarding` page for conversational onboarding
- Add Python FastAPI backend for API endpoints

## Risks & Mitigation
- **Breaking login/setup:** Only reroute "Get Started" CTA, leave login unchanged
- **Style mismatch:** Use existing Tailwind and Radix UI patterns
- **No DB layer:** Add SQLAlchemy/Alembic, keep changes additive
- **PII exposure:** Redact logs, encrypt sensitive fields, use env for keys
- **API rate limits, CORS:** Add protections to new endpoints

## Estimate of Touched Files
- **Modified:** `app/page.tsx`, possibly central nav/guard
- **Added:** All onboarding feature files, backend, docs, tests

## Naming Conventions & Patterns
- PascalCase for components
- UI components in `components/ui/` or `components/onboarding/`
- API routes in Python FastAPI backend
- Libs/services in `backend/services/`
- DB models in `backend/db/models.py`
- Docs in `docs/`

## Next Steps
1. Patch CTA in `app/page.tsx`
2. Add onboarding page and components
3. Add Python FastAPI backend
4. Add tests and backend README
