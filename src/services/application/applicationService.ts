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
        description: 'Initiated via DigiGovAssist AI Navigator.',
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
        title: 'Application Submitted',
        description: `Dispatched to ${draft.department || 'Department Portal'} (Prototype Simulation).`,
        timestamp: formattedDate,
        status: 'completed',
      },
      {
        id: `ev-${Date.now()}-5`,
        title: 'Department Scrutiny & Verification',
        description: 'Under digital scrutiny by department officer.',
        timestamp: 'Estimated: 24 - 48 Hours',
        status: 'in_progress',
      },
      {
        id: `ev-${Date.now()}-6`,
        title: 'Final Approval & Certificate Issuance',
        description: 'Digital certificate generation and Parivahan/State registry update.',
        timestamp: 'Pending scrutiny',
        status: 'pending',
      },
    ];

    const newApplication: Application = {
      id: appId,
      userId: draft.userId || 'citizen-arjun',
      serviceId: draft.serviceId || 'vehicle_ownership_transfer',
      serviceName: draft.serviceName || 'Vehicle Ownership Transfer',
      department: draft.department || 'Ministry of Road Transport & Highways',
      status: 'Submitted',
      readinessScore: draft.readinessScore || 100,
      submittedAt: formattedDate,
      updatedAt: formattedDate,
      formData: draft.formData || {},
      autofilledFields: draft.autofilledFields || [],
      events,
      isPrototypeSubmission: true,
      notes: 'Demo Prototype Submission - Simulated Department Acknowledgment',
    };

    this.applications.unshift(newApplication);
    this.save();
    return newApplication;
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
