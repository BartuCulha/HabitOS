import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface QuickActionsProps {
  onLogShadow: () => void;
  onLogArtifact: () => void;
  onStartBlock: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onLogShadow, onLogArtifact, onStartBlock }) => (
  <View style={styles.container}>
    <TouchableOpacity style={[styles.button, styles.shadow]} onPress={onLogShadow} activeOpacity={0.7}>
      <Text style={styles.emoji}>👁</Text>
      <Text style={styles.label}>Shadow</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.artifact]} onPress={onLogArtifact} activeOpacity={0.7}>
      <Text style={styles.emoji}>⚡</Text>
      <Text style={styles.label}>Artifact</Text>
    </TouchableOpacity>
    <TouchableOpacity style={[styles.button, styles.block]} onPress={onStartBlock} activeOpacity={0.7}>
      <Text style={styles.emoji}>▶️</Text>
      <Text style={styles.label}>Block</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  shadow: {
    backgroundColor: `${colors.danger}15`,
    borderColor: `${colors.danger}40`,
  },
  artifact: {
    backgroundColor: `${colors.xp}15`,
    borderColor: `${colors.xp}40`,
  },
  block: {
    backgroundColor: `${colors.success}15`,
    borderColor: `${colors.success}40`,
  },
  emoji: {
    fontSize: fontSize.xl,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
