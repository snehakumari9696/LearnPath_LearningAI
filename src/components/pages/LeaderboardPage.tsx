import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Award, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  Filter, 
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { LeaderboardEntry, PageTab, UserProfile, UserStats } from '../../types';

interface LeaderboardPageProps {
  currentUser: UserProfile | null;
  stats: UserStats;
  onNavigateToTab: (tab: PageTab, contextData?: any) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  currentUser,
  stats,
  onNavigateToTab,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'All-Time' | 'Monthly' | 'Weekly'>('All-Time');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // First sync current user
      if (currentUser) {
        await fetch('/api/leaderboard/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: currentUser, stats })
        }).catch(() => {});
      }

      const params = new URLSearchParams();
      if (selectedTrack !== 'All') params.append('track', selectedTrack);
      params.append('timeframe', selectedTimeframe);

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      const data = await res.json();
      if (data.leaderboard) {
        // Tag current user
        const marked = data.leaderboard.map((entry: LeaderboardEntry) => ({
          ...entry,
          isCurrentUser: currentUser ? (entry.id === currentUser.id || entry.name.toLowerCase() === currentUser.name.toLowerCase()) : (entry.id === 'usr-default-alex')
        }));
        setLeaderboard(marked);
      }
    } catch (err) {
      console.error('Leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedTrack, selectedTimeframe, currentUser, stats.xp, stats.completedMilestones]);

  const topThree = leaderboard.slice(0, 3);
  const restList = leaderboard.slice(3);
  const currentUserEntry = leaderboard.find(e => e.isCurrentUser);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-amber-600 text-yellow-950 border-yellow-300';
      case 2: return 'from-slate-300 to-slate-400 text-slate-950 border-slate-200';
      case 3: return 'from-amber-600 to-orange-700 text-amber-950 border-orange-400';
      default: return 'from-white/10 to-white/5 text-gray-300 border-white/10';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full p-4 sm:p-6 text-white space-y-8 pb-24">
      {/* Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-black border border-amber-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" /> Global Engineering League
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Learner Leaderboard</h1>
          <p className="text-xs text-gray-400">Compete with engineers globally by mastering quizzes, flashcards, and roadmap phases.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeaderboard()}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title="Refresh rankings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={() => onNavigateToTab('quiz')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Earn XP in Quiz</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Track Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'AI Engineering', 'Full-Stack Development', 'Data Science', 'Cloud & DevOps'].map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                selectedTrack === track
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                  : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {track}
            </button>
          ))}
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs font-medium self-end sm:self-auto">
          {(['All-Time', 'Monthly', 'Weekly'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeframe(period)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedTimeframe === period
                  ? 'bg-amber-500 text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (1st, 2nd, 3rd) */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:order-1 p-6 rounded-3xl bg-gradient-to-b from-slate-900/40 to-slate-950/80 border border-slate-400/30 text-center space-y-4 relative shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={topThree[1].avatarUrl}
                    alt={topThree[1].name}
                    className="w-20 h-20 mx-auto rounded-2xl object-cover border-2 border-slate-300 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-bold text-xs flex items-center justify-center border-2 border-black font-mono">
                    #2
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                    {topThree[1].name}
                    {topThree[1].isCurrentUser && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-[9px] font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-300">{topThree[1].targetRole}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="text-xl font-extrabold text-white font-mono flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {topThree[1].xp.toLocaleString()} XP
                </div>
                <div className="text-[11px] text-gray-400 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-0.5 text-orange-400"><Flame className="w-3 h-3 fill-orange-400" /> {topThree[1].streakDays}d</span>
                  <span>•</span>
                  <span>{topThree[1].quizzesPassed} Quizzes</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Gold Crown - Hero) */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:order-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-950/60 via-yellow-950/40 to-black border-2 border-yellow-400/60 text-center space-y-4 relative shadow-2xl shadow-yellow-500/10 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative inline-block">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce">
                    <Crown className="w-7 h-7 fill-yellow-400" />
                  </div>
                  <img
                    src={topThree[0].avatarUrl}
                    alt={topThree[0].name}
                    className="w-24 h-24 mx-auto rounded-3xl object-cover border-3 border-yellow-400 shadow-2xl shadow-yellow-500/30"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs flex items-center justify-center border-2 border-black font-mono shadow-md">
                    #1
                  </div>
                </div>

                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 text-[10px] font-bold border border-yellow-400/40 mb-1">
                    {topThree[0].badgeTitle || 'Grandmaster'}
                  </div>
                  <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-1.5">
                    {topThree[0].name}
                    {topThree[0].isCurrentUser && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-[9px] font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-amber-200/80">{topThree[0].targetRole}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 space-y-1">
                <div className="text-2xl font-extrabold text-yellow-300 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-5 h-5 fill-yellow-400" />
                  {topThree[0].xp.toLocaleString()} XP
                </div>
                <div className="text-xs text-amber-200/70 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1 text-orange-400 font-semibold"><Flame className="w-3.5 h-3.5 fill-orange-400" /> {topThree[0].streakDays}d Streak</span>
                  <span>•</span>
                  <span>{topThree[0].flashcardsMastered} Cards</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:order-3 p-6 rounded-3xl bg-gradient-to-b from-orange-950/30 to-black border border-orange-500/30 text-center space-y-4 relative shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative inline-block">
                  <img
                    src={topThree[2].avatarUrl}
                    alt={topThree[2].name}
                    className="w-20 h-20 mx-auto rounded-2xl object-cover border-2 border-orange-400 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-orange-400 text-orange-950 font-bold text-xs flex items-center justify-center border-2 border-black font-mono">
                    #3
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
                    {topThree[2].name}
                    {topThree[2].isCurrentUser && (
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500 text-[9px] font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-[11px] text-orange-200/80">{topThree[2].targetRole}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                <div className="text-xl font-extrabold text-white font-mono flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {topThree[2].xp.toLocaleString()} XP
                </div>
                <div className="text-[11px] text-gray-400 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-0.5 text-orange-400"><Flame className="w-3 h-3 fill-orange-400" /> {topThree[2].streakDays}d</span>
                  <span>•</span>
                  <span>{topThree[2].quizzesPassed} Quizzes</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Ranks 4+ Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" /> Full Standings
        </h2>

        <div className="space-y-2">
          {restList.map((entry) => {
            return (
              <div
                key={entry.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  entry.isCurrentUser
                    ? 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="w-8 text-center text-sm font-mono font-bold text-gray-400">
                    #{entry.rank}
                  </span>

                  <img
                    src={entry.avatarUrl}
                    alt={entry.name}
                    className="w-10 h-10 rounded-xl object-cover border border-white/15 bg-white/5"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500 text-white">
                          YOU
                        </span>
                      )}
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-white/10 text-gray-300 font-medium hidden sm:inline">
                        {entry.track}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{entry.targetRole}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-gray-300 pl-11 sm:pl-0">
                  <div className="flex items-center gap-1 text-orange-400 font-mono">
                    <Flame className="w-3.5 h-3.5 fill-orange-400" />
                    <span>{entry.streakDays}d streak</span>
                  </div>

                  <div className="hidden sm:block text-gray-400">
                    <span>{entry.flashcardsMastered} cards mastered</span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-amber-300 font-mono">
                      {entry.xp.toLocaleString()} XP
                    </div>
                    <div className="text-[10px] text-gray-400">{entry.badgeTitle || 'Scholar'}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Bar with Current User Ranking */}
      {currentUserEntry && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-xl border-t border-white/15 p-3 sm:p-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center font-mono font-bold text-sm text-indigo-300">
                #{currentUserEntry.rank}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Your Current Rank: #{currentUserEntry.rank} of {leaderboard.length}</span>
                  <span className="text-amber-400 font-mono">({currentUserEntry.xp} XP)</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  {currentUserEntry.rank > 3
                    ? `Reach Top 3 to earn the Podium Crown! Only ${(topThree[2]?.xp - currentUserEntry.xp + 100).toLocaleString()} XP to overtake #3.`
                    : '🌟 You are on the podium! Keep your daily streak alive to maintain rank.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToTab('quiz')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-purple-600/20"
              >
                <Zap className="w-3.5 h-3.5 fill-current" /> Quick Quiz (+100 XP)
              </button>
              <button
                onClick={() => onNavigateToTab('flashcards')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-cyan-600/20"
              >
                <Layers className="w-3.5 h-3.5" /> Flashcards (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
