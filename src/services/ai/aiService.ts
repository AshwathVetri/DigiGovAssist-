import { AIIntent } from '../../types';
import { config } from '../../config/env';
import { GeminiServiceFutureAdapter } from './geminiService';

export interface AIService {
  analyzeSituation(userInput: string): Promise<AIIntent>;
  getProviderName(): string;
  isRealAI(): boolean;
}

export class MockAIService implements AIService {
  public getProviderName(): string {
    return 'Mock AI Rule Engine (Keyword & Semantic Matcher)';
  }

  public isRealAI(): boolean {
    return false;
  }

  public async analyzeSituation(userInput: string): Promise<AIIntent> {
    // Artificial small delay for realistic UX response
    await new Promise((resolve) => setTimeout(resolve, 600));

    const text = userInput.toLowerCase().trim();

    // SCENARIO 1: Used Vehicle Purchase / Second-hand bike
    if (
      text.includes('second-hand') ||
      text.includes('second hand') ||
      text.includes('used bike') ||
      text.includes('bought a bike') ||
      text.includes('bought a used') ||
      text.includes('used vehicle') ||
      text.includes('bought a motorcycle') ||
      text.includes('purchase bike') ||
      text.includes('ownership transfer') ||
      text.includes('transfer bike')
    ) {
      return {
        intentKey: 'used_vehicle_purchase',
        confidence: 0.96,
        situationTitle: 'Used Vehicle Purchase (Two-Wheeler / Car)',
        explanation:
          'You purchased a pre-owned vehicle. Indian law requires transferring the Registration Certificate (RC) within 30 days, plus verifying active insurance and PUC compliance to avoid penalties.',
        recommendedServiceIds: [
          'vehicle_ownership_transfer',
          'vehicle_rc_verification',
          'vehicle_insurance_verification',
          'vehicle_puc_verification',
        ],
        tags: ['Parivahan', 'Form 29/30', 'High Priority', 'RC Transfer'],
      };
    }

    // SCENARIO 2: Driving Licence / Permanent DL
    if (
      (text.includes('driving') && text.includes('licence')) ||
      (text.includes('driving') && text.includes('license')) ||
      text.includes('permanent dl') ||
      text.includes('apply for dl') ||
      text.includes('need a dl') ||
      text.includes('apply for driving')
    ) {
      return {
        intentKey: 'driving_license',
        confidence: 0.94,
        situationTitle: 'Permanent Driving Licence Application',
        explanation:
          'You need a Permanent Driving Licence. If you already hold a Learner Licence (LLR) for 30+ days, you can book a driving skill test slot; otherwise, start with a Learner Licence.',
        recommendedServiceIds: ['driving_license', 'learner_license'],
        tags: ['Sarathi MoRTH', 'RTO Slot Booking', 'Driving Test'],
      };
    }

    // SCENARIO 3: Learner's Licence (LLR)
    if (
      text.includes('learner') ||
      text.includes('learning licence') ||
      text.includes('learning license') ||
      text.includes('llr') ||
      text.includes('learn driving')
    ) {
      return {
        intentKey: 'learner_license',
        confidence: 0.95,
        situationTitle: "Learner's Licence (LLR) - Contactless",
        explanation:
          'To begin driving legally, you require an LLR. With Aadhaar e-KYC, you can attempt the computer-based theory test online from home without visiting an RTO.',
        recommendedServiceIds: ['learner_license'],
        tags: ['Aadhaar e-KYC', 'Online Exam', 'Contactless'],
      };
    }

    // SCENARIO 4: Income Certificate / Scholarship / College
    if (
      text.includes('income certificate') ||
      text.includes('income proof') ||
      text.includes('family income') ||
      text.includes('scholarship') ||
      text.includes('fee concession') ||
      text.includes('finished 12th') ||
      text.includes('join college') ||
      text.includes('admission')
    ) {
      return {
        intentKey: 'income_certificate',
        confidence: 0.92,
        situationTitle: 'Income Certificate for Higher Education / Welfare',
        explanation:
          'College admissions, fee concessions, and government welfare programs require a certified Annual Income Certificate issued by your local Revenue Taluk / Tahsildar.',
        recommendedServiceIds: ['income_certificate', 'residence_certificate'],
        tags: ['e-District', 'Revenue Dept', 'Education Support'],
      };
    }

    // SCENARIO 5: Birth Certificate / Child Born
    if (
      text.includes('child was born') ||
      text.includes('baby born') ||
      text.includes('newborn') ||
      text.includes('birth certificate') ||
      text.includes('had a baby') ||
      text.includes('register birth')
    ) {
      return {
        intentKey: 'birth_certificate',
        confidence: 0.98,
        situationTitle: 'Newborn Birth Registration & Certificate',
        explanation:
          'Births must be registered within 21 days with the local Municipal Corporation / Registrar of Births and Deaths. A digitally signed vital certificate is generated.',
        recommendedServiceIds: ['birth_certificate', 'residence_certificate'],
        tags: ['Civil Registration System', 'Vital Record', 'Municipal'],
      };
    }

    // SCENARIO 6: Small Business / Shop / MSME
    if (
      text.includes('small shop') ||
      text.includes('start a shop') ||
      text.includes('start business') ||
      text.includes('start a business') ||
      text.includes('msme') ||
      text.includes('udyam') ||
      text.includes('business registration') ||
      text.includes('retail store')
    ) {
      return {
        intentKey: 'business_registration',
        confidence: 0.95,
        situationTitle: 'Udyam Small Business / MSME Registration',
        explanation:
          'For starting a commercial shop or firm, paperless Udyam Registration provides legal recognition, eligibility for priority banking loans, and utility subsidies at zero government fee.',
        recommendedServiceIds: ['business_registration'],
        tags: ['Ministry of MSME', 'Zero Government Fee', 'Instant Udyam'],
      };
    }

    // SCENARIO 7: Residence / Domicile / New House
    if (
      text.includes('bought a house') ||
      text.includes('bought a new house') ||
      text.includes('new home') ||
      text.includes('domicile') ||
      text.includes('residence certificate') ||
      text.includes('address change') ||
      text.includes('moved to')
    ) {
      return {
        intentKey: 'residence_certificate',
        confidence: 0.91,
        situationTitle: 'Residence / Domicile Certificate',
        explanation:
          'Proof of local residency is needed for regional government services, local reservations, and property documentation with your district revenue authority.',
        recommendedServiceIds: ['residence_certificate'],
        tags: ['e-District', 'Domicile Proof'],
      };
    }

    // SCENARIO 8: Generic RC or PUC Check
    if (text.includes('puc') || text.includes('pollution')) {
      return {
        intentKey: 'puc_check',
        confidence: 0.93,
        situationTitle: 'Pollution Under Control (PUC) Compliance',
        explanation: 'Check status or schedule an emission test for your vehicle.',
        recommendedServiceIds: ['vehicle_puc_verification'],
        tags: ['Automated Testing', 'Compliance'],
      };
    }

    // Default intelligent fallback for any unlisted natural language query
    return {
      intentKey: 'general_assistance',
      confidence: 0.78,
      situationTitle: 'Citizen Government Service Assistance',
      explanation:
        'Based on your description, we identified the most frequently requested citizen services across Transport, Identity, and Revenue departments.',
      recommendedServiceIds: [
        'vehicle_ownership_transfer',
        'income_certificate',
        'learner_license',
        'business_registration',
      ],
      tags: ['General Navigator', 'Recommended Services'],
    };
  }
}

export class GeminiAIService implements AIService {
  private fallbackService: MockAIService;
  private geminiAdapter: GeminiServiceFutureAdapter;

  constructor() {
    this.fallbackService = new MockAIService();
    this.geminiAdapter = new GeminiServiceFutureAdapter(config.geminiApiKey);
  }

  public getProviderName(): string {
    if (config.isGeminiConfigured) {
      return 'Google Gemini 1.5/2.0 + DigiGovAssist Context Parser';
    }
    return this.fallbackService.getProviderName();
  }

  public isRealAI(): boolean {
    return config.isGeminiConfigured;
  }

  public async analyzeSituation(userInput: string): Promise<AIIntent> {
    if (config.isGeminiConfigured) {
      try {
        const geminiResult = await this.geminiAdapter.parseSituationWithGemini(userInput);
        if (geminiResult && geminiResult.recommendedServiceIds.length > 0) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('Falling back to rule-based mock engine due to error:', err);
      }
    }
    return this.fallbackService.analyzeSituation(userInput);
  }
}

// Export singleton instance based on availability
export const aiService: AIService = new GeminiAIService();
