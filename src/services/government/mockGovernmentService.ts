import { GovernmentService, ServiceReadiness, DigiProProfile } from '../../types';
import { MOCK_GOVERNMENT_SERVICES } from '../../data/mockServices';
import { GovernmentServiceProvider } from './types';
import { ServiceRequirementEngine } from './requirementEngine';

export class MockGovernmentService implements GovernmentServiceProvider {
  private services: GovernmentService[];

  constructor() {
    this.services = [...MOCK_GOVERNMENT_SERVICES];
  }

  public async getAllServices(): Promise<GovernmentService[]> {
    await new Promise((r) => setTimeout(r, 200));
    return this.services;
  }

  public async getServiceById(id: string): Promise<GovernmentService | null> {
    await new Promise((r) => setTimeout(r, 150));
    return this.services.find((s) => s.id === id) || null;
  }

  public async getServicesByCategory(category: string): Promise<GovernmentService[]> {
    await new Promise((r) => setTimeout(r, 200));
    if (category === 'All') return this.services;
    return this.services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  public async searchServices(query: string): Promise<GovernmentService[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.services;
    return this.services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }

  public calculateReadiness(service: GovernmentService, profile: DigiProProfile | null): ServiceReadiness {
    return ServiceRequirementEngine.calculate(service, profile);
  }
}

export const governmentService = new MockGovernmentService();
