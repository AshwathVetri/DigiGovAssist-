import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { governmentService } from '../services/government';
import { GovernmentService } from '../types';
import { ServiceRequirementEngine } from '../services/government/requirementEngine';
import { ReadinessBar } from '../components/common/ReadinessBar';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { ConsentModal } from '../components/consent/ConsentModal';
import { RetrievalStepperModal } from '../components/digipro/RetrievalStepperModal';
import {
  Building2,
  Clock,
  Coins,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Loader2,
  ShieldCheck,
  FileCheck2,
  ListOrdered,
  ChevronRight,
  FileText,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeCitizen, activeProfile, recordConsent } = useApp();

  const [service, setService] = useState<GovernmentService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isRetrievalOpen, setIsRetrievalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await governmentService.getServiceById(id);
        setService(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStartFlow = () => {
    setIsConsentOpen(true);
  };

  const handleConsentAllowed = async () => {
    if (!service) return;
    setIsConsentOpen(false);

    await recordConsent({
      userId: activeCitizen.id,
      serviceId: service.id,
      serviceName: service.name,
      grantedAt: new Date().toLocaleString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: 'Granted',
      accessedData: service.required_fields,
      purpose: `Automatic preparation of ${service.name} application via DigiGovAssist.`,
    });

    setIsRetrievalOpen(true);
  };

  const handleRetrievalFinished = () => {
    setIsRetrievalOpen(false);
    if (service) {
      navigate(`/apply/${service.id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f4477] mx-auto" />
        <p className="text-xs text-[#64748b] font-medium">
          Loading official government service record...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-xl border border-[#cbd5e1] p-8 font-sans">
        <h2 className="text-lg font-bold text-[#0a2558]">Service Record Not Found</h2>
        <p className="text-xs text-[#64748b]">
          The requested service could not be located in the central registry.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f4477] text-white text-xs font-bold"
        >
          <span>Return to All Services</span>
        </Link>
      </div>
    );
  }

  const readiness = ServiceRequirementEngine.calculate(service, activeProfile);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb: Home > Transport > Vehicle Ownership Transfer */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <Link to="/services" className="text-[#0f4477] font-semibold hover:underline">
          {service.category || 'Government Services'}
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#1e293b] font-bold truncate max-w-md">{service.name}</span>
      </nav>

      {/* 2. Official Service Header Banner */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#e2e8f0]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#0f4477] uppercase tracking-wider bg-[#f0f5fa] border border-[#c2d8ec] px-2 py-0.5 rounded">
                Official Government Service
              </span>
              <PrototypeBadge label="Service Registry" size="sm" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0a2558] tracking-tight">
              {service.name}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium">
              <Building2 className="w-4 h-4 text-[#0f4477]" />
              <span className="font-semibold text-[#0a2558]">
                {service.department.includes('Transport') ? 'Transport Department' : service.department}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={handleStartFlow}
              className="px-6 py-2.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Start Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] text-[#046a38] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DigiPro Auto-fill Ready</span>
            </span>
          </div>
        </div>

        {/* Quick Official Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <div className="text-[10px] text-[#64748b] font-bold uppercase">Processing Time</div>
            <div className="font-bold text-[#0f172a] mt-0.5">{service.processing_time}</div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <div className="text-[10px] text-[#64748b] font-bold uppercase">Statutory Fee</div>
            <div className="font-bold text-[#0f172a] mt-0.5">{service.fee}</div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <div className="text-[10px] text-[#64748b] font-bold uppercase">Service Mode</div>
            <div className="font-bold text-[#046a38] mt-0.5">Online Contactless</div>
          </div>

          <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
            <div className="text-[10px] text-[#64748b] font-bold uppercase">Department Portal</div>
            <a
              href={service.application_url}
              target="_blank"
              rel="noreferrer"
              className="text-[#0f4477] hover:underline font-bold flex items-center gap-1 mt-0.5"
            >
              <span>Official Site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* 3. Formal Government Layout Sections */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-8">
        {/* Section 1: About the Service */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            1. About the Service
          </h2>
          <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
            {service.description}
          </p>
          {service.why_needed && (
            <div className="p-3 bg-[#f0f5fa] border border-[#c2d8ec] rounded-lg text-xs text-[#0f4477] leading-relaxed">
              <strong>Statutory Purpose:</strong> {service.why_needed}
            </div>
          )}
        </section>

        {/* Section 2: Eligibility */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            2. Eligibility
          </h2>
          <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs text-[#1e293b] leading-relaxed">
            {service.eligibility}
          </div>
        </section>

        {/* Section 3: Documents Required */}
        <section className="space-y-2">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
            <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider">
              3. Documents Required
            </h2>
            <span className="text-[11px] text-[#046a38] font-bold">
              DigiPro Verification Status
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {service.required_documents.map((doc) => {
              const check = readiness.checks.find((c) => c.key === doc);
              const isReady = check?.isAvailable;
              return (
                <div
                  key={doc}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    isReady
                      ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#065f46]'
                      : 'bg-[#fffbeb] border-[#fde68a] text-[#92400e]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isReady ? (
                      <CheckCircle2 className="w-4 h-4 text-[#046a38]" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-[#d97706]" />
                    )}
                    <span className="font-bold">{doc}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isReady ? 'Available in DigiPro ✓' : 'Manual Upload Needed'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Information Required */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            4. Information Required
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            {service.required_fields.map((field) => (
              <div
                key={field}
                className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#1e293b] font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#046a38] shrink-0" />
                <span className="truncate">{field}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Fees */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            5. Fees & Charges
          </h2>
          <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#0f172a]">Statutory Government Fee</div>
              <div className="text-[11px] text-[#64748b]">
                Includes smart card issuance and administrative service charges
              </div>
            </div>
            <div className="text-base font-extrabold text-[#0a2558]">{service.fee}</div>
          </div>
        </section>

        {/* Section 6: Processing Time */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            6. Processing Time & Citizen Charter
          </h2>
          <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-[#0f172a]">Guaranteed Service Delivery SLA</div>
              <div className="text-[11px] text-[#64748b]">
                Subject to document verification by designated competent authority
              </div>
            </div>
            <div className="text-sm font-bold text-[#046a38]">{service.processing_time}</div>
          </div>
        </section>

        {/* Section 7: Application Process */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            7. Application Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#0f4477] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div className="font-bold text-[#0f172a]">Grant Consent</div>
              <p className="text-[11px] text-[#64748b]">
                Authorize DigiGovAssist to access your verified profile.
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#0f4477] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div className="font-bold text-[#0f172a]">Verify Pre-filled Data</div>
              <p className="text-[11px] text-[#64748b]">
                Review automatically populated fields and attached records.
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#0f4477] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div className="font-bold text-[#0f172a]">Confirm Declaration</div>
              <p className="text-[11px] text-[#64748b]">
                Accept statutory declaration under IT Act rules.
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
              <div className="w-6 h-6 rounded-full bg-[#0f4477] text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div className="font-bold text-[#0f172a]">Track Status</div>
              <p className="text-[11px] text-[#64748b]">
                Receive official tracking identifier (e.g. DGA-2026-00124).
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Application Readiness */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-[#0a2558] uppercase tracking-wider border-b border-[#e2e8f0] pb-2">
            8. Application Readiness
          </h2>

          <div className="p-5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-[#065f46] uppercase tracking-wider">
                  Citizen Profile Readiness
                </div>
                <div className="text-base font-extrabold text-[#046a38]">
                  {readiness.percentage}% — Ready for submission
                </div>
              </div>
              <div className="text-xs text-[#046a38] font-bold bg-white px-3 py-1.5 rounded-lg border border-[#bbf7d0]">
                {readiness.availableRequirements}/{readiness.totalRequirements} Required Records Linked
              </div>
            </div>

            <ReadinessBar percentage={readiness.percentage} />
          </div>
        </section>

        {/* Bottom Prominent Action */}
        <div className="pt-4 border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-[#475569]">
            Applying as: <strong className="text-[#0f172a]">{activeCitizen.name}</strong> ({activeCitizen.address.city}, {activeCitizen.address.state})
          </div>

          <button
            onClick={handleStartFlow}
            className="px-8 py-3 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Application</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <ConsentModal
        isOpen={isConsentOpen}
        service={service}
        onAllow={handleConsentAllowed}
        onCancel={() => setIsConsentOpen(false)}
      />

      <RetrievalStepperModal
        isOpen={isRetrievalOpen}
        service={service}
        onFinished={handleRetrievalFinished}
      />
    </div>
  );
};
