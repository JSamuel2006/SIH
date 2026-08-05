import { Request, Response, NextFunction } from 'express';
import { conversationRepository } from '../repositories/conversationRepository.js';
import { buildAIResponse } from '../services/ai-services/medicalKnowledgeBase.js';
import { bhashiniService } from '../services/ai-services/bhashiniService.js';
import { piiRedactor } from '../services/ai-services/piiRedactor.js';
import { geminiService } from '../services/ai-services/geminiService.js';

// POST /api/v1/assistant/sessions — Create a new conversation session
export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId = 'usr-901', language = 'en' } = req.body;
    const session = await conversationRepository.createSession(userId, language);
    return res.status(201).json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/assistant/sessions — Get all sessions for a user
export async function getSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req.query.userId as string) || 'usr-901';
    const sessions = await conversationRepository.getSessionsByUser(userId);
    return res.status(200).json({ success: true, data: { sessions } });
  } catch (error) {
    next(error);
  }
}

// GET /api/v1/assistant/sessions/:id — Get a specific session with messages
export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await conversationRepository.getSession(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    return res.status(200).json({ success: true, data: { session } });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/v1/assistant/sessions/:id — Delete a session
export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const deleted = await conversationRepository.deleteSession(req.params.id);
    return res.status(200).json({ success: true, data: { deleted } });
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/assistant/sessions/:id/messages — Send a message and get AI response
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId } = req.params;
    const { content, language = 'en', userId = 'usr-901' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    // 1. Validate session exists — create if not
    let session = await conversationRepository.getSession(sessionId);
    if (!session) {
      session = await conversationRepository.createSession(userId, language);
    }

    // 2. Sanitize PII from user input
    const sanitizedContent = piiRedactor.stripPII(content.trim());

    // 3. Translate to English if needed for knowledge lookup
    const englishQuery =
      language !== 'en'
        ? await bhashiniService.translateText(sanitizedContent, language, 'en')
        : sanitizedContent;

    // 4. Store user message
    const userMessage = await conversationRepository.addMessage(session.id, {
      role: 'user',
      content: sanitizedContent,
      language,
      category: 'GENERAL',
      isFavorite: false,
    });

    // 5. Try Gemini AI first with ICMR-grounded system instruction
    const ICMR_SYSTEM_PROMPT = `You are ArogyaMitra, an expert public health AI assistant for India, grounded in ICMR (Indian Council of Medical Research), WHO SEARO, and MoHFW (Ministry of Health & Family Welfare) guidelines.

Your role is to provide accurate, evidence-based public health information to Indian citizens and health workers.

RULES:
1. ONLY provide information grounded in ICMR, WHO, or MoHFW guidelines.
2. NEVER provide a definitive medical diagnosis. Always advise consulting a Registered Medical Practitioner (RMP).
3. For ANY emergency symptoms (chest pain, difficulty breathing, unconsciousness, high fever with rash, severe bleeding), immediately direct the person to call 108 or visit the nearest emergency room.
4. Always mention that your response is for public health awareness only.
5. Structure your response clearly with: a brief summary, key information, preventive measures (if relevant), and the recommended next action.
6. Be compassionate and clear. Avoid medical jargon where possible.
7. For Indian-specific diseases (Dengue, Malaria, Typhoid, Cholera, TB, Japanese Encephalitis), reference India-specific prevalence and prevention guidelines.
8. End EVERY response with: "⚕️ This information is for public health awareness only and is NOT a medical prescription. Please consult a Registered Medical Practitioner for diagnosis and treatment."`;

    let responseText: string;
    let aiCategory = 'GENERAL';
    let aiSources = ['ICMR National Guidelines', 'WHO SEARO'];
    let isEmergency = false;
    let confidence = 0.88;
    let usedGemini = false;

    try {
      responseText = await geminiService.generateText(englishQuery, ICMR_SYSTEM_PROMPT);
      usedGemini = true;

      // Detect emergency keywords in Gemini response for escalation flag
      const emergencyKeywords = ['call 108', 'emergency', 'immediately', 'urgent', 'hospital'];
      isEmergency = emergencyKeywords.some(k => responseText.toLowerCase().includes(k));
    } catch (geminiError) {
      // 6. Fallback to ICMR knowledge base if Gemini fails
      const fallbackResponse = buildAIResponse(englishQuery);
      responseText = formatResponseText(fallbackResponse);
      aiCategory = fallbackResponse.category;
      aiSources = fallbackResponse.sources;
      isEmergency = fallbackResponse.isEmergency;
      confidence = fallbackResponse.confidence;
    }

    // 7. Translate response back if needed
    const localizedResponse =
      language !== 'en'
        ? await bhashiniService.translateText(responseText, 'en', language)
        : responseText;

    // 8. Store assistant message
    const assistantMessage = await conversationRepository.addMessage(session.id, {
      role: 'assistant',
      content: localizedResponse,
      language,
      category: aiCategory as any,
      isFavorite: false,
      sources: aiSources,
      confidence,
      isEmergency,
      disclaimer: 'This information is for public health awareness only. Consult a Registered Medical Practitioner for diagnosis.',
    });

    return res.status(200).json({
      success: true,
      data: {
        userMessage,
        assistantMessage,
        sessionId: session.id,
        meta: { poweredBy: usedGemini ? geminiService.getActiveModel() : 'icmr-knowledge-base', isEmergency },
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/assistant/sessions/:sessionId/messages/:messageId/favorite — Toggle favorite
export async function toggleFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, messageId } = req.params;
    const isFavorite = await conversationRepository.toggleFavorite(sessionId, messageId);
    return res.status(200).json({ success: true, data: { isFavorite } });
  } catch (error) {
    next(error);
  }
}

// POST /api/v1/assistant/sessions/:sessionId/messages/:messageId/feedback — Submit feedback
export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, messageId } = req.params;
    const { feedback } = req.body;
    await conversationRepository.submitFeedback(sessionId, messageId, feedback);
    return res.status(200).json({ success: true, data: { message: 'Feedback recorded. Thank you.' } });
  } catch (error) {
    next(error);
  }
}

// Helper: Format AI response as readable markdown text
function formatResponseText(resp: import('../services/ai-services/medicalKnowledgeBase.js').StructuredAIResponse): string {
  if (resp.isEmergency && resp.emergencyMessage) {
    return `## 🚨 ${resp.summary}\n\n${resp.detailedExplanation}\n\n### Immediate Actions:\n${resp.recommendedPrecautions.map((p) => `- ${p}`).join('\n')}\n\n---\n*${resp.disclaimer}*`;
  }

  const parts: string[] = [
    `## ${resp.summary}`,
    `\n${resp.detailedExplanation}`,
  ];

  if (resp.preventiveMeasures.length > 0) {
    parts.push(`\n### 🛡️ Preventive Measures\n${resp.preventiveMeasures.map((p) => `- ${p}`).join('\n')}`);
  }

  if (resp.recommendedPrecautions.length > 0) {
    parts.push(`\n### ⚠️ Recommended Precautions\n${resp.recommendedPrecautions.map((p) => `- ${p}`).join('\n')}`);
  }

  if (resp.govtResources.length > 0) {
    parts.push(`\n### 🏛️ Government Resources\n${resp.govtResources.map((r) => `- ${r}`).join('\n')}`);
  }

  parts.push(`\n### ✅ Next Recommended Action\n${resp.nextRecommendedAction}`);
  parts.push(`\n---\n*Confidence: ${Math.round(resp.confidence * 100)}% | Sources: ${resp.sources.slice(0, 2).join(', ')}*`);
  parts.push(`\n> ⚕️ **${resp.disclaimer}**`);

  return parts.join('\n');
}
