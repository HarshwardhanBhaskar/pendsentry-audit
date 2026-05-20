'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  HelpCircle, 
  Coins, 
  Lock,
  ExternalLink
} from 'lucide-react';
import AuditForm from '../components/AuditForm';
import AuditResults from '../components/AuditResults';
import { runSpendAudit, AuditInput, AuditReport } from '../lib/auditEngine';

const LOCAL_STORAGE_KEY = 'spend-sentry-form-state-v1';

const initialFormState: AuditInput = {
  teamSize: 5,
  primaryUseCase: 'coding',
  tools: {
    cursor: { enabled: true, plan: 'pro', seats: 5 },
    copilot: { enabled: false, plan: 'individual', seats: 0 },
    claude: { enabled: true, plan: 'pro', seats: 5 },
    chatgpt: { enabled: false, plan: 'plus', seats: 0 },
    anthropic_api: { enabled: false, plan: 'pay_as_you_go', seats: 0, customSpend: 100 },
    openai_api: { enabled: false, plan: 'pay_as_you_go', seats: 0, customSpend: 100 },
    gemini: { enabled: false, plan: 'free', seats: 0 },
    windsurf: { enabled: false, plan: 'free', seats: 0 },
  },
};

export default function Home() {
  const [formData, setFormData] = useState<AuditInput>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to rehydrate form state:', err);
      }
    }
    return initialFormState;
  });
  const [report, setReport] = useState<AuditReport | null>(null);
  
  // Auditing animation phases
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditStep, setAuditStep] = useState<number>(0);
  const auditSteps = [
    'Parsing seat quotas across active subscriptions...',
    'De-duplicating Cursor and GitHub Copilot licenses...',
    'Analyzing Claude Team 5-seat minimum thresholds...',
    'Cross-referencing direct Anthropic & OpenAI API billing tiers...',
    'Checking eligibility for Credex discounted credits...',
    'Compiling defensible financial optimization report...'
  ];



  // Persist form state to LocalStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
      console.warn('Failed to persist form state:', err);
    }
  }, [formData]);

  const handleCalculate = () => {
    setIsAuditing(true);
    setAuditStep(0);

    // Run interactive multi-stage loader
    const interval = setInterval(() => {
      setAuditStep((prev) => {
        if (prev >= auditSteps.length - 1) {
          clearInterval(interval);
          
          // Generate final audit report
          const auditResult = runSpendAudit(formData);
          setReport(auditResult);
          setIsAuditing(false);
          
          // Scroll smoothly to top of results
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return 0;
        }
        return prev + 1;
      });
    }, 400); // Fast, snappy transitions
  };

  const handleReset = () => {
    setReport(null);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      
      {/* HEADER BAR */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px', background: 'var(--color-primary-glow)', borderRadius: '6px', border: '1px solid var(--border-glass)', color: '#60a5fa' }}>
            <Coins size={22} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            SpendSentry
          </span>
        </div>
        <div>
          <a 
            href="https://credex.rocks" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
          >
            <span>by Credex</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </header>

      {/* CORE LAYOUT GRID */}
      {isAuditing ? (
        /* LOADING STATE OVERLAY (Snappy micro-animations) */
        <div className="glass-container" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', textAlign: 'center', minHeight: '400px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid rgba(255, 255, 255, 0.05)', borderTopColor: 'var(--color-primary)', animation: 'spin-slow 0.8s linear infinite', boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)' }}></div>
          <h2 style={{ fontSize: '20px', color: '#ffffff', margin: 0 }}>Analyzing Subscriptions</h2>
          <div style={{ minHeight: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            {auditSteps[auditStep]}
          </div>
          
          {/* visual loading bar */}
          <div style={{ width: '100%', maxWidth: '300px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${((auditStep + 1) / auditSteps.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-success) 100%)', borderRadius: '2px', transition: 'width 0.3s ease-out' }}></div>
          </div>
        </div>
      ) : report ? (
        /* RESULTS INTERFACE SCREEN */
        <div className="glass-container" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span className="badge badge-green" style={{ marginBottom: '8px' }}>Audit Ready</span>
            <h2 style={{ fontSize: '28px', margin: 0, color: '#ffffff' }}>Your Cost Reduction Blueprint</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Deterministic, finance-literate optimization options calculated as of May 2026.
            </p>
          </div>
          
          <AuditResults 
            report={report} 
            formData={formData} 
            onReset={handleReset} 
          />
        </div>
      ) : (
        /* INPUT AUDITOR & MARKETING DOCK SCREEN */
        <div className="layout-grid">
          
          {/* Left Column: Interactive Form Panel */}
          <div>
            <AuditForm 
              formData={formData} 
              setFormData={setFormData} 
              onSubmit={handleCalculate} 
            />
          </div>

          {/* Right Column: Copy deck & FAQ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* Copy Hook */}
            <div className="glass-card" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(20, 22, 38, 0.4) 0%, rgba(13, 14, 24, 0.4) 100%)' }}>
              <span className="badge badge-blue" style={{ marginBottom: '12px' }}>Lead-Gen Free Audit</span>
              <h1 style={{ fontSize: '32px', lineHeight: '1.2', color: '#ffffff', margin: '0 0 16px 0', fontWeight: 'bold' }}>
                Stop Burning Cash on Duplicate, Overpriced AI Subscriptions.
              </h1>
              <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
                Startups frequently pay retail rates for duplicate coding seats, fall into seat-minimum billing traps (like Claude Team&apos;s 5-seat minimum), or overpay for direct API traffic. SpendSentry runs hard, defensible calculations to instantly show you where to consolidate, downgrade, or switch to bulk credits.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
                  <span><strong>100% Secure:</strong> No bank connection or billing portal credentials needed.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={16} style={{ color: 'var(--color-success)' }} />
                  <span><strong>Privacy First:</strong> Social share links strip company and email details completely.</span>
                </div>
              </div>
            </div>

            {/* Visual Social Proof Block */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verified Startup Savings
              </h3>
              <div style={{ fontStyle: 'italic', fontSize: '13px', color: 'var(--text-secondary)', borderLeft: '3px solid #3b82f6', paddingLeft: '12px' }}>
                &ldquo;We ran SpendSentry and discovered we were double-paying for GitHub Copilot seats while our engineering team had already switched to Cursor. We canceled the redundant licenses and saved $780/month in 5 minutes.&rdquo;
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'normal', fontWeight: 'bold' }}>
                  — Aris K., VP of Engineering at FlowState (Team of 40)
                </div>
              </div>
            </div>

            {/* 5 FAQ Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={18} style={{ color: '#60a5fa' }} /> Spend Audit FAQs
              </h3>
              
              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Do I need to connect billing portals to run this audit?</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Absolutely not. SpendSentry is fully zero-integration and self-reported. Select what tools your team uses and active seats in our spend form. We process the audit instantly on-screen.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>How does Cursor + Copilot double-paying detection work?</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Many engineering orgs pay $19/user/mo for Copilot while paying $40/user/mo for Cursor. Since Cursor contains native autocompletes, keeping separate Copilot licenses is completely redundant. We flag this exact seat overlap.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>How is my email and data handled? Is my audit public?</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Your privacy is our priority. Public share links strip identifying details like company name or email, displaying only tool counts and savings numbers. Raw inputs are kept secure in our Postgres database.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>How is Credex able to offer bulk discounts?</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Startups regularly overforecast their infrastructure needs, leaving them with surplus, unused AI credits. Credex buys these credits at a deep discount, letting you secure Claude, OpenAI API, or Cursor seats for up to 30% off.
                </p>
              </div>

              <div className="glass-card" style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>What makes your audit recommendations &ldquo;defensible&rdquo;?</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  We do not use speculative AI to guess costs. Our engine executes exact mathematical rules using real-time verified pricing pages (SSO upgrades, team minimums, and API scopes) that any finance officer can verify.
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* FOOTER BAR */}
      <footer style={{ marginTop: '60px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p>SpendSentry is a free startup tool provided by Credex. Sourcing surplus corporate credits to slash tech burn.</p>
        <p>© 2026 Credex. Rocks. All rights reserved.</p>
      </footer>

    </div>
  );
}
export const runtime = 'nodejs';
