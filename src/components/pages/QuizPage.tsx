import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Award, 
  ArrowRight, 
  Clock, 
  Zap, 
  BookOpen, 
  Share2, 
  Layers, 
  MessageSquare, 
  Flame, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  SlidersHorizontal,
  Check,
  AlertCircle,
  Brain,
  Trophy
} from 'lucide-react';
import { QuizData, QuizQuestion, Roadmap, PageTab } from '../../types';

interface QuizPageProps {
  activeRoadmap: Roadmap | null;
  initialTopic?: string;
  onNavigateToTab: (tab: PageTab, contextData?: any) => void;
  onQuizPassed?: (score: number, total: number) => void;
}

const quickTopics = [
  'Transformers & Multi-Head Attention',
  'React 19 & Server Components',
  'Distributed Caching & Redis',
  'Docker & Container Architecture',
  'Python Asyncio & Concurrency',
  'Vector Databases & RAG',
  'PostgreSQL Indexing & Optimization',
  'System Design & Microservices'
];

const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Mastery'];

export const QuizPage: React.FC<QuizPageProps> = ({
  activeRoadmap,
  initialTopic = '',
  onNavigateToTab,
  onQuizPassed,
}) => {
  const [topic, setTopic] = useState<string>(
    initialTopic || (activeRoadmap ? activeRoadmap.phases[0]?.topics[0] || activeRoadmap.skill : 'Transformers & Multi-Head Attention')
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    activeRoadmap?.difficulty || 'Intermediate'
  );
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Array<{ questionIndex: number; selectedOption: number; isCorrect: boolean }>>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [reviewMode, setReviewMode] = useState<boolean>(false);

  // Sync with initialTopic prop whenever it updates
  useEffect(() => {
    if (initialTopic && initialTopic !== topic) {
      setTopic(initialTopic);
      fetchQuiz(initialTopic, selectedDifficulty);
    }
  }, [initialTopic]);

  const playFeedbackSound = (correct: boolean) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (correct) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, audioCtx.currentTime);
        osc.frequency.setValueAtTime(180, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // Audio not permitted or supported
    }
  };

  const fetchQuiz = async (customTopic?: string, customDifficulty?: string) => {
    const targetTopic = (customTopic || topic).trim() || 'Software Engineering Core';
    const targetDifficulty = customDifficulty || selectedDifficulty;

    setLoading(true);
    setErrorMsg(null);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
    setUserAnswers([]);
    setReviewMode(false);

    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          skill: activeRoadmap?.skill || 'Computer Science & AI',
          difficulty: targetDifficulty
        })
      });

      const data = await res.json();
      if (data && data.quiz && Array.isArray(data.quiz.questions) && data.quiz.questions.length > 0) {
        setQuizData(data.quiz);
      } else {
        throw new Error('Invalid quiz response structure');
      }
    } catch (err: any) {
      console.warn('Quiz API fetch error, applying fallback quiz:', err);
      // Client-side dynamic fallback guarantee
      setQuizData({
        topic: targetTopic,
        skill: activeRoadmap?.skill || 'Engineering Fundamentals',
        questions: [
          {
            id: 1,
            question: `In modern engineering, what is the core conceptual advantage of "${targetTopic}"?`,
            options: [
              `Enables modular abstraction, predictable state management, and scalable performance`,
              `Increases source code footprint without structural benefit`,
              `Forces single-threaded execution and disables caching`,
              `Replaces automated verification with manual testing`
            ],
            correctAnswer: 0,
            explanation: `${targetTopic} is designed to enforce predictable data flow, strict modularity, and high maintainability.`
          },
          {
            id: 2,
            question: `Which architectural practice best ensures fault tolerance when implementing "${targetTopic}"?`,
            options: [
              `Ignoring unhandled exceptions and omitting logs`,
              `Strict boundary validation, robust error typing, and telemetry metrics`,
              `Hardcoding environment variables into client bundles`,
              `Disabling automated CI/CD pipeline tests`
            ],
            correctAnswer: 1,
            explanation: `Defensive design, automated test suites, and boundary validation prevent unexpected crashes in production.`
          },
          {
            id: 3,
            question: `How should telemetry and monitoring be structured around "${targetTopic}"?`,
            options: [
              `Instrument key latency, error rate, and resource utilization metrics with automated alerts`,
              `Delete all logs to minimize CPU cache overhead`,
              `Rely strictly on user bug reports after failures`,
              `Run benchmarks only on local development laptops`
            ],
            correctAnswer: 0,
            explanation: `Observability through structured metrics and proactive alerting ensures high uptime and rapid debugging.`
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null || !quizData) return;

    setSelectedOption(index);
    setShowExplanation(true);

    const isCorrect = index === quizData.questions[currentQuestionIndex].correctAnswer;
    playFeedbackSound(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selectedOption: index,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestionIndex + 1 < quizData.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      const totalQ = quizData.questions.length;
      const finalScore = score + (selectedOption === quizData.questions[currentQuestionIndex].correctAnswer ? 0 : 0);
      
      if (onQuizPassed) {
        onQuizPassed(finalScore, totalQ);
      }

      if (finalScore >= Math.ceil(totalQ / 2)) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }
  };

  // Keyboard shortcut listener for options (1-4 or A-D) and Enter to next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading || quizFinished || !quizData) return;

      if (selectedOption === null) {
        if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelectOption(0);
        else if (e.key === '2' || e.key === 'b' || e.key === 'B') handleSelectOption(1);
        else if (e.key === '3' || e.key === 'c' || e.key === 'C') handleSelectOption(2);
        else if (e.key === '4' || e.key === 'd' || e.key === 'D') handleSelectOption(3);
      } else if (showExplanation) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [loading, quizFinished, quizData, selectedOption, showExplanation, currentQuestionIndex]);

  const currentQ: QuizQuestion | undefined = quizData?.questions[currentQuestionIndex];
  const totalQuestions = quizData?.questions.length || 0;
  const earnedXp = 100 + (score * 50);
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const isPassed = percentage >= 60;

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-4xl mx-auto w-full p-4 sm:p-6 text-white space-y-6">
      {/* Header card with Topic & Difficulty Configuration */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-black border border-purple-500/20 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Knowledge Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Interactive Skill Quiz</h1>
          <p className="text-xs text-gray-400">
            Real-time evaluation with Gemini 3.7 Flash. Earn XP, track recall, and level up badges.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => {
              setSelectedDifficulty(e.target.value);
              fetchQuiz(topic, e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff} className="bg-[#0b0f1a] text-white">
                {diff} Difficulty
              </option>
            ))}
          </select>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundEnabled ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/10 text-gray-400'
            }`}
            title={soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Custom Topic Search / Generator Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && topic.trim()) {
                fetchQuiz();
              }
            }}
            placeholder="Type any skill, framework, or algorithm to test (e.g. Docker, RAG, PyTorch)..."
            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          {topic && (
            <button
              onClick={() => setTopic('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => fetchQuiz()}
          disabled={loading || !topic.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-t-white border-white/30 animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : (
            <>
              <Brain className="w-3.5 h-3.5" />
              <span>Generate Quiz</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Topic Starter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap pl-1">Preset Topics:</span>
        {quickTopics.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t);
              fetchQuiz(t, selectedDifficulty);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              topic === t
                ? 'bg-purple-500/25 border-purple-400 text-purple-200 shadow-md shadow-purple-500/10'
                : 'bg-white/[0.03] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Quiz View */}
      {loading ? (
        <div className="min-h-[380px] flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Generating AI Skill Quiz</h3>
            <p className="text-xs text-purple-300 font-mono">
              Formulating targeted conceptual questions for "{topic}" ({selectedDifficulty})...
            </p>
          </div>
        </div>
      ) : quizFinished ? (
        /* Result Summary Card */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0e1222] to-black border border-purple-500/30 text-center space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-purple-300 shadow-xl shadow-purple-500/10">
            {isPassed ? <Award className="w-10 h-10 text-amber-400" /> : <Brain className="w-10 h-10 text-purple-300" />}
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Assessment Result
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isPassed ? 'Congratulations! Quiz Passed' : 'Skill Assessment Completed'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Topic: <strong className="text-purple-300">{quizData?.topic}</strong> ({selectedDifficulty})
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="max-w-lg mx-auto grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="text-[11px] text-gray-400">Score</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {score} / {totalQuestions}
              </div>
              <div className="text-[10px] text-gray-500">{percentage}% Accuracy</div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-1">
              <div className="text-[11px] text-purple-300">XP Gained</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
                +{earnedXp}
              </div>
              <div className="text-[10px] text-purple-400">+50 per answer</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <div className="text-[11px] text-amber-300">Streak Status</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-400" /> Active
              </div>
              <div className="text-[10px] text-amber-400">Consistency +1</div>
            </div>
          </div>

          {/* Review Question Section Accordion Toggle */}
          <div className="pt-2">
            <button
              onClick={() => setReviewMode(!reviewMode)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4 transition-colors"
            >
              {reviewMode ? 'Hide Question Breakdown' : 'Review All Questions & Explanations'}
            </button>
          </div>

          {reviewMode && quizData && (
            <div className="space-y-4 text-left max-w-2xl mx-auto pt-2">
              {quizData.questions.map((q, idx) => {
                const answerRecord = userAnswers.find((a) => a.questionIndex === idx);
                const isCorrect = answerRecord?.isCorrect;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2.5 ${
                      isCorrect ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/30 border-red-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white">Q{idx + 1}: {q.question}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="space-y-1 pl-2 border-l border-white/10">
                      <div className="text-gray-400">
                        Your answer: <span className="text-white font-medium">{answerRecord !== undefined ? q.options[answerRecord.selectedOption] : 'None'}</span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-400">
                          Correct answer: <span className="font-semibold">{q.options[q.correctAnswer]}</span>
                        </div>
                      )}
                      <div className="text-gray-300 text-[11px] pt-1">
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => fetchQuiz()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30"
            >
              <RotateCcw className="w-4 h-4" /> Retake / Refresh Topic
            </button>
            <button
              onClick={() => onNavigateToTab('flashcards')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-white text-xs font-bold transition-all"
            >
              <Layers className="w-4 h-4 text-cyan-400" /> Study in Flashcard Studio
            </button>
            <button
              onClick={() => onNavigateToTab('discussions')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-white text-xs font-bold transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" /> Discuss in Study Room
            </button>
          </div>
        </motion.div>
      ) : currentQ ? (
        /* Active Question Card */
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6 shadow-xl"
        >
          {/* Progress Bar & Question Step Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">
                  {selectedDifficulty}
                </span>
                <span>
                  Question <strong className="text-white font-mono">{currentQuestionIndex + 1}</strong> of {totalQuestions}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  Keyboard: Keys 1-4 to pick, Enter to next
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-mono text-xs">
                  Score: <strong className="text-emerald-400">{score}</strong>
                </span>
              </div>
            </div>

            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / (totalQuestions || 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Option Choices */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswer;
              
              let style = 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-gray-200';
              if (selectedOption !== null) {
                if (isCorrect) {
                  style = 'bg-emerald-950/50 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/10 font-semibold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-red-950/50 border-red-400 text-red-200';
                } else {
                  style = 'bg-white/[0.02] border-white/5 opacity-40 text-gray-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start justify-between gap-3 group ${style}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 group-hover:bg-white/20'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{option}</span>
                  </div>

                  {selectedOption !== null && (
                    <div className="shrink-0 pt-0.5">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/40 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Concept Analysis & Master Note:</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    Press <strong className="text-white">Enter ↵</strong> to continue
                  </span>
                </div>

                <p className="text-gray-200 leading-relaxed text-xs sm:text-sm">
                  {currentQ.explanation}
                </p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <span>{currentQuestionIndex + 1 === totalQuestions ? 'View Final Results' : 'Next Question'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty / Initial State fallback if no questions */
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
          <Brain className="w-10 h-10 text-purple-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No active quiz loaded</h3>
            <p className="text-xs text-gray-400">Click below to generate questions on {topic}.</p>
          </div>
          <button
            onClick={() => fetchQuiz()}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
};
