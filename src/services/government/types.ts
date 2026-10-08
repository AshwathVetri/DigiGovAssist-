import { GovernmentService, ServiceReadiness, DigiProProfile } from '../../types';

export interface GovernmentServiceProvider {
  getAllServices(): Promise<GovernmentService[]>;
  getServiceById(id: string): Promise<GovernmentService | null>;
  getServicesByCategory(category: string): Promise<GovernmentService[]>;
  searchServices(query: string): Promise<GovernmentService[]>;
  calculateReadiness(service: GovernmentService, profile: DigiProProfile | null): ServiceReadiness;
}
