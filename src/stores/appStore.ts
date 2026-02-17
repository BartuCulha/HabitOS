import { create } from 'zustand';
import type {
  FourDScan, Habit, HabitCompletion, UserProfile, DailyMission, Rank,
  ShadowEntry, Artifact, ExecutionBlock, EnergyEntry,
  Conversation, ConversationMessage, PinnedInsight, Phase,
  ArtifactDomain, BlockCategory, ISOSMode, AIProvider,
} from '../types';
import { RANK_THRESHOLDS } from '../types';
import {
  DEFAULT_HABITS, SAMPLE_SHADOW_ENTRIES, SAMPLE_ARTIFACTS, SAMPLE_BLOCKS,
  SAMPLE_PHASES, SAMPLE_ENERGY, SAMPLE_CONVERSATIONS, SAMPLE_MESSAGES,
  SAMPLE_INSIGHTS, SOBRIETY_START_DATE, getMockAIResponse,
  type JournalEntry, SAMPLE_JOURNAL,
  type Decision, SAMPLE_DECISIONS,
} from '../utils/mockData';

function calcRank(xp: number): Rank {
  const ranks: Rank[] = ['Archon', 'Sovereign', 'Warlord', 'Architect', 'Operator', 'Novice'];
  for (const r of ranks) {
    if (xp >= RANK_THRESHOLDS[r]) return r;
  }
  return 'Novice';
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface AppState {
  // Auth
  userId: string;

  // Profile
  profile: UserProfile;

  // Today's state
  todayMission: DailyMission | null;
  todayScan: FourDScan | null;
  todayCompletions: HabitCompletion[];
  habits: Habit[];

  // Shadow
  shadowEntries: ShadowEntry[];

  // Artifacts
  artifacts: Artifact[];

  // Execution Blocks
  executionBlocks: ExecutionBlock[];
  activeBlock: ExecutionBlock | null;

  // Energy
  energyEntries: EnergyEntry[];

  // Nutrition
  todayNutrition: { structuredMeals: boolean; bloodTypeProtocol: boolean };

  // Body Metrics
  bodyWeight: number;
  bodyNotes: string;

  // Sobriety
  sobrietyStartDate: string;

  // Phases
  phases: Phase[];

  // AI
  conversations: Conversation[];
  messages: ConversationMessage[];
  pinnedInsights: PinnedInsight[];
  activeConversationId: string | null;
  aiProvider: AIProvider;
  isosMode: ISOSMode;

  // Journal
  journalEntries: JournalEntry[];

  // Decisions
  decisions: Decision[];

  // Settings
  settings: {
    modelPreference: AIProvider;
    contextInjection: { habits: boolean; shadow: boolean; energy: boolean; blocks: boolean };
    notifications: { morning: boolean; evening: boolean; streakWarning: boolean };
  };

  // Rank-up modal
  showRankUpModal: boolean;
  newRank: Rank | null;

  // UI
  isLoading: boolean;

  // Actions
  setTodayMission: (statement: string) => void;
  setTodayScan: (scan: FourDScan) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  addShadowEntry: (entry: Omit<ShadowEntry, 'id' | 'userId' | 'createdAt'>) => void;
  addArtifact: (artifact: Omit<Artifact, 'id' | 'userId' | 'createdAt' | 'xpEarned'>) => void;
  startBlock: (category: BlockCategory) => void;
  stopBlock: (note: string) => void;
  setEnergy: (period: 'morning' | 'afternoon' | 'evening', value: number) => void;
  setNutrition: (key: 'structuredMeals' | 'bloodTypeProtocol', value: boolean) => void;
  setBodyWeight: (weight: number) => void;
  setBodyNotes: (notes: string) => void;
  resetSobriety: (trigger: string) => void;
  addXp: (amount: number) => void;
  setAiProvider: (provider: AIProvider) => void;
  setIsosMode: (mode: ISOSMode) => void;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (content: string) => void;
  startNewConversation: () => void;
  pinInsight: (messageId: string, topic: string) => void;
  addJournalEntry: (content: string) => void;
  addDecision: (title: string, reasoning: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  addPhase: (phase: Omit<Phase, 'id' | 'userId' | 'createdAt'>) => void;
  togglePhase: (phaseId: string) => void;
  updateSettings: (path: string, value: boolean | string) => void;
  dismissRankUp: () => void;
  setLoading: (loading: boolean) => void;

  // Computed
  isMinimumViableDay: () => boolean;
  todayXP: () => number;
  sobrietyDays: () => number;
}

const today = new Date().toISOString().split('T')[0];

export const useAppStore = create<AppState>((set, get) => ({
  userId: 'demo',
  profile: {
    id: 'demo',
    displayName: 'Operator',
    totalXp: 580,
    rank: 'Architect',
    currentStreak: 7,
    longestStreak: 12,
    activePhaseId: 'ph1',
    createdAt: '',
  },
  todayMission: null,
  todayScan: null,
  todayCompletions: [],
  habits: DEFAULT_HABITS,
  shadowEntries: SAMPLE_SHADOW_ENTRIES,
  artifacts: SAMPLE_ARTIFACTS,
  executionBlocks: SAMPLE_BLOCKS,
  activeBlock: null,
  energyEntries: SAMPLE_ENERGY,
  todayNutrition: { structuredMeals: false, bloodTypeProtocol: false },
  bodyWeight: 71.2,
  bodyNotes: '',
  sobrietyStartDate: SOBRIETY_START_DATE,
  phases: SAMPLE_PHASES,
  conversations: SAMPLE_CONVERSATIONS,
  messages: SAMPLE_MESSAGES,
  pinnedInsights: SAMPLE_INSIGHTS,
  activeConversationId: null,
  aiProvider: 'claude',
  isosMode: 'default',
  journalEntries: SAMPLE_JOURNAL,
  decisions: SAMPLE_DECISIONS,
  settings: {
    modelPreference: 'claude',
    contextInjection: { habits: true, shadow: true, energy: true, blocks: true },
    notifications: { morning: true, evening: true, streakWarning: true },
  },
  showRankUpModal: false,
  newRank: null,
  isLoading: false,

  setTodayMission: (statement) => set({
    todayMission: { id: genId(), userId: 'demo', date: today, statement, isAiGenerated: false, createdAt: new Date().toISOString() },
  }),

  setTodayScan: (scan) => set({ todayScan: scan }),

  toggleHabitCompletion: (habitId, date) => {
    const { todayCompletions, habits } = get();
    const existing = todayCompletions.find(c => c.habitId === habitId && c.date === date);
    if (existing) {
      set({ todayCompletions: todayCompletions.filter(c => c.id !== existing.id) });
    } else {
      const habit = habits.find(h => h.id === habitId);
      const xp = habit?.xpWeight || 5;
      const newCompletion: HabitCompletion = {
        id: genId(), userId: 'demo', habitId, date,
        isMinimumViable: get().isMinimumViableDay(), createdAt: new Date().toISOString(),
      };
      set({ todayCompletions: [...todayCompletions, newCompletion] });
      get().addXp(xp);
    }
  },

  addShadowEntry: (entry) => {
    const newEntry: ShadowEntry = { ...entry, id: genId(), userId: 'demo', createdAt: new Date().toISOString() };
    set(s => ({ shadowEntries: [newEntry, ...s.shadowEntries] }));
    if (entry.resolved) get().addXp(100);
  },

  addArtifact: (artifact) => {
    const newArtifact: Artifact = { ...artifact, id: genId(), userId: 'demo', xpEarned: 50, createdAt: new Date().toISOString() };
    set(s => ({ artifacts: [newArtifact, ...s.artifacts] }));
    get().addXp(50);
  },

  startBlock: (category) => {
    const block: ExecutionBlock = {
      id: genId(), userId: 'demo', category,
      startTime: new Date().toISOString(), endTime: null,
      durationMinutes: null, note: '', xpEarned: 0, createdAt: new Date().toISOString(),
    };
    set({ activeBlock: block });
  },

  stopBlock: (note) => {
    const { activeBlock } = get();
    if (!activeBlock) return;
    const endTime = new Date();
    const startTime = new Date(activeBlock.startTime);
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    const finishedBlock: ExecutionBlock = {
      ...activeBlock, endTime: endTime.toISOString(), durationMinutes, note, xpEarned: 10,
    };
    set(s => ({ executionBlocks: [finishedBlock, ...s.executionBlocks], activeBlock: null }));
    get().addXp(10);
  },

  setEnergy: (period, value) => {
    set(s => {
      const existing = s.energyEntries.find(e => e.date === today);
      if (existing) {
        return { energyEntries: s.energyEntries.map(e => e.date === today ? { ...e, [period]: value } : e) };
      }
      const newEntry: EnergyEntry = { id: genId(), userId: 'demo', date: today, morning: null, afternoon: null, evening: null, [period]: value, createdAt: '' };
      return { energyEntries: [newEntry, ...s.energyEntries] };
    });
  },

  setNutrition: (key, value) => set(s => ({ todayNutrition: { ...s.todayNutrition, [key]: value } })),
  setBodyWeight: (weight) => set({ bodyWeight: weight }),
  setBodyNotes: (notes) => set({ bodyNotes: notes }),

  resetSobriety: (_trigger) => {
    set({ sobrietyStartDate: today });
    // Trigger is logged but we don't need to store separately for UI
  },

  addXp: (amount) => {
    set(s => {
      const newXp = s.profile.totalXp + amount;
      const oldRank = s.profile.rank;
      const newRank = calcRank(newXp);
      const rankChanged = newRank !== oldRank;
      return {
        profile: { ...s.profile, totalXp: newXp, rank: newRank },
        ...(rankChanged ? { showRankUpModal: true, newRank } : {}),
      };
    });
  },

  setAiProvider: (provider) => set({ aiProvider: provider }),
  setIsosMode: (mode) => set({ isosMode: mode }),
  setActiveConversation: (id) => set({ activeConversationId: id }),

  sendMessage: (content) => {
    const { activeConversationId, aiProvider, isosMode, conversations, messages } = get();
    let convId = activeConversationId;

    if (!convId) {
      convId = genId();
      const newConv: Conversation = {
        id: convId, userId: 'demo', provider: aiProvider, mode: isosMode,
        title: content.slice(0, 40) + (content.length > 40 ? '...' : ''),
        tags: [isosMode], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      set({ conversations: [newConv, ...conversations], activeConversationId: convId });
    }

    const userMsg: ConversationMessage = {
      id: genId(), conversationId: convId, role: 'user', content,
      provider: aiProvider, isPinned: false, createdAt: new Date().toISOString(),
    };
    const aiResponse = getMockAIResponse(isosMode, content);
    const aiMsg: ConversationMessage = {
      id: genId(), conversationId: convId, role: 'assistant', content: aiResponse,
      provider: aiProvider, isPinned: false, createdAt: new Date().toISOString(),
    };
    set({ messages: [...messages, userMsg, aiMsg] });
  },

  startNewConversation: () => set({ activeConversationId: null }),

  pinInsight: (messageId, topic) => {
    const msg = get().messages.find(m => m.id === messageId);
    if (!msg) return;
    const insight: PinnedInsight = {
      id: genId(), userId: 'demo', content: msg.content, source: msg.provider,
      conversationId: msg.conversationId, topic, createdAt: new Date().toISOString(),
    };
    set(s => ({
      pinnedInsights: [...s.pinnedInsights, insight],
      messages: s.messages.map(m => m.id === messageId ? { ...m, isPinned: true } : m),
    }));
  },

  addJournalEntry: (content) => {
    const entry: JournalEntry = { id: genId(), userId: 'demo', content, date: today, createdAt: new Date().toISOString() };
    set(s => ({ journalEntries: [entry, ...s.journalEntries] }));
  },

  addDecision: (title, reasoning) => {
    const decision: Decision = { id: genId(), userId: 'demo', title, reasoning, date: today, createdAt: new Date().toISOString() };
    set(s => ({ decisions: [decision, ...s.decisions] }));
  },

  updateHabit: (habitId, updates) => {
    set(s => ({ habits: s.habits.map(h => h.id === habitId ? { ...h, ...updates } : h) }));
  },

  addPhase: (phase) => {
    const newPhase: Phase = { ...phase, id: genId(), userId: 'demo', createdAt: new Date().toISOString() };
    set(s => ({ phases: [...s.phases, newPhase] }));
  },

  togglePhase: (phaseId) => {
    set(s => ({
      phases: s.phases.map(p => ({ ...p, isActive: p.id === phaseId ? !p.isActive : false })),
    }));
  },

  updateSettings: (path, value) => {
    set(s => {
      const newSettings = { ...s.settings };
      const parts = path.split('.');
      if (parts.length === 2) {
        const section = parts[0] as keyof typeof newSettings;
        const key = parts[1];
        if (typeof newSettings[section] === 'object' && newSettings[section] !== null) {
          (newSettings[section] as Record<string, boolean | string>)[key] = value;
        }
      } else if (parts.length === 1) {
        (newSettings as Record<string, boolean | string | object>)[parts[0]] = value;
      }
      return { settings: newSettings };
    });
  },

  dismissRankUp: () => set({ showRankUpModal: false, newRank: null }),
  setLoading: (loading) => set({ isLoading: loading }),

  isMinimumViableDay: () => {
    const scan = get().todayScan;
    if (!scan) return false;
    return scan.somatic < 4;
  },

  todayXP: () => {
    const { todayCompletions, habits } = get();
    return todayCompletions.reduce((total, completion) => {
      const habit = habits.find(h => h.id === completion.habitId);
      return total + (habit?.xpWeight || 5);
    }, 0);
  },

  sobrietyDays: () => {
    const start = new Date(get().sobrietyStartDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  },
}));
