import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface FourDScannerProps {
  onSubmit: (scores: { somatic: number; structural: number; noetic: number; sovereign: number }) => void;
  initialValues?: { somatic: number; structural: number; noetic: number; sovereign: number };
}

const dimensions = [
  { key: 'somatic' as const, label: 'Somatic', color: colors.somatic, emoji: '🔴' },
  { key: 'structural' as const, label: 'Structural', color: colors.structural, emoji: '🟢' },
  { key: 'noetic' as const, label: 'Noetic', color: colors.noetic, emoji: '🟡' },
  { key: 'sovereign' as const, label: 'Sovereign', color: colors.sovereign, emoji: '🟣' },
];

export const FourDScanner: React.FC<FourDScannerProps> = ({ onSubmit, initialValues }) => {
  const [scores, setScores] = useState({
    somatic: initialValues?.somatic || 5,
    structural: initialValues?.structural || 5,
    noetic: initialValues?.noetic || 5,
    sovereign: initialValues?.sovereign || 5,
  });

  const updateScore = (key: keyof typeof scores, value: number) => {
    const newScores = { ...scores, [key]: Math.round(value) };
    setScores(newScores);
    onSubmit(newScores);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>4D SCAN</Text>
      {dimensions.map((dim) => (
        <View key={dim.key} style={styles.row}>
          <View style={styles.labelRow}>
            <Text style={styles.emoji}>{dim.emoji}</Text>
            <Text style={[styles.label, { color: dim.color }]}>{dim.label}</Text>
            <Text style={[styles.value, { color: dim.color }]}>{scores[dim.key]}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={scores[dim.key]}
            onValueChange={(v) => updateScore(dim.key, v)}
            minimumTrackTintColor={dim.color}
            maximumTrackTintColor={colors.bgInput}
            thumbTintColor={dim.color}
          />
        </View>
      ))}
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
  title: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  row: {
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  emoji: {
    fontSize: fontSize.sm,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    minWidth: 28,
    textAlign: 'right',
  },
  slider: {
    width: '100%',
    height: 32,
  },
});
