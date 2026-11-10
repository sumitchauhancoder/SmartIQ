import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  ChevronDown, 
  Zap, 
  Compass, 
  Award, 
  Check, 
  Copy,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { sendChatMessage } from '../api';

export default function IntelligenceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your **Enigma AI Guide**.\n\nAsk me any quick question about improving your **IQ** (thinking), **EQ** (handling stress), **SQ** (calm & values), or **AQ** (adapting to change)!`,
      model: 'Groq Llama 3.3',
      source: 'groq'
    }
  ]);

  // Read scores from localStorage for context-aware responses
  const [userContext, setUserContext] = useState({});

  useEffect(() => {
    try {
      const iq = JSON.parse(localStorage.getItem('enigma_iq_data') || localStorage.getItem('smartiq_iq_data') || sessionStorage.getItem('enigma_iq_data') || sessionStorage.getItem('smartiq_iq_data') || 'null');
      const eq = JSON.parse(localStorage.getItem('enigma_eq_data') || localStorage.getItem('smartiq_eq_data') || sessionStorage.getItem('enigma_eq_data') || sessionStorage.getItem('smartiq_eq_data') || 'null');
      const sq = JSON.parse(localStorage.getItem('enigma_sq_data') || localStorage.getItem('smartiq_sq_data') || sessionStorage.getItem('enigma_sq_data') || sessionStorage.getItem('smartiq_sq_data') || 'null');
      const aq = JSON.parse(localStorage.getItem('enigma_aq_data') || localStorage.getItem('smartiq_aq_data') || sessionStorage.getItem('enigma_aq_data') || sessionStorage.getItem('smartiq_aq_data') || 'null');

      setUserContext({
        iq_score: iq?.iq_score || null,
        eq_score: eq?.eq_score || null,
        sq_score: sq?.sq_score || null,
        aq_score: aq?.aq_score || null,
        archetype_title: aq?.ai_analysis?.archetype_title || sq?.ai_analysis?.archetype_title || eq?.ai_analysis?.archetype_title || iq?.ai_analysis?.archetype_title || null
      });
    } catch (e) {}
  }, [isOpen]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const result = await sendChatMessage(newMessages, userContext);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: result.response,
          model: result.model || 'Groq Llama 3.3',
          source: result.source || 'groq'
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I apologize, but I encountered an unexpected interruption. Please ask your question again or explore our Cognitive Gym!",
          model: 'Enigma Fallback',
          source: 'local'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat cleared! Ask me anything about IQ, EQ, SQ, or AQ.`,
        model: 'Groq Llama 3.3',
        source: 'groq'
      }
    ]);
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Quick suggestion chips
  const suggestedPrompts = [
    "How can I improve my adaptability (AQ)?",
    "Tips to stay calm under pressure",
    "Difference between IQ and EQ",
    "Simple 2-minute daily focus habit"
  ];

  const hasScores = userContext.iq_score || userContext.eq_score || userContext.sq_score || userContext.aq_score;

  return (
    <>
      {/* =====================================================================
          1. THE ROUND FLOATING BALL TRIGGER
          ===================================================================== */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center group">
          {/* Subtle Hover Tooltip Pill */}
          <div className="hidden sm:flex items-center gap-1.5 mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-indigo-500/40 text-slate-200 text-xs font-semibold shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-x-2 group-hover:translate-x-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Ask Groq AI • Intelligence Mentor</span>
          </div>

          {/* The Circular Glowing Ball */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Groq Intelligence Chatbot"
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          >
            {/* Outer Pulsing Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 blur-md opacity-60 group-hover:opacity-100 animate-pulse"></div>

            {/* Inner Core Ball */}
            <div className="relative w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400 group-hover:text-emerald-300 transition-colors" />

              {/* Live Groq Active Badge */}
              <span className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            </div>
          </button>
        </div>
      )}

      {/* =====================================================================
          2. EXPANDED SIDE CHATBOT PANEL
          ===================================================================== */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[420px] h-[85vh] sm:h-[620px] max-h-[720px] rounded-3xl glass-panel border border-indigo-500/40 shadow-2xl flex flex-col overflow-hidden bg-slate-950/95 backdrop-blur-xl animate-fadeIn">
          {/* Header Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-emerald-500 p-[2px]">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">Enigma Intelligence AI</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                    Groq
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ask anything about IQ • EQ • SQ • AQ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chatbot"
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Profile Intelligence Context Chip (if available) */}
          {hasScores && (
            <div className="px-3.5 py-1.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] overflow-x-auto">
              <span className="text-slate-400 font-medium whitespace-nowrap mr-2">Your Profile:</span>
              <div className="flex items-center gap-2 whitespace-nowrap font-mono text-[10px]">
                {userContext.iq_score && (
                  <span className="text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40 font-bold">
                    IQ: {userContext.iq_score}
                  </span>
                )}
                {userContext.eq_score && (
                  <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40 font-bold">
                    EQ: {userContext.eq_score}
                  </span>
                )}
                {userContext.sq_score && (
                  <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40 font-bold">
                    SQ: {userContext.sq_score}
                  </span>
                )}
                {userContext.aq_score && (
                  <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                    AQ: {userContext.aq_score}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed relative ${
                      isUser
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                        : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {/* Render basic Markdown lines cleanly */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {msg.content.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>
                          {paragraph.split('\n').map((line, lIdx) => {
                            if (line.startsWith('### ')) {
                              return <strong key={lIdx} className="block text-indigo-300 text-xs mb-1 font-bold">{line.replace('### ', '')}</strong>;
                            }
                            if (line.startsWith('- ')) {
                              return (
                                <span key={lIdx} className="block pl-2 my-0.5 text-slate-300">
                                  • {line.replace('- ', '')}
                                </span>
                              );
                            }
                            return <span key={lIdx} className="block">{line}</span>;
                          })}
                        </p>
                      ))}
                    </div>

                    {!isUser && (
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400">
                        <span className="font-mono text-indigo-400/80 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          {msg.model || 'Groq Llama 3.3'}
                        </span>
                        <button
                          onClick={() => handleCopyMessage(msg.content, idx)}
                          title="Copy message"
                          className="hover:text-white transition-colors"
                        >
                          {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking / Typing Indicator */}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 px-3 bg-slate-900/60 rounded-2xl w-fit border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <span>Groq AI is answering...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips (Only shown on welcome screen before chatting) */}
          {messages.length === 1 && !loading && (
            <div className="px-3.5 py-2 bg-slate-900/60 border-t border-slate-800/80">
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>Quick questions:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800">
            <div className="relative flex items-center">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask Groq about IQ, EQ, SQ, AQ, Stoicism, or drills..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500/80 rounded-2xl py-2.5 pl-3.5 pr-11 text-xs text-white placeholder-slate-500 resize-none outline-none transition-all shadow-inner"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || loading}
                className={`absolute right-2 p-1.5 rounded-xl transition-all ${
                  inputMessage.trim() && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>Press Enter to send • Groq Accelerated</span>
              <span className="text-emerald-400 font-mono">Llama 3.3 70B</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
