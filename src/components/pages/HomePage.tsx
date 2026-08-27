import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Terminal, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Star, 
  Flame, 
  BookOpen, 
  Target, 
  HelpCircle,
  Play
} from 'lucide-react';
import { BackgroundVideo } from '../BackgroundVideo';
import { PageTab } from '../../types';

interface HomePageProps {
  onNavigateToGenerator: (initialSkill?: string) => void;
  onNavigateToExplore: () => void;
  setActiveTab: (tab: PageTab) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToGenerator,
  onNavigateToExplore,
  setActiveTab,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const keySkills = [
    {
      title: 'Machine Learning & Neural Networks',
      tag: 'HOT IN 2026',
      icon: BrainCircuit,
      color: 'from-blue-500 to-cyan-500',
      description: 'Master PyTorch, CNNs, Transformers, and MLOps production deployment architectures.',
      query: 'Machine Learning & Deep Learning'
    },
    {
      title: 'Generative AI & Agentic Workflows',
      tag: 'FAST TRACK',
      icon: Cpu,
      color: 'from-purple-500 to-pink-500',
      description: 'Build autonomous AI agents, RAG vector pipelines, and fine-tune open-weight models.',
      query: 'Generative AI & LLM Systems'
    },
    {
      title: 'Full-Stack Cloud & TypeScript',
      tag: 'ESSENTIAL',
      icon: Layers,
      color: 'from-emerald-500 to-teal-500',
      description: 'Modern React 19, Node.js microservices, PostgreSQL, and scalable Docker containerization.',
      query: 'Full-Stack Web Development'
    },
    {
      title: 'Prompt Engineering & Reasoning',
      tag: 'CORE SKILL',
      icon: Terminal,
      color: 'from-amber-500 to-orange-500',
      description: 'Advanced chain-of-thought, few-shot prompting, structured JSON schema, and evaluation metrics.',
      query: 'Prompt Engineering & LLM Alignment'
    }
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onNavigateToGenerator(quickInput.trim());
    } else {
      onNavigateToGenerator();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-black text-white">
      {/* Hero Section with Cloudinary Loop Video Background */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        {/* Background Video Component */}
        <BackgroundVideo />

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-300 shadow-xl"
          >
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Next-Gen AI Learning Path Generator</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="text-gray-300 font-normal">Powered by Gemini 3.7</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans"
          >
            Master Any Skill with a <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Personalized AI Roadmap
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-gray-300 font-light leading-relaxed"
          >
            Generate customized, milestone-driven curriculums with real-world projects, curated resources, 
            interactive skill assessments, and an on-demand AI Mentor.
          </motion.p>

          {/* Interactive Search / Prompt Launcher Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <form 
              onSubmit={handleQuickSubmit}
              className="relative flex items-center p-2 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/10 focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            >
              <div className="pl-3 text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="What skill do you want to master? (e.g. Machine Learning, React, DevOps...)"
                className="w-full px-3 py-3 bg-transparent text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Generate Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Quick Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-gray-400">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Popular:
              </span>
              {['Machine Learning', 'Full-Stack React', 'LLM Architect', 'Cloud DevOps', 'Data Science'].map((skill) => (
                <button
                  key={skill}
                  onClick={() => onNavigateToGenerator(skill)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-indigo-400/40 text-gray-300 hover:text-white transition-all"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Interactive Key Skills Showcase Grid */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            High-Impact Career Skill Tracks
          </h2>
          <p className="text-sm text-gray-400">
            Click any career domain to immediately customize and generate your milestone roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {keySkills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => onNavigateToGenerator(skill.query)}
                className="group relative p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-indigo-500/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-lg hover:shadow-indigo-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color} shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                      {skill.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {skill.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Generate Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-black border border-indigo-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Milestone Engine</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every roadmap breaks down complex subjects into weekly milestones with verified prerequisites and realistic time estimates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Curated Real-World Projects</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Build resume-worthy portfolio projects with step-by-step specifications, starter templates, and evaluation criteria.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-pink-950/40 to-black border border-pink-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Mentor & Skill Quizzes</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Get instant, jargon-free explanations, practical code snippets, and dynamically generated quizzes for each milestone.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-black border border-indigo-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to accelerate your learning?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-gray-300 font-light">
            Tell the AI what you want to achieve, how much time you have, and get a tailored step-by-step roadmap in seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigateToGenerator()}
              className="px-6 py-3.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Launch AI Generator
            </button>
            <button
              onClick={onNavigateToExplore}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm transition-all"
            >
              Explore Pre-Built Curriculums
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
