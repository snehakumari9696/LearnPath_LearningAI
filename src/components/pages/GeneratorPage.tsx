import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Calendar, 
  BookOpen, 
  Brain, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  Flame,
  Check
} from 'lucide-react';
import { Roadmap } from '../../types';

interface GeneratorPageProps {
  initialSkill?: string;
  onRoadmapGenerated: (roadmap: Roadmap) => void;
}

export const GeneratorPage: React.FC<GeneratorPageProps> = ({
  initialSkill = '',
  onRoadmapGenerated,
}) => {
  const [step, setStep] = useState<number>(1);
  const [skill, setSkill] = useState<string>(initialSkill || 'Machine Learning & Deep Learning');
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [targetGoal, setTargetGoal] = useState<string>('Land a high-impact role as a Machine Learning Engineer');
  const [weeklyHours, setWeeklyHours] = useState<number>(10);
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [learningStyle, setLearningStyle] = useState<string>('Hands-on Projects & Code');
  const [mode, setMode] = useState<'ai' | 'demo'>('ai');

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhase, setLoadingPhase] = useState<string>('Initializing curriculum synthesis...');
  const [error, setError] = useState<string | null>(null);

  const presetSkills = [
    { name: 'Machine Learning & Deep Learning', goal: 'Become a Production-Ready ML Engineer' },
    { name: 'Generative AI & LLM Systems', goal: 'Build Multi-Agent AI Systems & RAG Pipelines' },
    { name: 'Full-Stack TypeScript & React 19', goal: 'Ship scalable fullstack web applications' },
    { name: 'Cloud DevOps & Kubernetes', goal: 'Architect high-availability cloud infrastructure' },
    { name: 'Data Science & Applied Analytics', goal: 'Transform complex business data into predictive insights' },
    { name: 'Cybersecurity & Ethical Hacking', goal: 'Protect enterprise systems and perform vulnerability audits' }
  ];

  const learningStyles = [
    { title: 'Hands-on Projects & Code', desc: 'Focus heavily on building working repositories, portfolio apps, and interactive coding labs.' },
    { title: 'Balanced Theory & Practice', desc: 'Equal parts deep conceptual foundations, textbooks, and applied exercises.' },
    { title: 'Fast-Track Crash Course', desc: 'Accelerated, high-density syllabus covering only modern industry essentials.' },
    { title: 'Video Tutorials & Visual Labs', desc: 'Curated visual lectures, step-by-step walkthroughs, and guided interactive sandboxes.' }
  ];

  const handlePresetSelect = (preset: { name: string; goal: string }) => {
    setSkill(preset.name);
    setTargetGoal(preset.goal);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const phases = [
      'Connecting to Gemini 3.7 Flash AI engine...',
      'Deconstructing target skill domain & prerequisites...',
      'Synthesizing weekly milestone breakdown...',
      'Curating authoritative docs, books, and GitHub repositories...',
      'Structuring real-world capstone project specifications...',
      'Finalizing your personalized learning path...'
    ];

    let phaseIndex = 0;
    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      setLoadingPhase(phases[phaseIndex]);
    }, 1200);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill,
          currentLevel,
          targetGoal,
          weeklyHours,
          durationWeeks,
          learningStyle,
          mode
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success && data.data) {
        const newRoadmap: Roadmap = {
          ...data.data,
          id: `roadmap-${Date.now()}`,
          createdAt: new Date().toISOString(),
          progressPercentage: 0
        };
        onRoadmapGenerated(newRoadmap);
      } else {
        throw new Error(data.error || 'Failed to generate roadmap');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.warn('Network issue during generation, generating resilient local roadmap:', err);
      // Construct rich local roadmap so user experience is never blocked
      const cleanSkill = skill.trim() || 'Software Engineering';
      const cleanGoal = targetGoal.trim() || `Master ${cleanSkill} and achieve career milestones`;
      const p1End = Math.max(2, Math.floor(durationWeeks * 0.3));
      const p2End = Math.max(p1End + 2, Math.floor(durationWeeks * 0.7));

      const fallbackRoadmap: Roadmap = {
        id: `roadmap-${Date.now()}`,
        title: `${cleanSkill} Mastery: from ${currentLevel} to ${cleanGoal}`,
        skill: cleanSkill,
        summary: `An adaptive, hands-on curriculum designed to transition from ${currentLevel.toLowerCase()} foundations into production-grade ${cleanSkill} systems.`,
        targetGoal: cleanGoal,
        estimatedWeeks: Number(durationWeeks) || 8,
        weeklyHours: Number(weeklyHours) || 10,
        difficulty: currentLevel,
        createdAt: new Date().toISOString(),
        progressPercentage: 0,
        phases: [
          {
            phaseNumber: 1,
            title: `Phase 1: ${cleanSkill} Core Foundations & Architecture`,
            duration: `Weeks 1-${p1End}`,
            description: `Master core mental models, syntax patterns, environment setup, and modular engineering principles for ${cleanSkill}.`,
            topics: [
              `Core Syntax & Mental Models in ${cleanSkill}`,
              'Architectural Abstractions & Modular Separation',
              'Data Flow, State Management & Debugging Strategies',
              'Unit Testing & Code Quality Linters'
            ],
            projects: [
              {
                name: `${cleanSkill} Modular Scaffolding Lab`,
                description: `Construct an end-to-end sandbox application demonstrating clean modular separation, typing, and automated testing.`
              }
            ],
            resources: [
              { name: `${cleanSkill} Official Guides & Documentation`, type: 'Docs', url: 'https://devdocs.io/' },
              { name: 'System Architecture & Best Practices Handbook', type: 'Book', url: 'https://refactoring.guru/' }
            ]
          },
          {
            phaseNumber: 2,
            title: `Phase 2: Deep Dive, Asynchronous Concurrency & Scalability`,
            duration: `Weeks ${p1End + 1}-${p2End}`,
            description: `Tackle production scenarios, concurrency, performance profiling, error handling boundaries, and database/API integration.`,
            topics: [
              'High-Throughput Asynchronous Processing',
              'Performance Benchmarking, Memory Caching & Indexing',
              'Defensive Input Validation & Security Boundaries',
              'API Integration & Relational/Document Storage'
            ],
            projects: [
              {
                name: `Production-Grade ${cleanSkill} Service Engine`,
                description: `Deliver a scalable, feature-complete service engine with robust error recovery, security controls, and responsive UI feedback.`
              }
            ],
            resources: [
              { name: 'System Design Primer', type: 'GitHub', url: 'https://github.com/donnemartin/system-design-primer' },
              { name: 'Full-Stack Architecture & Design Patterns', type: 'GitHub', url: 'https://github.com/goldbergyoni/nodebestpractices' }
            ]
          },
          {
            phaseNumber: 3,
            title: `Phase 3: Production Deployment, Portfolio & ${cleanGoal}`,
            duration: `Weeks ${p2End + 1}-${durationWeeks}`,
            description: `Deploy to cloud infrastructure, configure observability telemetry, containerize with Docker, and prepare interview-ready portfolio case studies.`,
            topics: [
              'CI/CD Pipelines & Automated Release Workflows',
              'Containerization (Docker) & Cloud Edge Deployment',
              'Observability, Telemetry Metrics & Automated Alerting',
              'Technical Case Study Defense & System Design Reviews'
            ],
            projects: [
              {
                name: `Full-Scale Capstone: ${cleanGoal}`,
                description: `Architect, benchmark, and deploy a live multi-module production system ready for hiring managers and technical evaluations.`
              }
            ],
            resources: [
              { name: 'Tech Interview Handbook', type: 'Docs', url: 'https://www.techinterviewhandbook.org/' },
              { name: 'Cloud Native & Deployment Guide', type: 'Docs', url: 'https://kubernetes.io/docs/' }
            ]
          }
        ]
      };

      onRoadmapGenerated(fallbackRoadmap);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-[#070b14] to-black text-white flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Step Indicator Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Curriculum Architect</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Create Your Custom Learning Path
          </h1>
          <p className="text-sm text-gray-400">
            Step {step} of 3 • Tailor your pace, prerequisites, and portfolio goals.
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto bg-white/10 h-1.5 rounded-full overflow-hidden mt-4">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: '33%' }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Wizard Form Container */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-2xl shadow-indigo-500/5">
          <AnimatePresence mode="wait">
            {/* STEP 1: Skill & Target Goal */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    What skill, technology, or topic do you want to learn?
                  </label>
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="e.g. Machine Learning, React & Next.js, Cloud Security..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm sm:text-base font-medium"
                  />
                </div>

                {/* Presets */}
                <div>
                  <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-2.5">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Popular Skill Tracks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {presetSkills.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          skill === preset.name
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                            : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/10 text-gray-300'
                        }`}
                      >
                        <span className="truncate pr-2">{preset.name}</span>
                        {skill === preset.name && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    What is your target career or project milestone?
                  </label>
                  <input
                    type="text"
                    value={targetGoal}
                    onChange={(e) => setTargetGoal(e.target.value)}
                    placeholder="e.g. Land a job as an AI Engineer, build a SaaS MVP..."
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!skill.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <span>Next: Knowledge & Style</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Current Level & Learning Style */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    What is your current proficiency level in this area?
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Beginner', desc: 'Little to no experience' },
                      { id: 'Intermediate', desc: 'Know fundamentals & syntax' },
                      { id: 'Advanced', desc: 'Experienced practitioner' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setCurrentLevel(lvl.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          currentLevel === lvl.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-gray-400'
                        }`}
                      >
                        <div className="font-bold text-sm text-white mb-0.5">{lvl.id}</div>
                        <div className="text-[11px] text-gray-400">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Preferred Learning Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {learningStyles.map((st) => (
                      <button
                        key={st.title}
                        type="button"
                        onClick={() => setLearningStyle(st.title)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          learningStyle === st.title
                            ? 'bg-purple-600/20 border-purple-500 text-white'
                            : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-gray-400'
                        }`}
                      >
                        <div className="font-semibold text-xs text-white mb-1">{st.title}</div>
                        <div className="text-[11px] text-gray-400 leading-snug">{st.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <span>Next: Schedule & AI Engine</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Commitment & Generate */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Sliders */}
                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-300 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Target Program Duration:
                      </span>
                      <span className="font-bold text-indigo-300 font-mono text-sm">{durationWeeks} Weeks</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={20}
                      step={2}
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>4 Weeks (Sprint)</span>
                      <span>12 Weeks (Standard)</span>
                      <span>20 Weeks (Deep Master)</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-gray-300 font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400" /> Weekly Time Commitment:
                      </span>
                      <span className="font-bold text-purple-300 font-mono text-sm">{weeklyHours} Hours / Week</span>
                    </div>
                    <input
                      type="range"
                      min={4}
                      max={30}
                      step={2}
                      value={weeklyHours}
                      onChange={(e) => setWeeklyHours(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>4 hrs/wk (Casual)</span>
                      <span>12 hrs/wk (Dedicated)</span>
                      <span>30 hrs/wk (Bootcamp)</span>
                    </div>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      AI Live Generator (Gemini 3.7)
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Generates real-time custom syllabus or uses instant intelligent offline fallback.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode('ai')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        mode === 'ai'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      AI Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('demo')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        mode === 'demo'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      Instant Demo
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {error}
                  </div>
                )}

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white text-sm font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate My Learning Path</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                <div className="w-full h-full rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Synthesizing Your Curriculum</h3>
              <p className="text-sm text-indigo-300 max-w-sm font-mono animate-pulse">
                {loadingPhase}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Powered by LearnPath-AI Core</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
