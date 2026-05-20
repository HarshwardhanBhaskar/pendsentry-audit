import { PRICING_DATABASE, ToolName, PrimaryUseCase, PlanDetails } from './pricingData';

export interface UserToolInput {
  enabled: boolean;
  plan: string;
  seats: number;
  customSpend?: number; // for API direct spend
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
  tools: Record<ToolName, UserToolInput>;
}

export interface ToolAuditResult {
  currentSpend: number;
  optimizedSpend: number;
  monthlySavings: number;
  recommendation: string;
  reason: string;
  display: boolean;
  actionType: 'none' | 'downgrade' | 'cancel' | 'consolidate' | 'credits' | 'optimize_api';
}

export interface AuditReport {
  totalMonthlySpend: number;
  totalOptimizedSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  savingsTier: 'optimal' | 'low_savings' | 'high_savings';
  toolBreakdown: Record<ToolName, ToolAuditResult>;
  credexLeadEligible: boolean;
}

export function runSpendAudit(input: AuditInput): AuditReport {
  const breakdown: Record<ToolName, ToolAuditResult> = {} as any;
  let totalMonthlySpend = 0;
  let totalOptimizedSpend = 0;

  // Initialize breakdown structure
  const toolsList: ToolName[] = [
    'cursor',
    'copilot',
    'claude',
    'chatgpt',
    'anthropic_api',
    'openai_api',
    'gemini',
    'windsurf',
  ];

  for (const t of toolsList) {
    breakdown[t] = {
      currentSpend: 0,
      optimizedSpend: 0,
      monthlySavings: 0,
      recommendation: 'Stack is optimal.',
      reason: 'No optimizations available for this tool.',
      display: false,
      actionType: 'none',
    };
  }

  const { teamSize, primaryUseCase, tools } = input;

  // 1. Calculate base costs for each tool
  for (const toolKey of toolsList) {
    const userInput = tools[toolKey];
    if (!userInput || !userInput.enabled) continue;

    breakdown[toolKey].display = true;
    const dbEntry = PRICING_DATABASE[toolKey];
    const planKey = userInput.plan;
    const plan = dbEntry.plans[planKey];

    if (!plan) continue;

    let currentSpend = 0;

    if (toolKey === 'anthropic_api' || toolKey === 'openai_api') {
      // API Direct spend is custom user-inputted monthly dollar amount
      currentSpend = userInput.customSpend || 0;
    } else {
      // Standard seat-based charge
      const pricePerSeat = plan.pricePerSeat;
      let effectiveSeats = userInput.seats;

      // Handle minimum seat limits enforced by vendors at retail
      if (plan.minSeats && effectiveSeats < plan.minSeats) {
        currentSpend = plan.pricePerSeat * plan.minSeats;
      } else {
        currentSpend = pricePerSeat * effectiveSeats;
      }
    }

    breakdown[toolKey].currentSpend = currentSpend;
    breakdown[toolKey].optimizedSpend = currentSpend; // Default is same
    totalMonthlySpend += currentSpend;
  }

  // 2. APPLY DETERMINISTIC OPTIMIZATION RULES

  // RULE A: Claude API and OpenAI API Spend -> Credex Discounts (Bulk purchase)
  const apiTools: ToolName[] = ['anthropic_api', 'openai_api'];
  for (const apiTool of apiTools) {
    const ui = tools[apiTool];
    const aud = breakdown[apiTool];
    if (ui && ui.enabled && aud.currentSpend > 0) {
      if (aud.currentSpend >= 500) {
        // High spend: Buy through Credex at a 25% discount
        const savings = aud.currentSpend * 0.25;
        aud.optimizedSpend = aud.currentSpend - savings;
        aud.monthlySavings = savings;
        aud.actionType = 'credits';
        aud.recommendation = 'Buy credits through Credex';
        aud.reason = `Your monthly API spend is high enough ($${aud.currentSpend}/mo) to qualify for Credex bulk credits, giving you a flat 25% discount on identical official endpoints.`;
      } else if (aud.currentSpend >= 150) {
        // Medium spend: optimization tips (e.g. Prompt caching for Claude, Batch API for OpenAI)
        aud.optimizedSpend = aud.currentSpend; // Math remains the same, but we show tips
        aud.actionType = 'optimize_api';
        aud.recommendation = 'Optimize API integrations';
        if (apiTool === 'anthropic_api') {
          aud.reason = 'Enable Prompt Caching for frequently repeated system prompts to cut input token billing by up to 90% via official Anthropic routers.';
        } else {
          aud.reason = 'Route asynchronous non-interactive jobs (e.g. background evaluations) to the OpenAI Batch API to secure a flat 50% discount.';
        }
      }
    }
  }

  // RULE B: Double-Paying on Coding Assistants (Cursor + GitHub Copilot)
  const cursorUI = tools.cursor;
  const copilotUI = tools.copilot;
  if (cursorUI && cursorUI.enabled && copilotUI && copilotUI.enabled) {
    const cursorActive = ['pro', 'business', 'enterprise'].includes(cursorUI.plan);
    const copilotActive = ['individual', 'business', 'enterprise'].includes(copilotUI.plan);

    if (cursorActive && copilotActive) {
      // Overlap! Copilot is completely redundant since Cursor has advanced autocomplete built-in
      const copilotAud = breakdown.copilot;
      copilotAud.optimizedSpend = 0;
      copilotAud.monthlySavings = copilotAud.currentSpend;
      copilotAud.actionType = 'cancel';
      copilotAud.recommendation = 'Cancel GitHub Copilot';
      copilotAud.reason = 'Your team is active on Cursor which includes top-tier built-in code completions, making separate Copilot licenses completely redundant.';
    }
  }

  // RULE C: Claude Team Seat-Minimum Billing Trap
  const claudeUI = tools.claude;
  if (claudeUI && claudeUI.enabled && claudeUI.plan === 'team') {
    const activeSeats = claudeUI.seats;
    if (activeSeats < 5) {
      // Billed for 5 seats ($125) but only using fewer. Suggest Claude Pro
      const aud = breakdown.claude;
      const proPlanPrice = PRICING_DATABASE.claude.plans.pro.pricePerSeat;
      const optimizedTotal = proPlanPrice * activeSeats;
      const savings = aud.currentSpend - optimizedTotal;

      if (savings > 0) {
        aud.optimizedSpend = optimizedTotal;
        aud.monthlySavings = savings;
        aud.actionType = 'downgrade';
        aud.recommendation = 'Downgrade to Claude Pro';
        aud.reason = `Claude Team enforces a 5-seat billing minimum ($125/mo). Since you only have ${activeSeats} active users, Claude Pro at $20/user/mo saves you $${savings}/mo.`;
      }
    }
  }

  // RULE D: ChatGPT Team Seat-Minimum Billing Trap
  const chatgptUI = tools.chatgpt;
  if (chatgptUI && chatgptUI.enabled && chatgptUI.plan === 'team') {
    const activeSeats = chatgptUI.seats;
    if (activeSeats === 1) {
      // Billed for 2 seats ($50) but only using 1. Suggest ChatGPT Plus ($20)
      const aud = breakdown.chatgpt;
      const plusPrice = PRICING_DATABASE.chatgpt.plans.plus.pricePerSeat;
      const savings = aud.currentSpend - plusPrice;

      if (savings > 0) {
        aud.optimizedSpend = plusPrice;
        aud.monthlySavings = savings;
        aud.actionType = 'downgrade';
        aud.recommendation = 'Downgrade to ChatGPT Plus';
        aud.reason = `ChatGPT Team enforces a 2-seat billing minimum ($50/mo). Downgrading to ChatGPT Plus at $20/mo for a single developer saves you $${savings}/mo.`;
      }
    }
  }

  // RULE E: Single Developer on Team/Business Plans (Cursor Business / Windsurf Teams)
  if (cursorUI && cursorUI.enabled && cursorUI.plan === 'business' && cursorUI.seats === 1) {
    const aud = breakdown.cursor;
    const proPrice = PRICING_DATABASE.cursor.plans.pro.pricePerSeat;
    const savings = aud.currentSpend - proPrice;

    if (savings > 0) {
      aud.optimizedSpend = proPrice;
      aud.monthlySavings = savings;
      aud.actionType = 'downgrade';
      aud.recommendation = 'Downgrade to Cursor Pro';
      aud.reason = 'You are paying for Cursor Business for a single developer. Downgrading to Cursor Pro provides identical coding capabilities for $20/mo less.';
    }
  }

  const windsurfUI = tools.windsurf;
  if (windsurfUI && windsurfUI.enabled && windsurfUI.plan === 'teams' && windsurfUI.seats === 1) {
    const aud = breakdown.windsurf;
    const proPrice = PRICING_DATABASE.windsurf.plans.pro.pricePerSeat;
    const savings = aud.currentSpend - proPrice;

    if (savings > 0) {
      aud.optimizedSpend = proPrice;
      aud.monthlySavings = savings;
      aud.actionType = 'downgrade';
      aud.recommendation = 'Downgrade to Windsurf Pro';
      aud.reason = 'You are paying for Windsurf Teams for a single user. Downgrading to Windsurf Pro offers equivalent AI agent coding for $20/mo less.';
    }
  }

  // RULE F: Double Chat Overlap (ChatGPT Plus + Claude Pro for Coding/Writing use cases)
  if (
    chatgptUI &&
    chatgptUI.enabled &&
    chatgptUI.plan === 'plus' &&
    claudeUI &&
    claudeUI.enabled &&
    claudeUI.plan === 'pro'
  ) {
    // If they have both, and they are coding or writing, they can consolidate models into Cursor Pro / Windsurf Pro!
    // Or just consolidate into one primary chat tool
    const chatgptAud = breakdown.chatgpt;
    const claudeAud = breakdown.claude;

    // We flag this on Claude Pro to avoid duplicate flagging on both tools
    if (claudeAud.monthlySavings === 0) {
      const savings = claudeAud.currentSpend; // saving the full Claude Pro cost
      claudeAud.optimizedSpend = 0;
      claudeAud.monthlySavings = savings;
      claudeAud.actionType = 'consolidate';
      claudeAud.recommendation = 'Consolidate Chat Accounts';
      
      if (cursorUI && cursorUI.enabled && ['pro', 'business'].includes(cursorUI.plan)) {
        claudeAud.reason = 'Your team pays for both ChatGPT Plus and Claude Pro alongside Cursor. Since Cursor Pro natively includes premium Claude 3.5 Sonnet and GPT-4o inside, you can cancel separate chat accounts and save $20/user/mo.';
      } else {
        claudeAud.reason = 'Your team is paying $40/user/mo for separate ChatGPT Plus and Claude Pro subscriptions. Consolidating to a single chat subscription or upgrading to Cursor Pro saves you $20/user/mo.';
      }
    }
  }

  // 3. Compile aggregate totals
  for (const t of toolsList) {
    const aud = breakdown[t];
    totalOptimizedSpend += aud.optimizedSpend;
  }

  const totalMonthlySavings = Math.max(0, totalMonthlySpend - totalOptimizedSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Determine savings tier
  let savingsTier: 'optimal' | 'low_savings' | 'high_savings' = 'optimal';
  if (totalMonthlySavings >= 300) {
    savingsTier = 'high_savings';
  } else if (totalMonthlySavings > 0) {
    savingsTier = 'low_savings';
  }

  // Eligible for Credex direct consultation lead if they save > $500/mo or spend > $1000/mo
  const credexLeadEligible = totalMonthlySavings >= 500 || totalMonthlySpend >= 1000;

  return {
    totalMonthlySpend: Number(totalMonthlySpend.toFixed(2)),
    totalOptimizedSpend: Number(totalOptimizedSpend.toFixed(2)),
    totalMonthlySavings: Number(totalMonthlySavings.toFixed(2)),
    totalAnnualSavings: Number(totalAnnualSavings.toFixed(2)),
    savingsTier,
    toolBreakdown: breakdown,
    credexLeadEligible,
  };
}
