import { DigiProProfile, DigiProDocument } from '../../types';
import { DigiProProvider } from './types';

/**
 * Future DigiLocker / API Setu Production Provider.
 * Connects via OAuth 2.0 PKCE flow to DigiLocker Issuer / Pull URI APIs.
 * When real credentials are provided in .env, this will replace MockDigiProService.
 */
export class DigiLockerProvider implements DigiProProvider {
  private clientId: string | null;
  private clientSecret: string | null;

  constructor(clientId: string | null = null, clientSecret: string | null = null) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  public isSimulated(): boolean {
    return false;
  }

  public getProviderLabel(): string {
    return 'DigiLocker National Gateway (Production)';
  }

  public async getProfile(_userId: string): Promise<DigiProProfile | null> {
    throw new Error('DigiLocker production credentials not configured. Please use MockDigiProProvider.');
  }

  public async getDocuments(_userId: string): Promise<DigiProDocument[]> {
    throw new Error('DigiLocker production credentials not configured.');
  }

  public async getDocument(_id: string): Promise<DigiProDocument | null> {
    throw new Error('DigiLocker production credentials not configured.');
  }

  public async getVehicles(_userId: string): Promise<any[]> {
    throw new Error('DigiLocker Parivahan integration not configured.');
  }
}
