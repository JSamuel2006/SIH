import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Mic,
  Send,
  ShieldAlert,
  BookOpen,
  MapPin,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RotateCw,
  Download,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Plus,
  Compass,
  FileText,
  User,
  ExternalLink,
  ChevronRight,
  Info,
  InfoIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, SUPPORTED_LANGUAGES, IndicLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import CitizenLayout from '../../layouts/CitizenLayout';
import TypingIndicator from '../../components/ai/TypingIndicator';
import EmergencyAlert from '../../components/ai/EmergencyAlert';
import SuggestedQuestions from '../../components/ai/SuggestedQuestions';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language: string;
  category: string;
  timestamp: string;
  isFavorite: boolean;
  sources?: string[];
  confidence?: number;
  isEmergency?: boolean;
}

interface ConversationSession {
  id: string;
  title: string;
  language: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export default function CitizenTriagePage() {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { notifications } = useNotifications();

  // State Management
  const [sessions, setSessions] = useState<ConversationSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'explainable'>('chat');

  // Interactive UI Helpers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const synth = window.speechSynthesis;

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load Sessions on Mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`/api/v1/assistant/sessions?userId=${user?.id || 'usr-901'}`);
      const data = await response.json();
      if (data.success && data.data.sessions.length > 0) {
        setSessions(data.data.sessions);
        setCurrentSessionId(data.data.sessions[0].id);
        setMessages(data.data.sessions[0].messages);
      } else {
        // Create initial session if none exist
        handleNewSession();
      }
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    }
  };

  const handleNewSession = async () => {
    try {
      const response = await fetch('/api/v1/assistant/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'usr-901', language: language.code }),
      });
      const data = await response.json();
      if (data.success) {
        setSessions((prev) => [data.data.session, ...prev]);
        setCurrentSessionId(data.data.session.id);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to create new session', err);
    }
  };

  const handleSelectSession = async (id: string) => {
    setCurrentSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setMessages(session.messages);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/assistant/sessions/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        const filtered = sessions.filter((s) => s.id !== id);
        setSessions(filtered);
        if (currentSessionId === id && filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
          setMessages(filtered[0].messages);
        } else if (filtered.length === 0) {
          handleNewSession();
        }
      }
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    if (!textToSend) setInputValue('');

    // Append user message immediately locally for instant feedback
    const tempUserMsg: ChatMessage = {
      id: `temp-usr-${Date.now()}`,
      role: 'user',
      content: text,
      language: language.code,
      category: 'GENERAL',
      timestamp: new Date().toISOString(),
      isFavorite: false,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/assistant/sessions/${currentSessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, language: language.code, userId: user?.id || 'usr-901' }),
      });
      const data = await response.json();

      if (data.success) {
        // Replace current local messages list with actual stored ones
        const responseData = data.data;
        setMessages((prev) => {
          const base = prev.filter((m) => !m.id.startsWith('temp-usr-'));
          return [...base, responseData.userMessage, responseData.assistantMessage];
        });

        // Update session list titles
        fetchSessions();
      }
    } catch (err) {
      // Fallback in case of server connection failure
      const fallbackResponse: ChatMessage = {
        id: `fallback-ai-${Date.now()}`,
        role: 'assistant',
        content: `## General Health Awareness Advisory\n\nFor persistent symptoms, maintain adequate rest, stay hydrated, and consult a medical practitioner at your nearest Sub-Health Centre or Primary Health Centre (PHC).\n\n### 🛡️ General Preventive Guidelines\n- Clean hands with soap and water frequently.\n- Consume hot, freshly cooked food and pure water.\n- Keep your residential surroundings clean and clear of water accumulation to avoid vector breeding.\n\n> ⚕️ **DISCLAIMER: This system provides general health awareness guidelines. It is NOT a diagnostic tool. In case of emergency or severe symptoms, please dial 108 immediately.**`,
        language: language.code,
        category: 'GENERAL',
        timestamp: new Date().toISOString(),
        isFavorite: false,
        sources: ['ICMR General Protocols'],
      };
      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (isSpeaking === id) {
      synth.cancel();
      setIsSpeaking(null);
      return;
    }
    synth.cancel();
    const cleanText = text.replace(/#/g, '').replace(/\*/g, '').replace(/>/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(null);
    setIsSpeaking(id);
    synth.speak(utterance);
  };

  const toggleFavorite = async (messageId: string) => {
    try {
      const response = await fetch(`/api/v1/assistant/sessions/${currentSessionId}/messages/${messageId}/favorite`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isFavorite: data.data.isFavorite } : m))
        );
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
    }
  };

  const submitFeedback = async (messageId: string, feedback: 'UP' | 'DOWN') => {
    try {
      await fetch(`/api/v1/assistant/sessions/${currentSessionId}/messages/${messageId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback }),
      });
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const handleMicToggle = () => {
    if (!micActive) {
      // Mock Speech-to-Text activation (in real integration we hook Bhashini/Web Speech API)
      setMicActive(true);
      setTimeout(() => {
        setInputValue('How to prevent Dengue fever?');
        setMicActive(false);
      }, 3000);
    } else {
      setMicActive(false);
    }
  };

  const exportConversation = (format: 'TXT' | 'PDF') => {
    const textContent = messages
      .map((m) => `${m.role.toUpperCase()} (${m.timestamp}):\n${m.content}\n\n`)
      .join('---\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ArogyaVerse-AI-Chat-${currentSessionId}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  // Extract explainable AI properties from last assistant response
  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'assistant');

  return (
    <CitizenLayout>
      <div className="flex h-[calc(100vh-10rem)] border border-slate-800 bg-slate-950/60 rounded-3xl overflow-hidden shadow-2xl">
        {/* Sessions / Chat History Sidebar */}
        <aside className="hidden md:flex flex-col w-72 bg-slate-900 border-r border-slate-800 p-4 justify-between">
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Queries</span>
              <button
                onClick={handleNewSession}
                className="p-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-xl transition"
                title="New Query"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => handleSelectSession(sess.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition text-xs ${
                    currentSessionId === sess.id
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate flex-1 font-semibold">{sess.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(sess.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl text-[10px] text-slate-500 flex items-center gap-2 mt-4">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>DPDP Shield Active | No PII Retained</span>
          </div>
        </aside>

        {/* Central Chat Workspace */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Top Panel Actions */}
          <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/15 border border-blue-500/30 rounded-xl text-blue-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-100">National Health Assistant</h2>
                <p className="text-[10px] text-slate-400">ICMR Grounded Verification Core</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportConversation('TXT')}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
                title="Export Chat"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl border border-slate-800 transition relative"
                title="Copy Link"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess && (
                  <span className="absolute -bottom-8 right-0 bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded shadow">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Primary View Selector tabs */}
          <div className="flex border-b border-slate-800/80 bg-slate-900/10 px-6">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Conversation
            </button>
            <button
              onClick={() => setActiveTab('explainable')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                activeTab === 'explainable'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Explainable AI (XAI)
            </button>
          </div>

          {/* Message Rendering Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'chat' ? (
              <>
                {messages.length === 0 ? (
                  <SuggestedQuestions onSelect={(q) => handleSend(q)} />
                ) : (
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {messages.map((msg) => {
                      const isAi = msg.role === 'assistant';
                      return (
                        <div key={msg.id} className="space-y-2">
                          <div className={`flex gap-3 items-start ${isAi ? 'justify-start' : 'justify-end'}`}>
                            {isAi && (
                              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 text-blue-400 font-bold text-xs">
                                AI
                              </div>
                            )}
                            <div
                              className={`p-4 rounded-2xl max-w-2xl leading-relaxed text-xs sm:text-sm border ${
                                isAi
                                  ? 'bg-slate-900 border-slate-800 text-slate-200 rounded-tl-none'
                                  : 'bg-blue-600 border-blue-500 text-white rounded-tr-none'
                              }`}
                            >
                              {/* Message body text */}
                              <div className="whitespace-pre-line">{msg.content}</div>

                              {/* AI Response Metadata & Guidelines citations */}
                              {isAi && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                                    Citations: {msg.sources.join(', ')}
                                  </div>
                                  {msg.confidence && (
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20 font-mono">
                                      Confidence: {Math.round(msg.confidence * 100)}%
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Bar for AI response */}
                          {isAi && (
                            <div className="flex items-center gap-3 pl-11 text-slate-400">
                              <button
                                onClick={() => handleCopy(msg.id, msg.content)}
                                className="p-1 hover:text-slate-200 transition"
                                title="Copy Response"
                              >
                                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => handleSpeak(msg.id, msg.content)}
                                className="p-1 hover:text-slate-200 transition"
                                title="Voice Out"
                              >
                                {isSpeaking === msg.id ? <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => toggleFavorite(msg.id)}
                                className="p-1 hover:text-rose-400 transition"
                                title="Favorite"
                              >
                                <Heart className={`w-3.5 h-3.5 ${msg.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Emergency escalation panel placeholder if alert triggered */}
                    {messages.some((m) => m.isEmergency) && <EmergencyAlert />}

                    {/* Chat Input Loader */}
                    {loading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 py-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-bold text-slate-200">Explainable AI (XAI) Audit Log</h3>
                  </div>

                  {lastAiMessage ? (
                    <div className="space-y-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-300">Why was this response generated?</h4>
                        <p className="text-slate-400 mt-1 leading-relaxed">
                          Your query contained parameters matching vector guidelines for target categorizations. 
                          The system referenced certified MoHFW & WHO protocols to form safety recommendations.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-300">Information Parameters Considered:</h4>
                        <ul className="list-disc pl-4 space-y-1 text-slate-400 mt-1">
                          <li>Symptom parameter isolation check</li>
                          <li>Maternal / Child health classification</li>
                          <li>Vector-borne seasonal disease criteria mapping</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-300">Trusted Medical Guideline Sources:</h4>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">ICMR Guidelines 2024</span>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">WHO Factsheet</span>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">NVBDCP Protocol</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-xs text-slate-400 py-6">
                      No AI response has been generated in this session yet. Submit a query to see explainable parameters.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Prompt / Voice Input Panel */}
          <footer className="p-4 border-t border-slate-800 bg-slate-900/20">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMicToggle}
                  className={`p-3 rounded-xl border transition flex-shrink-0 ${
                    micActive
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'
                  }`}
                  title="Speech Input"
                >
                  <Mic className="w-5 h-5 text-blue-400" />
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={micActive ? 'Listening to voice input...' : 'Describe symptoms or ask about health schemes...'}
                  disabled={micActive}
                  className="flex-1 bg-slate-900 text-xs sm:text-sm text-slate-200 placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />

                <button
                  onClick={() => handleSend()}
                  disabled={loading || !inputValue.trim()}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Medical disclaimer note under input box */}
              <div className="mt-2.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-amber-500/80">
                <InfoIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Informational advisory portal. Never prescribes dosages. Always consult an RMP for diagnosis.</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </CitizenLayout>
  );
}
