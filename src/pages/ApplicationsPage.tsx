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
  CreditCard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, payments, activeCitizen } = useApp();
  const [activeTab, setActiveTab] = useState<'applications' | 'payments'>('applications');
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

  const filteredPayments = payments.filter((pay) => {
    return (
      (pay.service_name || pay.service_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pay.razorpay_payment_id || pay.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.application_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* 1. Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#64748b]">
        <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
          Home
        </Link>
        <span className="text-[#cbd5e1]">/</span>
        <span className="text-[#475569]">
          {activeTab === 'applications' ? 'My Applications' : 'Payment History'}
        </span>
      </nav>

      {/* 2. Official Header */}
      <div className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GovEmblem size="sm" showSealBorder={false} />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0a2558] tracking-tight">
              {activeTab === 'applications' ? 'My Applications' : 'Government Service Payment History'}
            </h1>
            <PrototypeBadge label="Citizen Portal" size="sm" />
          </div>
          <p className="text-xs text-[#475569] mt-1">
            Tracking verified submissions and statutory fees for <strong>{activeCitizen.name}</strong> across central and
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

      {/* 3. Primary Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#cbd5e1] pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#0a2558] text-white shadow-2xs'
              : 'bg-white hover:bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>My Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-[#0a2558] text-white shadow-2xs'
              : 'bg-white hover:bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment History ({payments.length})</span>
        </button>
      </div>

      {/* 4. Tab Content: Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[#64748b] font-bold text-[11px] uppercase mr-1">Filter:</span>
              {['All', 'Payment Pending', 'Submitted', 'Approved', 'Completed'].map((tab) => (
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

          {/* Applications Grid */}
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
                  {/* Card Header */}
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

                  {/* Progress & Payment Status */}
                  <div className="space-y-3 pt-3 border-t border-[#f1f5f9]">
                    <ReadinessBar percentage={app.readinessScore} compact />

                    <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                        <span>{app.submittedAt ? `Submitted: ${app.submittedAt}` : `Updated: ${app.updatedAt}`}</span>
                      </div>

                      {app.paymentStatus === 'paid' ? (
                        <span className="text-[10px] text-[#046a38] font-bold bg-[#f0fdf4] px-1.5 py-0.5 rounded border border-[#bbf7d0]">
                          Fee Paid ✓
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-300">
                          Fee Pending (₹ {app.feeAmount || 530})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    {app.paymentStatus === 'pending' || app.status === 'Payment Pending' ? (
                      <Link
                        to={`/payment/${app.id}`}
                        className="flex-1 py-2 px-3 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Fee (₹ {app.feeAmount || 530})</span>
                      </Link>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => navigate(`/applications/${app.id}`)}
                      className={`py-2 px-3 rounded-lg bg-[#f0f5fa] hover:bg-[#e1ecf6] text-[#0f4477] font-bold text-xs border border-[#c2d8ec] transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        app.paymentStatus === 'pending' || app.status === 'Payment Pending' ? 'w-auto' : 'w-full'
                      }`}
                    >
                      <span>Track Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content: Payment History */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Header Note */}
          <div className="p-4 bg-[#f0f5fa] rounded-xl border border-[#c2d8ec] text-xs text-[#0f4477] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#0f4477]" />
              <span>
                Statutory payments processed through <strong>Razorpay Test Mode</strong> for citizen record audit.
              </span>
            </div>
            <span className="font-bold text-[10px] uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
              Test Mode
            </span>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-xl border border-[#cbd5e1] overflow-hidden shadow-2xs text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#cbd5e1] text-[#0a2558]">
                  <th className="py-3 px-4 font-bold">Service</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Payment ID</th>
                  <th className="py-3 px-4 font-bold">Date</th>
                  <th className="py-3 px-4 font-bold text-center">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#64748b]">
                      No payment history records found for this citizen profile.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#f8fafc] transition-colors">
                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0a2558]">
                          {pay.service_name || 'Vehicle Ownership Transfer'}
                        </div>
                        <div className="font-mono text-[11px] text-[#64748b]">
                          App ID: {pay.application_id}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#046a38]">
                        ₹ {pay.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Payment ID */}
                      <td className="py-3.5 px-4 font-mono text-[#334155]">
                        {pay.razorpay_payment_id || pay.id}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#475569]">
                        {pay.paid_at || pay.created_at}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {pay.status === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f0fdf4] text-[#046a38] border border-[#bbf7d0]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        ) : pay.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            <span>Failed</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {pay.status === 'paid' ? (
                          <Link
                            to={`/payment/${pay.application_id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f4477] hover:underline"
                          >
                            <span>View Receipt</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <Link
                            to={`/payment/${pay.application_id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0f4477] hover:bg-[#0a2558] text-white text-[11px] font-bold transition-colors"
                          >
                            <span>Pay Now</span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
