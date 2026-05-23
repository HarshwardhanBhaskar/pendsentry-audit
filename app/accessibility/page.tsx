'use client';

import React from 'react';
import { ArrowLeft, Sparkles, Eye, CheckCircle2, Accessibility, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AccessibilityStatement() {
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
        
        {/* Header Block with visual icon */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div className="liquid-glass" style={{ 
              borderRadius: '9999px', 
              width: '64px', 
              height: '64px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#00e676'
            }}>
              <Accessibility size={28} />
            </div>
          </div>

          <span style={{ fontSize: '13px', fontWeight: '800', color: '#00e676', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', display: 'block', fontFamily: 'var(--font-display)' }}>
            Inclusive Web Statement
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
            Accessibility then <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.65)' }}>Standard</em>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            We design experiences that prioritize clarity, support assistive inputs, and maintain elite visual legibility for all members of the startup ecosystem.
          </p>
          <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '24px', fontFamily: 'var(--font-display)', fontWeight: '800', letterSpacing: '0.08em' }}>
            LAST VERIFIED: MAY 23, 2026
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
                <Eye size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>High Color Contrast</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  Aesthetic layout selections are strictly checked against HSL contrast guidelines exceeding 4.5:1 ratios.
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
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>Keyboard Navigation</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  All custom input parameters, tool checkmarks, and form fields are fully operational via keyboard tab targets.
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
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff', letterSpacing: '0.05em' }}>Semantic Elements</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.6' }}>
                  Crafted using standard native tags with clear aria designations to support seamless screen reader operations.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Document Bento Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section 1 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', tracking: '0.1em', uppercase: 'true', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 1
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              WCAG AA Conformance then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Standards</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              Web Content Accessibility Guidelines (WCAG) dictate standard specifications to establish digital access for users with disabilities. SpendSentry is fully conformant with WCAG 2.1 Level AA parameters, mapping clear layouts and color combinations to meet structural standards.
            </p>
          </div>

          {/* Section 2 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', tracking: '0.1em', uppercase: 'true', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 2
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              Contrast ratios then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Legibility</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              Our glassmorphic elements maintain contrast safety by checking text styling parameters against deep dark backdrops. We use HSL color tokens to guarantee reading copy is set to a crisp `text-neutral-200` contrast, keeping text legibility above the standard 4.5:1 ratio.
            </p>
          </div>

          {/* Section 3 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', tracking: '0.1em', uppercase: 'true', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
              SECTION 3
            </span>
            <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
              Interactive keyboard focus <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Indicators</em>
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
              Standard screen readers require clear HTML DOM sequences to execute tab targets smoothly. SpendSentry features native HTML inputs, explicit matching focus markers, and responsive check outlines to guide keyboard-only users without mouse support.
            </p>
          </div>

          {/* Section 4 */}
          <div className="liquid-glass" style={{ padding: '40px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#00e676', tracking: '0.1em', uppercase: 'true', display: 'block', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>
                CONTACT & IMPROVEMENTS
              </span>
              <h2 style={{ fontSize: '28px', fontFamily: "'Instrument Serif', serif", fontWeight: '400', margin: '0 0 16px 0', color: '#ffffff' }}>
                Reader Feedback then <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>Support</em>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
                If you encounter any barrier while interacting with SpendSentry dashboards, experiencing font delays, or sharing audit blueprints, please contact our accessibility support directly:
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
