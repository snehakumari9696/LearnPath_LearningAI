import React from 'react';
import { X, CheckCircle2, ArrowRight, BookOpen, Layers, DollarSign } from 'lucide-react';
import { SkillField } from '../types';
import { DataScientistIcon, MLEngineerIcon, DeepLearningIcon, NLPSpecialistIcon } from './SkillIcons';

interface SkillModalProps {
  skill: SkillField | null;
  onClose: () => void;
  onStartTrial: () => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({ skill, onClose, onStartTrial }) => {
  if (!skill) return null;

  const renderIcon = () => {
    switch (skill.iconType) {
      case 'data-scientist':
        return <DataScientistIcon className="w-16 h-16" />;
      case 'ml-engineer':
        return <MLEngineerIcon className="w-16 h-16" />;
      case 'deep-learning':
        return <DeepLearningIcon className="w-16 h-16" />;
      case 'nlp-specialist':
        return <NLPSpecialistIcon className="w-16 h-16" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-2xl bg-[#061833] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(14,165,233,0.3)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-cyan-950/60 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 p-2 rounded-xl bg-[#0a274d] border border-cyan-500/30 flex items-center justify-center">
            {renderIcon()}
          </div>
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-1">
              {skill.category}
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {skill.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
          {skill.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-[#031126] border border-cyan-900/60">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses</span>
            </div>
            <div className="text-lg font-bold text-white">{skill.coursesCount} Paths</div>
          </div>

          <div className="text-center border-x border-cyan-900/60">
            <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Projects</span>
            </div>
            <div className="text-lg font-bold text-white">{skill.projectsCount} Labs</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Avg Base</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-300 truncate">{skill.salaryRange.split('-')[0]}</div>
          </div>
        </div>

        {/* Key Topics List */}
        <div className="mb-6">
          <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
            Core Curriculum Modules
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {skill.topics.map((topic, index) => (
              <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-900/60">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onStartTrial();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-[0_0_20px_rgba(14,165,233,0.7)] hover:scale-105 transition-transform"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
