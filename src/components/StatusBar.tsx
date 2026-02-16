import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import type { Rank } from '../types';

interface StatusBarProps {
  rank: Rank;
  totalXp: number;
  streak: number;
  todayXp: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ rank, totalXp, streak, todayXp }) => (
  <View style={styles.container}>
    <View style={styles.item}>
      <Text style={styles.value}>{rank}</Text>
      <Text style={styles.label}>RANK</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.item}>
      <Text style={[styles.value, { color: colors.xp }]}>{totalXp.toLocaleString()}</Text>
      <Text style={styles.label}>TOTAL XP</Text>
    </View>
    <View style={styles.divider} />
    <View style={styles.item}>
      <Text style={styles.value}>🔥 {streak}</Text>
      <Text style={styles.label}>STREAK</Text>
    </View>
    <View style={styles.item}>
      <Text style={[styles.value, { color: colors.success }]}>+{todayXp}</Text>
      <Text style={styles.label}>TODAY</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
  },
  value: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
});
