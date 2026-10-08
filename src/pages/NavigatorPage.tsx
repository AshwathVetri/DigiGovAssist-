import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { aiService } from '../services/ai';
import { governmentService } from '../services/government';
import { AIIntent, GovernmentService } from '../types';
import { ServiceRecommendationCard } from '../components/ai/ServiceRecommendationCard';
import { ConsentModal } from '../components/consent/ConsentModal';
import { RetrievalStepperModal } from '../components/digipro/RetrievalStepperModal';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import {
  Search,
  Mic,
  MicOff,
  Send,
  Loader2,
  CheckCircle2,
  Building2,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Info,
  Car,
  FileText,
  Award,
  ArrowRight,
} from 'lucide-react';

export const NavigatorPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeCitizen, activeProfile, recordConsent } = useApp();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [currentIntent, setCurrentIntent] = useState<AIIntent | null>(null);
  const [matchedServices, setMatchedServices] = useState<GovernmentService[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Workflow modals
  const [selectedServiceForConsent, setSelectedServiceForConsent] = useState<GovernmentService | null>(null);
  const [isConsentOpen, setIsConsentOpen] = useState<boolean>(false);
  const [isRetrievalOpen, setIsRetrievalOpen] = useState<boolean>(false);
  const [activeApplyingService, setActiveApplyingService] = useState<GovernmentService | null>(null);

  const popularPills = [
    { label: 'Driving Licence', text: 'I want to apply for a driving licence.' },
    { label: 'Vehicle Services', text: 'I bought a second-hand bike.' },
    { label: 'Certificates', text: 'I need an income certificate for college admission.' },
    { label: 'Business Registration', text: 'I want to start a small shop.' },
  ];

  const runAnalysis = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAnalyzing(true);
    setCurrentIntent(null);
    setMatchedServices([]);

    try {
      const intent = await aiService.analyzeSituation(queryText);
      setCurrentIntent(intent);

      const all = await governmentService.getAllServices();
      const matched = all.filter((s) => intent.recommendedServiceIds.includes(s.id));

      // Ensure the order matches recommendedServiceIds
      const orderedMatched = intent.recommendedServiceIds
        .map((id) => matched.find((s) => s.id === id))
        .filter(Boolean) as GovernmentService[];

      setMatchedServices(orderedMatched);
    } catch (err) {
      console.error('Analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInputPrompt(q);
      runAnalysis(q);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPrompt.trim()) {
      setSearchParams({ q: inputPrompt.trim() });
      runAnalysis(inputPrompt.trim());
    }
  };

  const handleSelectPill = (prompt: string) => {
    setInputPrompt(prompt);
    setSearchParams({ q: prompt });
    runAnalysis(prompt);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const sample = 'I bought a second-hand bike.';
      setInputPrompt(sample);
      setSearchParams({ q: sample });
      runAnalysis(sample);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      setIsListening(true);

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
        setSearchParams({ q: transcript });
        runAnalysis(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        const sample = 'I bought a second-hand bike.';
        setInputPrompt(sample);
        setSearchParams({ q: sample });
        runAnalysis(sample);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleStartService = (service: GovernmentService) => {
    setSelectedServiceForConsent(service);
    setIsConsentOpen(true);
  };

  const handleConsentAllowed = async () => {
    if (!selectedServiceForConsent) return;
    setIsConsentOpen(false);

    await recordConsent({
      userId: activeCitizen.id,
      serviceId: selectedServiceForConsent.id,
      serviceName: selectedServiceForConsent.name,
      grantedAt: new Date().toLocaleString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'Granted',
      accessedData: selectedServiceForConsent.required_fields,
      purpose: `Automatic preparation of ${selectedServiceForConsent.name} via DigiGovAssist.`,
    });

    setActiveApplyingService(selectedServiceForConsent);
    setIsRetrievalOpen(true);
  };

  const handleRetrievalFinished = () => {
    setIsRetrievalOpen(false);
    if (activeApplyingService) {
      navigate(`/apply/${activeApplyingService.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">Service Search Assistant</span>
      </nav>

      {/* 2. Official Header Section */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <GovEmblem size="sm" showSealBorder={false} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
                  Citizen Service Search Assistant
                </h1>
                <span className="text-[10px] font-bold bg-[#f0f5fa] text-[#0f4477] border border-[#c2d8ec] px-1.5 py-0.5 rounded uppercase">
                  AI Navigator
                </span>
              </div>
              <p className="text-xs text-[#475569] mt-0.5 font-medium">
                "Tell us what happened. We'll identify the government services you may need."
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#64748b]">Citizen:</span>
            <span className="text-xs font-bold text-[#0a2558] bg-[#f8fafc] px-2.5 py-1 rounded border border-[#cbd5e1]">
              {activeCitizen.name}
            </span>
          </div>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center rounded-xl border-2 border-[#0f4477] bg-white shadow-2xs focus-within:border-[#0a2558]">
            <Search className="w-5 h-5 text-[#64748b] ml-4 shrink-0" />
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="What do you need help with? (e.g. I bought a second-hand bike. What should I do?)"
              className="w-full text-xs sm:text-sm px-3.5 py-3.5 bg-transparent border-0 focus:outline-none text-[#0f172a] placeholder:text-[#94a3b8] font-medium"
            />

            {/* Microphone button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 mr-1 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-100 text-rose-600 animate-pulse'
                  : 'text-[#64748b] hover:text-[#0f4477]'
              }`}
              title="Voice Search"
              aria-label="Voice Input"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing || !inputPrompt.trim()}
              className="mr-1.5 px-5 py-2.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] disabled:opacity-60 text-white text-xs sm:text-sm font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Identifying...</span>
                </>
              ) : (
                <>
                  <span>Find Services</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Popular Services Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[#64748b] font-semibold text-[11px] uppercase tracking-wide">
              Popular services:
            </span>
            {popularPills.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPill(p.text)}
                className="px-2.5 py-1 rounded-lg bg-[#f8fafc] hover:bg-[#f0f5fa] hover:text-[#0f4477] text-[#1e293b] font-semibold border border-[#cbd5e1] transition-colors cursor-pointer"
              >
                [{p.label}]
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 3. Loading State Indicator */}
      {isAnalyzing && (
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-10 text-center space-y-3 shadow-2xs">
          <div className="w-10 h-10 rounded-full bg-[#f0f5fa] text-[#0f4477] mx-auto flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#0f4477]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0a2558]">
              Analyzing your request across government service registers...
            </h3>
            <p className="text-xs text-[#64748b] mt-1">
              Mapping requirements with DigiPro citizen credentials
            </p>
          </div>
        </div>
      )}

      {/* 4. Structured Government Service Results (NOT CHATGPT LOOK) */}
      {!isAnalyzing && currentIntent && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Step Indicator */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#64748b] border-b border-[#f1f5f9] pb-3 mb-3">
              <span className="text-[#0a2558] font-bold">Government Service Workflow:</span>
              <span className="text-[11px] text-[#046a38]">Step 2 of 5: Service Selection</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#065f46] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38]" />
                <span>1. Situation Input</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0f4477] text-white font-bold flex items-center gap-1.5 shadow-2xs">
                <span className="w-4 h-4 rounded-full bg-white text-[#0f4477] text-[10px] flex items-center justify-center font-bold">2</span>
                <span>2. Service Match</span>
              </div>
              <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#e2e8f0] text-[#64748b] text-[10px] flex items-center justify-center font-bold">3</span>
                <span>3. Citizen Consent</span>
              </div>
              <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#e2e8f0] text-[#64748b] text-[10px] flex items-center justify-center font-bold">4</span>
                <span>4. Submission</span>
              </div>
            </div>
          </div>

          {/* Results Header Notice */}
          <div className="bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-[#0f4477] uppercase tracking-wider">
                Official Recommendation
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0a2558] mt-0.5">
                Based on your request, you may need the following services.
              </h2>
              <p className="text-xs text-[#334155] mt-1 leading-relaxed">
                {currentIntent.explanation}
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentIntent(null);
                setInputPrompt('');
                setSearchParams({});
              }}
              className="text-xs text-[#0f4477] hover:text-[#0a2558] font-bold flex items-center gap-1 self-start sm:self-auto shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Search</span>
            </button>
          </div>

          {/* Structured Government Service Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0a2558]">
                Recommended Services ({matchedServices.length})
              </h3>
              <span className="text-xs text-[#64748b]">
                Verified with DigiPro Profile
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {matchedServices.map((service, idx) => (
                <ServiceRecommendationCard
                  key={service.id}
                  service={service}
                  profile={activeProfile}
                  onStartService={handleStartService}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Initial State: Category Guidance (Not Chat Bubbles) */}
      {!isAnalyzing && !currentIntent && (
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-base font-bold text-[#0a2558]">
              Browse Services by Life Situation
            </h2>
            <p className="text-xs text-[#64748b]">
              Select a situation to automatically identify required central and state services.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => handleSelectPill('I bought a second-hand bike.')}
              className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] bg-[#f8fafc] hover:bg-white text-left transition-all group space-y-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#e1ecf6] text-[#0f4477] flex items-center justify-center font-bold">
                <Car className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#0f172a] group-hover:text-[#0f4477]">
                Used Vehicle Purchase
              </div>
              <div className="text-[11px] text-[#64748b] leading-tight">
                Ownership transfer, RC status, insurance and PUC checks.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPill('I want to apply for a driving licence.')}
              className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] bg-[#f8fafc] hover:bg-white text-left transition-all group space-y-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ffedd5] text-[#c2410c] flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#0f172a] group-hover:text-[#0f4477]">
                Driving Licence
              </div>
              <div className="text-[11px] text-[#64748b] leading-tight">
                Contactless Learner Licence and permanent DL testing.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPill('I need an income certificate for college admission.')}
              className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] bg-[#f8fafc] hover:bg-white text-left transition-all group space-y-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#046a38] flex items-center justify-center font-bold">
                <FileText className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#0f172a] group-hover:text-[#0f4477]">
                Education & Certificates
              </div>
              <div className="text-[11px] text-[#64748b] leading-tight">
                Annual income proof, residence and domicile certificates.
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPill('I want to start a small shop.')}
              className="p-4 rounded-xl border border-[#cbd5e1] hover:border-[#0f4477] bg-[#f8fafc] hover:bg-white text-left transition-all group space-y-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#dbeafe] text-[#1e3a8a] flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-[#0f172a] group-hover:text-[#0f4477]">
                Commercial & MSME
              </div>
              <div className="text-[11px] text-[#64748b] leading-tight">
                Instant free Udyam registration and priority bank loans.
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Consent Modal Dialog */}
      <ConsentModal
        isOpen={isConsentOpen}
        service={selectedServiceForConsent}
        onAllow={handleConsentAllowed}
        onCancel={() => setIsConsentOpen(false)}
      />

      {/* Stepper Modal */}
      {activeApplyingService && (
        <RetrievalStepperModal
          isOpen={isRetrievalOpen}
          service={activeApplyingService}
          onFinished={handleRetrievalFinished}
        />
      )}
    </div>
  );
};
