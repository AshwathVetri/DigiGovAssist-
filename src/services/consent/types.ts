import { ConsentRecord, ConsentRequest } from '../../types';

export interface ConsentServiceProvider {
  getConsentsForUser(userId: string): Promise<ConsentRecord[]>;
  recordConsent(record: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord>;
  revokeConsent(consentId: string): Promise<boolean>;
  hasConsent(userId: string, serviceId: string): Promise<boolean>;
  getConsentRequestForService(serviceId: string): Promise<ConsentRequest>;
}
