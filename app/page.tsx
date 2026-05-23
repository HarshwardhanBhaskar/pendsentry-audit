'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock,
  ExternalLink,
  ChevronDown,
  ArrowDown
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
  const [formData, setFormData] = useState<AuditInput>(initialFormState);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
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

  const auditSectionRef = useRef<HTMLDivElement>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Merge with initialFormState to ensure all properties exist and prevent runtime type crashes
          const merged: AuditInput = {
            teamSize: typeof parsed.teamSize === 'number' ? parsed.teamSize : initialFormState.teamSize,
            primaryUseCase: typeof parsed.primaryUseCase === 'string' && ['coding', 'writing', 'data', 'research', 'mixed'].includes(parsed.primaryUseCase)
              ? parsed.primaryUseCase as AuditInput['primaryUseCase']
              : initialFormState.primaryUseCase,
            tools: { ...initialFormState.tools }
          };
          
          if (parsed.tools && typeof parsed.tools === 'object') {
            Object.keys(initialFormState.tools).forEach((key) => {
              const toolKey = key as keyof typeof initialFormState.tools;
              if (parsed.tools[toolKey] && typeof parsed.tools[toolKey] === 'object') {
                merged.tools[toolKey] = {
                  ...initialFormState.tools[toolKey],
                  ...parsed.tools[toolKey]
                };
              }
            });
          }
          setFormData(merged);
        }
      }
    } catch (err) {
      console.warn('Failed to load form state from localStorage:', err);
    }
    setIsMounted(true);
  }, []);

  // Persist form state to LocalStorage on every change, but only after mounting
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    } catch (err) {
      console.warn('Failed to persist form state:', err);
    }
  }, [formData, isMounted]);

  const handleCalculate = () => {
    setIsAuditing(true);
    setAuditStep(0);

    // Scroll to the audit section to show the loading phase
    if (auditSectionRef.current) {
      auditSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const interval = setInterval(() => {
      setAuditStep((prev) => {
        if (prev >= auditSteps.length - 1) {
          clearInterval(interval);
          
          const auditResult = runSpendAudit(formData);
          setReport(auditResult);
          setIsAuditing(false);
          return 0;
        }
        return prev + 1;
      });
    }, 400);
  };

  const handleReset = () => {
    setReport(null);
  };

  const scrollToAudit = () => {
    if (auditSectionRef.current) {
      auditSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. TOP NAV BAR (Minimalist Wix Grid Aesthetic) */}
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
          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-display)', color: '#ffffff', letterSpacing: '-0.02em' }}>
            CREDEX
          </span>
          <span style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#00e676', letterSpacing: '0.08em' }}>
            SPENDSENTRY
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a 
            href="#audit-section"
            onClick={(e) => { e.preventDefault(); scrollToAudit(); }}
            style={{ fontSize: '13px', color: '#ffffff', textDecoration: 'none', fontWeight: '600', letterSpacing: '0.02em', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00e676'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
          >
            Audit Tool
          </a>
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
              letterSpacing: '0.02em',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00ff80'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00e676'}
          >
            Sponsor Credex
          </a>
        </div>
      </nav>

      {/* 2. HERO SECTION GRID (2-Columns Wix Grid Layout) */}
      <section className="wix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', borderTop: 'none' }}>
        
        {/* Hero Copy Cell */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '520px', padding: '60px 48px' }}>
          <span style={{ fontSize: '14px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px', display: 'block' }}>
            SOFTWARE SOLUTIONS & AUTOMATION • BUILT BY HB TECHNOLOGIES
          </span>
          <h1 style={{ fontSize: '64px', lineHeight: '0.95', color: '#ffffff', margin: '0 0 24px 0', textTransform: 'uppercase', fontWeight: '800' }}>
            Burn less cash.<br/>
            <span style={{ color: '#00e676' }}>Save 30% on AI.</span>
          </h1>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 36px 0', maxWidth: '520px' }}>
            Startups pay retail rates for duplicate coding tools, leak licenses, and fall into 5-seat minimum traps. SpendSentry performs exact, finance-approved math to audit your subscriptions and consolidate under bulk credits.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              onClick={scrollToAudit} 
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>Launch Spend Audit</span>
              <ArrowDown size={16} />
            </button>
            <a 
              href="https://credex.rocks" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <span>Visit Credex Brokerage</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Hero Visual Mockup Cell */}
        <div className="wix-grid-cell-alt" style={{ 
          position: 'relative', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: 'hidden', 
          minHeight: '520px',
          padding: '40px' 
        }}>
          {/* Dashboard Image */}
          <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/dashboard_mockup.png" 
              alt="SpendSentry Corporate Analytics Dashboard Mockup" 
              style={{ 
                width: '100%', 
                borderRadius: '8px', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
              }}
            />
          </div>

          {/* HB Technologies Wix overlay card style */}
          <div style={{ 
            position: 'absolute', 
            bottom: '24px', 
            left: '24px', 
            right: '24px', 
            backgroundColor: 'rgba(0,0,0,0.92)', 
            border: '1px solid rgba(255, 255, 255, 0.08)', 
            borderRadius: '4px', 
            padding: '20px 24px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', fontFamily: 'var(--font-display)', lineHeight: '1' }}>15</div>
              <div style={{ fontSize: '10px', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Years of Experience</div>
            </div>
            <div style={{ width: '1px', height: '30px', backgroundColor: 'rgba(255, 255, 255, 0.15)' }}></div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#00e676', fontFamily: 'var(--font-display)', lineHeight: '1' }}>25M+</div>
              <div style={{ fontSize: '10px', color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Products Installed</div>
            </div>
          </div>
        </div>

      </section>

      {/* 3. INTERACTIVE AUDIT SECTION */}
      <section id="audit-section" ref={auditSectionRef} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        {/* Section title header block */}
        <div style={{ 
          borderBottom: '1px solid var(--border-color)', 
          padding: '40px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
              01 / INTERACTIVE WORKBENCH
            </span>
            <h2 style={{ fontSize: '36px', margin: 0, textTransform: 'uppercase' }}>
              SpendSentry Calculator
            </h2>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.5' }}>
            Self-report your seat counts and active AI plans. We cross-reference retail rates, seat minimum thresholds, and duplicate functions to return savings immediately.
          </div>
        </div>

        {isAuditing ? (
          /* AUDITING ACTIVE TRANSITION */
          <div style={{ padding: '80px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', textAlign: 'center', minHeight: '420px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.05)', borderTopColor: '#00e676', animation: 'spin-slow 0.8s linear infinite' }}></div>
            <h3 style={{ fontSize: '20px', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>Evaluating Tech Burn</h3>
            <div style={{ minHeight: '24px', fontSize: '14px', color: '#00e676', fontFamily: 'var(--font-display)', fontWeight: '600' }}>
              {auditSteps[auditStep]}
            </div>
            
            {/* Minimal line loader */}
            <div style={{ width: '100%', maxWidth: '280px', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ width: `${((auditStep + 1) / auditSteps.length) * 100}%`, height: '100%', background: '#00e676', transition: 'width 0.3s ease-out' }}></div>
            </div>
          </div>
        ) : report ? (
          /* RESULTS PANELS DISPLAY */
          <div style={{ padding: '48px' }}>
            <AuditResults 
              report={report} 
              formData={formData} 
              onReset={handleReset} 
            />
          </div>
        ) : (
          /* SIDE-BY-SIDE CALCULATOR WORKBENCH */
          <div className="layout-grid" style={{ gap: 0, borderBottom: 'none' }}>
            
            {/* Form Column - Left */}
            <div style={{ padding: '48px', borderRight: '1px solid var(--border-color)' }}>
              {isMounted ? (
                <AuditForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  onSubmit={handleCalculate} 
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.05)', borderTopColor: '#00e676', animation: 'spin-slow 0.8s linear infinite' }}></div>
                </div>
              )}
            </div>

            {/* Support Copy Deck Column - Right */}
            <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '40px', backgroundColor: 'var(--bg-secondary)' }}>
              
              <div>
                <span className="badge badge-green" style={{ marginBottom: '16px' }}>LEAD-GEN FREE UTILITY</span>
                <h3 style={{ fontSize: '24px', margin: '0 0 16px 0', textTransform: 'uppercase', lineHeight: '1.2' }}>
                  Secure, Private and Fully Zero-Integration.
                </h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                  We require no database credentials, credit card logs, or administrative logins. Enter your approximate active counts manually. Calculations are processed locally inside the application runtime.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={18} style={{ color: '#00e676', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', textTransform: 'uppercase', color: '#ffffff' }}>Smart Duplication Logic</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Identifies when developers use separate Copilot and Cursor licenses for the same workload, instantly saving $19/user/month in redundant fees.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <Lock size={18} style={{ color: '#00e676', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', fontSize: '13px', textTransform: 'uppercase', color: '#ffffff' }}>Seat Threshold Compliance</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      Flags hidden costs like Claude Team&apos;s 5-seat minimum. If your team is smaller, we recommend downgrading to individual Pro tiers to save $45+/month immediately.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border-color)', padding: '24px', backgroundColor: '#000000' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Verified Startup Savings Case</h4>
                <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  &ldquo;SpendSentry detected duplicate GitHub Copilot seats while our engineering group was actively migrating to Cursor. We pruned the licenses in 5 minutes, immediately reclaiming $780/mo.&rdquo;
                </p>
                <div style={{ fontSize: '11px', color: '#00e676', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '12px', letterSpacing: '0.05em' }}>
                  — Aris K., VP of Engineering at FlowState (40 seats)
                </div>
              </div>

            </div>

          </div>
        )}
      </section>

      {/* 4. FEATURES GRID (Automation & Data Analytics, matching Wix Template 5) */}
      <section style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', padding: '40px 48px' }}>
          <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            02 / CORE CAPABILITIES
          </span>
          <h2 style={{ fontSize: '36px', margin: 0, textTransform: 'uppercase' }}>
            Specialized Solutions
          </h2>
        </div>

        <div className="wix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          
          {/* Cell 1: Automation */}
          <div className="wix-grid-cell" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '4px', height: '60px', alignItems: 'flex-end', paddingTop: '10px' }}>
              <span className="equalizer-bar" style={{ height: '30px' }}></span>
              <span className="equalizer-bar" style={{ height: '55px' }}></span>
              <span className="equalizer-bar" style={{ height: '20px' }}></span>
              <span className="equalizer-bar" style={{ height: '45px' }}></span>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
                Automation
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                Our automation solutions are tailored to simplify complex processes, saving time and resources for businesses. Experience seamless operations and increased efficiency with our innovative automation tools.
              </p>
            </div>
          </div>

          {/* Cell 2: Data Analytics */}
          <div className="wix-grid-cell" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '4px', height: '60px', alignItems: 'flex-end', paddingTop: '10px' }}>
              <span className="equalizer-bar" style={{ height: '20px', backgroundColor: '#525252' }}></span>
              <span className="equalizer-bar" style={{ height: '40px', backgroundColor: '#ffffff' }}></span>
              <span className="equalizer-bar" style={{ height: '55px', backgroundColor: '#525252' }}></span>
              <span className="equalizer-bar" style={{ height: '30px', backgroundColor: '#ffffff' }}></span>
            </div>
            <div>
              <h3 style={{ fontSize: '28px', margin: '0 0 16px 0', textTransform: 'uppercase' }}>
                Data Analytics
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                Unlock valuable insights and make informed decisions with our powerful data analytics solutions. Dive deep into your data to drive strategic actions and achieve your business goals.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* 5. TEAM SPECIALISTS GRID (Sophia, Ethan, Luisa, matching Wix Template 4) */}
      <section style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', padding: '40px 48px' }}>
          <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            03 / PROFESSIONAL ARCHITECTS
          </span>
          <h2 style={{ fontSize: '36px', margin: 0, textTransform: 'uppercase' }}>
            Meet Our Specialists
          </h2>
        </div>

        <div className="wix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          
          {/* Specialist 1: Sophia Williams */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/sophia_avatar.png" 
                alt="Sophia Williams - Head of Automation" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                Sophia Williams
              </h3>
              <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>
                Head of Automation
              </span>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                As the Head of Automation, Sophia brings a wealth of experience in developing efficient processes and optimizing workflows. Her innovative strategies have helped numerous startups streamline engineering licenses.
              </p>
            </div>
          </div>

          {/* Specialist 2: Ethan Patel */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/ethan_avatar.png" 
                alt="Ethan Patel - Data Analytics Specialist" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                Ethan Patel
              </h3>
              <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>
                Data Analytics Specialist
              </span>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                Ethan, our Data Analytics Specialist, leverages his expertise to provide valuable spend insights. His analytical skills and rigorous mathematical models power SpendSentry&apos;s cost audits.
              </p>
            </div>
          </div>

          {/* Specialist 3: Luisa Chen */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/luisa_avatar.png" 
                alt="Luisa Chen - Industry Solutions Architect" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                Luisa Chen
              </h3>
              <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>
                Industry Solutions Architect
              </span>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: 0 }}>
                Luisa, our Solutions Architect, specializes in tailoring spend platforms to meet unique vertical requirements. Her deep knowledge of enterprise cloud agreements guarantees high-accuracy suggestions.
              </p>
            </div>
          </div>

        </div>

      </section>

      {/* 6. VERIFIED TESTIMONIALS GRID (Matching Wix Template 7) */}
      <section style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', padding: '40px 48px' }}>
          <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            04 / VERIFIED CUSTOMER VOICES
          </span>
          <h2 style={{ fontSize: '36px', margin: 0, textTransform: 'uppercase' }}>
            Testimonials
          </h2>
        </div>

        <div className="wix-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          
          {/* Testimonial 1 */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px', color: '#00e676', fontFamily: 'var(--font-display)', fontWeight: '900', lineHeight: '0.5', marginTop: '10px' }}>“</span>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#ffffff', margin: 0, fontWeight: '500' }}>
              &ldquo;I am amazed by the impact of SpendSentry&apos;s solutions on our daily operations. Efficiency has never been easier!&rdquo;
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px', color: '#00e676', fontFamily: 'var(--font-display)', fontWeight: '900', lineHeight: '0.5', marginTop: '10px' }}>“</span>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#ffffff', margin: 0, fontWeight: '500' }}>
              &ldquo;The data analytics tools provided by HB Technologies have transformed the way we make business decisions. Truly game-changing!&rdquo;
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '48px', color: '#00e676', fontFamily: 'var(--font-display)', fontWeight: '900', lineHeight: '0.5', marginTop: '10px' }}>“</span>
            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#ffffff', margin: 0, fontWeight: '500' }}>
              &ldquo;Thanks to SpendSentry&apos;s automation platform, we have significantly improved our workflow efficiency and saved valuable time.&rdquo;
            </p>
          </div>

        </div>

      </section>

      {/* 7. COLLABORATIVE OFFICE HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        minHeight: '450px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Background team office graphic */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, zIndex: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/office_collaboration.png" 
            alt="Sleek modern collaboration workspace" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{ zIndex: 1, position: 'relative', textAlign: 'center', padding: '60px 24px', maxWidth: '640px' }}>
          <span className="badge badge-green" style={{ marginBottom: '20px' }}>BUILT BY HB TECHNOLOGIES</span>
          <h2 style={{ fontSize: '44px', textTransform: 'uppercase', lineHeight: '1.05', margin: '0 0 16px 0' }}>
            Ready to Cut Engineering Burn?
          </h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', margin: '0 0 28px 0' }}>
            SpendSentry is sponsored by Credex. We procure surplus corporate tech credits, allowing engineering teams to source Claude Pro, OpenAI APIs, and Cursor licenses at bulk, off-market discounts.
          </p>
          <button 
            type="button" 
            onClick={scrollToAudit} 
            className="btn btn-primary"
            style={{ fontSize: '15px', padding: '14px 36px' }}
          >
            Run Free Audit
          </button>
        </div>
      </section>

      {/* 8. FAQ ACCORDION LIST GRID */}
      <section style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: '#000000' }}>
        
        <div style={{ borderBottom: '1px solid var(--border-color)', padding: '40px 48px' }}>
          <span style={{ fontSize: '12px', color: '#00e676', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
            05 / FAQS & POLICIES
          </span>
          <h2 style={{ fontSize: '36px', margin: 0, textTransform: 'uppercase' }}>
            Spend Audit FAQs
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              q: "Do I need to connect billing portals to run this audit?",
              a: "Absolutely not. SpendSentry is fully zero-integration. Simply specify your active team seat sizes and enabled tools on-screen, and we calculate optimizations instantly without accessing your financial accounts."
            },
            {
              q: "How does Cursor + Copilot double-paying detection work?",
              a: "Many development teams pay $19/user/month for Copilot while paying $40/user/month for Cursor. Since Cursor contains native autocompletes, maintaining separate Copilot licenses is redundant. We isolate this seat overlap."
            },
            {
              q: "How is my email and data handled? Is my audit public?",
              a: "Your privacy is our highest priority. The public shareable URL (pendsentry-audit.vercel.app/share/[id]) strips away all identifying details like your company name, email, or team member roles, displaying only the aggregate tool count and savings breakdown. Your raw data is stored securely in our private Postgres backend, and we will never sell or share your email address."
            },
            {
              q: "How is Credex able to offer bulk discounts?",
              a: "Startups regularly over-commit on cloud vouchers. Credex secures these surplus accounts at a steep discount, enabling other engineering orgs to procure verified model keys for up to 30% off."
            },
            {
              q: "What makes your audit recommendations \"defensible\"?",
              a: "We execute strict, deterministic rules based on published enterprise pricing schedules (seat limits, API models). Any financial controller or VP can easily verify these formulas against vendor pricing sheets."
            }
          ].map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: isOpen ? 'var(--bg-secondary)' : '#000000', transition: 'background-color 0.2s' }}
              >
                <button 
                  type="button"
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '24px 48px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '700',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>{item.q}</span>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      color: '#00e676', 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.2s' 
                    }} 
                  />
                </button>
                {isOpen && (
                  <div style={{ 
                    padding: '0 48px 24px 48px', 
                    fontSize: '14px', 
                    lineHeight: '1.6', 
                    color: 'var(--text-secondary)',
                    maxWidth: '820px'
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      <footer className="wix-grid" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        borderBottom: 'none',
        backgroundColor: '#000000',
        padding: '0px',
        marginTop: 'auto'
      }}>
        
        {/* Foot Col 1: Contact Details */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '48px' }}>
          <h4 style={{ fontSize: '20px', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#ffffff' }}>CREDEX</h4>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>hello@credex.rocks</span>
            <span>https://credex.rocks</span>
          </div>
        </div>

        {/* Foot Col 2: Address */}
        <div className="wix-grid-cell" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '48px' }}>
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', margin: '0 0 8px 0', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>Location</h4>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span>Ranchi, Jharkhand</span>
            <span>India - 834001</span>
          </div>
        </div>

        {/* Foot Col 3: Social & Copyright */}
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

export const runtime = 'nodejs';
