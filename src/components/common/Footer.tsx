import React from 'react';
import { Link } from 'react-router-dom';
import { GovEmblem } from './GovEmblem';
import {
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Mail,
  HelpCircle,
  FileText,
  Lock,
  Globe,
  AlertTriangle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07182d] text-slate-300 text-xs border-t-4 border-[#0f4477] mt-auto font-sans">
      {/* Tricolor Accent Stripe */}
      <div className="tricolor-stripe w-full" aria-hidden="true" />

      {/* Main Government Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Top Section: Emblem, Title, and Prototype Disclaimer */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[#1e3452]">
          <div className="flex items-center gap-4">
            <GovEmblem size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white tracking-tight">
                  DigiGov<span className="text-[#60a5fa]">Assist</span>
                </span>
                <span className="bg-[#0f4477] text-white text-[10px] px-2 py-0.5 rounded font-semibold border border-[#2b6cb0]">
                  Citizen Portal
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                AI-Powered Citizen Service Assistant — Digital India Innovation
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                "Tell us what happened. We'll identify the government services you may need."
              </p>
            </div>
          </div>

          {/* Prototype Callout Box */}
          <div className="bg-[#0f2444] border border-[#234b7a] rounded-xl p-3.5 max-w-md text-[11px] leading-relaxed text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Prototype — Not an official Government of India website.</span>
            </div>
            <p className="text-slate-300">
              Developed as a hackathon prototype. Simulated citizen records represent a future
              consent-based verified data layer (DigiPro).
            </p>
          </div>
        </div>

        {/* Middle Links Grid: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Citizen Services */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#234b7a] pb-2">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services/vehicle_ownership_transfer" className="hover:text-white transition-colors">
                  Vehicle Ownership Transfer
                </Link>
              </li>
              <li>
                <Link to="/services/learner_license" className="hover:text-white transition-colors">
                  Learner's Licence (LLR)
                </Link>
              </li>
              <li>
                <Link to="/services/driving_license" className="hover:text-white transition-colors">
                  Permanent Driving Licence
                </Link>
              </li>
              <li>
                <Link to="/services/income_certificate" className="hover:text-white transition-colors">
                  Income Certificate
                </Link>
              </li>
              <li>
                <Link to="/services/birth_certificate" className="hover:text-white transition-colors">
                  Birth Certificate Registration
                </Link>
              </li>
              <li>
                <Link to="/services/business_registration" className="hover:text-white transition-colors">
                  Udyam MSME Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Digital India Initiatives */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#234b7a] pb-2">
              National Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>National Portal of India</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digilocker.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>DigiLocker Ecosystem</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://parivahan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Parivahan Sewa (MoRTH)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://web.umang.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>UMANG Services Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://myscheme.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Citizen Access */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#234b7a] pb-2">
              Help & Citizen Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/navigator" className="hover:text-white transition-colors">
                  AI Citizen Service Search
                </Link>
              </li>
              <li>
                <Link to="/digipro" className="hover:text-white transition-colors">
                  DigiPro Verified Records
                </Link>
              </li>
              <li>
                <Link to="/applications" className="hover:text-white transition-colors">
                  Application Tracking System
                </Link>
              </li>
              <li>
                <Link to="/consent-history" className="hover:text-white transition-colors">
                  Citizen Consent Audit Log
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Citizen Profile & Documents
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-[#234b7a] pb-2">
              Helpdesk & Support
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-bold">1800-111-999 (Toll Free)</div>
                  <div className="text-[11px] text-slate-400">Available Mon-Sat, 9 AM - 6 PM IST</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">support@digigovassist.demo</div>
                  <div className="text-[11px] text-slate-400">Citizen grievances & queries</div>
                </div>
              </div>
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0a2558] text-emerald-400 border border-[#1e4a7a] text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Consent-First Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Official Governance Standard Disclaimers */}
        <div className="pt-6 border-t border-[#1e3452] flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/services" className="hover:text-white transition-colors">About</Link>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Accessibility Statement</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Use</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Hyperlinking Policy</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Citizen Charter</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-slate-400">
              Last Updated: 08 Oct 2026
            </span>
            <span className="px-2 py-0.5 bg-[#0f2444] rounded border border-[#234b7a] font-mono text-[10px] text-amber-300">
              Visitors: 1,284,930
            </span>
          </div>
        </div>

        {/* Bottom Bar: Copyright and GIGW compliance */}
        <div className="pt-4 border-t border-[#16273f] text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            &copy; 2026 DigiGovAssist Prototype. Designed in compliance with Guidelines for Indian
            Government Websites (GIGW).
          </div>
          <div className="text-slate-400">
            "Don't ask citizens what the government already knows."
          </div>
        </div>
      </div>
    </footer>
  );
};
