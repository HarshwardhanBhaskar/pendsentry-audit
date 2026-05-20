import { describe, it, expect } from 'vitest';
import { runSpendAudit, AuditInput } from '../lib/auditEngine';

describe('SpendSentry Audit Engine Tests', () => {
  // Test Scenario 1: Optimal Stack (No savings)
  it('should return zero savings for an already-optimized AI stack', () => {
    const optimalInput: AuditInput = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: {
        cursor: { enabled: true, plan: 'pro', seats: 1 },
        copilot: { enabled: false, plan: 'free', seats: 0 },
        claude: { enabled: false, plan: 'free', seats: 0 },
        chatgpt: { enabled: true, plan: 'plus', seats: 1 }, // ChatGPT Plus is fine
        anthropic_api: { enabled: false, plan: 'pay_as_you_go', seats: 0, customSpend: 0 },
        openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0, customSpend: 0 },
        gemini: { enabled: false, plan: 'free', seats: 0 },
        windsurf: { enabled: false, plan: 'free', seats: 0 },
      },
    };

    const result = runSpendAudit(optimalInput);

    expect(result.totalMonthlySpend).toBe(40.0); // $20 Cursor Pro + $20 ChatGPT Plus
    expect(result.totalOptimizedSpend).toBe(40.0);
    expect(result.totalMonthlySavings).toBe(0.0);
    expect(result.totalAnnualSavings).toBe(0.0);
    expect(result.savingsTier).toBe('optimal');
    expect(result.credexLeadEligible).toBe(false);
  });

  // Test Scenario 2: Double-Paying Overlap (Cursor + GitHub Copilot)
  it('should successfully detect double-paying overlap (Cursor + GitHub Copilot)', () => {
    const doublePayInput: AuditInput = {
      teamSize: 5,
      primaryUseCase: 'coding',
      tools: {
        cursor: { enabled: true, plan: 'business', seats: 5 }, // $40 * 5 = $200
        copilot: { enabled: true, plan: 'business', seats: 5 }, // $19 * 5 = $95 (redundant!)
        claude: { enabled: false, plan: 'free', seats: 0 },
        chatgpt: { enabled: false, plan: 'free', seats: 0 },
        anthropic_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        gemini: { enabled: false, plan: 'free', seats: 0 },
        windsurf: { enabled: false, plan: 'free', seats: 0 },
      },
    };

    const result = runSpendAudit(doublePayInput);

    expect(result.totalMonthlySpend).toBe(295.0); // $200 Cursor + $95 Copilot
    expect(result.totalOptimizedSpend).toBe(200.0); // Copilot canceled
    expect(result.totalMonthlySavings).toBe(95.0);
    expect(result.totalAnnualSavings).toBe(1140.0);
    expect(result.savingsTier).toBe('low_savings');
    expect(result.toolBreakdown.copilot.optimizedSpend).toBe(0);
    expect(result.toolBreakdown.copilot.monthlySavings).toBe(95.0);
    expect(result.toolBreakdown.copilot.actionType).toBe('cancel');
    expect(result.toolBreakdown.copilot.recommendation).toContain('Cancel GitHub Copilot');
  });

  // Test Scenario 3: Claude Team Minimum Seats Mismatch
  it('should identify seat-minimum mismatches on Claude Team plans', () => {
    const claudeTeamInput: AuditInput = {
      teamSize: 2,
      primaryUseCase: 'mixed',
      tools: {
        cursor: { enabled: false, plan: 'hobby', seats: 0 },
        copilot: { enabled: false, plan: 'free', seats: 0 },
        claude: { enabled: true, plan: 'team', seats: 2 }, // paying for 5 seats minimum ($125/mo)
        chatgpt: { enabled: false, plan: 'free', seats: 0 },
        anthropic_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        gemini: { enabled: false, plan: 'free', seats: 0 },
        windsurf: { enabled: false, plan: 'free', seats: 0 },
      },
    };

    const result = runSpendAudit(claudeTeamInput);

    expect(result.totalMonthlySpend).toBe(125.0); // Enforced 5 seat minimum * $25
    expect(result.totalOptimizedSpend).toBe(40.0); // 2 seats Pro * $20
    expect(result.totalMonthlySavings).toBe(85.0);
    expect(result.totalAnnualSavings).toBe(1020.0);
    expect(result.toolBreakdown.claude.actionType).toBe('downgrade');
    expect(result.toolBreakdown.claude.recommendation).toContain('Downgrade to Claude Pro');
    expect(result.toolBreakdown.claude.reason).toContain('Claude Team enforces a 5-seat billing minimum');
  });

  // Test Scenario 4: Chat Account Consolidation
  it('should recommend single-user chat consolidation into Cursor Pro', () => {
    const consolidateInput: AuditInput = {
      teamSize: 1,
      primaryUseCase: 'mixed',
      tools: {
        cursor: { enabled: true, plan: 'pro', seats: 1 }, // $20
        copilot: { enabled: false, plan: 'free', seats: 0 },
        claude: { enabled: true, plan: 'pro', seats: 1 }, // $20 (redundant chat)
        chatgpt: { enabled: true, plan: 'plus', seats: 1 }, // $20 (redundant chat)
        anthropic_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0 },
        gemini: { enabled: false, plan: 'free', seats: 0 },
        windsurf: { enabled: false, plan: 'free', seats: 0 },
      },
    };

    const result = runSpendAudit(consolidateInput);

    expect(result.totalMonthlySpend).toBe(60.0); // $20 Cursor + $20 Claude Pro + $20 ChatGPT Plus
    // It cancels Claude Pro ($20) because Cursor Pro natively bundles both Sonnet & GPT-4o
    expect(result.toolBreakdown.claude.actionType).toBe('consolidate');
    expect(result.toolBreakdown.claude.monthlySavings).toBe(20.0);
    expect(result.totalMonthlySavings).toBe(20.0);
  });

  // Test Scenario 5: High Spend API Credex Lead Trigger
  it('should trigger high-savings Credex consulting path for spenders > $500/mo', () => {
    const highSpendInput: AuditInput = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: {
        cursor: { enabled: false, plan: 'hobby', seats: 0 },
        copilot: { enabled: false, plan: 'free', seats: 0 },
        claude: { enabled: false, plan: 'free', seats: 0 },
        chatgpt: { enabled: false, plan: 'free', seats: 0 },
        anthropic_api: { enabled: true, plan: 'pay_as_you_go', seats: 0, customSpend: 600 }, // $600/mo spend
        openai_api: { enabled: true, plan: 'pay_as_you_go', seats: 0, customSpend: 800 }, // $800/mo spend
        gemini: { enabled: false, plan: 'free', seats: 0 },
        windsurf: { enabled: false, plan: 'free', seats: 0 },
      },
    };

    const result = runSpendAudit(highSpendInput);

    expect(result.totalMonthlySpend).toBe(1400.0);
    expect(result.totalMonthlySavings).toBe(350.0); // 25% savings of $1,400 = $350
    expect(result.totalOptimizedSpend).toBe(1050.0);
    expect(result.totalAnnualSavings).toBe(4200.0);
    expect(result.savingsTier).toBe('high_savings');
    expect(result.credexLeadEligible).toBe(true); // Eligible for Credex!
    expect(result.toolBreakdown.anthropic_api.actionType).toBe('credits');
    expect(result.toolBreakdown.openai_api.actionType).toBe('credits');
    expect(result.toolBreakdown.anthropic_api.recommendation).toContain('Buy credits through Credex');
  });
});
