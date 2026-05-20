import { NextResponse } from 'next/server';
import { ToolAuditResult } from '../../../lib/auditEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamSize, primaryUseCase, totalMonthlySpend, totalMonthlySavings, totalAnnualSavings, savingsTier, toolBreakdown } = body;

    // Filter active tool breakdown descriptions to feed as context for Claude
    const activeFindings: string[] = [];
    if (toolBreakdown) {
      for (const [key, value] of Object.entries(toolBreakdown)) {
        const val = value as ToolAuditResult;
        if (val.display && val.monthlySavings > 0) {
          activeFindings.push(`- ${key}: Current Spend $${val.currentSpend}/mo, Optimized Spend $${val.optimizedSpend}/mo. Savings: $${val.monthlySavings}/mo. Recommendation: ${val.recommendation}. Reason: ${val.reason}`);
        }
      }
    }
    const toolFindingsText = activeFindings.length > 0 
      ? activeFindings.join('\n') 
      : 'All current subscription allocations are optimal. No plan or seat redundancies detected.';

    // Construct local fallback summary beforehand in case Anthropic is unavailable
    let personalSummary = '';
    if (savingsTier === 'optimal' || totalMonthlySavings === 0) {
      personalSummary = `Your AI subscription stack is exceptionally lean! Spending $${totalMonthlySpend}/mo across a team of ${teamSize} for ${primaryUseCase} use cases aligns perfectly with current industry efficiency benchmarks. You have zero active license leakage or duplicate tools. I recommend setting up quarterly seat reviews to prevent zombie licenses from accumulating as you scale, and staying subscribed to Credex optimization alerts to capture future vendor pricing updates immediately.`;
    } else if (savingsTier === 'high_savings' || totalMonthlySavings >= 300) {
      personalSummary = `We identified substantial cost-reduction opportunities totaling $${totalMonthlySavings}/mo ($${totalAnnualSavings}/yr) across your ${teamSize}-person team. Your primary leverage point centers on eliminating tool overlap and downgrading under-utilized seat quotas. Furthermore, since your monthly AI spend of $${totalMonthlySpend}/mo is highly significant, routing your core API and license procurement through Credex bulk credits marketplace represents your absolute highest-leverage savings driver, locking in a flat 25% discount instantly.`;
    } else {
      personalSummary = `Your AI stack has immediate optimization levers that can capture $${totalMonthlySavings}/mo in savings. By addressing seat-minimum billing traps (such as Claude Team's 5-seat threshold) and consolidating redundant chat subscriptions into unified editors like Cursor, your team size of ${teamSize} can operate at full capacity with lower overhead. Reclaiming this $${totalMonthlySavings}/mo will decrease your monthly SaaS burn by ${Math.round((totalMonthlySavings / totalMonthlySpend) * 100)}% with zero loss in developer capabilities.`;
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (anthropicKey && anthropicKey !== 'your_anthropic_api_key') {
      try {
        // Construct the Messages API request body for Claude 3.5 Sonnet
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 250,
            temperature: 0.1,
            system: `You are an expert Chief Financial Officer (CFO) and SaaS cost optimization consultant. 
Your job is to analyze a startup's AI tool spend audit data and write a sharp, punchy, and highly professional personalized summary paragraph of exactly 80 to 110 words.

Guidelines:
1. Do not use generic filler words like "Congratulations," "It looks like," or "I noticed." Start directly with the analysis.
2. Focus on the single highest-leverage optimization action. Be extremely specific with numbers.
3. Keep the tone professional, objective, and financially literate. No developer hype.
4. Mention the value of consolidating redundant licenses (like duplicate Cursor and Copilot seats).
5. If savings are substantial (>$300/mo), highlight that routing enterprise spend through a credits broker like Credex represents their absolute highest cost-saving lever.
6. If their spend is already optimal (savings <$100/mo), be honest. Validate their efficiency and recommend they set up alerts for future leakage.
7. Return only the raw text paragraph. Do not wrap in markdown quotes or add greeting/signature blocks.`,
            messages: [
              {
                role: 'user',
                content: `Analyze the following audited AI subscription data and write the summary.

[INPUT DATA]
- Team Size: ${teamSize}
- Primary Use Case: ${primaryUseCase}
- Current Monthly Spend: $${totalMonthlySpend}/mo
- Total Monthly Savings Identified: $${totalMonthlySavings}/mo
- Total Annual Savings Identified: $${totalAnnualSavings}/mo
- Savings Tier: ${savingsTier}

[PER-TOOL AUDIT FINDINGS]
${toolFindingsText}

Generate the personalized 100-word CFO summary:`,
              },
            ],
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          if (resData.content && resData.content[0] && resData.content[0].text) {
            personalSummary = resData.content[0].text.trim();
          }
        } else {
          console.warn('Anthropic API responded with error status:', response.status);
        }
      } catch (apiError) {
        console.error('Failed to communicate with Anthropic API, executing local fallback:', apiError);
      }
    }

    return NextResponse.json({ summary: personalSummary });
  } catch (error) {
    console.error('Summary API Endpoint Error:', error);
    return NextResponse.json({ error: 'Failed to generate audit summary.' }, { status: 500 });
  }
}
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
