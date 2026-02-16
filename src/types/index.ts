// =============================================
// HabitOS — Core Type Definitions
// =============================================

// 4D Scanner
export interface FourDScan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  timeOfDay: 'morning' | 'evening';
  somatic: number;    // 1-10
  structural: number; // 1-10
  noetic: number;     // 1-10
  sovereign: number;  // 1-10
  createdAt: string;
}

// Habits
export type HabitCategory = 'physical' | 'creative' | 'structural' | 'sovereign';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  category: HabitCategory;
  xpWeight: number;        // 5-20
  minimumViableVersion: string;
  why: string;
  phaseId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  date: string;
  isMinimumViable: boolean;
  createdAt: string;
}

// Phases
export interface Phase {
  id: string;
  userId: string;
  name: string;
  description: string;
  goal: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

// Execution Blocks
export type BlockCategory = 'creative' | 'structural' | 'physical' | 'learning';

export interface ExecutionBlock {
  id: string;
  userId: string;
  category: BlockCategory;
  startTime: string;
  endTime: string | null;
  durationMinutes: number | null;
  note: string;
  xpEarned: number;
  createdAt: string;
}

// Shadow Log
export interface ShadowEntry {
  id: string;
  userId: string;
  patternName: string;
  trigger: string;
  intensity: number; // 1-10
  intervention: string | null;
  resolved: boolean;
  date: string;
  createdAt: string;
}

// Artifacts
export type ArtifactDomain = 'music' | 'code' | 'writing' | 'system' | 'physical' | 'other';

export interface Artifact {
  id: string;
  userId: string;
  name: string;
  description: string;
  domain: ArtifactDomain;
  xpEarned: number;
  date: string;
  createdAt: string;
}

// XP & Progression
export type Rank = 'Novice' | 'Operator' | 'Architect' | 'Warlord' | 'Sovereign' | 'Archon';

export interface UserProfile {
  id: string;
  displayName: string;
  totalXp: number;
  rank: Rank;
  currentStreak: number;
  longestStreak: number;
  activePhaseId: string | null;
  createdAt: string;
}

export const RANK_THRESHOLDS: Record<Rank, number> = {
  Novice: 0,
  Operator: 100,
  Architect: 500,
  Warlord: 1000,
  Sovereign: 2500,
  Archon: 5000,
};

// AI Console
export type AIProvider = 'claude' | 'gemini';
export type ISOSMode = 'default' | 'warlord' | 'architect' | 'sovereign' | 'noetic' | 'somatic' | 'shadow' | 'pantheon';

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider: AIProvider;
  isPinned: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  provider: AIProvider;
  mode: ISOSMode;
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Patterns (Pattern Library)
export interface Pattern {
  id: string;
  userId: string;
  name: string;
  description: string;
  typicalTrigger: string;
  typicalPayoff: string;
  cost: string;
  countermove: string;
  frequencyLast30: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  createdAt: string;
}

// Pinned Insights
export interface PinnedInsight {
  id: string;
  userId: string;
  content: string;
  source: AIProvider;
  conversationId: string;
  topic: string;
  createdAt: string;
}

// Energy tracking
export interface EnergyEntry {
  id: string;
  userId: string;
  date: string;
  morning: number | null;  // 1-10
  afternoon: number | null;
  evening: number | null;
  createdAt: string;
}

// Nutrition
export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  structuredMeals: boolean;
  bloodTypeProtocol: boolean;
  notes: string;
  createdAt: string;
}

// Daily Score
export interface DailyScore {
  id: string;
  userId: string;
  date: string;
  score: number;       // 0-100
  xpEarned: number;
  habitsCompleted: number;
  habitsTotal: number;
  blocksCompleted: number;
  artifactsShipped: number;
  createdAt: string;
}

// Mission
export interface DailyMission {
  id: string;
  userId: string;
  date: string;
  statement: string;
  isAiGenerated: boolean;
  createdAt: string;
}
