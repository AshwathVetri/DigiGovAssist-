import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import {
  User,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FolderLock,
  ChevronRight,
  Check,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { activeCitizen, activeProfile, allCitizens, setActiveCitizenId } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">Citizen Profile</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
              Citizen Profile & Credentials
            </h1>
            <PrototypeBadge label="Verified Citizen" size="sm" />
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Official citizen identity verified through simulated DigiPro repository.
          </p>
        </div>

        {/* Demo Persona Switcher */}
        <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-lg border border-[#cbd5e1] text-xs">
          <span className="text-[#64748b] font-bold text-[10px] uppercase">Switch Demo Persona:</span>
          <select
            value={activeCitizen.id}
            onChange={(e) => setActiveCitizenId(e.target.value)}
            className="font-bold text-[#0a2558] bg-transparent focus:outline-none cursor-pointer"
          >
            {allCitizens.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.address.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Main Profile Details */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] shadow-2xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#0a2558] text-white font-extrabold text-xl flex items-center justify-center shadow-2xs">
              {activeCitizen.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#0f172a]">{activeCitizen.name}</h2>
                <span className="text-xs font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>DigiPro Verified</span>
                </span>
              </div>
              <div className="text-xs text-[#64748b] mt-0.5">{activeCitizen.occupation || 'Citizen of India'}</div>
              <div className="text-[11px] text-[#94a3b8] font-mono mt-0.5">ID: {activeCitizen.id}</div>
            </div>
          </div>

          <div className="text-left sm:text-right bg-[#f8fafc] sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-0 border-[#e2e8f0]">
            <span className="text-[10px] text-[#64748b] font-bold uppercase">
              DigiPro Completeness
            </span>
            <div className="text-2xl font-black text-[#046a38]">
              {activeProfile?.profileCompleteness || 100}%
            </div>
            <span className="text-[11px] text-[#046a38] font-semibold">Active & Connected ✓</span>
          </div>
        </div>

        {/* Sensitive Information Rule */}
        <div className="p-3.5 rounded-lg bg-[#f0f5fa] border border-[#c2d8ec] text-xs text-[#1e3a5f] flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#0f4477] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Verified Record Integrity:</strong> Core demographic data is anchored to your
            verified Aadhaar / State registry records. Any modification requires e-KYC authentication.
          </p>
        </div>

        {/* Detailed Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
            <div className="text-[#64748b] text-[10px] uppercase font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Legal Full Name</span>
            </div>
            <div className="font-bold text-[#0f172a] text-sm">{activeCitizen.name}</div>
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
            <div className="text-[#64748b] text-[10px] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Date of Birth</span>
            </div>
            <div className="font-bold text-[#0f172a] text-sm">{activeCitizen.dob}</div>
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
            <div className="text-[#64748b] text-[10px] uppercase font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Mobile Number (Aadhaar Verified)</span>
            </div>
            <div className="font-bold text-[#0f172a] text-sm font-mono">+91 {activeCitizen.mobile}</div>
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] space-y-1">
            <div className="text-[#64748b] text-[10px] uppercase font-bold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Email Address</span>
            </div>
            <div className="font-bold text-[#0f172a] text-sm">{activeCitizen.email}</div>
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] sm:col-span-2 space-y-1">
            <div className="text-[#64748b] text-[10px] uppercase font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#64748b]" />
              <span>Permanent Residential Address</span>
            </div>
            <div className="font-medium text-[#0f172a] text-sm">
              {activeCitizen.address.line}, {activeCitizen.address.city},{' '}
              {activeCitizen.address.state} - {activeCitizen.address.pincode}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            to="/digipro"
            className="font-bold text-[#0f4477] hover:underline flex items-center gap-1"
          >
            <FolderLock className="w-4 h-4" />
            <span>Inspect DigiPro Documents ({activeProfile?.documents.length || 0})</span>
          </Link>

          <Link
            to="/consent-history"
            className="font-bold text-[#475569] hover:text-[#0f172a] flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-[#046a38]" />
            <span>Review Consent Audit Trail</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
