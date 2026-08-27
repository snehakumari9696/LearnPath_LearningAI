import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/pages/HomePage';
import { GeneratorPage } from './components/pages/GeneratorPage';
import { RoadmapPage } from './components/pages/RoadmapPage';
import { MentorPage } from './components/pages/MentorPage';
import { QuizPage } from './components/pages/QuizPage';
import { FlashcardsPage } from './components/pages/FlashcardsPage';
import { DiscussionsPage } from './components/pages/DiscussionsPage';
import { LeaderboardPage } from './components/pages/LeaderboardPage';
import { ExplorePage } from './components/pages/ExplorePage';
import { DashboardPage } from './components/pages/DashboardPage';
import { AuthPage } from './components/pages/AuthPage';
import { AuthModal } from './components/AuthModal';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { PageTab, Roadmap, UserStats, UserProfile, Badge } from './types';
import { curatedCatalogRoadmaps } from './data/mockRoadmaps';
import { initialBadges } from './data/badgesData';

const STORAGE_KEY_ROADMAP = 'learnpath_active_roadmap';
const STORAGE_KEY_STATS = 'learnpath_user_stats';
const STORAGE_KEY_AUTH = 'learnpath_user_profile';
const STORAGE_KEY_TOKEN = 'learnpath_auth_token';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) return JSON.parse(savedAuth);
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState<PageTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalFeatureName, setAuthModalFeatureName] = useState<string | null>(null);
  const [pendingRedirectTab, setPendingRedirectTab] = useState<PageTab | null>(null);

  const [generatorSkill, setGeneratorSkill] = useState<string>('');
  const [mentorTopic, setMentorTopic] = useState<string>('');
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [unlockedBadgeToast, setUnlockedBadgeToast] = useState<Badge | null>(null);
  const [requiredFeatureNotice, setRequiredFeatureNotice] = useState<string | null>(null);

  // Verify stored session token on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(data.user));
          } else {
            // Session expired or invalid
            setCurrentUser(null);
            localStorage.removeItem(STORAGE_KEY_AUTH);
            localStorage.removeItem(STORAGE_KEY_TOKEN);
          }
        })
        .catch(err => {
          console.warn('Session verification fallback:', err);
        });
    }
  }, []);

  const triggerAuthRequirement = (targetTab: PageTab, featureLabel?: string) => {
    const featureLabels: Record<string, string> = {
      generator: 'the AI Learning Path Generator',
      roadmap: 'the Interactive Milestones & Progress tracker',
      quiz: 'Skill Assessment Quizzes',
      flashcards: 'Flashcards & Spaced Repetition',
      discussions: 'Community Discussions',
      leaderboard: 'the Global Ranking Leaderboard',
      mentor: 'the 24/7 AI Mentor Tutor',
      explore: 'Curated Roadmaps Catalog',
      dashboard: 'your Personal Learning Dashboard',
    };
    const featName = featureLabel || featureLabels[targetTab] || 'this feature';
    setAuthModalFeatureName(featName);
    setRequiredFeatureNotice(`Please sign in or create an account to access ${featName}.`);
    setPendingRedirectTab(targetTab);
    setAuthModalOpen(true);
  };

  // Guarantee that unauthenticated users cannot view protected features
  const handleTabChange = (newTab: PageTab) => {
    if (!currentUser && newTab !== 'home' && newTab !== 'auth') {
      triggerAuthRequirement(newTab);
      return;
    }
    setActiveTab(newTab);
  };

  // Active Roadmap state (defaults to first curated roadmap if empty)
  const [activeRoadmap, setActiveRoadmap] = useState<Roadmap | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROADMAP);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved roadmap:', e);
    }
    return curatedCatalogRoadmaps[0];
  });

  // User Stats state
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.badges) parsed.badges = initialBadges;
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved stats:', e);
    }
    return {
      streakDays: 5,
      totalHoursLearned: 22.5,
      completedMilestones: 4,
      activeRoadmapsCount: 1,
      savedRoadmaps: [curatedCatalogRoadmaps[0]],
      completedPhasesIds: [],
      xp: 2120,
      quizzesPassed: 12,
      flashcardsMastered: 18,
      badges: initialBadges
    };
  });

  // Save to local storage
  useEffect(() => {
    if (activeRoadmap) {
      localStorage.setItem(STORAGE_KEY_ROADMAP, JSON.stringify(activeRoadmap));
    }
  }, [activeRoadmap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
  }, [stats]);

  // Helper to trigger badge unlock if not already unlocked
  const triggerUnlockBadge = (badgeId: string) => {
    setStats((prev) => {
      const existingBadge = prev.badges.find(b => b.id === badgeId);
      if (existingBadge && existingBadge.unlocked) return prev; // already unlocked

      const updatedBadges = prev.badges.map(b => {
        if (b.id === badgeId) {
          return {
            ...b,
            unlocked: true,
            progress: b.maxProgress,
            unlockedAt: new Date().toISOString()
          };
        }
        return b;
      });

      const unlockedOne = updatedBadges.find(b => b.id === badgeId);
      if (unlockedOne) {
        setUnlockedBadgeToast(unlockedOne);
      }

      return {
        ...prev,
        xp: prev.xp + (unlockedOne ? unlockedOne.xpReward : 100),
        badges: updatedBadges
      };
    });
  };

  const handleLoginSuccess = (user: UserProfile, token: string) => {
    setCurrentUser(user);
    setRequiredFeatureNotice(null);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_TOKEN, token);

    // Redirect to the tab the user was trying to reach, or dashboard
    if (pendingRedirectTab && pendingRedirectTab !== 'auth') {
      setActiveTab(pendingRedirectTab);
      setPendingRedirectTab(null);
    } else if (activeTab === 'auth') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    setRequiredFeatureNotice(null);
    setActiveTab('home');
  };

  const handleNavigateToGenerator = (initialSkill?: string) => {
    if (initialSkill) {
      setGeneratorSkill(initialSkill);
    }
    if (!currentUser) {
      triggerAuthRequirement('generator', 'the AI Learning Path Generator');
      return;
    }
    setActiveTab('generator');
  };

  const handleRoadmapGenerated = (newRoadmap: Roadmap) => {
    setActiveRoadmap(newRoadmap);
    triggerUnlockBadge('badge-curriculum-starter');

    setStats((prev) => {
      const exists = prev.savedRoadmaps.some((r) => r.id === newRoadmap.id);
      const updatedList = exists
        ? prev.savedRoadmaps.map((r) => (r.id === newRoadmap.id ? newRoadmap : r))
        : [newRoadmap, ...prev.savedRoadmaps];
      return {
        ...prev,
        savedRoadmaps: updatedList,
        activeRoadmapsCount: updatedList.length,
        xp: prev.xp + 150
      };
    });
    setActiveTab('roadmap');
  };

  const handleUpdateRoadmap = (updated: Roadmap) => {
    setActiveRoadmap(updated);
    setStats((prev) => {
      const updatedList = prev.savedRoadmaps.map((r) => (r.id === updated.id ? updated : r));
      const totalCompletedPhases = updatedList.reduce(
        (acc, curr) => acc + curr.phases.filter((p) => p.completed).length,
        0
      );
      if (totalCompletedPhases >= 1) {
        triggerUnlockBadge('badge-roadmap-first-milestone');
      }
      return {
        ...prev,
        savedRoadmaps: updatedList,
        completedMilestones: totalCompletedPhases,
        xp: prev.xp + 50
      };
    });
  };

  const handleDeleteRoadmap = (id: string) => {
    setStats((prev) => {
      const filtered = prev.savedRoadmaps.filter((r) => r.id !== id);
      return {
        ...prev,
        savedRoadmaps: filtered,
        activeRoadmapsCount: filtered.length
      };
    });
    if (activeRoadmap?.id === id) {
      setActiveRoadmap(stats.savedRoadmaps.find((r) => r.id !== id) || null);
    }
  };

  const handleLogStudyHours = (hours: number) => {
    setStats((prev) => ({
      ...prev,
      totalHoursLearned: prev.totalHoursLearned + hours,
      xp: prev.xp + Math.round(hours * 30)
    }));
  };

  const handleFlashcardMastered = (cardId: string) => {
    setStats((prev) => {
      const newMastered = (prev.flashcardsMastered || 0) + 1;
      if (newMastered >= 1) triggerUnlockBadge('badge-flashcard-scholar');
      if (newMastered >= 10) triggerUnlockBadge('badge-grandmaster-recall');

      return {
        ...prev,
        flashcardsMastered: newMastered,
        xp: prev.xp + 50
      };
    });
  };

  const handleQuizPassed = (score: number, total: number) => {
    setStats((prev) => {
      const newQuizzes = (prev.quizzesPassed || 0) + 1;
      if (score === total) triggerUnlockBadge('badge-quiz-master');
      if (newQuizzes >= 3) triggerUnlockBadge('badge-technical-evaluator');

      return {
        ...prev,
        quizzesPassed: newQuizzes,
        xp: prev.xp + 100 + (score * 50)
      };
    });
  };

  const handleMessageSent = () => {
    triggerUnlockBadge('badge-discussion-catalyst');
  };

  const handleNavigateWithContext = (tab: PageTab, contextData?: any) => {
    if (!currentUser && tab !== 'home' && tab !== 'auth') {
      triggerAuthRequirement(tab);
      return;
    }
    if (tab === 'mentor' && contextData?.topic) {
      setMentorTopic(contextData.topic);
    }
    if (tab === 'quiz' && contextData?.topic) {
      setQuizTopic(contextData.topic);
    }
    if (tab === 'roadmap' && contextData) {
      setActiveRoadmap(contextData);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen w-full bg-black text-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        hasActiveRoadmap={!!activeRoadmap}
        currentUser={currentUser}
        onLogout={handleLogout}
        onRequireAuth={(tab) => {
          triggerAuthRequirement(tab || 'generator');
        }}
      />

      {/* Main Multi-Page Switcher with Animated Motion Transitions */}
      <main className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="page-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HomePage
                onNavigateToGenerator={handleNavigateToGenerator}
                onNavigateToExplore={() => {
                  if (!currentUser) {
                    triggerAuthRequirement('explore', 'Curated Roadmaps Catalog');
                  } else {
                    setActiveTab('explore');
                  }
                }}
                setActiveTab={handleTabChange}
              />
            </motion.div>
          )}

          {activeTab === 'auth' && (
            <motion.div
              key="page-auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AuthPage
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onNavigateToTab={handleTabChange}
                requiredFeatureMessage={requiredFeatureNotice}
              />
            </motion.div>
          )}

          {/* Gated feature fallback: if not authenticated and navigating to a gated tab, show AuthPage */}
          {activeTab !== 'home' && activeTab !== 'auth' && !currentUser && (
            <motion.div
              key="page-gate-fallback"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <AuthPage
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
                onNavigateToTab={handleTabChange}
                requiredFeatureMessage={requiredFeatureNotice || 'Please sign in or create an account to access this feature.'}
              />
            </motion.div>
          )}

              {activeTab === 'generator' && (
                <motion.div
                  key="page-generator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <GeneratorPage
                    initialSkill={generatorSkill}
                    onRoadmapGenerated={handleRoadmapGenerated}
                  />
                </motion.div>
              )}

              {activeTab === 'roadmap' && (
                <motion.div
                  key="page-roadmap"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <RoadmapPage
                    roadmap={activeRoadmap}
                    onNavigateToTab={handleNavigateWithContext}
                    onUpdateRoadmap={handleUpdateRoadmap}
                    onLogStudyHours={handleLogStudyHours}
                  />
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="page-quiz"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <QuizPage
                    activeRoadmap={activeRoadmap}
                    initialTopic={quizTopic}
                    onNavigateToTab={handleNavigateWithContext}
                    onQuizPassed={handleQuizPassed}
                  />
                </motion.div>
              )}

              {activeTab === 'flashcards' && (
                <motion.div
                  key="page-flashcards"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <FlashcardsPage
                    activeRoadmap={activeRoadmap}
                    onNavigateToTab={handleNavigateWithContext}
                    onFlashcardMastered={handleFlashcardMastered}
                  />
                </motion.div>
              )}

              {activeTab === 'discussions' && (
                <motion.div
                  key="page-discussions"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <DiscussionsPage
                    currentUser={currentUser}
                    stats={stats}
                    activeRoadmap={activeRoadmap}
                    onNavigateToTab={handleNavigateWithContext}
                    onMessageSent={handleMessageSent}
                  />
                </motion.div>
              )}

              {activeTab === 'leaderboard' && (
                <motion.div
                  key="page-leaderboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <LeaderboardPage
                    currentUser={currentUser}
                    stats={stats}
                    onNavigateToTab={handleNavigateWithContext}
                  />
                </motion.div>
              )}

              {activeTab === 'mentor' && (
                <motion.div
                  key="page-mentor"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <MentorPage
                    activeRoadmap={activeRoadmap}
                    initialTopic={mentorTopic}
                  />
                </motion.div>
              )}

              {activeTab === 'explore' && (
                <motion.div
                  key="page-explore"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExplorePage
                    onSelectRoadmap={(rm) => {
                      setActiveRoadmap(rm);
                      setStats((prev) => {
                        const exists = prev.savedRoadmaps.some((r) => r.id === rm.id);
                        const updated = exists ? prev.savedRoadmaps : [rm, ...prev.savedRoadmaps];
                        return { ...prev, savedRoadmaps: updated };
                      });
                      setActiveTab('roadmap');
                    }}
                    onNavigateToTab={handleTabChange}
                  />
                </motion.div>
              )}

              {activeTab === 'dashboard' && (
                <motion.div
                  key="page-dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                >
                  <DashboardPage
                    stats={stats}
                    currentUser={currentUser}
                    onSelectRoadmap={(rm) => {
                      setActiveRoadmap(rm);
                      setActiveTab('roadmap');
                    }}
                    onDeleteRoadmap={handleDeleteRoadmap}
                    onNavigateToTab={handleTabChange}
                  />
                </motion.div>
              )}
        </AnimatePresence>
      </main>

      {/* Auth Modal for Feature Gating */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        targetFeatureName={authModalFeatureName}
      />

      {/* Global Badge Unlock Fanfare Toast */}
      <BadgeUnlockToast
        badge={unlockedBadgeToast}
        onClose={() => setUnlockedBadgeToast(null)}
      />
    </div>
  );
}
