import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

interface TabBarProps<T extends string> {
  tabs: { key: T; label: string; emoji?: string }[];
  activeTab: T;
  onTabPress: (tab: T) => void;
}

export function TabBar<T extends string>({ tabs, activeTab, onTabPress }: TabBarProps<T>): React.ReactElement {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.content}
    >
      {tabs.map(t => (
        <TouchableOpacity
          key={t.key}
          style={[styles.tab, activeTab === t.key && styles.tabActive]}
          onPress={() => onTabPress(t.key)}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
            {t.emoji ? `${t.emoji} ` : ''}{t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  content: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
    justifyContent: 'center',
  },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  tabText: { color: colors.textMuted, fontSize: fontSize.sm },
  tabTextActive: { color: colors.textPrimary, fontWeight: '600' },
});
