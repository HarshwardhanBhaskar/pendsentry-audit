'use client';

import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
      
      {/* Navigation */}
      <nav style={{ 
        borderBottom: '1px solid var(--border-color)', 
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000000',
        zIndex: 50,
        position: 'sticky',
        top: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#ffffff', letterSpacing: '-0.02em' }}>
              CREDEX
            </span>
            <span style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#00e676', letterSpacing: '0.08em' }}>
              SPENDSENTRY
            </span>
          </Link>
        </div>
        <div>
          <Link 
            href="/" 
            style={{ 
              fontSize: '12px', 
              color: '#000000', 
              backgroundColor: '#00e676',
              textDecoration: 'none', 
              fontWeight: '700', 
              padding: '8px 18px',
              borderRadius: '9999px',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00ff80'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00e676'}
          >
            <ArrowLeft size={14} />
            <span>Back to Audit</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '80px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        
        {/* Header Block */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#00e676', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'block' }}>
            Privacy Shield Commitment
          </span>
          <h1 style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            Privacy Policy
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Your privacy is our absolute priority. We do not sell your personal data, and we anonymize public reports to shield your corporate identity.
          </p>
          <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
            LAST UPDATED: MAY 23, 2026
          </div>
        </div>

        {/* Highlight Card */}
        <div className="glass-card" style={{ 
          border: '1px solid var(--border-color)', 
          padding: '32px', 
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '4px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          marginBottom: '60px'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#00e676', marginTop: '4px' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>Zero Selling</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>We never monetize, share, or sell your emails or startup budget logs to third-party ad brokers.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#00e676', marginTop: '4px' }}>
              <EyeOff size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>Anonymized Shares</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Public audit results pages strip away all email addresses, company names, and employee roles.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#00e676', marginTop: '4px' }}>
              <Lock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>PostgreSQL Encryption</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>All raw submissions are stored on private, authenticated and firewall-protected databases.</p>
            </div>
          </div>
        </div>

        {/* Text Document Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: '1.8', fontSize: '15px', color: 'var(--text-secondary)' }}>
          
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              1. Information We Collect
            </h2>
            <p>
              To perform a comprehensive and mathematically defensible AI spend audit, SpendSentry processes two categories of information:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Operational Audit Input (Self-Reported):</strong> This includes your team size, primary engineering or business workload scope, active SaaS tool subscription tiers (Cursor, Copilot, ChatGPT, Claude, Gemini, Windsurf), and estimated monthly custom API spends.
              </li>
              <li>
                <strong>Lead Contact Information:</strong> If you request a full optimization ledger, we collect your business email address, and optionally, your company name and professional role.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              2. How We Use Your Data
            </h2>
            <p>
              We process your operational data exclusively to evaluate licenses and compile immediate, actionable cost-reduction recommendations:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>To execute deterministic calculations identifying plan redundancies and seat billing minimum thresholds.</li>
              <li>To securely dispatch transactional audit summaries directly to your inbox via the Resend API.</li>
              <li>To trigger specialized enterprise consulting workflows with our sponsor, Credex, if savings exceed our high-spend consulting limit (greater than or equal to $500/mo).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              3. Shareable Page Anonymization
            </h2>
            <p>
              SpendSentry features viral shared blueprints (`/share/[id]`) so you can present cost savings directly to your Chief Financial Officer, VP of Engineering, or accounting department. 
            </p>
            <p style={{ marginTop: '12px' }}>
              To ensure absolute privacy, **the server completely strips out the email address, company name, and user role** from the public dashboard before compiling the layout. Visitors looking at a shared dashboard will only see the aggregated calculations, metrics graphs, and optimization steps. Your identity remains 100% private.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              4. Third-Party Integrations
            </h2>
            <p>
              SpendSentry does not make client-side calls to external models or messaging vendors to prevent browser scraping. To draft personalized executive analysis briefs, we query **Google Gemini** (`gemini-2.5-flash`) and **Anthropic** (`claude-3-5-sonnet`) securely from our private serverless route handlers. No identifying data is shared with AI providers; they are fed only anonymized numbers and workload definitions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, your stored lead details, or if you wish to request the manual deletion of your audit record from our Postgres table, please reach out to us:
            </p>
            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#00e676', fontWeight: '600' }}>
              <Mail size={16} />
              <span>hello@credex.rocks</span>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)',
        padding: '32px 40px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        © 2026 SpendSentry. Designed and Engineered by HB Technologies. Sponsored by Credex.
      </footer>

    </div>
  );
}
