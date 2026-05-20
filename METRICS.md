# SpendSentry growth Telemetry & Metrics

As a free lead-generation asset for Credex, SpendSentry must be measured using B2B growth and performance funnel metrics. We do not track generic consumer metrics like Daily Active Users (DAU), as a spend audit is a tool a startup founder uses once a quarter, not every day. Instead, our telemetry focus is strictly on conversion efficiency and value delivery.

---

## 1. The North Star Metric
Our single North Star Metric is **Consultation Booking Conversion Rate (CBCR)**, defined as:

$$\text{CBCR} = \frac{\text{Credex Consultations Booked}}{\text{Total Completed Spend Audits}} \times 100$$

### Why This Metric?
SpendSentry is a top-of-funnel lead generator. Its ultimate business value is measured by its ability to drive qualified, high-spending startup founders into sales conversations with Credex to buy discounted bulk credits. If users are auditing their spend but never booking a consult, the tool is a cost center rather than a growth engine.

---

## 2. The 3 Input Metrics
To move our North Star Metric, we optimize three key input metrics along the user journey:

1. **Audit Completion Velocity (ACV):** The percentage of visitors who land on the page and successfully complete the spend input form. This tracks form UX friction, loading time, and form-field drop-off.
2. **Lead Capture Capture Rate (LCCR):** The percentage of users showing savings >$100/mo who submit their email on the lead-capture screen. This measures the perceived value of our audit results and the copy-strength of the email gate.
3. **High-Savings Share Rate (HSSR):** The percentage of users with >$300/mo in savings who share their unique public audit URL on X (Twitter), Slack, or LinkedIn. This drives the viral loop, feeding free high-quality traffic back into the top of the funnel.

---

## 3. Instrumentation Strategy
We will implement light, privacy-compliant B2B tracking using **PostHog** or **Plausible Analytics** on day one:
- **Form Drop-off Tracking:** Segment page-leave events by the active form field to see if users bounce when asked for complex API spend numbers or seats.
- **Dynamic Savings Segmentation:** Tag every backend record and event with their calculated savings tier (`optimal`, `low_savings`, `high_savings`) to understand which cohorts book consultations.
- **Copy A/B Testing:** Track the click-through rates on the Credex booking banner with differing copy treatments (e.g., *"Save 25% via Credex"* vs. *"Book CFO Audit"*).

---

## 4. The Pivot Trigger
If after **500 completed audits** we have a **CBCR of less than 0.5% (fewer than 3 bookings)**, it triggers an immediate pivot decision.

### Action Plan on Trigger:
1. **Auditing the Friction:** Check if our threshold for high-savings (> $500/mo) is set too high, excluding mid-sized startups spending $200–$400/mo who still have substantial savings.
2. **Value Shift:** Transition from a purely self-reported audit form to a **one-click calendar booking** offering a *"15-Minute Live CFO AI Audit"* where a human does the work, lowering the cognitive barrier.
3. **API Integration:** If users find manual entry tedious, pivot to importing CSV billing files from AWS/GCP/OpenAI directly to output instant, exact audits.
