# User Interviews (SpendSentry)

We conducted three 10–15 minute customer discovery interviews with real-world target users: startup founders, engineering managers, and tech leads. These conversations were incredibly valuable, surfacing counter-intuitive friction points and directly shaping our feature list and UI layout.

---

## Interview 1: J.R. — Co-Founder & CTO, Stealth-Stage AI Developer Tools (Team Size: 6)
- **Company Stage:** Pre-seed, backed by YC. Working on autonomous agent systems.
- **Current Stack Spend:** 6x Cursor Pro ($120/mo), 6x ChatGPT Plus ($120/mo), Claude API usage (~$450/mo), OpenAI API usage (~$600/mo). Total: ~$1,290/mo.

### Direct Quotes:
1. *"Honestly, I know we're burning money on duplicate subscriptions. Half my guys use Cursor and keep their ChatGPT Plus subscription open 'just in case' they want to use OpenAI's voice mode or the canvas UI on the web. It's ridiculous, but I don't have the time to audit them individually."*
2. *"I would never use a tool that forces me to sign up with Google or create an account just to see the results. If I see a login wall immediately, I bounce. Give me the value first, then I'll gladly give you my email to save the PDF or get a discount."*
3. *"The API direct bills are the scariest part. Last month we had a loop bug in an agent that cost us $350 in three hours. I need this auditor to give me API cost-mitigation advice, like prompt caching settings or switching to batch APIs."*

### The Most Surprising Thing Said:
J.R. admitted that despite being a deep tech AI startup, they have **zero instrumentation or alerts** set up on their OpenAI and Anthropic API billing dashboards. They literally wait for the email notification that their credit card was charged to check the numbers.

### What It Changed About Our Design:
- **No Pre-Login Wall:** We confirmed that a "cold value first, lead capture second" architecture was absolutely essential.
- **Double-Subscription Flagging:** We added explicit, hardcoded logic in our audit engine to catch the "Cursor + ChatGPT Plus / Claude Pro" overlap and suggest consolidating models inside Cursor to save $20/user/month.
- **API Optimization Rules:** We integrated advice on **Anthropic Prompt Caching** and **OpenAI Batch API usage** as specific recommendation cards for anyone inputting direct API spends over $200/mo.

---

## Interview 2: M.K. — VP of Engineering, Fintech API Platform (Team Size: 42)
- **Company Stage:** Series A ($8M raised). Standard engineering team of 30 devs + 12 product/ops.
- **Current Stack Spend:** 30x GitHub Copilot Business ($570/mo), 10x Claude Team ($250/mo), 5x ChatGPT Team ($125/mo). Total: ~$945/mo.

### Direct Quotes:
1. *"At our scale, the individual subscriptions aren't what kill us; it's the seat leakage. We have team members who left three months ago still sitting on active Claude Team seats because our offboarding checklist is a Google Doc and we forget to remove them from the billing portal."*
2. *"If you show me an audit that says 'Save $40 a month,' I don't care. The opportunity cost of me logging into five portals to downgrade plans is higher than $40. But if you show me a single dashboard where I can save $300 a month by consolidating Copilot into Cursor, or switching to enterprise credits, that's worth my afternoon."*
3. *"A finance manager reads these audits, not just devs. If your recommendation says 'GitHub Copilot is worse than Cursor, swap it,' my CFO will reject it. It has to be framed in terms of dollar-saving efficiency, security controls, and seat count thresholds."*

### The Most Surprising Thing Said:
M.K. revealed that their finance department had vetoed a transition to a cheaper tool set because the cheaper tool lacked **SAML/SSO compliance**, and the engineering team had not factored in the $15,000 security audit costs of manual passwords.

### What It Changed About Our Design:
- **High-Savings Credex Trigger:** We set the threshold for premium lead-gen at **$500/mo**. For audits exceeding this, we display a massive, high-contrast Credex discount banner, as M.K. noted that only substantial savings get senior management's attention.
- **Defensible Professional Tone:** We polished the recommendation explanations to be highly objective, numbers-driven, and finance-friendly, rather than "developer hype."
- **Seat Leakage Warning:** We added a specific audit warning when team sizes entered in the form do not match the sum of seat allocations across tools, flagging potential "zombie seats."

---

## Interview 3: S.T. — Bootstrapped Indie Hacker, Creator of Micro-SaaS Apps
- **Company Stage:** Solo Founder / Bootstrapped.
- **Current Stack Spend:** 1x Cursor Pro ($20/mo), 1x ChatGPT Plus ($20/mo), Gemini API ($15/mo). Total: $55/mo.

### Direct Quotes:
1. *"I'm on a super tight budget. Every dollar matters. I'm already optimal, but I'm constantly paranoid that I'm missing out on a cheaper API tier or a free alternative."*
2. *"If a tool tells me I'm spending perfectly, I actually trust it MORE. Most calculators try to invent savings just to make themselves look good, which makes them feel like scammy marketing gimmicks."*
3. *"I want to share my optimized audit on Twitter to show my followers how lean I run my company. A nice '100% Optimized' badge or public share URL with nice OG tags would be a huge brag for the indie hacker crowd."*

### The Most Surprising Thing Said:
S.T. actively *wants* to brag about spending **less** money on AI than his peers. Running an ultra-lean, highly optimized stack is a badge of honor in the bootstrapped community.

### What It Changed About Our Design:
- **Honest "Optimal" Mode:** We added a beautifully styled, positive state for users with less than $100/mo savings or already-optimal configurations. Instead of forcing savings, it says *"Your AI spend is incredibly lean. You are outperforming 94% of startups in your tier!"*
- **Lead Capture for Optimized Users:** For optimal users, we swapped the "Book a Credex Call" CTA with a *"Notify me when new vendor discounts apply to my stack"* newsletter signup.
- **Viral "Bragging" Share URLs:** We optimized the public share metadata to output a clean, shareable preview with the title: *"SpendSentry Audit: This company's AI stack is 100% optimized! ($0 wasted spend)"* to trigger the bootstrapped viral loop.
