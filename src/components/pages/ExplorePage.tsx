import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BrainCircuit, 
  Database,
  Code,
  Shield
} from 'lucide-react';
import { curatedCatalogRoadmaps } from '../../data/mockRoadmaps';
import { Roadmap, PageTab } from '../../types';

interface ExplorePageProps {
  onSelectRoadmap: (roadmap: Roadmap) => void;
  onNavigateToTab: (tab: PageTab) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectRoadmap,
  onNavigateToTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'AI & Machine Learning', 'Web Development', 'Data Science', 'Cloud & DevOps'];

  const filteredRoadmaps = curatedCatalogRoadmaps.filter((rm) => {
    const matchesSearch = rm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rm.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          rm.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <Compass className="w-3.5 h-3.5" /> Curated Curriculum Library
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Explore Industry-Standard Learning Roadmaps
        </h1>
        <p className="text-sm text-gray-400">
          Hand-crafted by senior software architects and machine learning researchers.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-white/[0.06] border border-white/15 focus-within:border-cyan-500 transition-all">
            <Search className="w-4 h-4 text-gray-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmaps by technology or keyword..."
              className="w-full px-3 py-2 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid of Roadmaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredRoadmaps.map((rm, idx) => (
          <motion.div
            key={rm.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 backdrop-blur-sm transition-all duration-300 flex flex-col justify-between space-y-5 shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {rm.skill}
                </span>
                <span className="text-[11px] text-gray-400">{rm.difficulty}</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {rm.title}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed">
                {rm.summary}
              </p>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-300 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> {rm.estimatedWeeks} Weeks
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> {rm.weeklyHours} hrs/wk
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" /> {rm.phases.length} Phases
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => onSelectRoadmap(rm)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                <span>Load Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
