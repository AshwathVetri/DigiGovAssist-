import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { governmentService } from '../services/government';
import { GovernmentService } from '../types';
import { ServiceRequirementEngine } from '../services/government/requirementEngine';
import { ReadinessBar } from '../components/common/ReadinessBar';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import {
  Search,
  ArrowRight,
  Clock,
  Coins,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const ServicesCatalogPage: React.FC = () => {
  const { activeProfile } = useApp();
  const navigate = useNavigate();

  const [services, setServices] = useState<GovernmentService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function load() {
      const data = await governmentService.getAllServices();
      setServices(data);
    }
    load();
  }, []);

  const categories = ['All', 'Transport', 'Certificates', 'Business'];

  const filtered = services.filter((s) => {
    const matchesCategory =
      selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">Central & State Services Directory</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
              Government Services Directory
            </h1>
            <PrototypeBadge label="Official Catalog" size="sm" />
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Browse official services across transport, revenue, and municipal bodies or use AI Navigator
            to match your requirements.
          </p>
        </div>

        <Link
          to="/navigator"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs font-bold shadow-2xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <span>Find Services via AI</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#cbd5e1] shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services by keyword, department, or vehicle..."
            className="w-full text-xs font-medium pl-9 pr-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] focus:outline-none focus:border-[#0f4477]"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0f4477] text-white shadow-2xs'
                  : 'bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#334155] border border-[#cbd5e1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => {
          const readiness = ServiceRequirementEngine.calculate(service, activeProfile);
          return (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-[#cbd5e1] shadow-2xs hover:border-[#0f4477] transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f4477] bg-[#f0f5fa] px-2 py-0.5 rounded border border-[#c2d8ec]">
                    {service.category}
                  </span>
                  {service.badge && (
                    <span className="text-[10px] font-bold text-[#92400e] bg-[#fffbeb] px-2 py-0.5 rounded border border-[#fde68a]">
                      {service.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0a2558] leading-snug">
                  {service.name}
                </h3>

                <p className="text-xs text-[#475569] line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="text-[11px] text-[#64748b] truncate flex items-center gap-1 pt-1">
                  <Building2 className="w-3.5 h-3.5 text-[#0f4477] shrink-0" />
                  <span className="truncate">{service.department}</span>
                </div>
              </div>

              {/* Specs & Readiness */}
              <div className="space-y-2.5 pt-3 border-t border-[#f1f5f9]">
                <div className="flex items-center justify-between text-xs text-[#64748b]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <span>{service.processing_time}</span>
                  </div>
                  <div className="font-bold text-[#0f172a]">{service.fee}</div>
                </div>

                <ReadinessBar percentage={readiness.percentage} compact />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  to={`/services/${service.id}`}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#334155] font-bold text-xs border border-[#cbd5e1] text-center transition-colors"
                >
                  [Check Details]
                </Link>
                <Link
                  to={`/apply/${service.id}`}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs text-center transition-colors shadow-2xs"
                >
                  Start Service
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
