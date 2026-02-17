import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface MissionBannerProps {
  mission: string | null;
  onEdit: () => void;
}

export const MissionBanner: React.FC<MissionBannerProps> = ({ mission, onEdit }) => {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!mission) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [mission, pulseAnim]);

  return (
    <TouchableOpacity style={styles.container} onPress={onEdit} activeOpacity={0.8}>
      <Text style={styles.label}>TODAY'S MISSION</Text>
      {mission ? (
        <Text style={styles.mission}>{mission}</Text>
      ) : (
        <Animated.Text style={[styles.placeholder, { opacity: pulseAnim }]}>
          Set today's mission
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent,
    borderLeftWidth: 3,
    minHeight: 44,
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
  placeholder: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
    fontStyle: 'italic',
  },
});
