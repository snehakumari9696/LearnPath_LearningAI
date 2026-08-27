import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Map, 
  Compass, 
  Bot, 
  HelpCircle, 
  LayoutDashboard, 
  Home, 
  PlusCircle, 
  Menu, 
  X, 
  Zap, 
  User, 
  Lock, 
  LogOut,
  Flame,
  CheckCircle2,
  Layers,
  Trophy,
  MessageSquare
} from 'lucide-react';
import { PageTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  hasActiveRoadmap: boolean;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onRequireAuth?: (targetTab?: PageTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasActiveRoadmap,
  currentUser,
  onLogout,
  onRequireAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [aiOnline, setAiOnline] = useState<boolean>(true);
  const [engineName, setEngineName] = useState<string>('Gemini 3.7 Flash');

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') {
          setAiOnline(true);
          if (data.engine) setEngineName(data.engine);
        }
      })
      .catch(() => setAiOnline(true));
  }, []);

  const navItems = [
    { id: 'home' as PageTab, label: 'Home', icon: Home },
    { id: 'generator' as PageTab, label: 'AI Generator', icon: Sparkles, badge: 'AI' },
    { id: 'roadmap' as PageTab, label: 'Roadmap', icon: Map, highlight: hasActiveRoadmap },
    { id: 'dashboard' as PageTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'quiz' as PageTab, label: 'Quiz', icon: HelpCircle },
    { id: 'flashcards' as PageTab, label: 'Flashcards', icon: Layers },
    { id: 'discussions' as PageTab, label: 'Discussions', icon: MessageSquare },
    { id: 'leaderboard' as PageTab, label: 'Leaderboard', icon: Trophy },
    { id: 'mentor' as PageTab, label: 'AI Mentor', icon: Bot },
  ];

  const handleTabClick = (tabId: PageTab) => {
    if (!currentUser && tabId !== 'home' && tabId !== 'auth') {
      if (onRequireAuth) {
        onRequireAuth(tabId);
      } else {
        setActiveTab('auth');
      }
      return;
    }
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/90 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 group text-left focus:outline-none shrink-0 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[9px] flex items-center justify-center">
              <Zap className="w-4 h-4 text-indigo-400 fill-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold tracking-tight text-white font-mono">
                LearnPath<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">.AI</span>
              </span>
              <span className="hidden 2xl:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title={`AI Engine: ${engineName}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live AI
              </span>
            </div>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-0.5 bg-white/[0.04] p-1 rounded-full border border-white/[0.08] overflow-x-auto scrollbar-none max-w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isDashboard = item.id === 'dashboard';
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-2.5 lg:px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? 'text-white font-semibold'
                    : isDashboard
                    ? 'text-indigo-300 hover:text-white hover:bg-white/[0.06]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-full shadow-inner border border-indigo-400/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : isDashboard ? 'text-indigo-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-indigo-500/40 text-indigo-200 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium transition-all"
              >
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg bg-indigo-500/30 object-cover border border-white/20"
                />
                <span className="text-white max-w-[90px] truncate">{currentUser.name}</span>
                <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-mono">
                  <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                  {currentUser.streakDays || 1}d
                </span>
              </button>

              {/* User dropdown menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-[#090e1b] border border-white/15 shadow-2xl backdrop-blur-xl space-y-1 z-50 text-left"
                  >
                    <div className="p-2 border-b border-white/10">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-gray-400 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-indigo-400 mt-0.5 truncate">{currentUser.targetRole || 'Learner'}</div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                      <span>Dashboard & Badges</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('leaderboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Global Leaderboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('auth');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('auth')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}

          {currentUser && (
            <button
              onClick={() => setActiveTab('generator')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 hover:from-indigo-600 to-purple-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setActiveTab('auth')}
            className="p-2 rounded-lg bg-white/[0.05] text-xs font-semibold text-gray-300 flex items-center gap-1 cursor-pointer"
            title="Account"
          >
            {currentUser ? <User className="w-4 h-4 text-indigo-400" /> : <Lock className="w-4 h-4 text-indigo-400" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-[#070b14]/95 backdrop-blur-xl px-4 py-3 space-y-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabClick(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/20 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
