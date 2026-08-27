export type PageTab = 
  | 'home' 
  | 'generator' 
  | 'roadmap' 
  | 'mentor' 
  | 'quiz' 
  | 'flashcards' 
  | 'discussions' 
  | 'leaderboard' 
  | 'explore' 
  | 'dashboard' 
  | 'auth';

export interface Resource {
  name: string;
  type: 'Docs' | 'Course' | 'Book' | 'Video' | 'GitHub' | 'Tool';
  url: string;
}

export interface ProjectSpec {
  name: string;
  description: string;
  githubTemplate?: string;
  deliverables?: string[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  description: string;
  topics: string[];
  projects: ProjectSpec[];
  resources: Resource[];
  completed?: boolean;
}

export interface Roadmap {
  id?: string;
  title: string;
  skill: string;
  summary: string;
  targetGoal: string;
  estimatedWeeks: number;
  weeklyHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  phases: RoadmapPhase[];
  createdAt?: string;
  progressPercentage?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  skill: string;
  difficulty?: string;
  questions: QuizQuestion[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  targetRole?: string;
  preferredLanguage?: string;
  bio?: string;
  token?: string;
  createdAt: string;
  streakDays?: number;
  xp?: number;
}

export type BadgeRarity = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // 'rocket' | 'brain' | 'cards' | 'flame' | 'award' | 'clock' | 'message' | 'bot' | 'crown' | 'zap'
  category: 'quiz' | 'flashcard' | 'roadmap' | 'community' | 'streak' | 'mentor' | 'xp';
  rarity: BadgeRarity;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  targetCount: number;
  currentCount: number;
  criteriaText: string;
}

export interface UserStats {
  streakDays: number;
  totalHoursLearned: number;
  completedMilestones: number;
  activeRoadmapsCount: number;
  savedRoadmaps: Roadmap[];
  completedPhasesIds: string[]; // formatted as "roadmapId-phaseIndex"
  xp: number;
  quizzesTaken: number;
  quizzesPassed: number;
  flashcardsReviewed: number;
  flashcardsMastered: number;
  discussionMessagesSent: number;
  mentorChatsCount: number;
  badges: Badge[];
}

export interface SkillField {
  id: string;
  title: string;
  category: string;
  description: string;
  iconType: 'data-scientist' | 'ml-engineer' | 'deep-learning' | 'nlp-specialist';
  coursesCount: number;
  projectsCount: number;
  salaryRange: string;
  topics: string[];
}

export interface TopicStudyGuide {
  topic: string;
  skill: string;
  quickSummary: string;
  analogy: string;
  keyConcepts: { title: string; desc: string }[];
  codeSnippet: string;
  codeLanguage?: string;
  interviewTips: string[];
}

export interface FlashcardItem {
  id: string;
  topic: string;
  front: string;
  back: string;
  analogy?: string;
  codeSnippet?: string;
  codeLanguage?: string;
  keyTakeaways?: string[];
  interviewTip?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  masteryStatus?: 'unseen' | 'learning' | 'mastered';
}

export interface FlashcardDeck {
  id: string;
  title: string;
  skill: string;
  topic: string;
  description: string;
  cardsCount: number;
  cards: FlashcardItem[];
}

export interface DiscussionMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole?: string;
  text: string;
  codeSnippet?: string;
  codeLanguage?: string;
  timestamp: string;
  reactions: { [emoji: string]: string[] }; // emoji -> array of userIds
  badge?: string;
}

export interface DiscussionRoom {
  id: string;
  name: string;
  topic: string;
  icon: string;
  description: string;
  onlineCount: number;
  category: 'ai' | 'fullstack' | 'interview' | 'showcase' | 'general';
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string;
  targetRole: string;
  xp: number;
  streakDays: number;
  quizzesPassed: number;
  flashcardsMastered: number;
  roadmapsCompleted: number;
  badgesCount: number;
  track: string;
  isCurrentUser?: boolean;
  badgeTitle?: string;
}
