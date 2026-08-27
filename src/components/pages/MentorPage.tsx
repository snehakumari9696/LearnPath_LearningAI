import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Code, 
  HelpCircle, 
  Lightbulb, 
  Zap,
  Trash2
} from 'lucide-react';
import { ChatMessage, Roadmap } from '../../types';

interface MentorPageProps {
  activeRoadmap: Roadmap | null;
  initialTopic?: string;
}

export const MentorPage: React.FC<MentorPageProps> = ({
  activeRoadmap,
  initialTopic = '',
}) => {
  const [topic, setTopic] = useState<string>(initialTopic || (activeRoadmap ? activeRoadmap.phases[0]?.topics[0] || activeRoadmap.skill : 'Machine Learning & Python'));
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: `Hello! I am your **AI Learning Mentor**. I'm here to answer technical questions, explain tricky formulas or architectures, generate code examples, and help you master **${activeRoadmap ? activeRoadmap.skill : 'your chosen technology'}**.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const presetPrompts = [
    { label: 'Intuitive Analogy', prompt: `Can you explain ${topic} using a simple, intuitive real-world analogy?` },
    { label: 'Production Code Sample', prompt: `Provide a clean, modern code snippet demonstrating how ${topic} is implemented in production.` },
    { label: 'Common Pitfalls', prompt: `What are the top 3 common bugs or misconceptions when working with ${topic}?` },
    { label: 'Interview Questions', prompt: `Give me 2 real-world technical interview questions testing knowledge of ${topic}.` }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || inputQuestion;
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          contextTopic: topic,
          skill: activeRoadmap?.skill || 'Software & AI Engineering',
          currentLevel: activeRoadmap?.difficulty || 'Intermediate'
        })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'I am ready to help with your next question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue connecting to the AI core. Please check your network or try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      const plainText = text.replace(/[*#`_]/g, '');
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4 text-white">
      {/* Header & Topic Context */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Interactive AI Learning Mentor
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Gemini 3.7 Flash
              </span>
            </h1>
            <p className="text-xs text-gray-400">Ask questions, request code, or clarify roadmap topics.</p>
          </div>
        </div>

        {/* Topic Input / Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Focus Topic:</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Focus topic..."
            className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-44 sm:w-56 font-medium"
          />
        </div>
      </div>

      {/* Preset Action Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Prompts:
        </span>
        {presetPrompts.map((p) => (
          <button
            key={p.label}
            onClick={() => handleSendMessage(p.prompt)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 text-gray-300 hover:text-indigo-200 transition-all font-medium"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 min-h-[400px] max-h-[550px] overflow-y-auto p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white/[0.06] border border-white/10 text-gray-200 rounded-tl-none space-y-2'
            }`}>
              <div className="whitespace-pre-wrap font-sans">
                {msg.text}
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[10px] text-gray-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      title="Read aloud"
                      className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
                    >
                      {speaking ? <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      title="Copy response"
                      className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shrink-0 mt-1">
                <span className="text-xs font-bold text-white">YOU</span>
              </div>
            )}
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-gray-400 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span>Thinking & formulating explanation...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2 p-2 rounded-2xl bg-white/[0.05] border border-white/15 focus-within:border-indigo-500 transition-all"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={`Ask the AI Mentor anything about ${topic}...`}
          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
