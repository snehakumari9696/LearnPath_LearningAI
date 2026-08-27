import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { 
  MessageSquare, 
  Send, 
  Code2, 
  Smile, 
  Users, 
  Hash, 
  Flame, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  Lock, 
  Radio, 
  ShieldCheck,
  Bot,
  Zap,
  Award
} from 'lucide-react';
import { DiscussionMessage, DiscussionRoom, PageTab, UserProfile, UserStats, Roadmap } from '../../types';

interface DiscussionsPageProps {
  currentUser: UserProfile | null;
  stats: UserStats;
  activeRoadmap: Roadmap | null;
  onNavigateToTab: (tab: PageTab, contextData?: any) => void;
  onMessageSent?: () => void;
}

const studyRooms: DiscussionRoom[] = [
  {
    id: 'room-ai',
    name: 'ai-engineering',
    topic: 'Generative AI, Transformers, RAG & PyTorch',
    icon: '🤖',
    description: 'Deep discussions on model architectures, embeddings, vector DBs, and fine-tuning.',
    onlineCount: 8,
    category: 'ai'
  },
  {
    id: 'room-fullstack',
    name: 'fullstack-dev',
    topic: 'React 19, TypeScript & Node.js Ecosystem',
    icon: '⚡',
    description: 'Frontend state, Server Components, API design, and modern web architectures.',
    onlineCount: 6,
    category: 'fullstack'
  },
  {
    id: 'room-interview',
    name: 'interview-prep',
    topic: 'System Design & Algorithm Mock Drills',
    icon: '🎯',
    description: 'Practice distributed system design, LeetCode patterns, and behavioral defense.',
    onlineCount: 5,
    category: 'interview'
  },
  {
    id: 'room-showcase',
    name: 'project-showcase',
    topic: 'Portfolio Projects & Peer Code Review',
    icon: '🚀',
    description: 'Share your deployed demo links, GitHub repositories, and get architecture reviews.',
    onlineCount: 4,
    category: 'showcase'
  },
  {
    id: 'room-general',
    name: 'general-study',
    topic: 'Daily Study Sprints & Accountability',
    icon: '☕',
    description: 'Join synchronized Pomodoro focus sessions and celebrate daily milestones.',
    onlineCount: 9,
    category: 'general'
  }
];

export const DiscussionsPage: React.FC<DiscussionsPageProps> = ({
  currentUser,
  stats,
  activeRoadmap,
  onNavigateToTab,
  onMessageSent,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string>('room-ai');
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  const activeRoom = studyRooms.find((r) => r.id === activeRoomId) || studyRooms[0];

  // User profile fallback for socket
  const effectiveUser = {
    id: currentUser?.id || 'usr-default-alex',
    name: currentUser?.name || 'Alex Chen',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRole: currentUser?.targetRole || 'Senior AI Engineer'
  };

  // Connect to Socket.io server
  useEffect(() => {
    // Connect to origin socket
    const socket = io({
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      // Join initial room
      socket.emit('join_room', {
        roomId: activeRoomId,
        user: effectiveUser
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('chat_history', (history: DiscussionMessage[]) => {
      setMessages(history);
    });

    socket.on('receive_message', (newMsg: DiscussionMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    socket.on('room_users', (usersList: any[]) => {
      setOnlineUsers(usersList);
    });

    socket.on('reaction_updated', ({ messageId, reactions }: { messageId: string; reactions: any }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
      );
    });

    socket.on('user_typing', ({ user, isTyping }: { user: { name: string }; isTyping: boolean }) => {
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(user.name) ? prev : [...prev, user.name];
        } else {
          return prev.filter((name) => name !== user.name);
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Switch Room
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join_room', {
        roomId: activeRoomId,
        user: effectiveUser
      });
    }
  }, [activeRoomId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !codeSnippet.trim()) return;

    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        roomId: activeRoomId,
        message: {
          senderId: effectiveUser.id,
          senderName: effectiveUser.name,
          senderAvatar: effectiveUser.avatarUrl,
          senderRole: effectiveUser.targetRole,
          text: inputText.trim(),
          codeSnippet: codeSnippet.trim() || undefined,
          codeLanguage: 'typescript'
        }
      });

      // Stop typing
      socketRef.current.emit('typing', {
        roomId: activeRoomId,
        user: { name: effectiveUser.name },
        isTyping: false
      });
    }

    setInputText('');
    setCodeSnippet('');
    setShowCodeInput(false);

    if (onMessageSent) {
      onMessageSent();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (socketRef.current) {
      socketRef.current.emit('typing', {
        roomId: activeRoomId,
        user: { name: effectiveUser.name },
        isTyping: true
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing', {
            roomId: activeRoomId,
            user: { name: effectiveUser.name },
            isTyping: false
          });
        }
      }, 1500);
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (socketRef.current) {
      socketRef.current.emit('toggle_reaction', {
        roomId: activeRoomId,
        messageId,
        emoji,
        userId: effectiveUser.id
      });
    }
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleShareRoadmapProgress = () => {
    if (!activeRoadmap) return;
    const completedCount = activeRoadmap.phases.filter((p) => p.completed).length;
    const percent = Math.round((completedCount / activeRoadmap.phases.length) * 100);

    const shareText = `🎯 Just completed Phase ${completedCount} of my ${activeRoadmap.skill} roadmap: "${activeRoadmap.title}" (${percent}% overall progress)!`;
    setInputText(shareText);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full p-4 sm:p-6 text-white flex flex-col md:flex-row gap-6">
      {/* Sidebar: Channel & Rooms list */}
      <div className="w-full md:w-72 shrink-0 space-y-4">
        {/* Header box */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-indigo-950/30 to-black border border-emerald-500/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Study Rooms</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Socket.io
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
              <span>{isConnected ? 'Live' : 'Connecting'}</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Real-time collaborative study channels.</p>
        </div>

        {/* Room list */}
        <div className="space-y-1.5">
          {studyRooms.map((room) => {
            const isActive = room.id === activeRoomId;
            return (
              <button
                key={room.id}
                onClick={() => setActiveRoomId(room.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-emerald-500/15 border-emerald-400/50 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base shrink-0">{room.icon}</span>
                  <div className="min-w-0 truncate">
                    <div className="text-xs font-bold truncate flex items-center gap-1">
                      <Hash className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{room.name}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 truncate">{room.topic}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{onlineUsers.length || room.onlineCount}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Online Room Members */}
        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Active Learners ({onlineUsers.length || 4})
          </div>

          <div className="space-y-2">
            {(onlineUsers.length > 0 ? onlineUsers : [effectiveUser]).map((u: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <img
                    src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name || 'user')}`}
                    alt={u.name}
                    className="w-6 h-6 rounded-lg object-cover border border-white/20 bg-white/10"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black" />
                </div>
                <div className="min-w-0 truncate">
                  <div className="text-gray-200 font-medium truncate">{u.name}</div>
                  <div className="text-[10px] text-gray-400 truncate">{u.targetRole || 'Learner'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Discussion Chat Area */}
      <div className="flex-1 flex flex-col rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl min-h-[550px]">
        {/* Room Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg">
              {activeRoom.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
                  <Hash className="w-4 h-4 text-emerald-400" />
                  {activeRoom.name}
                </h2>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-white/10 text-gray-300">
                  {activeRoom.category}
                </span>
              </div>
              <p className="text-xs text-gray-400">{activeRoom.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeRoadmap && (
              <button
                onClick={handleShareRoadmapProgress}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                title="Share roadmap milestone in chat"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Progress
              </button>
            )}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[500px] scrollbar-thin">
          {messages.map((msg) => {
            const isMe = msg.senderId === effectiveUser.id || msg.senderName === effectiveUser.name;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.senderAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(msg.senderName)}`}
                  alt={msg.senderName}
                  className="w-9 h-9 rounded-2xl object-cover border border-white/15 bg-white/5 shrink-0 mt-0.5"
                />

                <div className={`space-y-1.5 max-w-xl ${isMe ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">{msg.senderName}</span>
                    {msg.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none'
                        : 'bg-white/[0.06] border border-white/10 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Code Snippet Box */}
                    {msg.codeSnippet && (
                      <div className="mt-2.5 rounded-xl bg-[#070b14] border border-white/15 overflow-hidden text-left">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1 text-emerald-400">
                            <Code2 className="w-3 h-3" /> {msg.codeLanguage || 'typescript'}
                          </span>
                          <button
                            onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                            className="hover:text-white flex items-center gap-1"
                          >
                            {copiedCodeId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCodeId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-xs font-mono text-emerald-200 overflow-x-auto max-h-40">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Reactions bar */}
                  <div className={`flex items-center gap-1.5 pt-0.5 ${isMe ? 'justify-end' : ''}`}>
                    {['🔥', '💡', '🚀', '❤️'].map((emoji) => {
                      const userList = msg.reactions?.[emoji] || [];
                      const hasReacted = userList.includes(effectiveUser.id);
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`px-2 py-0.5 rounded-lg text-[11px] flex items-center gap-1 transition-all border ${
                            hasReacted
                              ? 'bg-emerald-500/20 border-emerald-400/40 text-white'
                              : 'bg-white/[0.03] border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                          }`}
                        >
                          <span>{emoji}</span>
                          {userList.length > 0 && <span className="font-mono text-[10px]">{userList.length}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 italic">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Optional Code Snippet Drawer */}
        <AnimatePresence>
          {showCodeInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3 bg-black/50 border-t border-white/10 space-y-1.5"
            >
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1 text-emerald-300 font-mono">
                  <Code2 className="w-3.5 h-3.5" /> Attach Code Snippet
                </span>
                <button
                  onClick={() => setShowCodeInput(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Paste clean code snippet or schema demonstration here..."
                className="w-full h-24 p-3 rounded-xl bg-[#090e1a] border border-white/15 text-xs text-emerald-200 font-mono placeholder-gray-600 focus:outline-none focus:border-emerald-500"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white/[0.03] border-t border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            className={`p-2.5 rounded-xl border transition-all ${
              showCodeInput
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-white/[0.05] border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Attach Code Snippet"
          >
            <Code2 className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder={`Message #${activeRoom.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !codeSnippet.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white transition-all shadow-lg shadow-emerald-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
