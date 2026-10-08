import { ConsentRecord, ConsentRequest } from '../../types';
import { INITIAL_MOCK_CONSENTS } from '../../data/mockConsents';
import { MOCK_GOVERNMENT_SERVICES } from '../../data/mockServices';
import { ConsentServiceProvider } from './types';

const STORAGE_KEY = 'digigov_consents';

export class MockConsentService implements ConsentServiceProvider {
  private consents: ConsentRecord[];

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        this.consents = JSON.parse(saved);
      } catch {
        this.consents = [...INITIAL_MOCK_CONSENTS];
      }
    } else {
      this.consents = [...INITIAL_MOCK_CONSENTS];
      this.save();
    }
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.consents));
  }

  public async getConsentsForUser(userId: string): Promise<ConsentRecord[]> {
    await new Promise((r) => setTimeout(r, 100));
    return this.consents.filter((c) => c.userId === userId);
  }

  public async recordConsent(record: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord> {
    await new Promise((r) => setTimeout(r, 200));
    const newConsent: ConsentRecord = {
      ...record,
      id: `cst-${Date.now().toString().slice(-6)}`,
    };
    // Replace any existing active consent for the same service
    this.consents = this.consents.filter(
      (c) => !(c.userId === record.userId && c.serviceId === record.serviceId)
    );
    this.consents.unshift(newConsent);
    this.save();
    return newConsent;
  }

  public async revokeConsent(consentId: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 150));
    const item = this.consents.find((c) => c.id === consentId);
    if (item) {
      item.status = 'Revoked';
      this.save();
      return true;
    }
    return false;
  }

  public async hasConsent(userId: string, serviceId: string): Promise<boolean> {
    const record = this.consents.find(
      (c) => c.userId === userId && c.serviceId === serviceId && c.status === 'Granted'
    );
    return Boolean(record);
  }

  public async getConsentRequestForService(serviceId: string): Promise<ConsentRequest> {
    const service = MOCK_GOVERNMENT_SERVICES.find((s) => s.id === serviceId);
    const serviceName = service ? service.name : 'Government Service';
    const department = service ? service.department : 'Government Department';

    const requestedFields = (service?.required_fields || [
      'Full Name',
      'Date of Birth',
      'Residential Address',
      'Mobile Number',
    ]).map((field) => ({
      key: field.toLowerCase().replace(/\s+/g, '_'),
      label: field,
      category: 'Verified Identity',
      description: `Verified citizen data to automatically complete ${field}`,
    }));

    const requestedDocuments = service?.required_documents || ['Aadhaar Card'];

    return {
      serviceId,
      serviceName,
      department,
      requestedFields,
      requestedDocuments,
      purpose: `Automatic population of official ${serviceName} forms without repetitive uploads.`,
      validityDuration: '30 Days (Revocable anytime)',
    };
  }
}

export const consentService = new MockConsentService();
