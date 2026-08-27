import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  FolderGit2, 
  Bot, 
  HelpCircle, 
  Share2, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Award, 
  ChevronRight, 
  FileText,
  Copy,
  Check,
  Zap,
  Lightbulb,
  Code2,
  HelpCircle as QuizIcon,
  RefreshCw
} from 'lucide-react';
import { Roadmap, RoadmapPhase, PageTab, TopicStudyGuide } from '../../types';

interface RoadmapPageProps {
  roadmap: Roadmap | null;
  onNavigateToTab: (tab: PageTab, contextData?: any) => void;
  onUpdateRoadmap: (updatedRoadmap: Roadmap) => void;
  onLogStudyHours: (hours: number) => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  roadmap,
  onNavigateToTab,
  onUpdateRoadmap,
  onLogStudyHours,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [phaseNotes, setPhaseNotes] = useState<Record<number, string>>({});

  // Study Flashcard AI state
  const [explainingTopic, setExplainingTopic] = useState<string | null>(null);
  const [studyGuide, setStudyGuide] = useState<TopicStudyGuide | null>(null);
  const [loadingStudyGuide, setLoadingStudyGuide] = useState(false);

  // Study timer stopwatch
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  React.useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!roadmap) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center text-white bg-black">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Active Roadmap Selected</h2>
        <p className="text-gray-400 text-sm max-w-md mb-6">
          Generate your personalized learning path or explore pre-built curriculum tracks to start learning.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigateToTab('generator')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
          >
            Create New Path
          </button>
          <button
            onClick={() => onNavigateToTab('explore')}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20"
          >
            Explore Roadmaps
          </button>
        </div>
      </div>
    );
  }

  // Calculate completion percentage
  const completedPhasesCount = roadmap.phases.filter(p => p.completed).length;
  const totalPhases = roadmap.phases.length;
  const progressPercent = totalPhases > 0 ? Math.round((completedPhasesCount / totalPhases) * 100) : 0;

  const togglePhaseCompletion = (phaseNumber: number) => {
    const updatedPhases = roadmap.phases.map(p => {
      if (p.phaseNumber === phaseNumber) {
        const nextState = !p.completed;
        if (nextState) {
          confetti({
            particleCount: 70,
            spread: 50,
            origin: { y: 0.7 }
          });
        }
        return { ...p, completed: nextState };
      }
      return p;
    });

    onUpdateRoadmap({
      ...roadmap,
      phases: updatedPhases,
      progressPercentage: Math.round((updatedPhases.filter(p => p.completed).length / updatedPhases.length) * 100)
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roadmap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${roadmap.skill.toLowerCase().replace(/\s+/g, '-')}-roadmap.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stopAndLogTimer = () => {
    if (secondsElapsed > 0) {
      const hours = Number((secondsElapsed / 3600).toFixed(2));
      onLogStudyHours(hours);
      setSecondsElapsed(0);
      setTimerRunning(false);
    }
  };

  const handleOpenStudyGuide = async (topic: string) => {
    setExplainingTopic(topic);
    setStudyGuide(null);
    setLoadingStudyGuide(true);

    try {
      const res = await fetch('/api/ai-explain-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          skill: roadmap.skill,
          level: roadmap.difficulty
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setStudyGuide(data.data);
      }
    } catch (err) {
      console.error('Study guide error:', err);
    } finally {
      setLoadingStudyGuide(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Top Roadmap Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-black border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {roadmap.skill}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {roadmap.difficulty} Track
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {roadmap.title}
            </h1>
            <p className="text-sm text-gray-300 max-w-3xl leading-relaxed">
              {roadmap.summary}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-bold font-mono text-indigo-300">{progressPercent}%</div>
              <div className="text-[11px] text-gray-400">Total Curriculum Progress</div>
            </div>
            <div className="w-36 bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Roadmap Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Duration: <strong>{roadmap.estimatedWeeks} Weeks</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Pace: <strong>{roadmap.weeklyHours}h / week</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Award className="w-4 h-4 text-pink-400" />
            <span>Target: <strong>{roadmap.targetGoal}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Milestones: <strong>{completedPhasesCount}/{totalPhases} Done</strong></span>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="flex items-center gap-2">
            {/* Ask AI Mentor */}
            <button
              onClick={() => onNavigateToTab('mentor', { skill: roadmap.skill })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              <Bot className="w-3.5 h-3.5" />
              Ask AI Mentor
            </button>

            {/* Test with AI Quiz */}
            <button
              onClick={() => onNavigateToTab('quiz', { skill: roadmap.skill, topic: roadmap.phases[0]?.topics[0] })}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 font-semibold transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Skill Quiz
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 transition-all"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Copied!' : 'Share'}
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>

          {/* Integrated Study Timer */}
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.04] border border-white/10">
            <span className="text-[11px] text-gray-400 font-mono pl-2">
              Focus Timer: <strong className="text-white font-mono">{formatTimer(secondsElapsed)}</strong>
            </span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                timerRunning ? 'bg-amber-500/30 text-amber-300' : 'bg-emerald-500/30 text-emerald-300'
              }`}
            >
              {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            {secondsElapsed > 0 && (
              <button
                onClick={stopAndLogTimer}
                title="Log study time to dashboard"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Roadmap Milestone Timeline Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Curriculum Stages & Milestones
          </h2>
          <span className="text-xs text-gray-400">
            Click topics for instant AI Flashcards & Cheat Sheets
          </span>
        </div>

        <div className="relative space-y-6 pl-4 sm:pl-8 border-l-2 border-indigo-500/30">
          {roadmap.phases.map((phase, index) => (
            <motion.div
              key={phase.phaseNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Connector Dot */}
              <button
                onClick={() => togglePhaseCompletion(phase.phaseNumber)}
                className={`absolute -left-[25px] sm:-left-[41px] top-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  phase.completed
                    ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-[#0b101e] border-indigo-500/50 text-indigo-400 hover:border-indigo-400'
                }`}
                title={phase.completed ? 'Mark incomplete' : 'Mark phase complete'}
              >
                {phase.completed ? <CheckCircle2 className="w-5 h-5 text-white" /> : <span className="text-xs font-bold">{phase.phaseNumber}</span>}
              </button>

              {/* Phase Card */}
              <div className={`p-6 rounded-2xl border transition-all ${
                phase.completed
                  ? 'bg-emerald-950/10 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10 shadow-xl'
              }`}>
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Phase {phase.phaseNumber} • {phase.duration}
                      </span>
                      {phase.completed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
                      {phase.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePhaseCompletion(phase.phaseNumber)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        phase.completed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/10 hover:bg-white/15 text-gray-300'
                      }`}
                    >
                      {phase.completed ? 'Completed ✓' : 'Mark as Done'}
                    </button>
                    <button
                      onClick={() => setSelectedPhase(phase)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/30 flex items-center gap-1"
                    >
                      <span>Deep Dive</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4">
                  {phase.description}
                </p>

                {/* Key Topics Pills */}
                <div className="mb-5">
                  <div className="text-xs font-semibold text-gray-400 mb-2">Key Concepts (Click for AI Study Flashcard):</div>
                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleOpenStudyGuide(topic)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 text-xs text-gray-200 hover:text-indigo-300 transition-all flex items-center gap-1.5 group"
                        title="Open AI Flashcard & Cheat Sheet"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        <span>{topic}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hands-on Projects */}
                {phase.projects && phase.projects.length > 0 && (
                  <div className="mb-5 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
                      <FolderGit2 className="w-4 h-4 text-indigo-400" />
                      <span>Hands-On Milestone Project:</span>
                    </div>
                    {phase.projects.map((proj, pIdx) => (
                      <div key={pIdx}>
                        <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Curated Resources */}
                {phase.resources && phase.resources.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-2">Authoritative Study Resources:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 hover:text-white flex items-center justify-between transition-all group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                              {res.type}
                            </span>
                            <span className="truncate group-hover:text-indigo-300">{res.name}</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-indigo-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Study Flashcard & Deep-Dive Modal */}
      <AnimatePresence>
        {explainingTopic && (
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
              className="max-w-2xl w-full bg-[#080d1a] border border-indigo-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">AI Concept Flashcard</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">{explainingTopic}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setExplainingTopic(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs"
                >
                  ✕
                </button>
              </div>

              {loadingStudyGuide ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-gray-400">Synthesizing comprehensive AI study guide & mental model...</p>
                </div>
              ) : studyGuide ? (
                <div className="space-y-5 text-left text-xs sm:text-sm">
                  {/* Quick summary */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <h4 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Conceptual Summary
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">{studyGuide.quickSummary}</p>
                  </div>

                  {/* Mental Model Analogy */}
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                    <h4 className="text-xs font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Physical Mental Model
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">{studyGuide.analogy}</p>
                  </div>

                  {/* Code snippet */}
                  {studyGuide.codeSnippet && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" /> Implementation Pattern
                      </h4>
                      <pre className="p-4 rounded-2xl bg-black border border-white/10 text-emerald-400 font-mono text-xs overflow-x-auto">
                        {studyGuide.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Interview Tips */}
                  {studyGuide.interviewTips && studyGuide.interviewTips.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" /> Technical Interview Defense
                      </h4>
                      <ul className="space-y-1.5 list-disc list-inside text-xs text-gray-300">
                        {studyGuide.interviewTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const topic = explainingTopic;
                          setExplainingTopic(null);
                          onNavigateToTab('mentor', { skill: roadmap.skill, topic });
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        Chat with Mentor
                      </button>
                      <button
                        onClick={() => {
                          const topic = explainingTopic;
                          setExplainingTopic(null);
                          onNavigateToTab('quiz', { skill: roadmap.skill, topic });
                        }}
                        className="px-4 py-2 rounded-xl bg-purple-600/40 hover:bg-purple-600 text-purple-200 text-xs font-semibold flex items-center gap-1.5 border border-purple-500/40"
                      >
                        <QuizIcon className="w-3.5 h-3.5" />
                        Quiz on Topic
                      </button>
                    </div>

                    <button
                      onClick={() => setExplainingTopic(null)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      Close Flashcard
                    </button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Deep Dive Modal */}
      <AnimatePresence>
        {selectedPhase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-2xl w-full bg-[#0a0f1d] border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-indigo-400">
                    PHASE {selectedPhase.phaseNumber} • {selectedPhase.duration}
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {selectedPhase.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPhase(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedPhase.description}
              </p>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Detailed Syllabus & Key Topics
                </h4>
                <ul className="space-y-2">
                  {selectedPhase.topics.map((t, idx) => (
                    <li key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                      <span className="text-gray-200 font-medium">{t}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPhase(null);
                            handleOpenStudyGuide(t);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" /> Flashcard
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPhase(null);
                            onNavigateToTab('mentor', { skill: roadmap.skill, topic: t });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <Bot className="w-3 h-3" /> Ask Mentor
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phase Notes Scratchpad */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  Your Study Notes & Key Takeaways
                </h4>
                <textarea
                  value={phaseNotes[selectedPhase.phaseNumber] || ''}
                  onChange={(e) => setPhaseNotes({ ...phaseNotes, [selectedPhase.phaseNumber]: e.target.value })}
                  placeholder="Record your thoughts, code snippets, or tricky questions here..."
                  className="w-full h-24 p-3 rounded-xl bg-white/[0.05] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => {
                    togglePhaseCompletion(selectedPhase.phaseNumber);
                    setSelectedPhase(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPhase.completed
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {selectedPhase.completed ? 'Mark Incomplete' : 'Complete Phase ✓'}
                </button>
                <button
                  onClick={() => setSelectedPhase(null)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
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
