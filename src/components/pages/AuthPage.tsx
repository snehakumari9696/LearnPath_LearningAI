import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Zap, 
  LogOut, 
  Compass, 
  Key, 
  RefreshCw,
  Award,
  BookOpen
} from 'lucide-react';
import { UserProfile, PageTab } from '../../types';

interface AuthPageProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  onLogout: () => void;
  onNavigateToTab: (tab: PageTab) => void;
  requiredFeatureMessage?: string | null;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToTab,
  requiredFeatureMessage
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('AI & Machine Learning Engineer');
  const [avatarSeed, setAvatarSeed] = useState('Alex');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit profile states when logged in
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const roleOptions = [
    'AI & Machine Learning Engineer',
    'Full-Stack TypeScript Developer',
    'Cloud Architect & DevOps',
    'Data Scientist & Analytics',
    'Systems & Blockchain Engineer'
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign in');
      }

      setSuccessMsg(`Welcome back, ${data.user.name}! Access unlocked.`);
      onLoginSuccess(data.user, data.token);
      setTimeout(() => {
        onNavigateToTab('dashboard');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(avatarSeed || name)}`;
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          targetRole,
          avatarUrl
        })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccessMsg('Account created successfully! All features are now unlocked.');
      onLoginSuccess(data.user, data.token);
      setTimeout(() => {
        onNavigateToTab('dashboard');
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not complete registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setSuccessMsg(data.message || 'Reset link dispatched. Please check your inbox.');
    } catch (err: any) {
      setErrorMsg('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsUpdatingProfile(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token || ''}`
        },
        body: JSON.stringify({
          name: currentUser.name,
          targetRole,
          bio,
          email: currentUser.email
        })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.user, currentUser.token || '');
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      setErrorMsg('Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // If already authenticated, show Profile Dashboard & Settings View
  if (currentUser) {
    return (
      <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full p-4 sm:p-8 text-white space-y-8">
        {/* Profile Card */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-black border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-indigo-400/40 object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Student
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{currentUser.name}</h1>
              <p className="text-xs text-gray-400 font-mono">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToTab('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Go to Dashboard
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-gray-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-white/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Learner Profile Settings</h2>
              <p className="text-xs text-gray-400">Customize your target career goals and AI personalization preferences.</p>
            </div>
            <span className="text-xs text-indigo-400 font-mono">ID: {currentUser.id}</span>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Target Career Specialization</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-indigo-500 text-white text-xs sm:text-sm focus:outline-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role} className="bg-gray-900 text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">Learning Goals & Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Describe your current tech stack and what you want to achieve with LearnPath-AI..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 focus:border-indigo-500 text-white text-xs sm:text-sm focus:outline-none resize-none placeholder-gray-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                {isUpdatingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full p-4 sm:p-8 flex flex-col items-center justify-center text-white space-y-6">
      {requiredFeatureMessage && (
        <div className="w-full p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-indigo-200 text-sm">
                <span>Account Required</span>
              </div>
              <p className="text-gray-300">
                {requiredFeatureMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left column: Brand & Value Highlights */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <Zap className="w-3.5 h-3.5 text-indigo-400" /> LearnPath-AI Student Portal
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sign In to Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">All AI Learning Features</span>
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed">
            Create an account or sign in to synthesize custom curriculums with Gemini 3.7 Flash, interact with your 24/7 AI tutor, track study streaks, take quizzes, and earn verified certificates.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>AI Roadmap Generator</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
              <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Interactive Quizzes</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
              <Zap className="w-4 h-4 text-pink-400 shrink-0" />
              <span>Live AI Mentor Chat</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Certificates</span>
            </div>
          </div>
        </div>

        {/* Right column: Auth Card Form */}
        <div className="lg:col-span-7 w-full max-w-md mx-auto">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090d19]/90 border border-white/10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            {/* Top glowing ambient effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-white/[0.05] p-1 mb-6 border border-white/10">
              <button
                onClick={() => { setAuthMode('login'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('register'); setErrorMsg(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  authMode === 'register'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
              <button
                onClick={() => { setAuthMode('forgot'); setErrorMsg(null); }}
                className={`px-3 py-2 text-[11px] font-bold rounded-lg transition-all ${
                  authMode === 'forgot'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reset
              </button>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form View Container */}
            <AnimatePresence mode="wait">
              {authMode === 'login' && (
                <motion.form
                  key="form-login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@learnpath.ai"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-300">Password</label>
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In to LearnPath</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {authMode === 'register' && (
                <motion.form
                  key="form-register"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleRegister}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setAvatarSeed(e.target.value);
                        }}
                        placeholder="e.g. Maya Lin"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Career Specialization Target</label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white text-xs focus:outline-none"
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r} className="bg-gray-900 text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">Confirm</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm"
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Create Student Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {authMode === 'forgot' && (
                <motion.form
                  key="form-forgot"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleForgotPassword}
                  className="space-y-4"
                >
                  <p className="text-xs text-gray-400">
                    Enter the email associated with your account and we will send you instructions to reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 focus:border-indigo-500 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Reset Instructions</span>}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
