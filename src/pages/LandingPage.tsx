import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../src/context/AppContext';
import { GovEmblem } from '../../src/components/common/GovEmblem';
import { StatusBadge } from '../../src/components/common/StatusBadge';
import { PrototypeBadge } from '../../src/components/common/PrototypeBadge';
import { ReadinessBar } from '../../src/components/common/ReadinessBar';
import {
  Search,
  Mic,
  MicOff,
  Car,
  FileText,
  Building2,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  UserCheck,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { activeCitizen, activeProfile, applications } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/navigator?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVoiceInput = () => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback message with sample prompt fill
      const sample = 'I bought a second-hand bike. What should I do?';
      setSearchQuery(sample);
      setVoiceNotice('Voice recognition simulated. Prompt filled: "I bought a second-hand bike."');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceNotice('Listening... Speak your situation (e.g. "I bought a second hand bike")');

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        setVoiceNotice(`Recognized: "${transcript}"`);
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSearchQuery('I bought a second-hand bike. What should I do?');
        setVoiceNotice('Voice input filled sample: "I bought a second-hand bike."');
        setTimeout(() => setVoiceNotice(null), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setSearchQuery('I bought a second-hand bike. What should I do?');
    }
  };

  const popularServices = [
    {
      label: 'Driving Licence',
      query: 'I want to apply for a driving licence.',
      dept: 'Transport Dept',
    },
    {
      label: 'Vehicle Services',
      query: 'I bought a second-hand bike. What should I do?',
      dept: 'Parivahan',
    },
    {
      label: 'Certificates',
      query: 'I need an income certificate for college admission.',
      dept: 'Revenue Dept',
    },
    {
      label: 'Business Registration',
      query: 'I want to start a small shop.',
      dept: 'MSME Udyam',
    },
  ];

  const recentServices = [
    {
      id: 'vehicle_ownership_transfer',
      name: 'Vehicle Ownership Transfer',
      dept: 'Transport Department (Parivahan)',
      desc: 'Transfer registration certificate (RC) legally from seller to buyer.',
      fee: '₹ 530',
      time: '7 - 10 working days',
    },
    {
      id: 'driving_license',
      name: 'Permanent Driving Licence (DL)',
      dept: 'State Transport Department / Sarathi',
      desc: 'Book slot and issue permanent biometric driving licence card.',
      fee: '₹ 700',
      time: '15 working days',
    },
    {
      id: 'income_certificate',
      name: 'Annual Income Certificate',
      dept: 'Revenue Administration / e-District',
      desc: 'Certified gross income certificate for higher education & scholarships.',
      fee: '₹ 60',
      time: '7 - 15 working days',
    },
    {
      id: 'business_registration',
      name: 'Udyam Small Business MSME Registration',
      dept: 'Ministry of MSME',
      desc: 'Paperless online enterprise recognition with zero government fee.',
      fee: 'Free',
      time: 'Instant Digital',
    },
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* 1. Official Government Alert / News Ticker */}
      <div className="bg-[#fffbeb] border-b border-[#fef3c7] text-[#92400e] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="bg-[#f59e0b] text-[#0a2558] font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
              Citizen Notice
            </span>
            <span className="truncate text-[12px] font-medium text-[#78350f]">
              DigiGovAssist is an AI-powered citizen service assistant. Tell us what happened in plain
              words — we identify required government services and auto-fill verified data with your
              explicit permission.
            </span>
          </div>
          <span className="text-[11px] font-mono shrink-0 hidden md:inline text-[#b45309]">
            Helpdesk: 1800-111-999
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 2. Official Government Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b] pt-1">
          <span className="text-[#0a2558] font-bold">Home</span>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#475569]">Citizen Services Portal</span>
        </nav>

        {/* 3. Hero / Service Section */}
        <section className="bg-white rounded-2xl border border-[#cbd5e1] p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f5fa] border border-[#c2d8ec] text-[#0f4477] text-xs font-bold">
              <GovEmblem size="sm" showSealBorder={false} />
              <span>National Citizen Service Assistant</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded font-mono">
                Prototype v1.0
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a2558] tracking-tight">
              How can we help you today?
            </h1>

            <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-2xl mx-auto font-normal">
              Tell us what happened. We'll identify the government services you may need.
            </p>

            {/* Large Central AI Input */}
            <form onSubmit={handleSearchSubmit} className="pt-3 relative max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-xs rounded-xl border-2 border-[#0f4477] bg-white focus-within:border-[#0a2558] focus-within:ring-2 focus-within:ring-[#0f4477]/20 transition-all">
                <Search className="w-5 h-5 text-[#64748b] ml-4 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What do you need help with? (e.g. I bought a second-hand bike. What should I do?)"
                  className="w-full text-xs sm:text-sm px-3.5 py-3.5 bg-transparent border-0 focus:outline-none text-[#0f172a] placeholder:text-[#94a3b8] font-medium"
                />

                {/* Microphone Icon Button */}
                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`p-2 mr-1 rounded-lg transition-colors cursor-pointer ${
                    isListening
                      ? 'bg-rose-100 text-rose-600 animate-pulse'
                      : 'text-[#64748b] hover:text-[#0f4477] hover:bg-[#f0f5fa]'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice Assistant (Click to speak)'}
                  aria-label="Voice Input"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Find Services Button */}
                <button
                  type="submit"
                  className="mr-1.5 px-5 py-2.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs sm:text-sm font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Find Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Voice / Feedback message */}
              {voiceNotice && (
                <div className="mt-2 text-xs font-semibold text-[#0f4477] bg-[#f0f5fa] border border-[#c2d8ec] py-1.5 px-3 rounded-lg text-left animate-in fade-in duration-150">
                  {voiceNotice}
                </div>
              )}
            </form>

            {/* Popular Services Quick Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-[#64748b] font-semibold text-[11px] uppercase tracking-wider mr-1">
                Popular Services:
              </span>
              {popularServices.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(`/navigator?q=${encodeURIComponent(item.query)}`)}
                  className="px-3 py-1.5 rounded-lg bg-[#f8fafc] hover:bg-[#f0f5fa] hover:text-[#0f4477] text-[#1e293b] font-semibold border border-[#cbd5e1] hover:border-[#0f4477] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>[{item.label}]</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Official Citizen Service Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column: My Services & Active Applications */}
          <div className="lg:col-span-8 space-y-8">
            {/* SECTION: My Services */}
            <section className="bg-white rounded-2xl border border-[#cbd5e1] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0f4477] text-white flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0a2558]">My Services</h2>
                    <p className="text-[11px] text-[#64748b]">
                      Categorized central and state government service desks
                    </p>
                  </div>
                </div>
                <Link
                  to="/services"
                  className="text-xs font-bold text-[#0f4477] hover:underline flex items-center gap-1"
                >
                  <span>View All 10 Services</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Link
                  to="/navigator?q=I+bought+a+second-hand+bike."
                  className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] hover:bg-[#f8fafc] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4477] bg-[#f0f5fa] px-2 py-0.5 rounded border border-[#c2d8ec]">
                        MoRTH / Parivahan
                      </span>
                      <Car className="w-4 h-4 text-[#0f4477]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#0f4477]">
                      Transport & Motor Vehicles
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Vehicle Ownership Transfer, RC Status, Insurance verification, PUC checks.
                    </p>
                  </div>
                  <div className="pt-3 text-[11px] font-bold text-[#0f4477] flex items-center gap-1">
                    <span>Access Transport Services</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  to="/navigator?q=I+need+an+income+certificate."
                  className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] hover:bg-[#f8fafc] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#046a38] bg-[#f0fdf4] px-2 py-0.5 rounded border border-[#bbf7d0]">
                        Revenue Dept / e-District
                      </span>
                      <FileText className="w-4 h-4 text-[#046a38]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#0f4477]">
                      Revenue & Certificates
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Annual Income Certificate, Domicile / Residence Proof, Community Certificates.
                    </p>
                  </div>
                  <div className="pt-3 text-[11px] font-bold text-[#0f4477] flex items-center gap-1">
                    <span>Access Certificate Services</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  to="/navigator?q=I+want+to+apply+for+a+driving+licence."
                  className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] hover:bg-[#f8fafc] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c2d12] bg-[#ffedd5] px-2 py-0.5 rounded border border-[#fed7aa]">
                        Sarathi Portal
                      </span>
                      <Award className="w-4 h-4 text-[#c2410c]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#0f4477]">
                      Driving Licence Services
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Learner's Licence (LLR) online theory test & permanent DL card slot booking.
                    </p>
                  </div>
                  <div className="pt-3 text-[11px] font-bold text-[#0f4477] flex items-center gap-1">
                    <span>Access Licence Services</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                <Link
                  to="/navigator?q=I+want+to+start+a+small+shop."
                  className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] hover:bg-[#f8fafc] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a8a] bg-[#dbeafe] px-2 py-0.5 rounded border border-[#bfdbfe]">
                        Ministry of MSME
                      </span>
                      <Building2 className="w-4 h-4 text-[#1e3a8a]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-[#0f4477]">
                      Business & MSME
                    </h3>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      Zero fee paperless Udyam Registration, subsidies, and priority bank loans.
                    </p>
                  </div>
                  <div className="pt-3 text-[11px] font-bold text-[#0f4477] flex items-center gap-1">
                    <span>Access MSME Registration</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>

            {/* SECTION: Active Applications */}
            <section className="bg-white rounded-2xl border border-[#cbd5e1] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#046a38] text-white flex items-center justify-center font-bold text-xs">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0a2558]">Active Applications</h2>
                    <p className="text-[11px] text-[#64748b]">
                      Track submissions currently processed by official authorities
                    </p>
                  </div>
                </div>
                <Link
                  to="/applications"
                  className="text-xs font-bold text-[#0f4477] hover:underline flex items-center gap-1"
                >
                  <span>All ({applications.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="p-8 text-center bg-[#f8fafc] rounded-xl border border-[#e2e8f0] text-xs text-[#64748b] space-y-2">
                  <p>No active applications submitted yet.</p>
                  <button
                    onClick={() => navigate('/navigator?q=I+bought+a+second-hand+bike.')}
                    className="px-4 py-2 bg-[#0f4477] text-white rounded-lg font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Launch Test Application (Used Bike)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 2).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-[#cbd5e1] bg-white hover:bg-[#f8fafc] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#0a2558] bg-[#f0f5fa] px-2 py-0.5 rounded border border-[#c2d8ec]">
                            {app.id}
                          </span>
                          <StatusBadge status={app.status} />
                          <PrototypeBadge label="Tracking Gateway" size="sm" />
                        </div>
                        <h4 className="text-sm font-bold text-[#0f172a]">{app.serviceName}</h4>
                        <div className="text-[11px] text-[#64748b] flex items-center gap-2">
                          <span>{app.department}</span>
                          <span>•</span>
                          <span>Filed: {app.submittedAt || app.updatedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <ReadinessBar percentage={app.readinessScore} compact />
                        <Link
                          to={`/applications/${app.id}`}
                          className="px-3 py-1.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs font-bold transition-colors shrink-0"
                        >
                          Track Status
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION: Recommended Services */}
            <section className="bg-white rounded-2xl border border-[#cbd5e1] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <h2 className="text-base font-bold text-[#0a2558]">Recommended Citizen Services</h2>
                </div>
                <span className="text-[11px] text-[#64748b]">Based on Citizen Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {recentServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 rounded-xl border border-[#cbd5e1] bg-[#fafbfc] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4477]">
                        {srv.dept}
                      </span>
                      <h4 className="text-sm font-bold text-[#0f172a] mt-0.5">{srv.name}</h4>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">{srv.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-xs">
                      <div className="text-[11px] text-[#64748b]">
                        Fee: <strong className="text-[#0f172a]">{srv.fee}</strong>
                      </div>
                      <Link
                        to={`/services/${srv.id}`}
                        className="px-3 py-1 bg-white hover:bg-[#f0f5fa] text-[#0f4477] font-bold rounded-lg border border-[#cbd5e1] transition-colors"
                      >
                        Check Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: DigiPro Information Panel & Official Security */}
          <div className="lg:col-span-4 space-y-6">
            {/* DIGIPRO DESIGN: Verified Citizen Information Panel */}
            <section className="bg-white rounded-2xl border border-[#cbd5e1] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0a2558]">DigiPro</span>
                    <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                      Verified Layer
                    </span>
                  </div>
                  <div className="text-xs text-[#0f4477] font-medium mt-0.5">
                    "Verified Citizen Information"
                  </div>
                </div>
                <PrototypeBadge label="Prototype Data" size="sm" variant="amber" />
              </div>

              {/* Citizen Information Card */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  Citizen Information
                </div>

                <div className="space-y-2 text-xs bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b]">Name:</span>
                    <div className="flex items-center gap-1 font-bold text-[#0f172a]">
                      <span>{activeCitizen.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38]" />
                      <span className="text-[10px] text-[#046a38]">Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b]">Date of Birth:</span>
                    <div className="flex items-center gap-1 font-semibold text-[#0f172a]">
                      <span>{activeCitizen.dob}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38]" />
                      <span className="text-[10px] text-[#046a38]">Verified</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#64748b]">Address:</span>
                    <div className="flex items-center gap-1 font-semibold text-[#0f172a] text-right truncate max-w-[170px]">
                      <span className="truncate">{activeCitizen.address.city}, {activeCitizen.address.state}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38] shrink-0" />
                      <span className="text-[10px] text-[#046a38] shrink-0">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Documents Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                  Documents Available via DigiPro
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between">
                    <span className="font-semibold text-[#064e3b]">Aadhaar</span>
                    <span className="text-[11px] font-bold text-[#046a38] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#046a38]" />
                      Available
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between">
                    <span className="font-semibold text-[#064e3b]">Vehicle RC</span>
                    <span className="text-[11px] font-bold text-[#046a38] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#046a38]" />
                      Available
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between">
                    <span className="font-semibold text-[#064e3b]">Insurance</span>
                    <span className="text-[11px] font-bold text-[#046a38] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#046a38]" />
                      Available
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-between">
                    <span className="font-semibold text-[#064e3b]">PUC</span>
                    <span className="text-[11px] font-bold text-[#046a38] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#046a38]" />
                      Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Prototype Clarification Banner */}
              <div className="p-3 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-[11px] text-[#92400e] leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-[#b45309] shrink-0 mt-0.5" />
                <div>
                  <strong>Prototype Data:</strong> This version uses simulated mock data to demonstrate
                  automatic application preparation.
                </div>
              </div>

              <Link
                to="/digipro"
                className="w-full py-2 bg-[#f0f5fa] hover:bg-[#e1ecf6] text-[#0f4477] font-bold text-xs rounded-xl border border-[#c2d8ec] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Inspect DigiPro Repository</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </section>

            {/* Consent & Privacy Assurance Card */}
            <section className="bg-white rounded-2xl border border-[#cbd5e1] p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#046a38]" />
                <h3 className="text-xs font-bold text-[#0a2558] uppercase tracking-wide">
                  Citizen Privacy Guarantee
                </h3>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Your information is accessed only with your explicit permission. You can review,
                download, or revoke permission at any moment in the Consent Audit Log.
              </p>
              <Link
                to="/consent-history"
                className="text-xs font-bold text-[#0f4477] hover:underline flex items-center gap-1 pt-1"
              >
                <span>View Citizen Consent Log</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
