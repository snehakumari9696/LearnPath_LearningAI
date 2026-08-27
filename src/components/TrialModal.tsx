import React, { useState } from 'react';
import { X, Check, Sparkles, Shield, Zap } from 'lucide-react';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrialModal: React.FC<TrialModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [learningTrack, setLearningTrack] = useState('all');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#061833] border border-cyan-500/50 p-6 sm:p-8 shadow-[0_0_60px_rgba(14,165,233,0.35)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-cyan-950/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 animate-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mx-auto mb-4 text-cyan-300 shadow-[0_0_25px_rgba(14,165,233,0.8)]">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to your Free Trial!</h3>
            <p className="text-slate-300 text-sm max-w-sm mx-auto mb-6">
              We have dispatched your instant sandbox credentials and curriculum onboarding link to <span className="text-cyan-300 font-semibold">{email}</span>.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(14,165,233,0.6)]"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              <span>14-Day Full Access Pass</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Start Your AI &amp; ML Trial
            </h3>

            <p className="text-slate-300 text-sm mb-6">
              Unlimited access to interactive GPU notebooks, real-world industry labs, neural network visualizers, and mentorship.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com or name@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#031126] border border-cyan-900/80 focus:border-cyan-400 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Interest Track
                </label>
                <select
                  value={learningTrack}
                  onChange={(e) => setLearningTrack(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#031126] border border-cyan-900/80 focus:border-cyan-400 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
                >
                  <option value="all">Full Curriculum Access (All Tracks)</option>
                  <option value="data-scientist">Data Science &amp; Predictive Analytics</option>
                  <option value="ml-engineer">MLOps &amp; Production Engineering</option>
                  <option value="deep-learning">Deep Learning &amp; Computer Vision</option>
                  <option value="nlp-specialist">NLP, Prompt Engineering &amp; LLMs</option>
                </select>
              </div>

              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>No credit card required. Instant sandbox activation.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Free cloud compute allocation included for hands-on labs.</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-semibold text-sm tracking-wide bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0284c7] shadow-[0_0_25px_rgba(14,165,233,0.8)] hover:shadow-[0_0_35px_rgba(56,189,248,1)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Activate Free Trial
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
