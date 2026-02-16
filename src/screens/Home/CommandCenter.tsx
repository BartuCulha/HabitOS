import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MissionBanner } from '../../components/MissionBanner';
import { StatusBar } from '../../components/StatusBar';
import { FourDScanner } from '../../components/FourDScanner';
import { HabitChecklist } from '../../components/HabitChecklist';
import { QuickActions } from '../../components/QuickActions';
import { colors, spacing, fontSize } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';

// Demo data for initial build
const DEMO_HABITS = [
  { id: '1', userId: 'demo', name: 'Morning Activation Protocol', category: 'physical' as const, xpWeight: 15, minimumViableVersion: '5 min stretch', why: 'Sets circadian rhythm', phaseId: null, isActive: true, sortOrder: 0, createdAt: '' },
  { id: '2', userId: 'demo', name: 'Cold Exposure', category: 'physical' as const, xpWeight: 10, minimumViableVersion: 'Cold face wash', why: 'Norepinephrine + discipline', phaseId: null, isActive: true, sortOrder: 1, createdAt: '' },
  { id: '3', userId: 'demo', name: 'Sleep Protocol', category: 'physical' as const, xpWeight: 20, minimumViableVersion: 'Screens off by midnight', why: 'Foundation of everything', phaseId: null, isActive: true, sortOrder: 2, createdAt: '' },
  { id: '4', userId: 'demo', name: 'Creative Block (30min+)', category: 'creative' as const, xpWeight: 15, minimumViableVersion: '15 min creative touch', why: 'Music is non-negotiable', phaseId: null, isActive: true, sortOrder: 3, createdAt: '' },
  { id: '5', userId: 'demo', name: 'Structured Meals', category: 'sovereign' as const, xpWeight: 10, minimumViableVersion: 'At least 2 real meals', why: 'Counter grazing pattern', phaseId: null, isActive: true, sortOrder: 4, createdAt: '' },
  { id: '6', userId: 'demo', name: 'Daily Audit', category: 'structural' as const, xpWeight: 5, minimumViableVersion: '4D evening scan', why: 'Close the loop', phaseId: null, isActive: true, sortOrder: 5, createdAt: '' },
];

export const CommandCenter: React.FC = () => {
  const {
    todayMission,
    todayScan,
    todayCompletions,
    isMinimumViableDay,
    todayXP,
    profile,
    setTodayScan,
    toggleHabitCompletion,
  } = useAppStore();

  const today = new Date().toISOString().split('T')[0];

  const handleScanSubmit = (scores: { somatic: number; structural: number; noetic: number; sovereign: number }) => {
    setTodayScan({
      id: `scan-${Date.now()}`,
      userId: 'demo',
      date: today,
      timeOfDay: 'morning',
      ...scores,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>HABIT<Text style={styles.logoAccent}>OS</Text></Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        {/* Status Bar */}
        <StatusBar
          rank={profile?.rank || 'Novice'}
          totalXp={profile?.totalXp || 0}
          streak={profile?.currentStreak || 0}
          todayXp={todayXP()}
        />

        {/* Mission */}
        <MissionBanner
          mission={todayMission?.statement || null}
          onEdit={() => {/* TODO: mission editor modal */}}
        />

        {/* 4D Scanner */}
        <FourDScanner
          onSubmit={handleScanSubmit}
          initialValues={todayScan ? {
            somatic: todayScan.somatic,
            structural: todayScan.structural,
            noetic: todayScan.noetic,
            sovereign: todayScan.sovereign,
          } : undefined}
        />

        {/* Habits */}
        <HabitChecklist
          habits={DEMO_HABITS}
          completions={todayCompletions}
          isMinimumViableDay={isMinimumViableDay()}
          onToggle={(id) => toggleHabitCompletion(id, today)}
        />

        {/* Quick Actions */}
        <QuickActions
          onLogShadow={() => {/* TODO */}}
          onLogArtifact={() => {/* TODO */}}
          onStartBlock={() => {/* TODO */}}
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  logo: {
    color: colors.textPrimary,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    letterSpacing: -1,
  },
  logoAccent: {
    color: colors.accent,
  },
  date: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
});
