import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface MissionBannerProps {
  mission: string | null;
  onEdit: () => void;
}

export const MissionBanner: React.FC<MissionBannerProps> = ({ mission, onEdit }) => (
  <TouchableOpacity style={styles.container} onPress={onEdit} activeOpacity={0.8}>
    <Text style={styles.label}>TODAY'S MISSION</Text>
    <Text style={styles.mission}>
      {mission || 'Tap to set your mission'}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderLeftWidth: 3,
  },
  label: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  mission: {
    color: colors.textPrimary,
    fontSize: fontSize.lg,
    fontWeight: '600',
    fontStyle: 'italic',
  },
});
