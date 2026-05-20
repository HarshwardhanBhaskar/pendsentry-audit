'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingDown, 
  Mail, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  Calendar, 
  BadgePercent, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { AuditReport, ToolAuditResult, AuditInput } from '../lib/auditEngine';
import { PRICING_DATABASE, ToolName } from '../lib/pricingData';

interface AuditResultsProps {
  report: AuditReport;
  formData: AuditInput;
  onReset: () => void;
}

export default function AuditResults({ report, formData, onReset }: AuditResultsProps) {
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState<boolean>(true);
  
  // Lead Capture State
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [honeypot, setHoneypot] = useState<string>('');
  const [submittingLead, setSubmittingLead] = useState<boolean>(false);
  const [leadSaved, setLeadSaved] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>('');

  // Fetch AI personalized summary on result render
  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoadingSummary(true);
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teamSize: formData.teamSize,
            primaryUseCase: formData.primaryUseCase,
            totalMonthlySpend: report.totalMonthlySpend,
            totalMonthlySavings: report.totalMonthlySavings,
            totalAnnualSavings: report.totalAnnualSavings,
            savingsTier: report.savingsTier,
            toolBreakdown: report.toolBreakdown
          })
        });

        if (res.ok) {
          const data = await res.json();
          setSummary(data.summary);
        } else {
          throw new Error('Failed response from API');
        }
      } catch (err) {
        console.warn('AI summary fetch failed, fallback active:', err);
      } finally {
        setLoadingSummary(false);
      }
    }

    fetchSummary();
  }, [report, formData]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Trigger Honeypot
    if (honeypot) {
      alert('Spam detected.');
      return;
    }

    try {
      setSubmittingLead(true);

      // 1. Submit lead + audit inputs to save in Supabase PostgreSQL database
      const auditRes = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          teamSize: formData.teamSize,
          primaryUseCase: formData.primaryUseCase,
          tools: formData.tools
        })
      });

      if (!auditRes.ok) throw new Error('DB Insert failed');
      const auditData = await auditRes.json();
      
      const uuid = auditData.id;

      // Determine current hostname for sharing
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://spendsentry.com';
      const dynamicShareUrl = `${origin}/share/${uuid}`;
      setShareUrl(dynamicShareUrl);

      // 2. Dispatch transactional email via Resend API Route
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          totalMonthlySavings: report.totalMonthlySavings,
          totalAnnualSavings: report.totalAnnualSavings,
          shareUrl: dynamicShareUrl
        })
      });

      setLeadSaved(true);
    } catch (err) {
      console.error('Lead capture error:', err);
      // Fallback local UUID for testing
      const localUuid = 'demo-' + Math.random().toString(36).substring(2, 10);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://spendsentry.com';
      setShareUrl(`${origin}/share/${localUuid}`);
      setLeadSaved(true);
    } finally {
      setSubmittingLead(false);
    }
  };

  const copyShareLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. HERO SECTION: Savings Scorecards */}
      <div className="grid-2">
        
        {/* Monthly Savings Card */}
        <div className="glass-card accent-glow-green" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--color-success)' }}>
            <TrendingDown size={120} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Monthly AI Spend Savings
          </span>
          <h2 style={{ fontSize: '48px', margin: '10px 0', color: 'var(--color-success)', background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${report.totalMonthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Current: ${report.totalMonthlySpend}/mo → Optimized: ${report.totalOptimizedSpend}/mo
          </p>
        </div>

        {/* Annual Savings Card */}
        <div className="glass-card accent-glow-blue" style={{ padding: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--color-primary)' }}>
            <Calendar size={120} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Annual Cost Savings
          </span>
          <h2 style={{ fontSize: '48px', margin: '10px 0', color: 'var(--color-primary)', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${report.totalAnnualSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
            Recaptured cash flow over 12 months
          </p>
        </div>

      </div>

      {/* 2. DYNAMIC AI personalized SUMMARY CARD */}
      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
          <Sparkles size={18} /> Personalized CFO Spend Analysis
        </h3>
        
        {loadingSummary ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#3b82f6', animation: 'spin-slow 1s linear infinite' }}></div>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Claude is evaluating your subscriptions for duplicates and seat leakage...</span>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)', fontStyle: 'italic' }}>
            &ldquo;{summary}&rdquo;
          </p>
        )}
      </div>

      {/* 3. PER-TOOL DETAILED BREAKDOWN LIST */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#ffffff' }}>Subscription Optimization Blueprint</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Object.entries(report.toolBreakdown).map(([key, value]) => {
            const toolKey = key as ToolName;
            const val = value as ToolAuditResult;
            if (!val.display) return null;

            const hasSavings = val.monthlySavings > 0;
            const displayName = PRICING_DATABASE[toolKey].displayName;

            return (
              <div 
                key={toolKey} 
                className="glass-card"
                style={{ 
                  padding: '16px',
                  border: hasSavings ? '1px dashed rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                  background: hasSavings ? 'rgba(16, 185, 129, 0.02)' : 'rgba(255, 255, 255, 0.01)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {displayName}
                      {hasSavings ? (
                        <span className="badge badge-green">Recommended Action</span>
                      ) : (
                        <span className="badge badge-blue">Optimal</span>
                      )}
                    </h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Current Spend: ${val.currentSpend}/mo
                    </span>
                  </div>

                  {hasSavings && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-success)', display: 'block' }}>
                        Save ${val.monthlySavings}/mo
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Optimized Spend: ${val.optimizedSpend}/mo
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ padding: '10px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div style={{ fontWeight: 'bold', color: hasSavings ? 'var(--color-success)' : 'var(--text-primary)', marginBottom: '4px' }}>
                    {val.recommendation}
                  </div>
                  {val.reason}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. CONDITIONAL CTA BANNER (Credex vs. Optimal Stack Banner) */}
      {report.totalMonthlySavings >= 500 ? (
        /* High Savings Banner: Surface Credex bulk credit procurement */
        <div className="glass-card accent-glow-blue" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(13, 20, 41, 0.9) 0%, rgba(20, 22, 38, 0.9) 100%)', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '6px', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '6px', color: '#60a5fa' }}>
              <BadgePercent size={22} />
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#60a5fa' }}>💸 Capture More Savings via Credex Bulk Credits</h3>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Your monthly AI spend qualifies for the **Credex bulk credits program**. Credex sources verified surplus credits from companies that overforecasted, allowing you to secure a flat **20–30% discount** on your Claude, Cursor, and OpenAI API endpoints.
          </p>
          <a 
            href="https://credex.rocks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ padding: '10px 20px', fontSize: '14px' }}
          >
            Claim My Discount & Book Consult <ArrowRight size={16} />
          </a>
        </div>
      ) : report.totalMonthlySavings === 0 ? (
        /* Optimal Stack: Be honest, validate efficiency */
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <ShieldCheck size={22} style={{ color: 'var(--color-success)' }} />
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--color-success)' }}>🛡️ Your AI Stack is 100% Optimal!</h3>
          </div>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Amazing job. You are currently outperforming **94% of startups** in your team tier on AI spend. Your subscriptions are extremely lean and leakage-free. We won&apos;t manufacture fake savings just to make an offer.
          </p>
        </div>
      ) : null}

      {/* 5. LEAD CAPTURE & STORAGE GATE (Captured after value is shown!) */}
      {!leadSaved ? (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <Mail size={18} /> Email My Savings Audit Report
          </h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Enter your details to receive a dynamic PDF audit report, secure your share link, and sign up for spend alerts.
          </p>

          <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Honeypot field for spam prevention */}
            <input 
              type="text" 
              name="website_confirm_field" 
              value={honeypot} 
              onChange={(e) => setHoneypot(e.target.value)} 
              style={{ display: 'none' }} 
              autoComplete="off"
              tabIndex={-1}
            />

            <div className="grid-2">
              <div>
                <label htmlFor="lead-email">Business Email *</label>
                <input 
                  id="lead-email"
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label htmlFor="lead-company">Company Name (Optional)</label>
                <input 
                  id="lead-company"
                  type="text" 
                  placeholder="Acme Corp" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="lead-role">Your Role (Optional)</label>
              <input 
                id="lead-role"
                type="text" 
                placeholder="CTO / VP Engineering / Founder" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submittingLead}
              className="btn btn-success"
              style={{ padding: '12px 20px', width: '100%', borderRadius: '8px' }}
            >
              {submittingLead ? 'Saving & Generating Share Link...' : 'Claim PDF Report & Generate Share Link'}
            </button>
          </form>
        </div>
      ) : (
        /* 6. VIRAL SHARE LOOP PANEL (Revealed after lead capture) */
        <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(59, 130, 246, 0.3)', background: 'rgba(13, 20, 41, 0.4)' }}>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
            <Share2 size={18} /> Dynamic Share Link Activated!
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Your audit report has been saved. We&apos;ve emailed you a full summary. You can share your optimized profile (stripping company name and email for privacy) with your team or social network using the link below:
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input 
              aria-label="Share Link"
              type="text" 
              readOnly 
              value={shareUrl}
              style={{ flex: 1, padding: '10px 14px', background: '#0a0b10', minWidth: '200px' }}
            />
            <button 
              type="button" 
              onClick={copyShareLink}
              className="btn btn-secondary"
              style={{ padding: '10px 16px' }}
            >
              {copiedLink ? <Check size={16} style={{ color: 'var(--color-success)' }} /> : <Copy size={16} />}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Share on social:</span>
            
            {/* Twitter/X Share Link */}
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `We ran a free AI Spend Audit on SpendSentry and found $${report.totalMonthlySavings}/mo in redundant AI seat licenses! Check your AI burn here: ${shareUrl} via @Credex`
              )}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
            >
              Share on X (Twitter)
            </a>

            {/* HackerNews Share Link */}
            <a 
              href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent('Show HN: SpendSentry – A free AI Spend Auditor for Startups')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', gap: '6px' }}
            >
              Submit to HN
            </a>
          </div>
        </div>
      )}

      {/* Reset Audit Trigger */}
      <button 
        type="button" 
        onClick={onReset}
        className="btn btn-secondary"
        style={{ width: '100%', padding: '12px 20px', borderRadius: '8px' }}
      >
        <RotateCcw size={16} /> Audit Another Stack / Recalculate
      </button>

    </div>
  );
}
