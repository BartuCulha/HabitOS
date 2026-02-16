import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../../constants/theme';

export const ObservatoryScreen: React.FC = () => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Text style={styles.title}>OBSERVATORY</Text>
      <Text style={styles.subtitle}>Chronos reports, patterns, correlations</Text>
      <Text style={styles.placeholder}>Coming in Phase 3</Text>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  title: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: fontSize.md, marginTop: spacing.sm },
  placeholder: { color: colors.accent, fontSize: fontSize.lg, marginTop: spacing.xl },
});
