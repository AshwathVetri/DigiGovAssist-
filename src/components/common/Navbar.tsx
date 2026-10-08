import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { GovEmblem } from './GovEmblem';
import {
  Compass,
  FileCheck2,
  FolderLock,
  Layers,
  History,
  UserCheck,
  Menu,
  X,
  HelpCircle,
  Volume2,
  ChevronDown,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeCitizen, allCitizens, setActiveCitizenId, applications } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'ta' | 'hi'>('en');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const navigate = useNavigate();

  // Apply font size class to html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  // Apply high contrast mode class
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const navLinks = [
    { to: '/', label: currentLang === 'ta' ? 'முகப்பு' : currentLang === 'hi' ? 'मुख्य पृष्ठ' : 'Home' },
    {
      to: '/navigator',
      label: currentLang === 'ta' ? 'சேவை தேடல் (AI)' : currentLang === 'hi' ? 'सेवा खोज (AI)' : 'Service Search',
      badge: 'Assistant',
    },
    { to: '/services', label: currentLang === 'ta' ? 'அனைத்து சேவைகள்' : currentLang === 'hi' ? 'सभी सेवाएं' : 'Government Services' },
    { to: '/digipro', label: 'DigiPro Records' },
    {
      to: '/applications',
      label: currentLang === 'ta' ? 'விண்ணப்பங்கள்' : currentLang === 'hi' ? 'आवेदन' : 'My Applications',
      count: applications.length,
    },
    { to: '/consent-history', label: 'Consent Audit' },
  ];

  const handleScreenReaderAnnounce = () => {
    const msg = `DigiGovAssist: AI-Powered Citizen Service Assistant. Currently showing citizen portal for ${activeCitizen.name}.`;
    const speech = new SpeechSynthesisUtterance(msg);
    window.speechSynthesis?.speak(speech);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#cbd5e1] shadow-2xs font-sans">
      {/* 1. Thin Tricolor Official Ribbon */}
      <div className="tricolor-stripe w-full" aria-hidden="true" />

      {/* 2. Government-Style Utility Top Bar */}
      <div className="bg-[#0a2558] text-white text-[11px] py-1 px-4 border-b border-[#082046]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Indian Portal Utility Links */}
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-wide text-amber-300 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              Citizen Digital Services
            </span>
            <span className="text-[#94a3b8] hidden sm:inline">|</span>
            <span className="text-slate-200 hidden md:inline">
              National e-Governance Assistance Portal
            </span>
            <span className="text-[#94a3b8] hidden lg:inline">|</span>
            <span className="text-amber-200/90 hidden lg:inline font-mono text-[10px]">
              Toll-Free: 1800-111-999
            </span>
          </div>

          {/* Right: Accessibility & Language Controls */}
          <div className="flex items-center gap-3 text-[11px]">
            {/* Screen Reader Voice */}
            <button
              onClick={handleScreenReaderAnnounce}
              className="text-slate-200 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
              title="Click for Screen Reader Speech"
              aria-label="Screen Reader Access"
            >
              <Volume2 className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Screen Reader</span>
            </button>

            <span className="text-[#64748b]">|</span>

            {/* Accessibility Font Size Toggle (A- / A / A+) */}
            <div className="flex items-center gap-0.5 bg-[#071c42] rounded px-1 py-0.5 border border-[#1e3a6e]">
              <button
                onClick={() => setFontSize('small')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  fontSize === 'small' ? 'bg-amber-400 text-[#0a2558]' : 'text-slate-300 hover:text-white'
                }`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  fontSize === 'normal' ? 'bg-amber-400 text-[#0a2558]' : 'text-slate-300 hover:text-white'
                }`}
                title="Standard Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  fontSize === 'large' ? 'bg-amber-400 text-[#0a2558]' : 'text-slate-300 hover:text-white'
                }`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                highContrast
                  ? 'bg-amber-300 text-slate-900 border-amber-400 font-bold'
                  : 'bg-transparent text-slate-300 border-[#1e3a6e] hover:text-white'
              }`}
              title="Toggle High Contrast"
            >
              Contrast
            </button>

            <span className="text-[#64748b]">|</span>

            {/* Language Selector: English | தமிழ் | हिन्दी */}
            <div className="flex items-center gap-1 font-medium">
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-1 py-0.5 rounded transition-colors ${
                  currentLang === 'en' ? 'font-bold text-amber-300 underline' : 'text-slate-300 hover:text-white'
                }`}
              >
                English
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={() => setCurrentLang('ta')}
                className={`px-1 py-0.5 rounded transition-colors ${
                  currentLang === 'ta' ? 'font-bold text-amber-300 underline' : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
              <span className="text-slate-500">|</span>
              <button
                onClick={() => setCurrentLang('hi')}
                className={`px-1 py-0.5 rounded transition-colors ${
                  currentLang === 'hi' ? 'font-bold text-amber-300 underline' : 'text-slate-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <span className="text-[#64748b]">|</span>

            {/* Help */}
            <button
              onClick={() => setHelpOpen(true)}
              className="text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-amber-300" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Primary Government Header */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Left: Indian-Government-Inspired Emblem & Portal Identity */}
            <Link to="/" className="flex items-center gap-3.5 group">
              <GovEmblem size="md" />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight leading-none">
                    DigiGov<span className="text-[#0d47a1]">Assist</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#f0f5fa] text-[#0f4477] border border-[#c2d8ec] px-1.5 py-0.5 rounded">
                    Citizen Portal
                  </span>
                </div>
                <span className="text-xs sm:text-[13px] font-semibold text-[#1e3a5f] mt-0.5 tracking-normal">
                  "AI-Powered Citizen Service Assistant"
                </span>
                <span className="text-[10px] text-[#64748b] leading-tight mt-0.5">
                  Independent Prototype • Inspired by Digital India & e-Governance
                </span>
              </div>
            </Link>

            {/* Right: Citizen Login / Verified Profile Switcher */}
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#cbd5e1] hover:border-[#0f4477] bg-[#f8fafc] hover:bg-white transition-all shadow-2xs text-left"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a2558] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {activeCitizen.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] leading-tight">
                      {activeCitizen.name}
                    </div>
                    <div className="text-[10px] text-[#046a38] font-semibold flex items-center gap-1 leading-tight">
                      <UserCheck className="w-2.5 h-2.5" />
                      <span>DigiPro Verified Citizen</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748b] ml-1" />
                </button>

                {/* Citizen Selector Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl border border-[#cbd5e1] shadow-xl z-50 py-2 animate-in fade-in duration-150">
                    <div className="px-3 py-2 border-b border-[#f1f5f9] bg-[#f8fafc]">
                      <div className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider">
                        Active Citizen Profile (Demo Switcher)
                      </div>
                      <div className="text-xs font-bold text-[#0a2558] mt-0.5">
                        {activeCitizen.name}
                      </div>
                      <div className="text-[11px] text-[#475569]">
                        {activeCitizen.address.city}, {activeCitizen.address.state}
                      </div>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <div className="px-2 py-1 text-[10px] font-bold text-[#94a3b8] uppercase">
                        Switch Demo Citizen:
                      </div>
                      {allCitizens.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveCitizenId(c.id);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            c.id === activeCitizen.id
                              ? 'bg-[#e1ecf6] text-[#0a2558] font-bold'
                              : 'text-[#334155] hover:bg-[#f1f5f9]'
                          }`}
                        >
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-[10px] text-[#64748b]">
                              {c.address.city} • {c.occupation || 'Resident'}
                            </div>
                          </div>
                          {c.id === activeCitizen.id && (
                            <span className="text-[10px] bg-[#0f4477] text-white px-1.5 py-0.5 rounded font-medium">
                              Active
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#f1f5f9] px-2 flex flex-col gap-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-center py-1.5 rounded-lg text-xs font-bold text-[#0f4477] bg-[#f0f5fa] hover:bg-[#e1ecf6] transition-colors"
                      >
                        View Full Citizen Profile
                      </Link>
                      <Link
                        to="/digipro"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-center py-1.5 rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] transition-colors"
                      >
                        Inspect DigiPro Credentials
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#0a2558] hover:bg-[#f1f5f9] border border-[#cbd5e1]"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Official Main Navigation Bar */}
      <nav className="bg-[#0f4477] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 py-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0a2558] text-white font-bold shadow-inner border-b-2 border-amber-400'
                        : 'text-slate-100 hover:bg-[#165a99] hover:text-white'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-amber-400 text-[#0a2558] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] font-bold bg-[#046a38] text-white px-1.5 py-0.2 rounded-full">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Direct Quick Search / Emergency Hotline */}
            <div className="flex items-center gap-2 text-xs">
              <Link
                to="/navigator?q=I+bought+a+second-hand+bike."
                className="text-[11px] font-semibold text-amber-300 hover:text-white bg-[#0a2558]/60 px-2.5 py-1 rounded border border-[#1e4a7a] flex items-center gap-1"
                title="Run Bike Ownership Demo"
              >
                <span>⚡ Test: Used Bike Purchase</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#cbd5e1] p-4 space-y-3 shadow-lg">
          <div className="p-3 bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0a2558] text-white flex items-center justify-center font-bold text-xs">
                {activeCitizen.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-[#0a2558]">{activeCitizen.name}</div>
                <div className="text-[10px] text-[#046a38] font-semibold">DigiPro Verified Citizen</div>
              </div>
            </div>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-[#0f4477] underline"
            >
              Profile
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    isActive
                      ? 'bg-[#0f4477] text-white'
                      : 'text-[#1e293b] hover:bg-[#f1f5f9]'
                  }`
                }
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-xs font-bold bg-[#046a38] text-white px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-xs text-[#64748b]">
            <span>Language: English | தமிழ் | हिन्दी</span>
            <button
              onClick={() => {
                setHelpOpen(true);
                setMobileMenuOpen(false);
              }}
              className="font-bold text-[#0f4477]"
            >
              Help & FAQ
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-[#cbd5e1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <GovEmblem size="sm" showSealBorder={false} />
                <h3 className="text-base font-bold text-[#0a2558]">
                  DigiGovAssist Citizen Help & Guidance
                </h3>
              </div>
              <button
                onClick={() => setHelpOpen(false)}
                className="p-1 rounded text-[#64748b] hover:text-[#0f172a]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#334155] leading-relaxed">
              <p>
                <strong>What is DigiGovAssist?</strong>
                <br />
                DigiGovAssist is an AI-powered citizen service assistant designed to help ordinary
                citizens identify the government services they need based on their life situation,
                without navigating complex departmental structures.
              </p>

              <div className="p-3 bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] space-y-1">
                <div className="font-bold text-[#0a2558]">Core Operating Principles:</div>
                <ul className="list-disc pl-4 space-y-1 text-[#1e3a5f]">
                  <li>
                    <strong>"Don't ask what is already known":</strong> Auto-fills verified data via DigiPro.
                  </li>
                  <li>
                    <strong>Explicit Consent:</strong> No citizen data is retrieved without prior permission.
                  </li>
                  <li>
                    <strong>Readiness Pre-check:</strong> Validates 100% eligibility before submission.
                  </li>
                </ul>
              </div>

              <p className="text-[11px] text-[#64748b]">
                <strong>Important Notice:</strong> This portal is a working prototype created for
                demonstration and hackathon evaluation. It is not an official Government of India website.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setHelpOpen(false)}
                className="px-4 py-2 bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
