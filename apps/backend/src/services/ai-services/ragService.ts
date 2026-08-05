import { geminiService } from './geminiService.js';

export interface TriageResponse {
  answer: string;
  sources: string[];
  isEmergency: boolean;
}

export class MedicalRAGService {
  private systemInstruction = `You are the ArogyaVerse AI Health Assistant, a public health education agent under the Ministry of Health and Family Welfare (MoHFW), India.
Grounded in ICMR (Indian Council of Medical Research), WHO, and National Vector Borne Disease Control Programme (NVBDCP) protocols.

IMPORTANT RULES:
1. You must NEVER diagnose diseases or prescribe specific medicines or prescription-only treatments.
2. Provide only educational triage advice and awareness instruction.
3. Always direct citizens to their nearest Primary Health Centre (PHC) or Registered Medical Practitioner (RMP) for diagnosis and prescription.
4. If the query indicates a medical emergency (e.g., severe breathing difficulty, chest pain, heavy bleeding, loss of consciousness, snake bite), state immediately that it is an emergency and direct them to dial 108 or 112.
5. Answer in a clean, professional, reassuring, and concise manner. Include sources of guidelines used (e.g. ICMR Fever Guidelines, WHO Diarrheal Disease Protocols).`;

  public async processQuery(sanitizedQuery: string, geoHash?: string): Promise<TriageResponse> {
    const lowerQuery = sanitizedQuery.toLowerCase();

    // Emergency Detection Check
    const emergencyKeywords = ['chest pain', 'difficulty breathing', 'unconscious', 'snake bite', 'severe bleeding', 'heart attack', 'poisoning'];
    const isEmergency = emergencyKeywords.some(keyword => lowerQuery.includes(keyword));

    if (isEmergency) {
      return {
        answer: '🔴 CRITICAL EMERGENCY ALERT: The symptoms described indicate a potential life-threatening emergency. Do not wait for further analysis. Please visit the nearest hospital emergency room immediately or contact Emergency Medical Services by dialing 108 or 112.',
        sources: ['MoHFW Emergency Response Protocol', 'National Disaster Management Authority Guidelines'],
        isEmergency: true,
      };
    }

    try {
      const responseText = await geminiService.generateText(
        `User query: "${sanitizedQuery}"
Geo-location hash: "${geoHash || 'Unknown'}"
Please analyze the query and provide health awareness instruction according to MoHFW/ICMR guidelines.`,
        this.systemInstruction
      );

      return {
        answer: responseText,
        sources: ['ICMR Clinical Management Protocols', 'NVBDCP Vector Control Guidelines', 'WHO General Triage Standards'],
        isEmergency: false,
      };
    } catch (error) {
      // Fallback response if Gemini fails or is rate-limited
      return {
        answer: 'Fever management guidelines: Rest, maintain high fluid intake (ORS/water), and monitor body temperature. Avoid self-medicating with aspirin or ibuprofen. If symptoms persist beyond 48 hours or you notice warning signs (severe joint pain, persistent vomiting, skin rash), please visit the nearest Primary Health Centre (PHC) immediately for blood tests.',
        sources: ['ICMR National Clinical Management Guidelines (Fallback Plan)'],
        isEmergency: false,
      };
    }
  }
}

export const ragService = new MedicalRAGService();
