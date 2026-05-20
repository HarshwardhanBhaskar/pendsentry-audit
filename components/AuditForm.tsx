'use client';

import React from 'react';
import { 
  Users, 
  Terminal, 
  Settings, 
  Code, 
  FileText, 
  Database, 
  Search, 
  HelpCircle, 
  Layers,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';
import { PRICING_DATABASE, ToolName, PrimaryUseCase } from '../lib/pricingData';
import { UserToolInput, AuditInput } from '../lib/auditEngine';

interface AuditFormProps {
  formData: AuditInput;
  setFormData: React.Dispatch<React.SetStateAction<AuditInput>>;
  onSubmit: () => void;
}

export default function AuditForm({ formData, setFormData, onSubmit }: AuditFormProps) {
  const handleGeneralChange = (field: 'teamSize' | 'primaryUseCase', value: any) => {
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
      case 'coding': return <Code size={18} />;
      case 'writing': return <FileText size={18} />;
      case 'data': return <Database size={18} />;
      case 'research': return <Search size={18} />;
      case 'mixed': return <Layers size={18} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Step 1: General Organization Info */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa' }}>
          <Sparkles size={20} /> 1. Team & Core Workload
        </h3>
        
        <div className="grid-2">
          {/* Team Size Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label htmlFor="team-size-input" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} /> Team Members Using AI
              </label>
              <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#60a5fa' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>1</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100+</span>
            </div>
          </div>

          {/* Primary Use Case Select */}
          <div>
            <label htmlFor="usecase-select" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Terminal size={16} /> Primary AI Use Case
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="usecase-select"
                value={formData.primaryUseCase}
                onChange={(e) => handleGeneralChange('primaryUseCase', e.target.value as PrimaryUseCase)}
                style={{ width: '100%', appearance: 'none', paddingLeft: '40px' }}
              >
                <option value="coding">Software Engineering (Coding, Debugging, Scripting)</option>
                <option value="writing">Content Writing (Marketing, Docs, Emails)</option>
                <option value="data">Data Analysis (Analytics, Forecasting, Python)</option>
                <option value="research">Academic Research & Intelligence Gathering</option>
                <option value="mixed">General Mixed Purpose Productivity</option>
              </select>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#60a5fa' }}>
                {getUseCaseIcon(formData.primaryUseCase)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Tools Breakdown selection */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#34d399' }}>
          <Zap size={20} /> 2. AI Subscriptions
        </h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Toggle on the tools your team currently pays for and specify their active plan and seat count.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(Object.keys(PRICING_DATABASE) as ToolName[]).map((toolKey) => {
            const toolPricing = PRICING_DATABASE[toolKey];
            const isApi = toolKey.endsWith('_api');
            const userVal = formData.tools[toolKey] || { enabled: false, plan: '', seats: 0 };

            return (
              <div 
                key={toolKey} 
                className="glass-card"
                style={{ 
                  padding: '16px',
                  borderLeft: userVal.enabled ? `4px solid ${isApi ? '#f59e0b' : '#3b82f6'}` : '1px solid var(--border-glass)',
                  background: userVal.enabled ? 'rgba(20, 22, 38, 0.7)' : 'rgba(20, 22, 38, 0.2)',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  
                  {/* Tool Header & Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <label className="switch" style={{ margin: 0 }} aria-label={`Enable ${toolPricing.displayName}`}>
                      <input 
                        type="checkbox" 
                        checked={userVal.enabled}
                        onChange={(e) => handleToolToggle(toolKey, e.target.checked)}
                      />
                      <span className="slider"></span>
                    </label>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', color: userVal.enabled ? '#ffffff' : 'var(--text-secondary)' }}>
                        {toolPricing.displayName}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {isApi ? 'Usage-Based API' : 'Seat-based subscriptions'}
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
                            style={{ padding: '6px 12px', fontSize: '13px' }}
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
                          <label htmlFor={`${toolKey}-spend`} style={{ margin: 0, fontSize: '13px' }}>Monthly Spend:</label>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: '#60a5fa' }}>$</span>
                            <input 
                              id={`${toolKey}-spend`}
                              type="number" 
                              min="0"
                              value={userVal.customSpend || 0}
                              onChange={(e) => handleToolNumericChange(toolKey, 'customSpend', Number(e.target.value))}
                              style={{ width: '100px', padding: '6px 10px 6px 20px', fontSize: '13px' }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <label htmlFor={`${toolKey}-seats`} style={{ margin: 0, fontSize: '13px' }}>Seats:</label>
                          <input 
                            id={`${toolKey}-seats`}
                            type="number" 
                            min="1"
                            max="500"
                            value={userVal.seats}
                            onChange={(e) => handleToolNumericChange(toolKey, 'seats', Number(e.target.value))}
                            style={{ width: '70px', padding: '6px 10px', fontSize: '13px' }}
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
        style={{ width: '100%', padding: '14px 20px', fontSize: '16px', borderRadius: '10px' }}
      >
        <Sparkles size={18} /> Calculate AI Cost Savings
      </button>
    </div>
  );
}
