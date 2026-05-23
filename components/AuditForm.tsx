'use client';

import React from 'react';
import { 
  Users, 
  Terminal, 
  Code, 
  FileText, 
  Database, 
  Search, 
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { PRICING_DATABASE, ToolName, PrimaryUseCase } from '../lib/pricingData';
import { AuditInput } from '../lib/auditEngine';

interface AuditFormProps {
  formData: AuditInput;
  setFormData: React.Dispatch<React.SetStateAction<AuditInput>>;
  onSubmit: () => void;
}

export default function AuditForm({ formData, setFormData, onSubmit }: AuditFormProps) {
  const handleGeneralChange = (field: 'teamSize' | 'primaryUseCase', value: number | PrimaryUseCase) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Auto-propagate team size to active tool seat counts as a smart default
      if (field === 'teamSize') {
        const newTeamSize = Number(value);
        const newTools = { ...prev.tools };
        
        (Object.keys(newTools) as ToolName[]).forEach((toolKey) => {
          if (newTools[toolKey].enabled) {
            newTools[toolKey] = {
              ...newTools[toolKey],
              seats: newTeamSize
            };
          }
        });
        updated.tools = newTools;
      }
      return updated;
    });
  };

  const handleToolToggle = (toolKey: ToolName, checked: boolean) => {
    setFormData((prev) => {
      const toolInput = prev.tools[toolKey] || { enabled: false, plan: '', seats: prev.teamSize };
      
      // Setup smart plan defaults when enabled
      let defaultPlan = '';
      if (checked) {
        if (toolKey === 'cursor') defaultPlan = 'pro';
        else if (toolKey === 'copilot') defaultPlan = 'individual';
        else if (toolKey === 'claude') defaultPlan = 'pro';
        else if (toolKey === 'chatgpt') defaultPlan = 'plus';
        else if (toolKey === 'gemini') defaultPlan = 'advanced';
        else if (toolKey === 'windsurf') defaultPlan = 'pro';
        else defaultPlan = Object.keys(PRICING_DATABASE[toolKey].plans)[0];
      }

      const updatedTools = {
        ...prev.tools,
        [toolKey]: {
          ...toolInput,
          enabled: checked,
          plan: defaultPlan,
          seats: checked ? prev.teamSize : 0,
          customSpend: toolKey.endsWith('_api') && checked ? 100 : undefined
        }
      };

      return { ...prev, tools: updatedTools };
    });
  };

  const handleToolPlanChange = (toolKey: ToolName, planKey: string) => {
    setFormData((prev) => {
      const toolInput = prev.tools[toolKey];
      if (!toolInput) return prev;

      // Handle custom API default spend
      let customSpendVal = toolInput.customSpend;
      if (toolKey.endsWith('_api')) {
        customSpendVal = 100;
      }

      const updatedTools = {
        ...prev.tools,
        [toolKey]: {
          ...toolInput,
          plan: planKey,
          customSpend: customSpendVal
        }
      };
      return { ...prev, tools: updatedTools };
    });
  };

  const handleToolNumericChange = (toolKey: ToolName, field: 'seats' | 'customSpend', value: number) => {
    setFormData((prev) => {
      const toolInput = prev.tools[toolKey];
      if (!toolInput) return prev;

      const updatedTools = {
        ...prev.tools,
        [toolKey]: {
          ...toolInput,
          [field]: Math.max(0, value)
        }
      };
      return { ...prev, tools: updatedTools };
    });
  };

  const getUseCaseIcon = (useCase: PrimaryUseCase) => {
    switch (useCase) {
      case 'coding': return <Code size={16} />;
      case 'writing': return <FileText size={16} />;
      case 'data': return <Database size={16} />;
      case 'research': return <Search size={16} />;
      case 'mixed': return <Layers size={16} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Step 1: General Organization Info */}
      <div style={{ 
        border: '1px solid var(--border-color)', 
        padding: '28px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', textTransform: 'uppercase' }}>
          <Sparkles size={16} style={{ color: '#00e676' }} /> 1. Team Size & Core Workload
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Team Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="team-size-input" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: '#a3a3a3', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>
                <Users size={14} style={{ color: '#00e676' }} /> Active Team Members
              </label>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#00e676', fontFamily: 'var(--font-display)' }}>
                {formData.teamSize} {formData.teamSize === 1 ? 'User' : 'Users'}
              </span>
            </div>
            <input 
              id="team-size-input"
              type="range" 
              min="1" 
              max="100" 
              value={formData.teamSize}
              onChange={(e) => handleGeneralChange('teamSize', Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
              <span>1 SEAT</span>
              <span>25 SEATS</span>
              <span>50 SEATS</span>
              <span>75 SEATS</span>
              <span>100+ SEATS</span>
            </div>
          </div>

          {/* Primary Use Case Select */}
          <div>
            <label htmlFor="usecase-select" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a3a3a3', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Terminal size={14} style={{ color: '#00e676' }} /> Primary Workload Scope
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="usecase-select"
                value={formData.primaryUseCase}
                onChange={(e) => handleGeneralChange('primaryUseCase', e.target.value as PrimaryUseCase)}
                style={{ 
                  width: '100%', 
                  appearance: 'none', 
                  paddingLeft: '38px',
                  backgroundColor: '#000000',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#ffffff'
                }}
              >
                <option value="coding">Software Engineering (Coding, Autocomplete, CLI)</option>
                <option value="writing">Content Generation (Copywriting, Marketing, Proposals)</option>
                <option value="data">Data Analysis & Modeling (Python, SQL, R)</option>
                <option value="research">Market Intelligence & Academic Research</option>
                <option value="mixed">General Purpose Multi-Model Productivity</option>
              </select>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00e676', display: 'flex', alignItems: 'center' }}>
                {getUseCaseIcon(formData.primaryUseCase)}
              </div>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              ℹ️ Your primary workload selection auto-calibrates custom audit priorities (e.g., prioritizing editor-level double-paying checks for coding, and account consolidation for mixed workflows).
            </p>
          </div>
        </div>
      </div>

      {/* Step 2: Tools Breakdown Selection */}
      <div style={{ 
        border: '1px solid var(--border-color)', 
        padding: '28px',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', textTransform: 'uppercase' }}>
          <Zap size={16} style={{ color: '#00e676' }} /> 2. Paid AI Software Subscriptions
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Toggle on the active subscriptions your company pays for to calculate optimized allocations.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(Object.keys(PRICING_DATABASE) as ToolName[]).map((toolKey) => {
            const toolPricing = PRICING_DATABASE[toolKey];
            const isApi = toolKey.endsWith('_api');
            const userVal = formData.tools[toolKey] || { enabled: false, plan: '', seats: 0 };

            return (
              <div 
                key={toolKey} 
                style={{ 
                  padding: '16px 20px',
                  border: '1px solid var(--border-color)',
                  borderLeft: userVal.enabled ? '3px solid var(--color-primary)' : '1px solid var(--border-color)',
                  background: userVal.enabled ? '#080808' : '#000000',
                  transition: 'var(--transition-fast)',
                  borderRadius: '2px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Tool Header & Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <label className="switch" style={{ margin: 0 }} aria-label={`Toggle ${toolPricing.displayName}`}>
                      <input 
                        type="checkbox" 
                        checked={userVal.enabled}
                        onChange={(e) => handleToolToggle(toolKey, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: userVal.enabled ? '#ffffff' : 'var(--text-secondary)', letterSpacing: '0.02em' }}>
                        {toolPricing.displayName}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.02em' }}>
                        {isApi ? 'API ENDPOINT' : 'LICENSED SEATS'}
                      </span>
                    </div>
                  </div>

                  {/* Form fields (Only visible if checked) */}
                  {userVal.enabled && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      
                      {/* Plan Dropdown Selection */}
                      {!isApi && (
                        <div>
                          <select
                            aria-label={`${toolPricing.displayName} Plan`}
                            value={userVal.plan}
                            onChange={(e) => handleToolPlanChange(toolKey, e.target.value)}
                            style={{ 
                              padding: '6px 12px', 
                              fontSize: '12px',
                              backgroundColor: '#000000',
                              border: '1px solid var(--border-color)',
                              borderRadius: '2px',
                              color: '#ffffff'
                            }}
                          >
                            {Object.entries(toolPricing.plans).map(([k, p]) => (
                              <option key={k} value={k}>
                                {p.name} {p.pricePerSeat > 0 ? `($${p.pricePerSeat}/mo)` : '(Free)'}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Numeric values (Seats or CustomSpend) */}
                      {isApi ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label htmlFor={`${toolKey}-spend`} style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Monthly Burn:</label>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: '#00e676', fontWeight: 'bold' }}>$</span>
                            <input 
                              id={`${toolKey}-spend`}
                              type="number" 
                              min="0"
                              value={userVal.customSpend || 0}
                              onChange={(e) => handleToolNumericChange(toolKey, 'customSpend', Number(e.target.value))}
                              style={{ 
                                width: '90px', 
                                padding: '6px 10px 6px 20px', 
                                fontSize: '12px',
                                backgroundColor: '#000000',
                                border: '1px solid var(--border-color)',
                                borderRadius: '2px',
                                color: '#ffffff'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label htmlFor={`${toolKey}-seats`} style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Seats:</label>
                          <input 
                            id={`${toolKey}-seats`}
                            type="number" 
                            min="1"
                            max="500"
                            value={userVal.seats}
                            onChange={(e) => handleToolNumericChange(toolKey, 'seats', Number(e.target.value))}
                            style={{ 
                              width: '64px', 
                              padding: '6px 10px', 
                              fontSize: '12px',
                              backgroundColor: '#000000',
                              border: '1px solid var(--border-color)',
                              borderRadius: '2px',
                              color: '#ffffff'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <button 
        type="button"
        onClick={onSubmit}
        className="btn btn-primary"
        style={{ 
          width: '100%', 
          padding: '16px 24px', 
          fontSize: '15px', 
          borderRadius: '9999px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: '800'
        }}
      >
        <Sparkles size={16} /> Run Cost Savings calculations
      </button>

    </div>
  );
}
