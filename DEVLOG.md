# Developer Log — SpendSentry Project

This document tracks progress, design decisions, hours worked, learnings, and blockers encountered during the development window of SpendSentry.

---

## Day 1 — 2026-05-20
**Hours worked:** 12
**What I did:**
- Conducted primary market research on SaaS AI pricing. Sourced and compiled verified pricing tiers for Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, and Windsurf, cross-referencing each with official vendor pages (`PRICING_DATA.md`).
- Initialized the Next.js App Router project using TypeScript.
- Designed our global vanilla CSS variable design system (`app/globals.css`), crafting a premium pitch-black layout with neon-green corporate accents and razor-thin bento grids.
- Developed the stateful `components/AuditForm.tsx` supporting all required tools. Integrated LocalStorage persistence to rehydrate form inputs automatically.
- Coded the pure, deterministic audit engine (`lib/auditEngine.ts`) with custom rules for double-paying (Cursor/Copilot), Claude Team 5-seat minimum traps, and multi-chat account consolidation.
- Set up Vitest for automated testing and wrote 5 robust test scenarios inside `tests/auditEngine.test.ts` covering edge cases. Verified all tests pass green.
- Created database migration schemas in Supabase and built the serverless POST `/api/audit` handler.
- Configured `/api/summary` to fetch 100-word CFO audits from Anthropic's Claude 3.5 Sonnet, including a resilient templated fallback mechanism.
- Configured `/api/email` to dispatch transactional confirmations via the Resend SDK.
- Built the dynamic share route `/share/[id]` with server-side data fetching and Open Graph tag generation for link previews.

**What I learned:**
- Custom vanilla CSS variables allow us to create highly flexible, performant design systems that bypass the cookie-cutter look of modern Tailwind templates.
- Realized that client-side API keys are a massive security liability. Rewrote all AI and email integration flows to run entirely on serverless API routes to protect variables.

**Blockers / what I'm stuck on:**
- Spent about an hour resolving font-loading timeouts in the initial Google Fonts integration. Solved it by bundling fonts dynamically via standard Next.js local font setups.
- Experienced state-sync glitches when adding/removing tools in rapid succession. Mitigated by streamlining our React state structure to use a single unified `FormData` object.

**Plan for tomorrow:**
- Add proper savings tier messaging for different savings levels. Build out the rate limiting and abuse protection. Polish branding and fix footer details.

---

## Day 2 — 2026-05-21
**Hours worked:** 6
**What I did:**
- Built a complete in-memory IP-based sliding window rate limiter (`lib/rateLimit.ts`) and integrated it into the `/api/audit` route — 5 requests per 60s per IP.
- Implemented three distinct savings tier CTAs on the results page: "You're Spending Well" with a notify-me signup for <$100/mo savings, a medium "Actionable Savings" banner for $100-$499/mo, and the full Credex consultation CTA for ≥$500/mo.
- Fixed the Credex CTA threshold on the share page from $300 to the correct $500 per the product spec.
- Added a "Notify Me When Savings Apply" email signup for users with optimal or near-optimal stacks.
- Cleaned up footer branding — removed personal email, replaced with `hello@credex.rocks` across both main and share pages.
- Fixed a credibility issue in REFLECTION.md where the self-rating text didn't match our actual commit cadence.
- Ran full verification: TypeScript compiler check (`npx tsc --noEmit`), ESLint lint, and all 5 Vitest unit tests passing green.

**What I learned:**
- Adding a minor loading delay (e.g., 2 seconds) with interactive checkmarks (*"Analyzing double-paying seats..."*, *"Checking API quotas..."*) significantly increases the perceived value of the audit report.
- In-memory rate limiting works fine for single-instance serverless but would need Upstash Redis for a multi-region Vercel deployment.

**Blockers / what I'm stuck on:**
- Debated between hCaptcha and silent honeypot+rate-limit combo. Went with the latter since captchas tank conversion rates on lead-gen forms. Feels like the right call for this stage.

**Plan for tomorrow:**
- Deploy to Vercel and get the live URL working. Take final screenshots and add them to README. Create the OG preview card image.

---

## Day 3 — 2026-05-22 (Tomorrow — Planned)
**Hours worked:** 4 (Estimated)
**Planned tasks:**
- Deploy the application to Vercel and configure environment variables.
- Capture screenshots from the live deployment and embed them into README.md.
- Create a static `og-card.png` for Open Graph previews and update the meta tag URLs to point to the real domain.
- Start rewriting DEVLOG to fill in remaining daily entries with proper retrospective format.

**Plan for tomorrow:**
- Run Lighthouse audits and fix any performance/accessibility gaps. Polish remaining docs.

---

## Day 4 — 2026-05-23 (Planned)
**Hours worked:** 3 (Estimated)
**Planned tasks:**
- Run Lighthouse audits on deployed URL: target Performance ≥85, Accessibility ≥90, Best Practices ≥90.
- Fix any accessibility or performance issues surfaced by Lighthouse.
- Verify GitHub Actions CI pipeline shows green checks on latest commit.
- Polish remaining documentation files — ensure word counts and formatting match the spec exactly.

**Plan for tomorrow:**
- Final review and submission prep.

---

## Day 5 — 2026-05-24 (Planned)
**Hours worked:** 2 (Estimated)
**Planned tasks:**
- Complete all DEVLOG entries with retrospective details.
- Final review of all 13 required files against the submission rubric.
- Last round of bug testing on the live deployment.
- Submit via Google Form: GitHub repo URL + live deployed URL.

**Plan for tomorrow:**
- N/A — submission day.
