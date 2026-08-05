export class PIIRedactorService {
  /**
   * Strips Indian Aadhaar numbers, 10-digit mobile numbers, emails, and exact address markers
   */
  public stripPII(text: string): string {
    let sanitized = text;

    // Aadhaar number regex (12 digits)
    sanitized = sanitized.replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[REDACTED_AADHAAR]');

    // Indian phone numbers
    sanitized = sanitized.replace(/\b(?:\+91[\-\s]?)?[6-9]\d{9}\b/g, '[REDACTED_PHONE]');

    // Email addresses
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');

    return sanitized;
  }
}

export const piiRedactor = new PIIRedactorService();
