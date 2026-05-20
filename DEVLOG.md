# Developer Log — SpendSentry Project

This document tracks daily progress, design decisions, hours worked, learnings, and blockers encountered during the 7-day development window of SpendSentry.

---

## Day 1 — 2026-05-14
**Hours worked:** 4
**What I did:**
- Conducted primary market research on SaaS AI pricing. Sourced and compiled verified pricing tiers for Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, and Windsurf, cross-referencing each with official vendor pages.
- Drafted and verified all source URLs for `PRICING_DATA.md`.
- Wrote the system architecture blueprint and finalized our stack choice: Next.js App Router, TypeScript, Vanilla CSS, Supabase, and Resend.

**What I learned:**
- Learned that Claude Team plan requires a minimum of 5 seats ($125/mo), which is a massive billing trap for teams with 2-4 users. This is a perfect high-leverage optimization candidate for our audit engine.

**Blockers / what I'm stuck on:**
- None. Setup went smoothly.

**Plan for tomorrow:**
- Conduct target customer discovery interviews with real-world startup founders and engineering managers to validate our design assumptions.

---

## Day 2 — 2026-05-15
**Hours worked:** 5
**What I did:**
- Scheduled and conducted three 15-minute customer discovery interviews with a seed CTO, a Series A VP of Engineering, and a bootstrapped indie hacker.
- Transcribed key quotes and documented findings in `USER_INTERVIEWS.md`.
- Refined the UX requirements based on their feedback, such as removing the pre-login wall and implementing an honest "Optimal Stack" congratulatory board.

**What I learned:**
- Learned that bootstrapped indie hackers take pride in having *optimized* spend, meaning we should celebrate lean setups rather than inventing fake savings to force a sale.
- Discovered that duplicate seat licenses (e.g. Cursor + Copilot) are incredibly common and represent massive hidden leakage for growing teams.

**Blockers / what I'm stuck on:**
- Realized that client-side API keys are a massive security liability. Must rewrite our planned AI integration to run entirely on serverless API routes.

**Plan for tomorrow:**
- Initialize the Next.js project locally and build the global CSS design tokens system.

---

## Day 3 — 2026-05-16
**Hours worked:** 5
**What I did:**
- Bootstrapped the Next.js project using TypeScript and App Router.
- Designed our global vanilla CSS variable design system (`app/globals.css`), crafting a premium glassmorphic dark-theme with vibrant tailored HSL colors, soft glowing radial gradients, and fluid micro-animations.
- Set up the folder structures and deleted template files.

**What I learned:**
- Custom vanilla CSS variables allow us to create highly flexible, performant design systems that bypass the cookie-cutter look of modern Tailwind/component templates.

**Blockers / what I'm stuck on:**
- Encountered a dependency version conflict between ESLint and the Next.js boilerplates, which I resolved by specifying exact resolutions in `package.json`.

**Plan for tomorrow:**
- Build the core audit engine (`lib/auditEngine.ts`) and write the automated test suite.

---

## Day 4 — 2026-05-17
**Hours worked:** 6
**What I did:**
- Implemented the deterministic audit calculator (`lib/auditEngine.ts`) handling double-paying flags, seat mismatches, and Credex high-savings consultation paths.
- Setup Vitest for automated testing and wrote 5 robust test scenarios inside `tests/auditEngine.test.ts` covering edge cases.
- Executed the test suite to ensure all checks return green.

**What I learned:**
- Pure functions are ideal for financial audit logic. By keeping our audit calculations completely separate from React state or database side effects, we can write robust, zero-friction unit tests.

**Blockers / what I'm stuck on:**
- Experienced a rounding issue where floating-point math created long decimals (e.g., $19.9999999). Resolved by standardizing cents representations internally and rounding strings using `.toFixed(2)`.

**Plan for tomorrow:**
- Build the persistent multi-step input form and results page UI.

---

## Day 5 — 2026-05-18
**Hours worked:** 7
**What I did:**
- Developed the stateful `components/AuditForm.tsx` supporting all required tools. Integrated LocalStorage persistence to rehydrate form inputs automatically.
- Developed the responsive, glassmorphic `components/AuditResults.tsx` panel displaying total monthly/annualized savings, detailed tool breakdowns, and the dynamic email-gate forms.
- Programmed a custom micro-animated loading overlay that mimics a finance-specific auditing screen to build user anticipation.

**What I learned:**
- Adding a minor loading delay (e.g., 2 seconds) with interactive checkmarks (*"Analyzing double-paying seats..."*, *"Checking API quotas..."*) significantly increases the perceived value of the audit report.

**Blockers / what I'm stuck on:**
- Experienced state-sync glitches when adding/removing tools in rapid succession. Mitigated by streamlining our React state structure to use a single unified `FormData` object.

**Plan for tomorrow:**
- Implement backend storage with Supabase, AI personalized summaries with Anthropic, and transactional email with Resend.

---

## Day 6 — 2026-05-19
**Hours worked:** 6
**What I did:**
- Created database migration schemas in Supabase and built the serverless POST `/api/audit` handler.
- Configured `/api/summary` to fetch 100-word CFO audits from Anthropic’s Claude 3.5 Sonnet, including a resilient templated fallback mechanism.
- Configured `/api/email` to dispatch transactional confirmations via the Resend SDK.
- Wrote the prompt designs and A/B test histories inside `PROMPTS.md`.

**What I learned:**
- Claude 3.5 Sonnet is exceptional at adopting CFO-level personas, but must be heavily constrained via word count and direct entrance instructions to prevent visual UI layout breakage.

**Blockers / what I'm stuck on:**
- Resend's free tier requires domain verification to send to arbitrary emails. Implemented a robust fallback that dispatches to our verified account while log-dumping the email payloads in dev mode for grading.

**Plan for tomorrow:**
- Build the dynamic public share routes, verify Lighthouse scores, draft remaining entrepreneurial files, and run final checks.

---

## Day 7 — 2026-05-20
**Hours worked:** 5
**What I did:**
- Programmed the public share route `/share/[id]` utilizing server-side data fetching and dynamic Open Graph tag generation to enable pixel-perfect link previews on Twitter/X and Slack.
- Drafted the final entrepreneurial files: `GTM.md`, `ECONOMICS.md`, `LANDING_COPY.md`, and `METRICS.md`.
- Configured `.github/workflows/ci.yml` for automated linting and tests.
- Audited the entire application using Chrome Lighthouse, ensuring Performance, Accessibility, and Best Practices all exceed 90.

**What I learned:**
- Dynanic Open Graph previews are a massive growth hack for B2B SaaS. Stripping identifying details from the shareable page builds user trust, encouraging virality.

**Blockers / what I'm stuck on:**
- Encountered font-loading timeouts in the dynamic OG image generator. Mitigated by base64-encoding the font buffer directly inside our static assets.

**Plan for tomorrow:**
- Submit the repository, deploy live, and celebrate shipping a high-value product!
