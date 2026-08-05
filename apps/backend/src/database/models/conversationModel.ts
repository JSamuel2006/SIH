export type MessageRole = 'user' | 'assistant';
export type MessageCategory =
  | 'GENERAL'
  | 'DISEASE'
  | 'MEDICINE'
  | 'VACCINATION'
  | 'EMERGENCY'
  | 'SCHEME'
  | 'NUTRITION'
  | 'MATERNAL'
  | 'MENTAL_HEALTH';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  language: string;
  category: MessageCategory;
  timestamp: Date;
  isFavorite: boolean;
  feedback?: 'UP' | 'DOWN';
  sources?: string[];
  confidence?: number;
  isEmergency?: boolean;
  disclaimer?: string;
}

export interface ConversationSession {
  id: string;
  userId: string;
  title: string;
  language: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}
