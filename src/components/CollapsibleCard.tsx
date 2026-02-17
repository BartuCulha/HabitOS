import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleCardProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  rightContent?: React.ReactNode;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  emoji,
  children,
  defaultOpen = true,
  rightContent,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const toOpen = !open;
    setOpen(toOpen);
    Animated.timing(rotateAnim, {
      toValue: toOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [open, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.7}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title}</Text>
        {rightContent}
        <Animated.Text style={[styles.arrow, { transform: [{ rotate }] }]}>▸</Animated.Text>
      </TouchableOpacity>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    minHeight: 44,
  },
  emoji: { fontSize: fontSize.lg, marginRight: spacing.sm },
  title: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
  },
  arrow: { color: colors.textMuted, fontSize: fontSize.lg },
  body: { padding: spacing.md, paddingTop: 0 },
});
