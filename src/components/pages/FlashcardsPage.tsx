import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Layers, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Copy, 
  Check, 
  Volume2, 
  HelpCircle, 
  Zap, 
  Lightbulb, 
  Code2, 
  Award, 
  PlusCircle, 
  ArrowRight,
  Flame,
  Bot
} from 'lucide-react';
import { FlashcardDeck, FlashcardItem, Roadmap } from '../../types';
import { curatedFlashcardDecks } from '../../data/flashcardDecks';

interface FlashcardsPageProps {
  activeRoadmap: Roadmap | null;
  onNavigateToTab: (tab: any, contextData?: any) => void;
  onFlashcardMastered?: (cardId: string) => void;
}

export const FlashcardsPage: React.FC<FlashcardsPageProps> = ({
  activeRoadmap,
  onNavigateToTab,
  onFlashcardMastered,
}) => {
  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    try {
      const saved = localStorage.getItem('learnpath_flashcard_decks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load flashcard decks:', e);
    }
    return curatedFlashcardDecks;
  });

  const [activeDeckId, setActiveDeckId] = useState<string>(decks[0]?.id || 'deck-ai-core');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [cardStatusMap, setCardStatusMap] = useState<Record<string, 'unseen' | 'learning' | 'mastered'>>({});

  // Generator modal state
  const [showDeckGenerator, setShowDeckGenerator] = useState<boolean>(false);
  const [genTopic, setGenTopic] = useState<string>('');
  const [genSkill, setGenSkill] = useState<string>(activeRoadmap?.skill || 'AI Engineering');
  const [genDifficulty, setGenDifficulty] = useState<string>('Intermediate');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const currentCard: FlashcardItem | undefined = activeDeck?.cards[currentCardIndex];

  // Save custom decks to local storage
  useEffect(() => {
    localStorage.setItem('learnpath_flashcard_decks', JSON.stringify(decks));
  }, [decks]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        handlePrevCard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCardIndex, activeDeck]);

  const handleNextCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setCopiedCode(false);
    setCurrentCardIndex((prev) => (prev + 1 < activeDeck.cards.length ? prev + 1 : 0));
  };

  const handlePrevCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setCopiedCode(false);
    setCurrentCardIndex((prev) => (prev - 1 >= 0 ? prev - 1 : activeDeck.cards.length - 1));
  };

  const handleShuffle = () => {
    if (!activeDeck) return;
    const shuffled = [...activeDeck.cards].sort(() => Math.random() - 0.5);
    const updatedDecks = decks.map((d) =>
      d.id === activeDeck.id ? { ...d, cards: shuffled } : d
    );
    setDecks(updatedDecks);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleMarkMastered = (card: FlashcardItem) => {
    setCardStatusMap((prev) => ({ ...prev, [card.id]: 'mastered' }));
    if (onFlashcardMastered) {
      onFlashcardMastered(card.id);
    }
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 }
    });
    handleNextCard();
  };

  const handleMarkLearning = (card: FlashcardItem) => {
    setCardStatusMap((prev) => ({ ...prev, [card.id]: 'learning' }));
    handleNextCard();
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-flashcard-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: genSkill,
          topic: genTopic,
          difficulty: genDifficulty
        })
      });
      const data = await res.json();
      if (data.deck && data.deck.cards?.length > 0) {
        const newDeck: FlashcardDeck = {
          id: `deck-${Date.now()}`,
          title: data.deck.title || `${genTopic} Study Deck`,
          skill: genSkill,
          topic: genTopic,
          description: data.deck.description || `AI-generated study deck for ${genTopic}`,
          cardsCount: data.deck.cards.length,
          cards: data.deck.cards
        };

        setDecks([newDeck, ...decks]);
        setActiveDeckId(newDeck.id);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setShowDeckGenerator(false);
        setGenTopic('');
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to generate deck:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const masteredCount = activeDeck?.cards.filter(
    (c) => cardStatusMap[c.id] === 'mastered' || c.masteryStatus === 'mastered'
  ).length || 0;

  const progressPercent = activeDeck?.cards.length
    ? Math.round((masteredCount / activeDeck.cards.length) * 100)
    : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full p-4 sm:p-6 text-white space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-black border border-cyan-500/20 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
            <Layers className="w-3.5 h-3.5" /> Interactive Flashcard Studio
          </div>
          <h1 className="text-2xl font-extrabold text-white">Active Recall & Mental Models</h1>
          <p className="text-xs text-gray-400">Flip cards to test deep intuition, code patterns, and interview defense tips.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeckGenerator(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Deck Generator</span>
          </button>
        </div>
      </div>

      {/* Deck Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {decks.map((deck) => {
          const isActive = deck.id === activeDeckId;
          return (
            <button
              key={deck.id}
              onClick={() => {
                setActiveDeckId(deck.id);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                  : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/[0.08]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>{deck.title}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono">
                {deck.cards.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Flashcard Container */}
      {currentCard ? (
        <div className="space-y-4">
          {/* Deck Progress Bar & Controls */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">
                Card {currentCardIndex + 1} of {activeDeck.cards.length}
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 font-semibold">{masteredCount} Mastered</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 transition-colors flex items-center gap-1 text-[11px]"
                title="Shuffle Deck"
              >
                <Shuffle className="w-3.5 h-3.5 text-cyan-400" /> Shuffle
              </button>
              <button
                onClick={() => handleSpeak(isFlipped ? currentCard.back : currentCard.front)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-300 transition-colors"
                title="Listen (Audio Speech)"
              >
                <Volume2 className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / activeDeck.cards.length) * 100}%` }}
            />
          </div>

          {/* 3D Interactive Flip Card */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[420px] rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative transition-all duration-300 hover:border-cyan-400/50 flex flex-col justify-between"
          >
            {/* Top Card Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentCard.topic || activeDeck.topic}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-gray-300">
                  {currentCard.difficulty || 'Intermediate'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{isFlipped ? 'Back (Answer)' : 'Front (Question)'} • Click to Flip</span>
              </div>
            </div>

            {/* Card Content (Front vs Back) */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                /* Card Front */
                <motion.div
                  key="front"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-center max-w-2xl mx-auto"
                >
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-inner">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                    {currentCard.front}
                  </h2>
                  <p className="text-xs text-gray-400 font-mono">
                    Press <kbd className="px-2 py-1 rounded bg-white/10 border border-white/20 text-white">Space</kbd> or click card to reveal answer & mental model
                  </p>
                </motion.div>
              ) : (
                /* Card Back (Detailed Answer, Analogy, Code, Interview Tip) */
                <motion.div
                  key="back"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-5 text-left"
                  onClick={(e) => e.stopPropagation()} // Prevent flip when clicking text/copy button
                >
                  {/* Core Definition */}
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-sm sm:text-base text-gray-100 font-medium leading-relaxed">
                    {currentCard.back}
                  </div>

                  {/* Real World Analogy */}
                  {currentCard.analogy && (
                    <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                        <Lightbulb className="w-4 h-4 text-amber-400" /> Physical Mental Model:
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">
                        "{currentCard.analogy}"
                      </p>
                    </div>
                  )}

                  {/* Code Snippet if present */}
                  {currentCard.codeSnippet && (
                    <div className="rounded-2xl bg-[#070b14] border border-white/15 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-[11px] text-gray-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                          {currentCard.codeLanguage || 'typescript'}
                        </span>
                        <button
                          onClick={() => handleCopyCode(currentCard.codeSnippet!)}
                          className="flex items-center gap-1 text-xs text-gray-300 hover:text-white"
                        >
                          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-cyan-200 overflow-x-auto max-h-48 scrollbar-thin">
                        <code>{currentCard.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {currentCard.keyTakeaways && currentCard.keyTakeaways.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Key Engineering Takeaways:</div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {currentCard.keyTakeaways.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interview Defense Tip */}
                  {currentCard.interviewTip && (
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200">
                      <Award className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold text-purple-300">Interview Defense Tip: </strong>
                        {currentCard.interviewTip}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Card Footer Navigation & Mastery Buttons */}
            <div 
              className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev / Next */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={handlePrevCard}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors border border-white/10"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors border border-white/10"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Confidence Ratings */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => handleMarkLearning(currentCard)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
                >
                  Still Learning
                </button>
                <button
                  onClick={() => handleMarkMastered(currentCard)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mastered (+50 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <p className="text-gray-400 text-sm">No flashcards found in this deck.</p>
          <button
            onClick={() => setShowDeckGenerator(true)}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
          >
            Generate AI Flashcard Deck
          </button>
        </div>
      )}

      {/* AI Deck Generator Modal */}
      <AnimatePresence>
        {showDeckGenerator && (
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
              className="max-w-lg w-full bg-[#0a0f1d] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Generate Custom Deck</h3>
                    <p className="text-xs text-gray-400">Powered by Gemini 3.7 Flash</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeckGenerator(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleGenerateDeck} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Subject / Technical Domain</label>
                  <input
                    type="text"
                    value={genSkill}
                    onChange={(e) => setGenSkill(e.target.value)}
                    placeholder="e.g. AI Engineering, Distributed Systems, React 19"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Target Topic or Subconcept</label>
                  <input
                    type="text"
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    placeholder="e.g. Vector Embeddings & HNSW, Redis Caching, Raft Consensus"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Difficulty Depth</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                      <button
                        type="button"
                        key={diff}
                        onClick={() => setGenDifficulty(diff)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          genDifficulty === diff
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                        <span>Synthesizing Flashcard Deck...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Study Deck</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeckGenerator(false)}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
