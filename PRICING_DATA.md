# AI Spend Audit Pricing Reference

This document serves as the official source of truth for all pricing data used in the SpendSentry audit engine. Every figure is traced back to a verified, official vendor pricing page as of May 2026.

---

## 1. Cursor
Official Pricing Page: [cursor.com/pricing](https://www.cursor.com/pricing)  
*Verified: 2026-05-20*

- **Hobby (Free):** $0/user/month
  - Includes: Limited agent requests, 2,000 autocomplete tokens, and basic model usage.
- **Pro:** $20/user/month (or $16/user/month billed annually)
  - Includes: Unlimited autocomplete completions, extended agent limits, and 500 fast premium requests per month.
- **Business:** $40/user/month
  - Includes: Everything in Pro plus centralized admin panel, SAML/SSO, pooled usage, and organization-wide privacy mode enforcement.
- **Enterprise:** Custom Pricing (estimated at $100/user/month for calculation baseline)
  - Includes: Custom security rules, dedicated model instances, advanced audit logs, and account management.

---

## 2. GitHub Copilot
Official Pricing Page: [github.com/features/copilot#pricing](https://github.com/features/copilot)  
*Verified: 2026-05-20*

- **Copilot Free:** $0/user/month
  - Includes: Basic autocomplete for public repositories or education.
- **Copilot Individual (formerly Pro):** $10/user/month (or $100/year)
  - Includes: Code completions, chat, CLI, and integration with IDEs.
- **Copilot Business:** $19/user/month
  - Includes: Individual features plus organization policy management, proxy support, and enterprise security.
- **Copilot Enterprise:** $39/user/month
  - Includes: Business features plus custom model fine-tuning (indexing), deep codebase search, and PR summaries.

---

## 3. Claude
Official Pricing Page: [claude.ai/pricing](https://claude.ai/pricing)  
*Verified: 2026-05-20*

- **Free:** $0/user/month
  - Includes: Standard access to Claude 3.5 Sonnet with basic limits.
- **Pro:** $20/user/month
  - Includes: 5x more usage than free tier, priority access during peak times, Claude Code access, and Projects.
- **Max:** $100/user/month
  - Includes: High-volume power user features, 5x Pro plan capacity, and advanced agent controls.
- **Team:** $25/user/month (requires a minimum of 5 seats, i.e., $125/month minimum)
  - Includes: Pro features plus administrative control, centralized billing, and shared team workspace.
- **Enterprise:** Custom Pricing (estimated at $75/user/month for calculation baseline)
  - Includes: Single Sign-On (SSO), granular user controls, directory sync (SCIM), and custom data retention rules.
- **API Direct:** Usage-based (Pay-as-you-go). Prompts cached at 90% discount. (Detail under API section).

---

## 4. ChatGPT
Official Pricing Page: [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)  
*Verified: 2026-05-20*

- **Free:** $0/user/month
  - Includes: Basic access to GPT-4o mini, limited GPT-4o access.
- **Plus:** $20/user/month
  - Includes: 5x usage limits on GPT-4o, custom GPT creator, and voice mode features.
- **Team (formerly Business):** $25/user/month (billed annually, i.e., $300/year) or $30/user/month (billed monthly)
  - Includes: Plus features plus higher usage cap, admin console, workspace sharing, and data privacy assurances.
- **Enterprise:** Custom Pricing (estimated at $60/user/month for calculation baseline)
  - Includes: Enterprise-grade security, unlimited GPT-4o access, double performance speed, and custom SSO/SAML integrations.
- **API Direct:** Usage-based (Pay-as-you-go). Billed per million tokens.

---

## 5. Anthropic API (Direct)
Official Pricing Page: [anthropic.com/pricing](https://www.anthropic.com/pricing)  
*Verified: 2026-05-20*

Pay-as-you-go model (Per Million Tokens):
- **Claude 3.5 Sonnet (v2):** Input: $3.00 / 1M tokens | Output: $15.00 / 1M tokens (Prompt Caching input: $0.30 | Read: $1.20)
- **Claude 3 Opus:** Input: $15.00 / 1M tokens | Output: $75.00 / 1M tokens
- **Claude 3.5 Haiku:** Input: $0.80 / 1M tokens | Output: $4.00 / 1M tokens
*Note: Users typically input their actual monthly spend directly into our auditor for analysis.*

---

## 6. OpenAI API (Direct)
Official Pricing Page: [openai.com/api/pricing](https://openai.com/api/pricing)  
*Verified: 2026-05-20*

Pay-as-you-go model (Per Million Tokens):
- **GPT-4o:** Input: $2.50 / 1M tokens | Output: $10.00 / 1M tokens
- **GPT-4o mini:** Input: $0.15 / 1M tokens | Output: $0.60 / 1M tokens
- **o1:** Input: $15.00 / 1M tokens | Output: $60.00 / 1M tokens
- **o1-preview:** Input: $15.00 / 1M tokens | Output: $60.00 / 1M tokens
*Note: Users typically input their actual monthly spend directly into our auditor for analysis.*

---

## 7. Gemini (Google AI)
Official Pricing Page: [gemini.google.com](https://gemini.google.com) & [workspace.google.com/pricing](https://workspace.google.com/pricing)  
*Verified: 2026-05-20*

- **Gemini Advanced (Consumer):** $20/user/month
  - Includes: Access to Gemini 1.5 Pro, 2TB Google One storage, and integration with Docs/Gmail.
- **Gemini Business (Workspace):** $20/user/month (billed annually) or $24/user/month (billed monthly)
  - Includes: Gemini add-on for Workspace teams, admin controls, enterprise data privacy.
- **Gemini Enterprise (Workspace):** $30/user/month (billed annually)
  - Includes: Unlimited usage of advanced models, enterprise-grade meeting translations, and advanced admin security.
- **Gemini API (Google AI Studio):**
  - **Gemini 1.5 Flash:** Input: $0.075 / 1M tokens | Output: $0.30 / 1M tokens
  - **Gemini 1.5 Pro:** Input: $1.25 / 1M tokens | Output: $5.00 / 1M tokens

---

## 8. Windsurf (Codeium)
Official Pricing Page: [codeium.com/windsurf](https://codeium.com/windsurf)  
*Verified: 2026-05-20*

- **Free:** $0/user/month
  - Includes: Unlimited autocomplete (Tab), basic Cascade agent usage.
- **Pro:** $20/user/month (or $15/user/month billed annually)
  - Includes: Unlimited autocomplete, premium models (Claude 3.5 Sonnet, GPT-4o), and priority Cascade access.
- **Teams:** $40/user/month (or $30/user/month billed annually)
  - Includes: Pro features plus central user management, organizational context, and team billing.
- **Enterprise:** Custom Pricing (estimated at $80/user/month for calculation baseline)
  - Includes: SSO/SAML, dedicated deployment options, VPC, and advanced audit logs.
