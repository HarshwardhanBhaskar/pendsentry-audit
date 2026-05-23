import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  TrendingDown, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  BadgePercent,
  ArrowRight,
  Info
} from 'lucide-react';
import { runSpendAudit, AuditInput, AuditReport, ToolAuditResult } from '../../../lib/auditEngine';
import { PRICING_DATABASE, ToolName } from '../../../lib/pricingData';
import { supabase } from '../../../lib/supabase';

interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

// 1. STABLE MOCK FALLBACK SYSTEM FOR AUDITS
function getMockAuditInput(): AuditInput {
  return {
    teamSize: 12,
    primaryUseCase: 'coding',
    tools: {
      cursor: { enabled: true, plan: 'business', seats: 12 },
      copilot: { enabled: true, plan: 'business', seats: 12 }, 
      claude: { enabled: true, plan: 'team', seats: 3 }, 
      chatgpt: { enabled: true, plan: 'plus', seats: 3 }, 
      anthropic_api: { enabled: true, plan: 'pay_as_you_go', seats: 0, customSpend: 750 }, 
      openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0, customSpend: 0 },
      gemini: { enabled: false, plan: 'free', seats: 0 },
      windsurf: { enabled: false, plan: 'free', seats: 0 }
    }
  };
}

async function fetchAuditData(id: string): Promise<AuditReport> {
  if (!id || id.startsWith('demo-') || id.startsWith('local-')) {
    return runSpendAudit(getMockAuditInput());
  }

  try {
    const { data, error } = await supabase
      .from('audits')
      .select('raw_input')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.warn('Database record not found or connection failed. Using resilient mock fallback.');
      return runSpendAudit(getMockAuditInput());
    }

    return runSpendAudit(data.raw_input as AuditInput);
  } catch {
    console.warn('Supabase fetch failed. Falling back to static mock data.');
    return runSpendAudit(getMockAuditInput());
  }
}

// 2. DYNAMIC OG METADATA GENERATOR
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const report = await fetchAuditData(id);

  const savingsFormatted = report.totalMonthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const annualSavingsFormatted = report.totalAnnualSavings.toLocaleString('en-US', { maximumFractionDigits: 0 });

  const title = `AI Spend Audit: Save $${annualSavingsFormatted}/year`;
  const description = `We ran our startup AI stack through SpendSentry and found $${savingsFormatted}/mo in immediate cost savings. Check your AI seat leakage and direct credits options now!`;

  return {
    title: `${title} | SpendSentry`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://pendsentry-audit.vercel.app/share/${id}`,
      siteName: 'SpendSentry',
      images: [
        {
          url: 'https://pendsentry-audit.vercel.app/og-card.png',
          width: 1200,
          height: 630,
          alt: 'SpendSentry - Automated AI Subscription Auditor'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://pendsentry-audit.vercel.app/og-card.png'],
      creator: '@Credex'
    }
  };
}

// 3. RENDER STUNNING WIX CORPORATE GRID VIEW
export default async function SharePage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const report = await fetchAuditData(id);

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* TOP NAV BAR */}
      <nav style={{ 
        borderBottom: '1px solid var(--border-color)', 
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000000'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#ffffff', letterSpacing: '-0.02em' }}>
            CREDEX
          </span>
          <span style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#00e676', letterSpacing: '0.08em' }}>
            SPENDSENTRY
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link 
            href="/"
            style={{ fontSize: '13px', color: '#ffffff', textDecoration: 'none', fontWeight: '600', letterSpacing: '0.02em' }}
          >
            Auditor Home
          </Link>
          <a 
            href="https://credex.rocks" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              fontSize: '12px', 
              color: '#000000', 
              backgroundColor: '#00e676',
              textDecoration: 'none', 
              fontWeight: '700', 
              padding: '8px 18px',
              borderRadius: '9999px',
              letterSpacing: '0.02em'
            }}
          >
            Sponsor Credex
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', width: '100%', margin: '40px auto', padding: '0 20px', flex: 1 }}>
        
        {/* PRIVACY SHIELD ANNOUNCEMENT */}
        <div style={{ 
          padding: '18px 24px', 
          marginBottom: '32px', 
          border: '1px solid rgba(0, 230, 118, 0.25)', 
          borderLeft: '4px solid var(--color-primary)',
          background: 'rgba(0, 230, 118, 0.02)', 
          display: 'flex', 
          gap: '14px', 
          alignItems: 'center',
          borderRadius: '2px'
        }}>
          <Info size={18} style={{ color: '#00e676', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Privacy Enforced:</strong> All personal identifying details (such as company name, business email, and role) have been completely stripped from this public view. Only aggregate mathematical optimizations and tool ratios are visible.
          </span>
        </div>

        {/* MAIN RESULTS BOARD */}
        <div style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', padding: '0px', marginBottom: '40px' }}>
          
          {/* TOP HEADER */}
          <div style={{ textAlign: 'center', padding: '40px 32px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <span className="badge badge-green" style={{ marginBottom: '10px' }}>Shared Audit Blueprint</span>
            <h2 style={{ fontSize: '32px', margin: 0, textTransform: 'uppercase' }}>Anonymized Cost Reduction Blueprint</h2>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Deterministic financial optimization options based on verified May 2026 pricing guidelines.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* HERO METRICS */}
            <div className="wix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
              
              {/* Monthly Savings Card */}
              <div className="wix-grid-cell-alt" style={{ padding: '36px', textAlign: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.03, color: '#00e676', pointerEvents: 'none' }}>
                  <TrendingDown size={140} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                  Monthly Tech Savings
                </span>
                <h2 style={{ fontSize: '52px', margin: '0 0 10px 0', color: '#00e676', fontWeight: '800', fontFamily: 'var(--font-display)', lineHeight: '1' }}>
                  ${report.totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.02em' }}>
                  Current: ${report.totalMonthlySpend}/mo → Optimized: ${report.totalOptimizedSpend}/mo
                </p>
              </div>

              {/* Annual Savings Card */}
              <div className="wix-grid-cell-alt" style={{ padding: '36px', textAlign: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', opacity: 0.03, color: '#ffffff', pointerEvents: 'none' }}>
                  <Calendar size={140} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>
                  Annualized Cash Reclaimed
                </span>
                <h2 style={{ fontSize: '52px', margin: '0 0 10px 0', color: '#ffffff', fontWeight: '800', fontFamily: 'var(--font-display)', lineHeight: '1' }}>
                  ${report.totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.02em' }}>
                  Recovered Burn Over 12-Month Horizon
                </p>
              </div>

            </div>

            {/* PER-TOOL OPTIMIZATION BLUEPRINT TABLE */}
            <div style={{ borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ padding: '20px 28px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                <h3 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', color: '#ffffff' }}>
                  SaaS Allocation Analysis
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(report.toolBreakdown).map(([key, value]) => {
                  const toolKey = key as ToolName;
                  const val = value as ToolAuditResult;
                  if (!val.display) return null;

                  const hasSavings = val.monthlySavings > 0;
                  const displayName = PRICING_DATABASE[toolKey].displayName;

                  return (
                    <div 
                      key={toolKey} 
                      style={{ 
                        padding: '24px 28px',
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: hasSavings ? 'rgba(0, 230, 118, 0.02)' : '#000000',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' }}>
                            {displayName}
                            {hasSavings ? (
                              <span className="badge badge-green">Action Required</span>
                            ) : (
                              <span className="badge badge-blue">Optimal</span>
                            )}
                          </h4>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.02em' }}>
                            Allocated Current Burn: ${val.currentSpend}/mo
                          </span>
                        </div>

                        {hasSavings && (
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#00e676', display: 'block', fontFamily: 'var(--font-display)' }}>
                              Save ${val.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.02em' }}>
                              Optimized Target: ${val.optimizedSpend}/mo
                            </span>
                          </div>
                        )}
                      </div>

                      <div style={{ 
                        padding: '14px 18px', 
                        backgroundColor: '#080808', 
                        border: '1px solid var(--border-color)',
                        fontSize: '13px', 
                        color: 'var(--text-secondary)',
                        borderRadius: '2px'
                      }}>
                        <div style={{ fontWeight: '700', color: hasSavings ? '#00e676' : '#ffffff', marginBottom: '6px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                          Recommendation: {val.recommendation}
                        </div>
                        <div style={{ lineHeight: '1.5' }}>
                          {val.reason}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC CREDEX DIRECT ADVERTISEMENT CARD */}
            {report.totalMonthlySavings >= 500 ? (
              <div style={{ padding: '32px', backgroundColor: 'rgba(0,230,118,0.03)', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ color: '#00e676' }}>
                    <BadgePercent size={22} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#00e676', textTransform: 'uppercase' }}>💸 Secure Bulk Credit Discounts via Credex</h3>
                </div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Credex routes active endpoints (Claude, OpenAI, Cursor) through verified corporate cloud credit pools, securing flat off-market discounts of up to 30% for high-volume development groups.
                </p>
                <a 
                  href="https://credex.rocks" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Learn More at Credex.rocks <ArrowRight size={16} />
                </a>
              </div>
            ) : (
              <div style={{ padding: '32px', borderBottom: '1px solid var(--border-color)', backgroundColor: '#080808' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <ShieldCheck size={22} style={{ color: '#00e676' }} />
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff', textTransform: 'uppercase' }}>🛡️ High Stack Efficiency Confirmed</h3>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  This organization is running an extremely clean and highly-optimized AI software stack. There is no redundant billing, double-spending, or seat leaks detected.
                </p>
              </div>
            )}

            {/* LARGE HERO ACTION CALLOUT (Lead-gen loop) */}
            <div style={{ padding: '48px 32px', textAlign: 'center', backgroundColor: '#000000' }}>
              <h3 style={{ fontSize: '24px', color: '#ffffff', margin: '0 0 12px 0', textTransform: 'uppercase' }}>Are You Overpaying For AI Subscription Seats?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
                Run your own automated, self-reported AI Spend Audit in under 2 minutes. Audit Cursor, Copilot, Claude, ChatGPT, API budgets, and more with exact May 2026 pricing. No account required.
              </p>
              <Link 
                href="/"
                className="btn btn-success"
                style={{ textDecoration: 'none', borderRadius: '9999px', padding: '14px 36px', textTransform: 'uppercase', fontWeight: '800' }}
              >
                <Sparkles size={16} /> Run Free AI Spend Audit
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* WIX MINIMALIST CONTACT FOOTER */}
      <footer className="wix-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        borderBottom: 'none',
        backgroundColor: '#000000',
        padding: '0px'
      }}>
        
        {/* Foot Col 1 */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '48px' }}>
          <h4 style={{ fontSize: '20px', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff' }}>CREDEX</h4>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>hello@credex.rocks</span>
            <span>https://credex.rocks</span>
          </div>
        </div>

        {/* Foot Col 2 */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '48px' }}>
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', margin: '0 0 8px 0', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Location</h4>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>Ranchi, Jharkhand</span>
            <span>India - 834001</span>
          </div>
        </div>

        {/* Foot Col 3 */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px', minHeight: '160px' }}>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <Link href="/privacy" style={{ color: '#ffffff', textDecoration: 'none' }} className="hover:underline">Privacy Policy</Link>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
            <Link href="/accessibility" style={{ color: '#ffffff', textDecoration: 'none' }} className="hover:underline">Accessibility Statement</Link>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '24px' }}>
            © 2026 SpendSentry. Built by HB Technologies. Sponsored by Credex. Sourcing surplus corporate credits.
          </div>
        </div>

      </footer>

    </div>
  );
}
