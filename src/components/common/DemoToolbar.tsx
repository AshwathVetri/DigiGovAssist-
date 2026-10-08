import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Sparkles, User, ChevronDown, Zap, ShieldAlert, Check } from 'lucide-react';

export const DemoToolbar: React.FC = () => {
  const { activeCitizen, allCitizens, setActiveCitizenId, showToast } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLoadScenario = (text: string) => {
    navigate(`/navigator?q=${encodeURIComponent(text)}`);
    showToast(`Loaded scenario: "${text}"`, 'info');
  };

  if (collapsed) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="bg-[#0a2558] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-amber-400/60 flex items-center gap-1.5 hover:bg-[#0f4477] transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Demo Controls</span>
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Demo Prototype Controls" className="bg-[#0f2444] text-slate-200 text-xs py-1.5 px-4 border-b border-[#0a1b33] relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Prototype Indicator & Citizen Switcher */}
        <div className="flex items-center gap-2.5">
          <div className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Prototype Testing Mode</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#16365f] hover:bg-[#1d4477] text-white text-[11px] font-medium border border-[#254d80] transition-colors"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span>Citizen: <strong>{activeCitizen.name}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-60 bg-[#0f2444] border border-[#254d80] rounded-lg shadow-2xl z-50 py-1 text-slate-200">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-[#254d80]">
                  Switch Citizen Persona
                </div>
                {allCitizens.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCitizenId(c.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#16365f] transition-colors ${
                      c.id === activeCitizen.id ? 'bg-[#16365f] text-white font-bold' : ''
                    }`}
                  >
                    <div>
                      <div>{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.address.city}</div>
                    </div>
                    {c.id === activeCitizen.id && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Demo Scenarios & Collapse */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">1-Click Scenarios:</span>

          <button
            onClick={() => handleLoadScenario('I bought a second-hand bike.')}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-[#0a2558] text-[11px] font-bold shadow-2xs transition-colors"
            title="Load Main Bike Purchase Scenario"
          >
            <Zap className="w-3 h-3 text-[#0a2558]" />
            <span>Used Bike (Form 29/30)</span>
          </button>

          <button
            onClick={() => handleLoadScenario('I want to apply for a driving licence.')}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-[#16365f] hover:bg-[#1d4477] text-slate-200 text-[11px] transition-colors"
          >
            <span>Driving Licence</span>
          </button>

          <button
            onClick={() => handleLoadScenario('I need an income certificate for college admission.')}
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-[#16365f] hover:bg-[#1d4477] text-slate-200 text-[11px] transition-colors"
          >
            <span>Income Certificate</span>
          </button>

          <button
            onClick={() => setCollapsed(true)}
            className="text-slate-400 hover:text-white text-[10px] underline ml-2"
            title="Minimize toolbar to floating button"
          >
            Minimize
          </button>
        </div>
      </div>
    </aside>
  );
};
