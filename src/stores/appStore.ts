import { create } from 'zustand';
import type { FourDScan, Habit, HabitCompletion, UserProfile, DailyMission, Rank, RANK_THRESHOLDS } from '../types';

interface AppState {
  // Auth
  userId: string | null;
  isAuthenticated: boolean;

  // Profile
  profile: UserProfile | null;

  // Today's state
  todayMission: DailyMission | null;
  todayScan: FourDScan | null;
  todayCompletions: HabitCompletion[];
  habits: Habit[];

  // UI
  isLoading: boolean;

  // Actions
  setUserId: (id: string | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setTodayMission: (mission: DailyMission | null) => void;
  setTodayScan: (scan: FourDScan | null) => void;
  setHabits: (habits: Habit[]) => void;
  toggleHabitCompletion: (habitId: string, date: string) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  isMinimumViableDay: () => boolean;
  todayXP: () => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  userId: null,
  isAuthenticated: false,
  profile: null,
  todayMission: null,
  todayScan: null,
  todayCompletions: [],
  habits: [],
  isLoading: false,

  setUserId: (id) => set({ userId: id, isAuthenticated: !!id }),
  setProfile: (profile) => set({ profile }),
  setTodayMission: (mission) => set({ todayMission: mission }),
  setTodayScan: (scan) => set({ todayScan: scan }),
  setHabits: (habits) => set({ habits }),
  toggleHabitCompletion: (habitId, date) => {
    const { todayCompletions } = get();
    const existing = todayCompletions.find(c => c.habitId === habitId && c.date === date);
    if (existing) {
      set({ todayCompletions: todayCompletions.filter(c => c.id !== existing.id) });
    } else {
      const newCompletion: HabitCompletion = {
        id: `temp-${Date.now()}`,
        userId: get().userId || '',
        habitId,
        date,
        isMinimumViable: get().isMinimumViableDay(),
        createdAt: new Date().toISOString(),
      };
      set({ todayCompletions: [...todayCompletions, newCompletion] });
    }
  },
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
}));
