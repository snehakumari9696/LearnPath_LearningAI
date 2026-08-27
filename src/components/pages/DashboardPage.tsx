import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  LayoutDashboard, 
  Flame, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  ArrowRight, 
  PlusCircle, 
  Trash2, 
  Download, 
  Sparkles,
  Printer,
  User,
  ShieldCheck,
  Zap,
  Layers,
  Trophy,
  MessageSquare,
  Lock,
  Check,
  Brain,
  Rocket,
  Crown,
  Share2
} from 'lucide-react';
import { Roadmap, UserStats, PageTab, UserProfile, Badge } from '../../types';
import { initialBadges } from '../../data/badgesData';

interface DashboardPageProps {
  stats: UserStats;
  currentUser?: UserProfile | null;
  onSelectRoadmap: (roadmap: Roadmap) => void;
  onDeleteRoadmap: (id: string) => void;
  onNavigateToTab: (tab: PageTab, contextData?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  currentUser,
  onSelectRoadmap,
  onDeleteRoadmap,
  onNavigateToTab,
}) => {
  const [certRoadmap, setCertRoadmap] = useState<Roadmap | null>(null);
  const [studentName, setStudentName] = useState<string>(currentUser?.name || 'Alex Chen');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [badgeCategoryFilter, setBadgeCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (currentUser?.name) {
      setStudentName(currentUser.name);
    }
  }, [currentUser]);

  const handleOpenCert = (roadmap: Roadmap) => {
    setCertRoadmap(roadmap);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handlePrintCert = () => {
    window.print();
  };

  const allBadges: Badge[] = stats.badges && stats.badges.length > 0 ? stats.badges : initialBadges;
  const unlockedBadgesCount = allBadges.filter(b => b.unlocked).length;

  const filteredBadges = allBadges.filter(b => {
    if (badgeCategoryFilter === 'all') return true;
    return b.category === badgeCategoryFilter;
  });

  const renderBadgeIcon = (name: string) => {
    switch (name) {
      case 'rocket': return <Rocket className="w-5 h-5 text-indigo-300" />;
      case 'brain': return <Brain className="w-5 h-5 text-pink-300" />;
      case 'cards': return <Layers className="w-5 h-5 text-cyan-300" />;
      case 'flame': return <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />;
      case 'award': return <Award className="w-5 h-5 text-amber-300" />;
      case 'crown': return <Crown className="w-5 h-5 text-yellow-300" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-emerald-300" />;
      default: return <Zap className="w-5 h-5 text-amber-300" />;
    }
  };

  const getRarityBadgeStyle = (rarity: string, unlocked: boolean) => {
    if (!unlocked) {
      return 'bg-white/[0.02] border-white/10 opacity-50 grayscale';
    }
    switch (rarity) {
      case 'Diamond': return 'bg-gradient-to-br from-cyan-950/60 to-blue-950/80 border-cyan-400/50 shadow-cyan-500/10 shadow-lg';
      case 'Platinum': return 'bg-gradient-to-br from-purple-950/60 to-indigo-950/80 border-purple-400/50 shadow-purple-500/10 shadow-lg';
      case 'Gold': return 'bg-gradient-to-br from-amber-950/60 to-yellow-950/80 border-amber-400/50 shadow-amber-500/10 shadow-lg';
      case 'Silver': return 'bg-gradient-to-br from-slate-900/60 to-gray-900/80 border-slate-300/40';
      default: return 'bg-gradient-to-br from-orange-950/60 to-amber-950/80 border-orange-500/40';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-black border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Student Command Center
            </span>
            {currentUser && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {currentUser.targetRole || 'Enrolled'}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {currentUser?.name || 'Learner'}!
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Track daily study streaks, completed milestones, AI quizzes, and verified credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!currentUser && (
            <button
              onClick={() => onNavigateToTab('auth')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10"
            >
              Sign In to Sync
            </button>
          )}
          <button
            onClick={() => onNavigateToTab('generator')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Create Roadmap
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-xs font-medium text-gray-400">Daily Streak</span>
            <Flame className="w-4 h-4 text-orange-400 animate-pulse fill-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {currentUser?.streakDays || stats.streakDays} <span className="text-xs font-normal text-gray-400">Days</span>
          </div>
          <p className="text-[11px] text-emerald-400">Active consistency 🔥</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs font-medium text-gray-400">Total Experience</span>
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {(stats.xp || 2120).toLocaleString()} <span className="text-xs font-normal text-gray-400">XP</span>
          </div>
          <p className="text-[11px] text-amber-300 font-semibold">Tier: Gold Scholar</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-medium text-gray-400">Flashcards Mastered</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats.flashcardsMastered || 18} <span className="text-xs font-normal text-gray-400">Cards</span>
          </div>
          <p className="text-[11px] text-cyan-300">Active Recall ready</p>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-purple-400">
            <span className="text-xs font-medium text-gray-400">Quizzes Passed</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {stats.quizzesPassed || 12} <span className="text-xs font-normal text-gray-400">Quizzes</span>
          </div>
          <p className="text-[11px] text-purple-300">Skill evaluations</p>
        </div>
      </div>

      {/* Quick Launchpad to Flashcards, Leaderboard, & Socket Discussions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Flashcards Box */}
        <div 
          onClick={() => onNavigateToTab('flashcards')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-cyan-950/30 to-black border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Flashcard Studio</h3>
            <p className="text-xs text-gray-400 mt-0.5">3D Interactive flip cards, mental models, code patterns, and AI generation.</p>
          </div>
          <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
            <span>Study Decks (+50 XP)</span>
          </div>
        </div>

        {/* Leaderboard Box */}
        <div 
          onClick={() => onNavigateToTab('leaderboard')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/20 hover:border-amber-400/50 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Trophy className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Global Leaderboard</h3>
            <p className="text-xs text-gray-400 mt-0.5">Compete for the Top 3 Podium Crown across AI, Full-Stack, and Data Science.</p>
          </div>
          <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <span>Your Rank: #4 • View Standings</span>
          </div>
        </div>

        {/* Group Discussions Box */}
        <div 
          onClick={() => onNavigateToTab('discussions')}
          className="cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-emerald-950/30 to-black border border-emerald-500/20 hover:border-emerald-400/50 transition-all space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Group Discussions</h3>
            <p className="text-xs text-gray-400 mt-0.5">Real-time study channels powered by Socket.io with code sharing and reactions.</p>
          </div>
          <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Join Active Sprints</span>
          </div>
        </div>
      </div>

      {/* Badges & Achievements Gallery */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Badges & Achievements ({unlockedBadgesCount} / {allBadges.length} Unlocked)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Unlock prestigious engineering credentials as you complete roadmaps, quizzes, and flashcards.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All' },
              { id: 'roadmap', label: 'Roadmaps' },
              { id: 'quiz', label: 'Quizzes' },
              { id: 'flashcard', label: 'Flashcards' },
              { id: 'streak', label: 'Streaks' },
              { id: 'community', label: 'Community' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setBadgeCategoryFilter(cat.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                  badgeCategoryFilter === cat.id
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => {
            const isUnlocked = badge.unlocked;
            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`cursor-pointer p-4 sm:p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 relative group hover:scale-[1.02] ${getRarityBadgeStyle(badge.rarity, isUnlocked)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    {renderBadgeIcon(badge.iconName)}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isUnlocked ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-white/5 text-gray-500 border-white/10'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight flex items-center gap-1.5">
                    <span>{badge.title}</span>
                    {isUnlocked && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar towards unlock */}
                <div className="space-y-1 pt-2 border-t border-white/10">
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>{isUnlocked ? 'Unlocked' : `${badge.currentCount || 0}/${badge.targetCount || 1}`}</span>
                    <span className="text-amber-300">+{badge.xpReward} XP</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${isUnlocked ? 'bg-emerald-400' : 'bg-amber-500'}`}
                      style={{ width: `${isUnlocked ? 100 : Math.min(100, badge.progress || (((badge.currentCount || 0) / (badge.targetCount || 1)) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saved Roadmaps Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          My Learning Roadmaps ({stats.savedRoadmaps.length})
        </h2>

        {stats.savedRoadmaps.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
            <p className="text-sm text-gray-400">You haven't generated or saved any roadmaps yet.</p>
            <button
              onClick={() => onNavigateToTab('generator')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Generate First Path
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.savedRoadmaps.map((rm) => {
              const completedCount = rm.phases.filter(p => p.completed).length;
              const percent = rm.phases.length > 0 ? Math.round((completedCount / rm.phases.length) * 100) : 0;
              const isFinished = percent === 100;

              return (
                <div
                  key={rm.id}
                  className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                        {rm.skill}
                      </span>
                      <span className="text-xs font-mono font-bold text-indigo-300">{percent}% Complete</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">
                      {rm.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {rm.summary}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isFinished ? 'bg-emerald-400' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectRoadmap(rm)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>Resume Path</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      {isFinished && (
                        <button
                          onClick={() => handleOpenCert(rm)}
                          className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          Certificate
                        </button>
                      )}
                    </div>

                    {rm.id && (
                      <button
                        onClick={() => onDeleteRoadmap(rm.id!)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove roadmap"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Badge Inspect Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full bg-[#0a0f1d] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border border-amber-400 flex items-center justify-center shadow-lg">
                {renderBadgeIcon(selectedBadge.iconName)}
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedBadge.rarity} Badge
                </span>
                <h3 className="text-xl font-extrabold text-white">{selectedBadge.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{selectedBadge.description}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-left text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Unlock Requirement:</span>
                  <span className="text-white font-medium">{selectedBadge.criteriaText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">XP Reward:</span>
                  <span className="text-amber-400 font-bold font-mono">+{selectedBadge.xpReward} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={selectedBadge.unlocked ? 'text-emerald-400 font-bold' : 'text-amber-400 font-semibold'}>
                    {selectedBadge.unlocked ? `Unlocked on ${selectedBadge.unlockedAt ? new Date(selectedBadge.unlockedAt).toLocaleDateString() : 'Active'}` : 'Locked (In Progress)'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
        {certRoadmap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full bg-[#0a0f1d] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl text-center relative"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300">
                  <Award className="w-8 h-8" />
                </div>

                <div className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Certificate of Achievement & Mastery
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  LearnPath-AI Verified Completion
                </h2>

                <p className="text-xs text-gray-400">
                  This certifies that
                </p>

                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full text-center py-2 px-3 bg-white/5 border-b-2 border-amber-400 text-lg font-bold text-white focus:outline-none"
                  />
                </div>

                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  has successfully completed all milestones and hands-on portfolio projects for the comprehensive curriculum:
                </p>

                <div className="text-lg font-bold text-indigo-300">
                  {certRoadmap.title}
                </div>

                <div className="pt-4 flex justify-between items-center text-[10px] text-gray-500 border-t border-white/10 font-mono">
                  <span>Issued: {new Date().toLocaleDateString()}</span>
                  <span>Credential ID: LPAI-{Date.now().toString().slice(-6)}</span>
                  <span>Verified by LearnPath-AI</span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handlePrintCert}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs"
                >
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setCertRoadmap(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
