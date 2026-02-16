import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import type { Habit, HabitCompletion } from '../types';

interface HabitChecklistProps {
  habits: Habit[];
  completions: HabitCompletion[];
  isMinimumViableDay: boolean;
  onToggle: (habitId: string) => void;
}

const categoryColors: Record<string, string> = {
  physical: colors.somatic,
  creative: colors.noetic,
  structural: colors.structural,
  sovereign: colors.sovereign,
};

export const HabitChecklist: React.FC<HabitChecklistProps> = ({
  habits,
  completions,
  isMinimumViableDay,
  onToggle,
}) => {
  const completedCount = completions.length;
  const totalCount = habits.length;
  const xpEarned = completions.reduce((sum, c) => {
    const habit = habits.find(h => h.id === c.habitId);
    return sum + (habit?.xpWeight || 5);
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isMinimumViableDay ? '⚡ MINIMUM VIABLE DAY' : '🎯 KEYSTONE HABITS'}
        </Text>
        <Text style={styles.counter}>
          {completedCount}/{totalCount} · <Text style={styles.xp}>+{xpEarned} XP</Text>
        </Text>
      </View>

      {habits.map((habit) => {
        const isCompleted = completions.some(c => c.habitId === habit.id);
        const catColor = categoryColors[habit.category] || colors.accent;

        return (
          <TouchableOpacity
            key={habit.id}
            style={[styles.habitRow, isCompleted && styles.habitCompleted]}
            onPress={() => onToggle(habit.id)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, isCompleted && { backgroundColor: catColor, borderColor: catColor }]}>
              {isCompleted && <Text style={styles.check}>✓</Text>}
            </View>
            <View style={styles.habitInfo}>
              <Text style={[styles.habitName, isCompleted && styles.habitNameCompleted]}>
                {isMinimumViableDay ? habit.minimumViableVersion || habit.name : habit.name}
              </Text>
              <Text style={styles.habitMeta}>
                <Text style={{ color: catColor }}>{habit.category}</Text> · {habit.xpWeight} XP
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },
  counter: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  xp: {
    color: colors.xp,
    fontWeight: '700',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  habitCompleted: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  check: {
    color: colors.bg,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    color: colors.textPrimary,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  habitMeta: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
