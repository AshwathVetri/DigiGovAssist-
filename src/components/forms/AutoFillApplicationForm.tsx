import React, { useState, useEffect } from 'react';
import { GovernmentService, DigiProProfile, ServiceReadiness } from '../../types';
import { useApp } from '../../context/AppContext';
import { ServiceRequirementEngine } from '../../services/government/requirementEngine';
import { GovEmblem } from '../common/GovEmblem';
import { PrototypeBadge } from '../common/PrototypeBadge';
import { governmentFeeService } from '../../services/payment/governmentFeeService';
import {
  CheckCircle2,
  FileCheck,
  Send,
  User,
  MapPin,
  Car,
  FileText,
  ShieldCheck,
  Info,
  Check,
  CreditCard,
} from 'lucide-react';

interface AutoFillApplicationFormProps {
  service: GovernmentService;
  profile: DigiProProfile;
  onSubmitSuccess: (applicationId: string) => void;
}

export const AutoFillApplicationForm: React.FC<AutoFillApplicationFormProps> = ({
  service,
  profile,
  onSubmitSuccess,
}) => {
  const { createApplication } = useApp();
  const citizen = profile.citizen;
  const vehicle = profile.vehicles && profile.vehicles.length > 0 ? profile.vehicles[0] : null;

  // Fee state from government fee database
  const [statutoryFee, setStatutoryFee] = useState<number>(530);

  useEffect(() => {
    governmentFeeService.getFeeForService(service.id).then((sched) => {
      setStatutoryFee(sched.totalFee);
    });
  }, [service.id]);

  // Form Data State
  const [formData, setFormData] = useState({
    // 1. Applicant Details
    fullName: citizen.name || '',
    dob: citizen.dob || '',
    gender: citizen.gender || 'Male',
    mobile: citizen.mobile || '',
    email: citizen.email || '',
    idNumber: 'XXXX-XXXX-4819',
    // 2. Address Details
    addressLine: citizen.address.line || '',
    city: citizen.address.city || '',
    state: citizen.address.state || '',
    pincode: citizen.address.pincode || '',
    // 3. Vehicle Details
    registrationNumber: vehicle?.registrationNumber || 'TN 38 BK 4920',
    vehicleMake: vehicle?.make || 'Royal Enfield',
    vehicleModel: vehicle?.model || 'Classic 350',
    vehicleType: vehicle?.type || 'Motorcycle',
    chassisNumber: vehicle?.chassisNumberMasked || 'ME3U3S5C1M1029XXX',
    transferType: 'Normal Sale / Purchase',
    sellerName: 'Simulated Previous Owner',
    sellerContact: '9845011223',
    // Declaration checkbox
    declarationAccepted: true,
  });

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate readiness
  const readiness: ServiceReadiness = ServiceRequirementEngine.calculate(service, profile);

  const handleFieldChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    try {
      const autofilled = [
        'fullName',
        'dob',
        'gender',
        'mobile',
        'email',
        'addressLine',
        'city',
        'state',
        'pincode',
        'registrationNumber',
        'vehicleMake',
        'vehicleModel',
        'vehicleType',
        'chassisNumber',
      ];

      const created = await createApplication({
        serviceId: service.id,
        serviceName: service.name,
        department: service.department,
        formData,
        autofilledFields: autofilled,
        readinessScore: readiness.percentage,
        isPrototypeSubmission: true,
        status: 'Payment Pending',
        paymentStatus: 'pending',
        feeAmount: statutoryFee,
      });

      setConfirmModalOpen(false);
      onSubmitSuccess(created.id);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isVehicleService = service.id.includes('vehicle');

  // Application readiness checklist items
  const readinessChecks = [
    { label: 'Applicant details', ready: true },
    { label: 'Address', ready: true },
    { label: 'Vehicle details', ready: true },
    { label: 'RC', ready: true },
    { label: 'Insurance', ready: true },
    { label: 'PUC', ready: true },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* ==================================================
          APPLICATION READINESS PANEL
          ================================================== */}
      <section className="bg-white rounded-xl border border-[#cbd5e1] p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
          <div>
            <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              Verification Audit
            </div>
            <h2 className="text-xl font-extrabold text-[#0a2558]">Application Readiness</h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-[#046a38] leading-none">
              100%
            </span>
            <div className="text-right">
              <span className="text-xs font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2.5 py-1 rounded inline-block">
                Ready for submission
              </span>
              <div className="text-[10px] text-[#64748b] mt-0.5">DigiPro Verified</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-bold text-[#475569] uppercase tracking-wider">
            Required information
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {readinessChecks.map((item) => (
              <div
                key={item.label}
                className="p-2.5 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-xs font-semibold text-[#065f46] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#046a38] shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          OFFICIAL APPLICATION FORM
          ================================================== */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setConfirmModalOpen(true);
        }}
        className="bg-white rounded-xl border border-[#cbd5e1] shadow-2xs overflow-hidden"
      >
        {/* Form Header Banner */}
        <div className="bg-[#f8fafc] border-b border-[#cbd5e1] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GovEmblem size="sm" showSealBorder={false} />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#0f4477] tracking-wider">
                Department Application Portal
              </div>
              <h2 className="text-base font-bold text-[#0a2558]">
                {service.name} — Form 29 & Form 30
              </h2>
            </div>
          </div>
          <PrototypeBadge label="Auto-filled via DigiPro" size="sm" variant="green" />
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* SECTION 1: Applicant Details */}
          <div className="space-y-4">
            <div className="border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f4477] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-[#0a2558] uppercase tracking-wide">
                  Applicant Details
                </h3>
              </div>
              <span className="text-[11px] text-[#046a38] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Verified via DigiPro</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Full Name</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleFieldChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] font-medium"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Date of Birth</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.dob}
                  onChange={(e) => handleFieldChange('dob', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] font-medium"
                />
              </div>

              {/* Gender */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Gender</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <select
                  value={formData.gender}
                  onChange={(e) => handleFieldChange('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] font-medium"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Mobile Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Mobile Number</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => handleFieldChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] font-medium font-mono"
                />
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Email Address</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] focus:bg-white text-[#0f172a] font-medium"
                />
              </div>

              {/* Identity Token */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Aadhaar Reference</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  disabled
                  value={formData.idNumber}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b] font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Address Details */}
          <div className="space-y-4">
            <div className="border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f4477] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-[#0a2558] uppercase tracking-wide">
                  Address Details
                </h3>
              </div>
              <span className="text-[11px] text-[#046a38] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Verified via DigiPro</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Address Line</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={(e) => handleFieldChange('addressLine', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">City / District</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">State & PIN</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={`${formData.state} - ${formData.pincode}`}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f1f5f9] text-[#0f172a] font-medium cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Vehicle Details */}
          <div className="space-y-4">
            <div className="border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f4477] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-bold text-[#0a2558] uppercase tracking-wide">
                  Vehicle Details
                </h3>
              </div>
              <span className="text-[11px] text-[#046a38] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Verified via DigiPro (Parivahan)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Registration Number</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => handleFieldChange('registrationNumber', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-bold font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Make & Model</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={`${formData.vehicleMake} ${formData.vehicleModel}`}
                  onChange={(e) => handleFieldChange('vehicleMake', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#334155]">Chassis Number</label>
                  <span className="text-[10px] font-semibold text-[#046a38] bg-[#f0fdf4] px-1.5 py-0.2 rounded border border-[#bbf7d0]">
                    Verified via DigiPro
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f1f5f9] text-[#64748b] font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-[#334155] block mb-1">Transfer Category</label>
                <input
                  type="text"
                  value={formData.transferType}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#334155] block mb-1">Seller / Transferor Name</label>
                <input
                  type="text"
                  value={formData.sellerName}
                  onChange={(e) => handleFieldChange('sellerName', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#334155] block mb-1">Seller Contact Number</label>
                <input
                  type="text"
                  value={formData.sellerContact}
                  onChange={(e) => handleFieldChange('sellerContact', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] text-[#0f172a] font-medium font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Supporting Documents */}
          <div className="space-y-4">
            <div className="border-b border-[#e2e8f0] pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#0f4477] text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="text-sm font-bold text-[#0a2558] uppercase tracking-wide">
                  Supporting Documents
                </h3>
              </div>
              <span className="text-[11px] text-[#046a38] font-bold">
                Zero Document Uploads Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0f4477]" />
                  <div>
                    <div className="font-bold text-[#0f172a]">Vehicle RC</div>
                    <div className="text-[10px] text-[#64748b]">TN 38 BK 4920 (Smart Card Extract)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                  Auto-filled
                </span>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0f4477]" />
                  <div>
                    <div className="font-bold text-[#0f172a]">Insurance Certificate</div>
                    <div className="text-[10px] text-[#64748b]">IRDAI Valid Policy (#71029482)</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                  Auto-filled
                </span>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0f4477]" />
                  <div>
                    <div className="font-bold text-[#0f172a]">PUC Certificate</div>
                    <div className="text-[10px] text-[#64748b]">Valid Emission Testing Center Extract</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                  Auto-filled
                </span>
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0f4477]" />
                  <div>
                    <div className="font-bold text-[#0f172a]">Identity & Address Proof</div>
                    <div className="text-[10px] text-[#64748b]">Aadhaar e-KYC Verified</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#046a38] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded">
                  Auto-filled
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 5: Declaration */}
          <div className="space-y-4">
            <div className="border-b border-[#e2e8f0] pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0f4477] text-white text-xs font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="text-sm font-bold text-[#0a2558] uppercase tracking-wide">
                Declaration
              </h3>
            </div>

            <div className="p-4 bg-[#f8fafc] rounded-lg border border-[#cbd5e1] space-y-3 text-xs leading-relaxed text-[#334155]">
              <p>
                I hereby declare that the particulars furnished above are true and correct to the
                best of my knowledge and belief. I agree that the vehicle registration certificate
                shall be issued in my name under relevant provisions of the Motor Vehicles Act, 1988
                and Central Motor Vehicle Rules.
              </p>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.declarationAccepted}
                  onChange={(e) => handleFieldChange('declarationAccepted', e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-[#cbd5e1] text-[#0f4477] focus:ring-[#0f4477]"
                />
                <span className="font-bold text-[#0f172a]">
                  I solemnly affirm and accept the statutory declaration above.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Form Submission Footer */}
        <div className="p-6 bg-[#f8fafc] border-t border-[#cbd5e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-[#64748b]">
            Application Status: <strong className="text-[#046a38]">Ready for submission (100%)</strong>
            <span className="hidden sm:inline text-slate-300 mx-2">|</span>
            <span className="text-[#0a2558] font-bold">Government Statutory Fee: ₹ {statutoryFee.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="submit"
            disabled={!formData.declarationAccepted}
            className="px-8 py-3 rounded-lg bg-[#0f4477] hover:bg-[#0a2558] disabled:opacity-50 text-white font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Proceed to Fee Payment (₹ {statutoryFee.toLocaleString('en-IN')})</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a192f]/60 backdrop-blur-2xs animate-in fade-in duration-150 font-sans">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#cbd5e1] shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f0f5fa] text-[#0f4477] mx-auto flex items-center justify-center border border-[#c2d8ec]">
              <ShieldCheck className="w-6 h-6 text-[#0f4477]" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#0a2558]">Confirm & Proceed to Payment</h3>
              <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                Your application for <strong className="text-[#0f172a]">{service.name}</strong> is verified and ready.
                Proceed to remit the statutory government service fee through Razorpay Test Mode.
              </p>
            </div>

            <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-left text-xs space-y-1.5 text-[#334155]">
              <div>
                <strong>Applicant:</strong> {formData.fullName}
              </div>
              <div>
                <strong>Readiness Score:</strong> <span className="text-[#046a38] font-bold">100% (DigiPro Verified)</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-[#e2e8f0]">
                <strong>Statutory Government Fee:</strong>
                <span className="font-mono font-bold text-[#046a38] text-sm">₹ {statutoryFee.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-[#475569] hover:bg-[#f1f5f9] border border-[#cbd5e1] transition-colors cursor-pointer"
              >
                Go Back & Review
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFormSubmit}
                className="flex-1 py-2 rounded-lg text-xs font-bold bg-[#0f4477] hover:bg-[#0a2558] text-white shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Opening Gateway...</span>
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
