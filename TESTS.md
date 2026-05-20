# Testing Suite Documentation - SpendSentry

SpendSentry relies on a deterministic mathematical audit engine. To ensure absolute financial accuracy, we maintain a comprehensive unit-testing suite built with **Vitest**. The test suite targets the core audit calculator (`lib/auditEngine.ts`), validating complex plan thresholds, seat allocations, double-paying flags, and lead generation triggers.

---

## 1. How to Run the Tests

To install testing dependencies and execute the suite locally, run the following commands:

```bash
# 1. Navigate to the project directory
cd spend-sentry

# 2. Install dev dependencies if not already done
npm install -D vitest

# 3. Run the test suite once
npm run test

# 4. Run tests in watch/dev mode
npx vitest
```

---

## 2. Test File Registry

### File Path: [tests/auditEngine.test.ts](file:///c:/Users/hwbha/Desktop/output/output/output/output/output/output/.vscode/output/c++%20programs/spend-sentry/tests/auditEngine.test.ts)

This file contains our core suite of **5 comprehensive test scenarios** verifying the mathematical accuracy and defensibility of our financial logic.

---

## 3. Test Coverage Details

### Test Scenario 1: `Should return zero savings for an already-optimized AI stack`
- **Objective:** Verify that the engine behaves honestly. If a user is on low-tier, perfectly scoped plans, we must *never* manufacture fake savings to look good.
- **Mock Input:** A solo developer on Cursor Pro ($20/mo) and ChatGPT Plus ($20/mo) with a primary use case of coding.
- **Expected Output:**
  - Total Savings: `$0.00`
  - Recommendations: Zero actionable downgrades.
  - State: Flagged as `optimal` or `low_savings`.

### Test Scenario 2: `Should successfully detect double-paying overlap (Cursor + GitHub Copilot)`
- **Objective:** Validate that if a developer has active seat licenses for both Cursor and GitHub Copilot, the engine flags this redundancy.
- **Mock Input:** A team of 5 developers on Cursor Business ($40/seat = $200/mo) AND GitHub Copilot Business ($19/seat = $95/mo).
- **Expected Output:**
  - Redundant Tool Flagged: GitHub Copilot
  - Recommended Action: Downgrade/Cancel Copilot since autocomplete and premium chat are natively bundled in Cursor.
  - Monthly Savings: `$95.00`
  - Reason: *"Your team is paying for separate GitHub Copilot seats while active on Cursor. Cursor contains native AI completions, making Copilot redundant."*

### Test Scenario 3: `Should identify seat-minimum mismatches on Claude Team plans`
- **Objective:** Verify the engine catches users paying for inactive seats due to Claude Team's 5-seat billing minimum ($125/mo base).
- **Mock Input:** A startup of 2 developers currently on the Claude Team plan, paying retail for 5 seats ($125/mo).
- **Expected Output:**
  - Recommendation: Downgrade from Claude Team to Claude Pro ($20/user/mo) for 2 users.
  - Calculated Retail Charge: `$125.00/mo`
  - Optimized Charge: `$40.00/mo`
  - Monthly Savings: `$85.00/mo`
  - Reason: *"Claude Team requires a 5-seat minimum ($125/mo). With only 2 active users, downgrading to Claude Pro saves $85/mo while maintaining equivalent models."*

### Test Scenario 4: `Should recommend single-user chat consolidation`
- **Objective:** Detect single users paying for both Claude Pro ($20/mo) and ChatGPT Plus ($20/mo) and recommend consolidation into Cursor Pro ($20/mo).
- **Mock Input:** 1 user subscribed to Claude Pro ($20/mo) AND ChatGPT Plus ($20/mo) AND using Cursor Hobby.
- **Expected Output:**
  - Recommended Action: Cancel individual Claude Pro and ChatGPT Plus accounts, upgrading to Cursor Pro ($20/mo) which natively provides unified access to both Claude 3.5 Sonnet and GPT-4o.
  - Monthly Savings: `$20.00/mo`

### Test Scenario 5: `Should trigger high-savings Credex consulting path for spenders > $500/mo`
- **Objective:** Verify that the engine accurately identifies high-value leads and applies the 25% Credex bulk-credit discount baseline.
- **Mock Input:** A fast-growing team of 10 developers spending $800/mo directly on the OpenAI API and $600/mo on Anthropic API.
- **Expected Output:**
  - Combined API Spend: `$1,400/mo`
  - Credex Discounted API Spend: `$1,050/mo`
  - Monthly Savings: `$350.00/mo` (25% off)
  - Savings Tier: `high_savings`
  - Credex Trigger: `true` (Surfaces prominent lead-generation booking buttons).
