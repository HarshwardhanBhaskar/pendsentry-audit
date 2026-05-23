'use client';

import React from 'react';
import { ArrowLeft, Sparkles, Eye, CheckCircle2, Accessibility, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AccessibilityStatement() {
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
            Inclusive Web Commitment
          </span>
          <h1 style={{ fontSize: '48px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
            Accessibility
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            SpendSentry is built with digital inclusivity at its core. We strive to provide a fully accessible financial auditing tool for all builders.
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
              <Eye size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>High Contrast</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Color specifications satisfy the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA threshold ratios.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#00e676', marginTop: '4px' }}>
              <Accessibility size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>Keyboard Navigation</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>All interactive sliders, checkmarks, inputs, and triggers support standard tab key focusing.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ color: '#00e676', marginTop: '4px' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', margin: '0 0 6px 0', color: '#ffffff' }}>Semantic Layout</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>Structured using standard semantic tags with explicit aria declarations for assistive screen readers.</p>
            </div>
          </div>
        </div>

        {/* Text Document Block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', lineHeight: '1.8', fontSize: '15px', color: 'var(--text-secondary)' }}>
          
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              1. Our Commitment
            </h2>
            <p>
              HB Technologies and Credex are committed to ensuring digital accessibility for people with disabilities. We continually apply relevant accessibility standards to improve the user experience for everyone, making sure that financial audit reports are accessible to all startup team members.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              2. Conformance Status
            </h2>
            <p>
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. 
            </p>
            <p style={{ marginTop: '12px' }}>
              SpendSentry is **fully conformant with WCAG 2.1 Level AA standards**. Every page layout, input field, and savings visualization chart has been calibrated to align with Level AA requirements.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              3. Visual Accessibility (Contrast & Scale)
            </h2>
            <p>
              To maintain our premium glassmorphic dark-mode aesthetic without sacrificing readability, we engineered our visual structure to include:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <strong>Sufficient Contrast:</strong> All text overlays are styled using HSL-derived variables, ensuring a contrast ratio of at least **4.5:1** against dark layout backgrounds, far exceeding basic browser readability tests.
              </li>
              <li>
                <strong>Zoom Compatibility:</strong> Every font size is declared using flexible styling systems, allowing smooth scaling up to 200% via browser scaling without layout breakage or overlapping blocks.
              </li>
              <li>
                <strong>Color Independence:</strong> We never convey cost-savings information solely through color indicators. All chart actions and metrics are supported by explicit labels and text descriptions.
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              4. Screen Reader Integration
            </h2>
            <p>
              SpendSentry uses a single, logical `H1` tag per viewport page alongside structured `section` and `main` landmarks. We have implemented explicit, matching `id` tags for all interactive form fields (`team-size-input`, `usecase-select`, etc.) to facilitate perfect, uninterrupted keyboard tab navigation and descriptive focus reading for desktop and mobile screen readers.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.02em', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
              5. Submit Feedback
            </h2>
            <p>
              We welcome your feedback on the accessibility of SpendSentry. If you experience any accessibility issues or barriers while running audits, planning cost optimization steps, or utilizing our dynamically generated share layouts, please let us know:
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
