import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { governmentService } from '../services/government';
import { GovernmentService } from '../types';
import { AutoFillApplicationForm } from '../components/forms/AutoFillApplicationForm';
import { GovEmblem } from '../components/common/GovEmblem';
import { PrototypeBadge } from '../components/common/PrototypeBadge';
import { ChevronLeft, FileText, AlertCircle, Loader2 } from 'lucide-react';

export const ApplicationFlowPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const { activeCitizen, activeProfile } = useApp();

  const [service, setService] = useState<GovernmentService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadService() {
      if (!serviceId) return;
      setLoading(true);
      try {
        const found = await governmentService.getServiceById(serviceId);
        setService(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [serviceId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#0f4477] mx-auto" />
        <p className="text-xs text-[#64748b] font-medium">Preparing application workflow...</p>
      </div>
    );
  }

  if (!service || !activeProfile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-white rounded-xl border border-[#cbd5e1] p-8 font-sans">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-lg font-bold text-[#0a2558]">Service Not Available</h2>
        <p className="text-xs text-[#64748b]">
          This service is currently unavailable or profile could not be loaded.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0f4477] text-white text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Browse Available Services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 font-sans">
      {/* Official Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center justify-between text-xs text-[#64748b]">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-[#0f4477] font-semibold hover:underline">
            Home
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <Link to={`/services/${service.id}`} className="text-[#0f4477] font-semibold hover:underline">
            {service.name}
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="text-[#1e293b] font-bold">Official Application Form</span>
        </div>

        <Link
          to="/navigator"
          className="text-xs font-semibold text-[#0f4477] hover:underline flex items-center gap-1"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Navigator</span>
        </Link>
      </nav>

      {/* AutoFill Form */}
      <AutoFillApplicationForm
        service={service}
        profile={activeProfile}
        onSubmitSuccess={(createdAppId) => {
          navigate(`/payment/${createdAppId}`);
        }}
      />
    </div>
  );
};
