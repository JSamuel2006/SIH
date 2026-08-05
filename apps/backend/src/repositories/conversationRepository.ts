import {
  ConversationSession,
  ChatMessage,
  MessageCategory,
} from '../database/models/conversationModel.js';

export class ConversationRepository {
  private sessions: Map<string, ConversationSession> = new Map();

  public async createSession(userId: string, language = 'en'): Promise<ConversationSession> {
    const session: ConversationSession = {
      id: `sess-${Date.now()}`,
      userId,
      title: 'New Health Query',
      language,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  public async getSession(id: string): Promise<ConversationSession | null> {
    return this.sessions.get(id) || null;
  }

  public async getSessionsByUser(userId: string): Promise<ConversationSession[]> {
    return Array.from(this.sessions.values())
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  public async addMessage(
    sessionId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ): Promise<ChatMessage> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session ${sessionId} not found`);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      ...message,
      timestamp: new Date(),
    };

    session.messages.push(newMsg);
    session.updatedAt = new Date();

    // Auto-title from first user message
    if (session.messages.filter((m) => m.role === 'user').length === 1 && message.role === 'user') {
      session.title = message.content.slice(0, 60) + (message.content.length > 60 ? '...' : '');
    }

    return newMsg;
  }

  public async toggleFavorite(sessionId: string, messageId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;
    const msg = session.messages.find((m) => m.id === messageId);
    if (!msg) return false;
    msg.isFavorite = !msg.isFavorite;
    return msg.isFavorite;
  }

  public async submitFeedback(
    sessionId: string,
    messageId: string,
    feedback: 'UP' | 'DOWN'
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;
    const msg = session.messages.find((m) => m.id === messageId);
    if (msg) msg.feedback = feedback;
  }

  public async deleteSession(id: string): Promise<boolean> {
    return this.sessions.delete(id);
  }
}

export const conversationRepository = new ConversationRepository();
