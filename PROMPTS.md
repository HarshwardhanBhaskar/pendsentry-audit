# Prompt Engineering & LLM Design for SpendSentry

This document details the exact system and user prompts used to drive the AI-generated personalized summary feature in SpendSentry, the reasoning behind our design, and the failure states we discovered and mitigated.

---

## 1. The Active Production Prompt

Our Next.js serverless route `/api/summary` calls the Anthropic API (targeting `claude-3-5-sonnet`) with a highly structured prompt. It is fed the raw, audited data and outputs a professional, concise summary.

### A. System Prompt
```
You are an expert Chief Financial Officer (CFO) and SaaS cost optimization consultant. 
Your job is to analyze a startup's AI tool spend audit data and write a sharp, punchy, and highly professional personalized summary paragraph of exactly 80 to 110 words.

Guidelines:
1. Do not use generic filler words like "Congratulations," "It looks like," or "I noticed." Start directly with the analysis.
2. Focus on the single highest-leverage optimization action. Be extremely specific with numbers.
3. Keep the tone professional, objective, and financially literate. No developer hype.
4. Mention the value of consolidating redundant licenses (like duplicate Cursor and Copilot seats).
5. If savings are substantial (>$300/mo), highlight that routing enterprise spend through a credits broker like Credex represents their absolute highest cost-saving lever.
6. If their spend is already optimal (savings <$100/mo), be honest. Validate their efficiency and recommend they set up alerts for future leakage.
7. Return only the raw text paragraph. Do not wrap in markdown quotes or add greeting/signature blocks.
```

### B. User Prompt Template (JSON Injected)
```
Analyze the following audited AI subscription data and write the summary.

[INPUT DATA]
- Team Size: {teamSize}
- Primary Use Case: {primaryUseCase}
- Current Monthly Spend: ${currentSpend}/mo
- Total Monthly Savings Identified: ${monthlySavings}/mo
- Total Annual Savings Identified: ${annualSavings}/mo
- Savings Tier: {savingsTier} (optimal / low_savings / high_savings)

[PER-TOOL AUDIT FINDINGS]
{toolFindingsText}

Generate the personalized 100-word CFO summary:
```

---

## 2. Rationale Behind the Prompt Design

- **Structured Roleplay (Expert CFO):** Forcing the model into a "CFO" persona ensures it communicates using financial metrics (ROI, duplication, consolidation, optimization) rather than generic software developer platitudes ("Cursor is a cooler editor!").
- **Exact Length Constraint (80–110 words):** In B2B SaaS dashboards, whitespace and visual density are premium. A long, rambling summary breaks our glassmorphic layout. Placing strict word counts prevents the LLM from pushing UI elements off the fold.
- **Direct Entry/Exit:** Instructing the model to skip introductory pleasantries (*"Here is your summary..."*) ensures the text immediately hooks the reader's eye when they land on the results page.
- **Structured Data Context:** Rather than feeding Claude raw, un-audited user selections and making the AI do the math, we run our deterministic math engine FIRST on the server and pass the calculated outputs to the LLM. This prevents AI hallucination of financial math, guaranteeing the AI summary matches the hard numbers displayed on the cards.

---

## 3. Failed Prompt Versions and Learnings

During local iteration, we tested several other prompt styles that failed to meet our bar.

### Failure Case 1: The "Speculative Math" Prompt
- **What We Tried:** We originally passed only the user's raw inputs (e.g. *"We have 5 devs using Cursor and ChatGPT"*) and asked Claude to calculate the pricing and identify savings entirely via its own internal knowledge base.
- **Why It Failed:** Claude routinely hallucinated outdated pricing tiers (e.g., quoting Copilot at $20/mo instead of $19/mo, or miscalculating Claude Team's 5-seat minimum). In finance, even a $1 error completely destroys credibility.
- **The Fix:** We stripped all mathematical calculations from the AI. The TypeScript backend now does the precise, defensible calculations first, and we only inject verified results into the prompt for the AI to summarize.

### Failure Case 2: The "Over-Friendly Advisor" Prompt
- **What We Tried:** A casual prompt asking the model to write a *"friendly, helpful developer-focused guide on how to optimize their stack."*
- **Why It Failed:** The output was bloated with emojis, exclamation points, and conversational filler: *"Hey there! 🚀 Wow, looks like your team is rocking Cursor! But did you know you can save some major bucks? Let's dive in! 💡"* This reads like cheap marketing copy and would immediately be dismissed by a Serie A VP of Engineering or a CFO.
- **The Fix:** We pivoted the persona to a strict "CFO Consultant" and added explicit negative constraints forbidding filler words.
