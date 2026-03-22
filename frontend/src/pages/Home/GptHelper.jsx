import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, MessageSquare, Plus } from 'lucide-react';

const INITIAL_MESSAGES = [
  { 
    id: 1, 
    type: 'ai', 
    text: "Hello! I'm your GTP Helper. I can help you with study tips, course concepts, or any educational questions you have. How can I assist you today?",
    time: "Just now"
  }
];

const PREDEFINED_RESPONSES = {
  "hello": "Hello! I'm ready to help you learn. What subject are we focusing on today?",
  "hi": "Greetings! Ready to tackle some educational questions?",
  "project": "Projects are essential for practical learning. You can find yours under 'Books & Projects' in the navbar.",
  "exam": "Exams can be stressful, but practice helps! Our 'Free exam' tool lets you test yourself.",
  "study": "Effective studying involves active recall. Try explaining a concept out loud!",
  "data science": "Data Science involves extracting insights from data using statistics, AI, and analysis techniques.",
  "business": "Business Management is about coordinating people and resources to achieve strategic goals.",
  "react": "React is a powerful JS library for building user interfaces with reusable components.",
  "javascript": "JavaScript is the core language of web development, allowing for interactive web pages.",
  "database": "A database stores information accurately and efficiently.",
  "lms": "LMS stands for Learning Management System. EduVault is your central place for learning.",
  "thank": "You're very welcome! Happy learning!",
  "thanks": "Glad I could help! Is there anything else?",
  "default": "That's a good question! For specific course details, check your syllabus or ask your lecturer. Anything else I can help with?",
};

const SUGGESTIONS = [
  "How to study effectively?",
  "Tell me about Projects",
  "What is Data Science?",
  "How to take a Free Exam?",
  "What is React?"
];

export default function GptHelper() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e, text = null) => {
    if (e) e.preventDefault();
    const finalInput = text || inputValue;
    if (!finalInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: finalInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!text) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = finalInput.toLowerCase();
      let aiText = PREDEFINED_RESPONSES["default"];

      for (const key in PREDEFINED_RESPONSES) {
        if (lowerInput.includes(key)) {
          aiText = PREDEFINED_RESPONSES[key];
          break;
        }
      }

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 64px)', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', display: 'flex', height: '80vh', overflow: 'hidden', border: '1px solid #eef2f6' }}>
        
        {/* Sidebar */}
        <div style={{ width: '280px', backgroundColor: '#fafafa', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.8rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
            <Plus size={18} /> New Chat
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Today</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '0.75rem', color: '#059669', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
              <MessageSquare size={16} /> Learning Assistant
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: msg.type === 'user' ? 'row-reverse' : 'row', gap: '0.875rem', maxWidth: '85%' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', background: msg.type === 'user' ? '#1f2937' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {msg.type === 'user' ? <User size={18} color="#fff" /> : <Sparkles size={18} color="#fff" />}
                  </div>
                  <div style={{ 
                    padding: '1.25rem', 
                    borderRadius: msg.type === 'user' ? '1.25rem 0.25rem 1.25rem 1.25rem' : '0.25rem 1.25rem 1.25rem 1.25rem',
                    background: msg.type === 'user' ? '#1f2937' : '#f8fafc',
                    color: msg.type === 'user' ? '#fff' : '#334155',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    border: msg.type === 'ai' ? '1px solid #f1f5f9' : 'none',
                    boxShadow: msg.type === 'ai' ? '0 1px 3px rgba(0,0,0,0.02)' : 'none'
                  }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', gap: '0.875rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: '10px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={18} color="#fff" />
                </div>
                <div style={{ padding: '0.8rem 1.25rem', background: '#f8fafc', borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', animation: 'bounce 0.8s infinite alternate' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', animation: 'bounce 0.8s infinite 0.2s alternate' }} />
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8', animation: 'bounce 0.8s infinite 0.4s alternate' }} />
                </div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                {SUGGESTIONS.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => handleSend(null, s)}
                    style={{ padding: '0.625rem 1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '2rem', fontSize: '0.875rem', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '2rem', borderTop: '1px solid #f1f5f9', background: '#fff' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Message your educational assistant..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)' }} 
                onFocus={e => e.currentTarget.style.borderColor = '#10b981'}
                onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim() || isTyping}
                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '1rem', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!inputValue.trim() || isTyping) ? 0.5 : 1, transition: 'all 0.2s' }}
                onMouseEnter={e => { if(!isTyping && inputValue.trim()) e.currentTarget.style.backgroundColor = '#059669'; }}
                onMouseLeave={e => { if(!isTyping && inputValue.trim()) e.currentTarget.style.backgroundColor = '#10b981'; }}
              >
                <Send size={20} />
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '1.25rem', fontWeight: 500 }}>
              EduVault GTP Helper • Powered by Advanced Education AI
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce { from { transform: translateY(0); opacity: 0.6; } to { transform: translateY(-3px); opacity: 1; } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
