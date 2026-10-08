import { Application, ApplicationStatus, ApplicationEvent } from '../../types';
import { INITIAL_MOCK_APPLICATIONS } from '../../data/mockApplications';
import { ApplicationServiceProvider } from './types';

const STORAGE_KEY = 'digigov_applications';

export class MockApplicationService implements ApplicationServiceProvider {
  private applications: Application[];

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.applications = JSON.parse(saved);
      } catch {
        this.applications = [...INITIAL_MOCK_APPLICATIONS];
      }
    } else {
      this.applications = [...INITIAL_MOCK_APPLICATIONS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.applications));
  }

  public async getApplicationsForUser(userId: string): Promise<Application[]> {
    await new Promise((r) => setTimeout(r, 150));
    return this.applications.filter((a) => a.userId === userId);
  }

  public async getApplicationById(id: string): Promise<Application | null> {
    await new Promise((r) => setTimeout(r, 100));
    return this.applications.find((a) => a.id === id) || null;
  }

  public async createApplication(draft: Partial<Application>): Promise<Application> {
    await new Promise((r) => setTimeout(r, 300));
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const appId = `DGA-2026-00${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const events: ApplicationEvent[] = [
      {
        id: `ev-${Date.now()}-1`,
        title: 'Application Created',
        description: 'Initiated via DigiGovAssist Citizen Service Assistant.',
        timestamp: formattedDate,
        status: 'completed',
      },
      {
        id: `ev-${Date.now()}-2`,
        title: 'Information Retrieved from DigiPro',
        description: 'Verified citizen profile and document records accessed under citizen consent.',
        timestamp: formattedDate,
        status: 'completed',
      },
      {
        id: `ev-${Date.now()}-3`,
        title: 'Application Form Auto-filled',
        description: '100% of required fields automatically mapped from verified repository.',
        timestamp: formattedDate,
        status: 'completed',
      },
      {
        id: `ev-${Date.now()}-4`,
        title: 'Government Fee Payment',
        description: draft.paymentStatus === 'paid'
          ? `Statutory fee of ₹${draft.feeAmount || 530} confirmed via Razorpay Test Gateway.`
          : `Awaiting statutory government fee payment of ₹${draft.feeAmount || 530} via Razorpay Test Mode.`,
        timestamp: draft.paymentStatus === 'paid' ? formattedDate : 'Pending Payment',
        status: draft.paymentStatus === 'paid' ? 'completed' : 'in_progress',
      },
      {
        id: `ev-${Date.now()}-5`,
        title: 'Department Scrutiny & Verification',
        description: draft.paymentStatus === 'paid'
          ? `Dispatched to ${draft.department || 'Department Portal'} for verification.`
          : 'Pending fee payment before submission.',
        timestamp: draft.paymentStatus === 'paid' ? 'Estimated: 24 - 48 Hours' : 'Awaiting payment',
        status: draft.paymentStatus === 'paid' ? 'in_progress' : 'pending',
      },
      {
        id: `ev-${Date.now()}-6`,
        title: 'Final Approval & Certificate Issuance',
        description: 'Digital certificate generation and Parivahan/State registry update.',
        timestamp: 'Pending scrutiny',
        status: 'pending',
      },
    ];

    const initialStatus: ApplicationStatus =
      draft.status || (draft.paymentStatus === 'paid' ? 'Submitted' : 'Payment Pending');

    const newApplication: Application = {
      id: appId,
      userId: draft.userId || 'citizen-arjun',
      serviceId: draft.serviceId || 'vehicle_ownership_transfer',
      serviceName: draft.serviceName || 'Vehicle Ownership Transfer',
      department: draft.department || 'Ministry of Road Transport & Highways',
      status: initialStatus,
      paymentStatus: draft.paymentStatus || 'pending',
      paymentId: draft.paymentId,
      feeAmount: draft.feeAmount || 530,
      readinessScore: draft.readinessScore || 100,
      submittedAt: draft.paymentStatus === 'paid' ? formattedDate : undefined,
      updatedAt: formattedDate,
      formData: draft.formData || {},
      autofilledFields: draft.autofilledFields || [],
      events,
      isPrototypeSubmission: true,
      notes: 'Demo Prototype Submission - Razorpay Test Payment Flow',
    };

    this.applications.unshift(newApplication);
    this.save();
    return newApplication;
  }

  public async markApplicationAsPaid(
    id: string,
    paymentId: string,
    amount: number
  ): Promise<Application | null> {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    app.status = 'Submitted';
    app.paymentStatus = 'paid';
    app.paymentId = paymentId;
    app.feeAmount = amount;
    app.submittedAt = formattedDate;
    app.updatedAt = formattedDate;

    // Update payment event in timeline
    const feeEvent = app.events.find((e) => e.title.includes('Government Fee') || e.title.includes('Fee Payment'));
    if (feeEvent) {
      feeEvent.status = 'completed';
      feeEvent.timestamp = formattedDate;
      feeEvent.description = `Statutory government fee of ₹${amount} confirmed via Razorpay Test Gateway (Payment ID: ${paymentId}).`;
    }

    // Advance scrutiny event to in_progress
    const scrutinyEvent = app.events.find((e) => e.title.includes('Scrutiny') || e.title.includes('Verification'));
    if (scrutinyEvent) {
      scrutinyEvent.status = 'in_progress';
      scrutinyEvent.timestamp = 'Estimated: 24 - 48 Hours';
      scrutinyEvent.description = `Dispatched to ${app.department} for verification.`;
    }

    this.save();
    return app;
  }

  public async updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
    const app = this.applications.find((a) => a.id === id);
    if (!app) return null;
    app.status = status;
    app.updatedAt = new Date().toLocaleString();
    this.save();
    return app;
  }

  public async deleteApplication(id: string): Promise<boolean> {
    const initialLen = this.applications.length;
    this.applications = this.applications.filter((a) => a.id !== id);
    this.save();
    return this.applications.length < initialLen;
  }
}

export const applicationService = new MockApplicationService();
