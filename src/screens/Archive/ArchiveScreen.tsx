import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import type { ArtifactDomain } from '../../types';

type Tab = 'artifacts' | 'journal' | 'decisions' | 'insights' | 'saveStates';
const TABS: { key: Tab; label: string }[] = [
  { key: 'artifacts', label: 'Artifacts' },
  { key: 'journal', label: 'Journal' },
  { key: 'decisions', label: 'Decisions' },
  { key: 'insights', label: 'Insights' },
  { key: 'saveStates', label: 'Save States' },
];

const DOMAIN_COLORS: Record<ArtifactDomain, string> = {
  music: '#FF6B6B', code: '#4ECDC4', writing: '#FFD93D', system: '#6C5CE7', physical: '#FF9FF3', other: '#8888A0',
};

export const ArchiveScreen: React.FC = () => {
  const store = useAppStore();
  const [tab, setTab] = useState<Tab>('artifacts');
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  // Journal add
  const [journalModal, setJournalModal] = useState(false);
  const [journalText, setJournalText] = useState('');

  // Save state
  const [snapshotModal, setSnapshotModal] = useState(false);

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.header}>ARCHIVE</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabRow} contentContainerStyle={s.tabRowContent}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[s.tab, tab === t.key && s.tabActive]} onPress={() => setTab(t.key)}>
            <Text style={[s.tabText, tab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Artifacts */}
        {tab === 'artifacts' && (
          <>
            {store.artifacts.map(a => (
              <View key={a.id} style={[s.card, { borderLeftWidth: 3, borderLeftColor: DOMAIN_COLORS[a.domain] }]}>
                <View style={s.artifactHeader}>
                  <Text style={s.artifactName}>{a.name}</Text>
                  <Text style={[s.artifactDomain, { color: DOMAIN_COLORS[a.domain] }]}>{a.domain}</Text>
                </View>
                <Text style={s.artifactDesc}>{a.description}</Text>
                <Text style={s.artifactMeta}>{a.date} · +{a.xpEarned} XP</Text>
              </View>
            ))}
            {store.artifacts.length === 0 && <Text style={s.emptyText}>No artifacts shipped yet. Get to work.</Text>}
          </>
        )}

        {/* Journal */}
        {tab === 'journal' && (
          <>
            <TouchableOpacity style={s.addBtn} onPress={() => setJournalModal(true)}>
              <Text style={s.addBtnText}>+ New Entry</Text>
            </TouchableOpacity>
            {store.journalEntries.map(j => (
              <View key={j.id} style={s.card}>
                <Text style={s.journalDate}>{j.date}</Text>
                <Text style={s.journalContent}>{j.content}</Text>
              </View>
            ))}
          </>
        )}

        {/* Decisions */}
        {tab === 'decisions' && (
          <>
            {store.decisions.map(d => (
              <TouchableOpacity key={d.id} style={s.card} onPress={() => setExpandedDecision(expandedDecision === d.id ? null : d.id)}>
                <View style={s.decisionHeader}>
                  <Text style={s.decisionTitle}>{d.title}</Text>
                  <Text style={s.decisionDate}>{d.date}</Text>
                </View>
                {expandedDecision === d.id && (
                  <Text style={s.decisionReasoning}>{d.reasoning}</Text>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Insights */}
        {tab === 'insights' && (
          <>
            {store.pinnedInsights.length === 0 && <Text style={s.emptyText}>No pinned insights. Long-press an AI message to pin.</Text>}
            {/* Group by topic */}
            {Array.from(new Set(store.pinnedInsights.map(i => i.topic))).map(topic => (
              <View key={topic}>
                <Text style={s.insightTopic}>{topic}</Text>
                {store.pinnedInsights.filter(i => i.topic === topic).map(i => (
                  <View key={i.id} style={s.card}>
                    <Text style={s.insightContent}>{i.content}</Text>
                    <Text style={s.insightMeta}>via {i.source} · {i.createdAt.split('T')[0]}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}

        {/* Save States */}
        {tab === 'saveStates' && (
          <>
            <View style={s.saveActions}>
              <TouchableOpacity style={s.saveBtn} onPress={() => setSnapshotModal(true)}>
                <Text style={s.saveBtnText}>📸 Create Snapshot</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.saveBtn, { borderColor: colors.info }]}>
                <Text style={[s.saveBtnText, { color: colors.info }]}>📤 Export All Data</Text>
              </TouchableOpacity>
            </View>
            {[
              { id: 'ss1', date: '2026-02-10', rank: 'Architect', xp: 500 },
              { id: 'ss2', date: '2026-02-03', rank: 'Operator', xp: 320 },
              { id: 'ss3', date: '2026-01-27', rank: 'Operator', xp: 180 },
            ].map(ss => (
              <View key={ss.id} style={s.card}>
                <View style={s.ssRow}>
                  <Text style={s.ssDate}>{ss.date}</Text>
                  <Text style={s.ssRank}>{ss.rank}</Text>
                  <Text style={s.ssXp}>{ss.xp} XP</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Journal Modal */}
      <Modal visible={journalModal} transparent animationType="slide" onRequestClose={() => setJournalModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>📝 Quick Entry</Text>
            <TextInput style={s.modalInput} value={journalText} onChangeText={setJournalText} placeholder="What's on your mind?" placeholderTextColor={colors.textMuted} multiline />
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setJournalModal(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if (journalText.trim()) { store.addJournalEntry(journalText.trim()); setJournalText(''); setJournalModal(false); }
              }}><Text style={s.submitText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Snapshot Modal */}
      <Modal visible={snapshotModal} transparent animationType="fade" onRequestClose={() => setSnapshotModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>📸 Snapshot Created</Text>
            <Text style={s.modalSub}>Your current state has been saved.</Text>
            <Text style={s.modalSub}>Rank: {store.profile.rank} · XP: {store.profile.totalXp}</Text>
            <TouchableOpacity style={s.submitBtn} onPress={() => setSnapshotModal(false)}>
              <Text style={s.submitText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  tabRow: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  tabRowContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  tab: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border },
  tabActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  tabText: { color: colors.textMuted, fontSize: fontSize.sm },
  tabTextActive: { color: colors.textPrimary, fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic', textAlign: 'center', paddingVertical: spacing.xl },
  // Artifacts
  artifactHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  artifactName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', flex: 1 },
  artifactDomain: { fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  artifactDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
  artifactMeta: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm },
  // Journal
  addBtn: { backgroundColor: colors.accentDim, borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', marginBottom: spacing.md },
  addBtnText: { color: colors.accent, fontWeight: '700' },
  journalDate: { color: colors.textMuted, fontSize: fontSize.xs, marginBottom: spacing.xs },
  journalContent: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 22 },
  // Decisions
  decisionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  decisionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', flex: 1 },
  decisionDate: { color: colors.textMuted, fontSize: fontSize.xs },
  decisionReasoning: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md, lineHeight: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  // Insights
  insightTopic: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm },
  insightContent: { color: colors.textPrimary, fontSize: fontSize.sm, lineHeight: 20, fontStyle: 'italic' },
  insightMeta: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm },
  // Save states
  saveActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  saveBtn: { flex: 1, borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center' },
  saveBtnText: { color: colors.accent, fontWeight: '700', fontSize: fontSize.sm },
  ssRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ssDate: { color: colors.textPrimary, fontSize: fontSize.md },
  ssRank: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },
  ssXp: { color: colors.xp, fontSize: fontSize.sm, fontWeight: '700' },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, width: '85%' },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.md },
  modalSub: { color: colors.textSecondary, fontSize: fontSize.md, marginBottom: spacing.sm },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, minHeight: 80 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  cancelText: { color: colors.textSecondary, paddingVertical: spacing.sm },
  submitBtn: { backgroundColor: colors.accent, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  submitText: { color: colors.textPrimary, fontWeight: '700' },
});
