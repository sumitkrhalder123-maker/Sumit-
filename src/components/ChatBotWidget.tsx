import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  Phone,
  Mail,
  RotateCcw,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  role: 'assistant',
  text: `Hi! 👋 I am **Sumit Kumar Halder's** AI Assistant.\n\nAsk me anything about his **portfolio link, phone number, rates, cinematic editing**, or AI workflows. I provide quick, compact answers!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const SUGGESTED_QUESTIONS = [
  { label: '🎨 Portfolio Link', prompt: 'Please give me Sumit’s portfolio and projects link.' },
  { label: '📞 Phone & WhatsApp', prompt: 'What is Sumit’s phone number and WhatsApp?' },
  { label: '🎬 Cinematic & Video', prompt: 'What are your cinematic framerates, 180 shutter rule, and grading tools?' },
  { label: '🤖 AI Video & Image Stack', prompt: 'Which AI models and ComfyUI workflows does Sumit master?' },
  { label: '💰 Rates & Pricing', prompt: 'What are the pricing options and rates for projects?' },
  { label: '📍 Studio Location', prompt: 'Where is Graphics Sumit office located?' },
];

export const ChatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowTooltip(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Hide floating tooltip after 10s if not interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build past history for multi-turn context
      const historyPayload = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
        }),
      });

      const data = await res.json();

      let replyText = data.reply;
      if (!replyText) {
        replyText = `You can directly reach Sumit Kumar Halder at:\n\n📞 **Phone**: [+91 9062355706](tel:+919062355706)\n✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)\n\nFeel free to ask any other questions!`;
      }

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMessage: ChatMessage = {
        id: `asst-fallback-${Date.now()}`,
        role: 'assistant',
        text: `You can reach **Sumit Kumar Halder (Graphics Sumit)** directly at:\n\n📞 **Phone / WhatsApp**: [+91 9062355706](tel:+919062355706)\n✉️ **Email**: [sumitkrhalder26@gmail.com](mailto:sumitkrhalder26@gmail.com)\n📍 **Studio**: Graphics Sumit, North Dumdum, Kolkata 700028, West Bengal, India`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Render markdown-like bold text, bullet points and links cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-sm">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Convert **bold** and markdown links [text](url)
          const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);

          const formattedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-semibold text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
              const match = part.match(/\[(.*?)\]\((.*?)\)/);
              if (match) {
                const [, label, href] = match;
                const isHash = href.startsWith('#');
                return (
                  <a
                    key={pIdx}
                    href={href}
                    target={isHash ? undefined : '_blank'}
                    rel={isHash ? undefined : 'noopener noreferrer'}
                    onClick={(e) => {
                      if (isHash) {
                        e.preventDefault();
                        const elem = document.querySelector(href);
                        if (elem) {
                          elem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="text-cyan-400 hover:text-cyan-300 underline font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    {label}
                  </a>
                );
              }
            }
            return part;
          });

          // Bullet points (-, *, •)
          const trimmed = line.trim();
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <span className="flex-1">{formattedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{formattedLine}</p>;
        })}
      </div>
    );
  };

  // Detect if message provides contact or portfolio info to render direct 1-tap buttons
  const hasContactDetails = (text: string) => {
    const t = text.toLowerCase();
    return t.includes('9062355706') || t.includes('phone') || t.includes('whatsapp') || t.includes('sumitkrhalder') || t.includes('portfolio') || t.includes('#portfolio');
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON & POPUP CONTAINER (Fixed Bottom Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
        
        {/* INVITING FLOATING CHAT TEASER PILL (When closed) */}
        <AnimatePresence>
          {!isOpen && showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 max-w-[260px] sm:max-w-[290px] p-3 rounded-2xl bg-[#0e1422]/95 border border-cyan-500/30 backdrop-blur-md shadow-2xl flex items-center gap-3 cursor-pointer group"
              onClick={() => setIsOpen(true)}
              id="chatbot-teaser-pill"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Bot className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <span>Chat with Sumit’s AI</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  Ask for phone, services, rates & details
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="text-slate-500 hover:text-slate-300 p-1"
                aria-label="Dismiss teaser"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHAT WINDOW MODAL / POPUP */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92, transformOrigin: 'bottom right' }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.92 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mb-4 w-[calc(100vw-2.5rem)] sm:w-[410px] h-[550px] max-h-[calc(100vh-6.5rem)] rounded-2xl bg-[#090d16] border border-cyan-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.18)] backdrop-blur-2xl flex flex-col overflow-hidden"
              id="chatbot-window"
            >
              {/* HEADER */}
              <div className="p-4 bg-[#0d1424] border-b border-slate-800 flex items-center justify-between shrink-0 relative">
                {/* Background glow strip */}
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                      <Bot className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#090d16] rounded-full ring-1 ring-emerald-400/50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">Graphics Sumit AI</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        3.8 Flash
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Online • Instant Answers</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleResetChat}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    title="Reset conversation"
                    aria-label="Reset chat"
                    id="chatbot-reset-btn"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    title="Close chat"
                    aria-label="Close chat"
                    id="chatbot-close-btn"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* MESSAGES SCROLL THREAD */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const showContactBar = !isUser && hasContactDetails(msg.text);

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow-md relative ${
                          isUser
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                            : 'bg-[#121927] border border-slate-700/60 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        {/* Message content */}
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        ) : (
                          renderFormattedText(msg.text)
                        )}

                        {/* Interactive contact quick actions when number, contact or portfolio is present */}
                        {showContactBar && (
                          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-2">
                            {(msg.text.toLowerCase().includes('portfolio') || msg.text.includes('#portfolio')) && (
                              <a
                                href="#portfolio"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-semibold transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                                <span>View Portfolio</span>
                              </a>
                            )}
                            <a
                              href={`tel:${PERSONAL_INFO.phone}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>Call {PERSONAL_INFO.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/919062355706?text=${encodeURIComponent(
                                'Hi Sumit, I found your portfolio and would like to discuss a project.'
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`mailto:${PERSONAL_INFO.email}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-semibold transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Email</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Footer info: timestamp & copy */}
                      <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopyText(msg.text, msg.id)}
                            className="hover:text-slate-300 flex items-center gap-1 transition-colors"
                            title="Copy message"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* TYPING LOADER */}
                {isLoading && (
                  <div className="flex items-start gap-2 text-slate-400">
                    <div className="px-4 py-3 rounded-2xl bg-[#121927] border border-slate-700/60 rounded-bl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span className="text-xs text-slate-300">Sumit’s AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK SUGGESTION CHIPS (Visible anytime or when messages are few) */}
              <div className="px-3 py-2 bg-[#0d1424]/90 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider shrink-0 pl-1">
                  Ask:
                </span>
                {SUGGESTED_QUESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 transition-colors shrink-0 active:scale-95 disabled:opacity-50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-[#0a0f1c] border-t border-slate-800 shrink-0">
                <div className="flex items-center gap-2 bg-[#121927] border border-slate-700/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30 rounded-xl px-3 py-1.5 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Sumit, his phone, rates, skills..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-1"
                    id="chatbot-input"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-colors shrink-0"
                    aria-label="Send message"
                    id="chatbot-send-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-500">
                  <span>Powered by Gemini 3.8 Flash</span>
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Direct Contact Form</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING TRIGGER BUTTON (Look like message option) */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-600 text-slate-950 shadow-[0_10px_25px_rgba(6,182,212,0.45),0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center border border-cyan-300/40 group focus:outline-none focus:ring-4 focus:ring-cyan-500/30"
          aria-label={isOpen ? 'Close chat' : 'Open message option'}
          id="chatbot-floating-toggle-btn"
        >
          {/* Ambient pulse ring when closed */}
          {!isOpen && (
            <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
          )}

          {/* Unread badge dot */}
          {!isOpen && hasUnread && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#070a11] rounded-full shadow-sm" />
          )}

          {/* Icon Switch: Message vs Close */}
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.div
                key="close-icon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-7 h-7 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat-icon"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative"
              >
                <MessageSquare className="w-7 h-7 text-slate-950 fill-slate-950/20 group-hover:scale-105 transition-transform" />
                <Sparkles className="w-3.5 h-3.5 text-white absolute -top-1 -right-1 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};
