import { NextResponse } from 'next/server';
import { runSpendAudit, AuditInput } from '../../../lib/auditEngine';
import { supabase } from '../../../lib/supabase';
import { checkRateLimit } from '../../../lib/rateLimit';

export async function POST(request: Request) {
  try {
    // IP-based rate limiting: 5 audit submissions per 60-second window
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    const rateLimitResult = checkRateLimit(ip, { maxRequests: 5, windowMs: 60_000 });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { 
          status: 429, 
          headers: { 'Retry-After': String(Math.ceil(rateLimitResult.retryAfterMs / 1000)) }
        }
      );
    }

    const body = await request.json();
    const { email, companyName, role, teamSize, primaryUseCase, tools } = body;

    // Honeypot anti-abuse check
    if (body.website_confirm_field) {
      return NextResponse.json({ error: 'Abuse detected.' }, { status: 400 });
    }

    if (!email || !teamSize || !primaryUseCase || !tools) {
      return NextResponse.json({ error: 'Missing required audit inputs.' }, { status: 400 });
    }

    // Run server-side audit math
    const auditPayload: AuditInput = { teamSize, primaryUseCase, tools };
    const auditResult = runSpendAudit(auditPayload);

    // Save lead + audit details to Supabase database (PostgreSQL)
    // In local development, if Supabase URL is mock/empty, it catches error and logs locally
    let savedId = 'local-mock-uuid-' + Math.random().toString(36).substring(2, 15);

    try {
      const { data, error } = await supabase
        .from('audits')
        .insert({
          email,
          company_name: companyName || null,
          role: role || null,
          team_size: Number(teamSize),
          primary_use_case: primaryUseCase,
          total_monthly_spend: auditResult.totalMonthlySpend,
          total_monthly_savings: auditResult.totalMonthlySavings,
          total_annual_savings: auditResult.totalAnnualSavings,
          savings_tier: auditResult.savingsTier,
          raw_input: auditPayload,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase DB Insert Error:', error.message);
      } else if (data) {
        savedId = data.id;
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn('Supabase DB Connection omitted or local fallback active:', errMsg);
    }

    // Return UUID and stripped public audit payload
    return NextResponse.json({
      success: true,
      id: savedId,
      audit: {
        totalMonthlySpend: auditResult.totalMonthlySpend,
        totalOptimizedSpend: auditResult.totalOptimizedSpend,
        totalMonthlySavings: auditResult.totalMonthlySavings,
        totalAnnualSavings: auditResult.totalAnnualSavings,
        savingsTier: auditResult.savingsTier,
        toolBreakdown: auditResult.toolBreakdown,
        credexLeadEligible: auditResult.credexLeadEligible,
      },
    });
  } catch (error) {
    console.error('Audit API Endpoint Error:', error);
    return NextResponse.json({ error: 'Failed to process audit report.' }, { status: 500 });
  }
}
export const runtime = 'nodejs'; // Node.js execution context
export const dynamic = 'force-dynamic';
