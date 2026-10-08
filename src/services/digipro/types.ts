import { DigiProProfile, DigiProDocument } from '../../types';

export interface DigiProProvider {
  getProfile(userId: string): Promise<DigiProProfile | null>;
  getDocuments(userId: string): Promise<DigiProDocument[]>;
  getDocument(id: string): Promise<DigiProDocument | null>;
  getVehicles(userId: string): Promise<any[]>;
  isSimulated(): boolean;
  getProviderLabel(): string;
}
