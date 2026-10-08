import { AIIntent } from '../../types';

/**
 * Gemini API Direct Adapter for DigiGovAssist.
 * In production or demo mode, invokes Gemini 1.5/2.0 Flash to analyze citizen situations.
 * When key is not provided or API fails, returns null so system seamlessly uses MockAIService.
 */
export class GeminiServiceFutureAdapter {
  private apiKey: string | null;

  constructor(apiKey: string | null = null) {
    this.apiKey = apiKey ? apiKey.trim() : null;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  public async parseSituationWithGemini(prompt: string): Promise<AIIntent | null> {
    if (!this.isAvailable()) {
      return null;
    }

    const candidateModels = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are DigiGovAssist, an intelligent Indian citizen government service navigator.
Analyze the citizen's situation: "${prompt}".
Respond strictly with valid JSON with the following structure (no other markdown or text outside JSON):
{
  "intentKey": string,
  "confidence": number (between 0.85 and 0.99),
  "situationTitle": string (clear title, e.g. "Used Vehicle Purchase (Two-Wheeler / Car)"),
  "explanation": string (plain language explanation of the law and next steps for Indian citizen),
  "recommendedServiceIds": string[] (select required IDs from: vehicle_ownership_transfer, vehicle_rc_verification, vehicle_insurance_verification, vehicle_puc_verification, learner_license, driving_license, income_certificate, residence_certificate, birth_certificate, business_registration),
  "tags": string[]
}`,
                  },
                ],
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.warn(`Gemini API model ${model} returned status ${response.status}:`, errorData);
          continue; // Try next fallback model
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        // Extract JSON from potential codeblock markdown
        const cleanedJson = rawText.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        return {
          intentKey: parsed.intentKey || 'custom_detected',
          confidence: Number(parsed.confidence) || 0.94,
          situationTitle: parsed.situationTitle || 'Citizen Request Identified',
          explanation: parsed.explanation || 'Identified government services based on your situation.',
          recommendedServiceIds: Array.isArray(parsed.recommendedServiceIds) && parsed.recommendedServiceIds.length > 0
            ? parsed.recommendedServiceIds
            : ['vehicle_ownership_transfer', 'vehicle_rc_verification', 'vehicle_insurance_verification', 'vehicle_puc_verification'],
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['Parivahan', 'Form 29/30'],
        };
      } catch (err) {
        console.warn(`Gemini parsing error with ${model}:`, err);
      }
    }

    return null;
  }
}

/**
 * Health check helper to test Gemini API key validity.
 */
export async function testGeminiConnection(apiKey: string): Promise<{ ok: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { ok: false, message: 'Invalid or missing GEMINI_API_KEY.' };
  }

  const candidateModels = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
  for (const model of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with the word "OK"' }] }],
        }),
      });

      if (res.ok) {
        return { ok: true, message: `Gemini API key is active and responding (model: ${model}).` };
      }
    } catch {
      // Continue to next model candidate
    }
  }

  return { ok: false, message: 'Gemini API endpoints could not be reached or returned error.' };
}
