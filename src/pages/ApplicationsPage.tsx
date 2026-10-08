import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GovEmblem } from '../components/common/GovEmblem';
import { StatusBadge } from '../components/common/StatusBadge';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { ReadinessBar } from '../components/common/ReadinessBar';
import {
  FileCheck2,
  Clock,
  ArrowRight,
  Plus,
  Filter,
  Building2,
  Calendar,
  Search,
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, activeCitizen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();

  const filteredApplications = applications.filter((app) => {
    const matchesFilter =
      filterStatus === 'All' || app.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">My Applications</span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
              My Applications
            </h1>
            <PrototypeBadge label="Tracking Gateway" size="sm" />
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Tracking verified submissions filed for <strong>{activeCitizen.name}</strong> across central and
            state departmental portals.
          </p>
        </div>

        <Link
          to="/navigator"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </Link>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[#64748b] font-bold text-[11px] uppercase mr-1">Filter:</span>
          {['All', 'Submitted', 'Approved', 'Completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                filterStatus === tab
                  ? 'bg-[#0f4477] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#cbd5e1] bg-white text-[#0f172a] focus:outline-none focus:border-[#0f4477]"
          />
        </div>
      </div>

      {/* 4. Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#cbd5e1] p-12 text-center space-y-3 max-w-md mx-auto shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-[#f0f5fa] text-[#0f4477] mx-auto flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[#0a2558]">No applications found</h3>
          <p className="text-xs text-[#64748b]">
            No records matching current filter or search criteria.
          </p>
          <Link
            to="/navigator"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f4477] text-white text-xs font-bold"
          >
            <span>Ask DigiGovAssist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-[#cbd5e1] shadow-2xs hover:border-[#0f4477] transition-all p-5 flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#0a2558] bg-[#f0f5fa] px-2.5 py-0.5 rounded border border-[#c2d8ec]">
                    {app.id}
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                <h3 className="text-base font-bold text-[#0a2558] leading-snug">
                  {app.serviceName}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <Building2 className="w-3.5 h-3.5 text-[#0f4477] shrink-0" />
                  <span className="truncate">{app.department}</span>
                </div>
              </div>

              {/* Progress & Metadata */}
              <div className="space-y-3 pt-3 border-t border-[#f1f5f9]">
                <ReadinessBar percentage={app.readinessScore} compact />

                <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                    <span>Submitted: {app.submittedAt || app.updatedAt}</span>
                  </div>
                  <span className="text-[10px] text-[#046a38] font-bold bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    {app.events.length} Timeline Stages
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#f0f5fa] hover:bg-[#e1ecf6] text-[#0f4477] font-bold text-xs border border-[#c2d8ec] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Track Application & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
