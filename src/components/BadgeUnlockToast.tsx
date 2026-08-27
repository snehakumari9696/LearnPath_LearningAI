import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  X, 
  Zap, 
  Brain, 
  Flame, 
  Rocket, 
  MessageSquare, 
  Bot, 
  Crown, 
  Clock, 
  Layers 
} from 'lucide-react';
import { Badge } from '../types';

interface BadgeUnlockToastProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeUnlockToast: React.FC<BadgeUnlockToastProps> = ({ badge, onClose }) => {
  React.useEffect(() => {
    if (badge) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.85, x: 0.85 }
      });
    }
  }, [badge]);

  if (!badge) return null;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'rocket': return <Rocket className="w-6 h-6 text-indigo-300" />;
      case 'brain': return <Brain className="w-6 h-6 text-pink-300" />;
      case 'cards': return <Layers className="w-6 h-6 text-cyan-300" />;
      case 'flame': return <Flame className="w-6 h-6 text-orange-300 fill-orange-400" />;
      case 'award': return <Award className="w-6 h-6 text-amber-300" />;
      case 'crown': return <Crown className="w-6 h-6 text-yellow-300" />;
      case 'message': return <MessageSquare className="w-6 h-6 text-emerald-300" />;
      case 'bot': return <Bot className="w-6 h-6 text-purple-300" />;
      case 'clock': return <Clock className="w-6 h-6 text-blue-300" />;
      default: return <Zap className="w-6 h-6 text-amber-300" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Diamond': return 'from-cyan-500/30 to-blue-600/30 border-cyan-400/50 text-cyan-200';
      case 'Platinum': return 'from-purple-500/30 to-indigo-600/30 border-purple-400/50 text-purple-200';
      case 'Gold': return 'from-amber-500/30 to-yellow-600/30 border-amber-400/50 text-amber-200';
      case 'Silver': return 'from-slate-400/30 to-gray-500/30 border-slate-300/50 text-slate-200';
      default: return 'from-orange-600/30 to-amber-700/30 border-orange-500/50 text-orange-200';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-3xl bg-[#0a0f1e]/95 border border-white/20 backdrop-blur-2xl shadow-2xl flex items-start gap-4"
      >
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getRarityColor(badge.rarity)} border flex items-center justify-center shrink-0 shadow-lg`}>
          {renderIcon(badge.iconName)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Badge Unlocked!
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white truncate mt-0.5">{badge.title}</h4>
          <p className="text-xs text-gray-300 line-clamp-2 mt-0.5">{badge.description}</p>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              +{badge.xpReward} XP
            </span>
            <span className="text-gray-400">{badge.rarity} Tier</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
