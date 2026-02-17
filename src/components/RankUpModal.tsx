import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSize, borderRadius } from '../constants/theme';
import type { Rank } from '../types';

interface RankUpModalProps {
  visible: boolean;
  rank: Rank | null;
  onDismiss: () => void;
}

export const RankUpModal: React.FC<RankUpModalProps> = ({ visible, rank, onDismiss }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>RANK UP!</Text>
        <Text style={styles.rank}>{rank}</Text>
        <Text style={styles.sub}>New capabilities unlocked. Keep building.</Text>
        <TouchableOpacity style={styles.btn} onPress={onDismiss}>
          <Text style={styles.btnText}>ACKNOWLEDGED</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center', borderWidth: 2, borderColor: colors.accent, width: '80%' },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { color: colors.xp, fontSize: fontSize.xxl, fontWeight: '800', letterSpacing: 3 },
  rank: { color: colors.accent, fontSize: fontSize.xxxl, fontWeight: '800', marginVertical: spacing.md },
  sub: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: 'center' },
  btn: { marginTop: spacing.lg, backgroundColor: colors.accent, paddingVertical: spacing.sm, paddingHorizontal: spacing.xl, borderRadius: borderRadius.md },
  btnText: { color: colors.textPrimary, fontWeight: '700', fontSize: fontSize.md, letterSpacing: 1 },
});
