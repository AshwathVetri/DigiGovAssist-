import { DigiProProfile, DigiProDocument } from '../../types';
import { MOCK_PROFILES } from '../../data/mockCitizens';
import { DigiProProvider } from './types';

export class MockDigiProService implements DigiProProvider {
  public isSimulated(): boolean {
    return true;
  }

  public getProviderLabel(): string {
    return 'DigiPro Prototype (Simulated Verified Data)';
  }

  public async getProfile(userId: string): Promise<DigiProProfile | null> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_PROFILES[userId] || MOCK_PROFILES['citizen-arjun'] || null;
  }

  public async getDocuments(userId: string): Promise<DigiProDocument[]> {
    await new Promise((r) => setTimeout(r, 300));
    const profile = MOCK_PROFILES[userId] || MOCK_PROFILES['citizen-arjun'];
    return profile ? profile.documents : [];
  }

  public async getDocument(id: string): Promise<DigiProDocument | null> {
    await new Promise((r) => setTimeout(r, 200));
    for (const profile of Object.values(MOCK_PROFILES)) {
      const match = profile.documents.find((d) => d.id === id);
      if (match) return match;
    }
    return null;
  }

  public async getVehicles(userId: string): Promise<any[]> {
    await new Promise((r) => setTimeout(r, 300));
    const profile = MOCK_PROFILES[userId] || MOCK_PROFILES['citizen-arjun'];
    return profile?.vehicles || [];
  }
}

export const digiProService = new MockDigiProService();
