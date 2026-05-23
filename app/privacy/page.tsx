'use client';

import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff', overflowX: 'hidden' }}>
      
      {/* Dynamic ambient background glow */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '1200px',
        height: '600px',
        background: 'radial-gradient(circle at top, rgba(0, 230, 118, 0.035) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{ 
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
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
            className="liquid-glass"
            style={{ 
              fontSize: '12px', 
              color: '#ffffff', 
              textDecoration: 'none', 
              fontWeight: '700', 
              padding: '10px 20px',
              borderRadius: '9999px',
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
              border: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={14} style={{ color: '#00e676' }} />
            <span>Back to Audit</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '80px 24px 120px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%', zIndex: 10, position: 'relative' }}>
        
        {/* Header Block with generated graphic */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          {/* Custom generated 3D data shield graphic, beautifully centered */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div className="liquid-glass" style={{ borderRadius: '24px', padding: '6px', maxWidth: '140px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/spend_sentry_shield.png" 
                alt="SpendSentry Premium 3D Data Protection Shield" 
                style={{ width: '100%', height: 'auto', borderRadius: '18px', display: 'block' }}
              />
            </div>
          </div>

          <span style={{ fontSize: '13px', fontWeight: '800', color: '#00e676', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'block', fontFamily: 'var(--font-display)' }}>
            Data Privacy Ledger
          </span>
          
          <h1 style={{ 
            fontSize: '64px', 
            fontWeight: '400', 
            fontFamily: "'Instrument Serif', serif", 
            letterSpacing: '-0.02em', 
            margin: '0 0 16px 0', 
            color: '#ffffff',
            lineHeight: '1.05'
          }}>
            Privacy then <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.65)' }}>Policy</em>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            We engineer secure pipelines that safeguard corporate credentials, while delivering mathematically defensible AI savings with zero compromise.
          </p>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '24px', fontFamily: 'var(--font-display)', fontWeight: '800', letterSpacing: '0.08em' }}>
            LAST SECURED: MAY 23, 2026
          </div>
        </div>

        {/* Liquid Glass Bento Grid Highlights */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}>
          
          {/* Card 1 */}
          <div className="liquid-glass" style={{ padding: '36px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                color: '#00e676', 
                backgroundColor: 'rgba(0, 230, 118, 0.05)', 
                width: '44px', 
                height: '44px', 
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>Zero Data Sales</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  We never monetize, broker, or sell email lists or operational parameters. Your logs are yours alone.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass" style={{ padding: '36px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                color: '#00e676', 
                backgroundColor: 'rgba(0, 230, 118, 0.05)', 
                width: '44px', 
                height: '44px', 
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <EyeOff size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>Anonymized Shares</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  Publicly generated dashboard blueprints strip out all emails, user names, and company tags completely.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass" style={{ padding: '36px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                color: '#00e676', 
                backgroundColor: 'rgba(0, 230, 118, 0.05)', 
                width: '44px', 
                height: '44px', 
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>PostgreSQL Shield</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  All persistent inputs are housed entirely within secured, authenticated, and firewall-protected databases.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Document Bento Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 1
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              Information then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Processed</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              To compute mathematically defensible AI spend audits, SpendSentry processes two categories of business data:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              <li>
                <strong>Operational Spend Data:</strong> Active tool subscriptions (Cursor, ChatGPT, Copilot, Claude, Gemini, Windsurf), team licenses, and custom API budgets.
              </li>
              <li>
                <strong>Secure Contact Captures:</strong> Business emails and optional company designations entered exclusively to dispatch confirmation savings templates.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 2
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              Audit Calculations then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Logic</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              Operational spend parameters are run through isolated, deterministic algorithms to optimize license usage. These routines detect overlapping coding editors, flag seat billing limits, and compile options. No personal data is combined or utilized for model training.
            </p>
          </div>

          {/* Section 3 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 3
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              Full Blueprint <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Anonymization</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              All dynamic shareable endpoints (`/share/[id]`) are thoroughly stripped of lead identifiers prior to server-side render. A guest user viewing your shared blueprint will only see aggregated charts and plan recommendations, guaranteeing absolute data safety.
            </p>
          </div>

          {/* Section 4 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                CONTACT & DELETIONS
              </span>
              <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
                Secure Data then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Control</em>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
                You maintain complete authority over your lead information. To query your records, request manual record deletion, or discuss our sponsor Credex's credits integration, contact our privacy engineering team directly:
              </p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#00e676', fontWeight: '800', fontSize: '15px' }}>
              <Mail size={16} />
              <span>hello@credex.rocks</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-color)',
        padding: '40px 24px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        © 2026 SpendSentry. Designed & Engineered by HB Technologies. Sponsored by Credex. Ranchi, Jharkhand, India.
      </footer>

    </div>
  );
}
