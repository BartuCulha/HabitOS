import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import { TabBar } from '../../components/TabBar';
import { relativeDate } from '../../utils/time';
import type { ArtifactDomain } from '../../types';

type Tab = 'artifacts' | 'journal' | 'decisions' | 'insights' | 'saveStates';
const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'artifacts', label: 'Artifacts', emoji: '⚡' },
  { key: 'journal', label: 'Journal', emoji: '📝' },
  { key: 'decisions', label: 'Decisions', emoji: '⚖️' },
  { key: 'insights', label: 'Insights', emoji: '📌' },
  { key: 'saveStates', label: 'Save States', emoji: '💾' },
];

const DOMAIN_CONFIG: Record<ArtifactDomain, { color: string; emoji: string }> = {
  music: { color: '#FF6B6B', emoji: '🎵' },
  code: { color: '#4ECDC4', emoji: '💻' },
  writing: { color: '#FFD93D', emoji: '✍️' },
  system: { color: '#6C5CE7', emoji: '⚙️' },
  physical: { color: '#FF9FF3', emoji: '💪' },
  other: { color: '#8888A0', emoji: '📦' },
};

export const ArchiveScreen: React.FC = () => {
  const store = useAppStore();
  const [tab, setTab] = useState<Tab>('artifacts');
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  // Journal add
  const [journalModal, setJournalModal] = useState(false);
  const [journalText, setJournalText] = useState('');

  // Decision add
  const [decisionModal, setDecisionModal] = useState(false);
  const [decisionTitle, setDecisionTitle] = useState('');
  const [decisionReasoning, setDecisionReasoning] = useState('');

  // Save state
  const [snapshotModal, setSnapshotModal] = useState(false);

  // FAB action based on tab
  const showFab = ['journal', 'decisions'].includes(tab);
  const handleFab = () => {
    if (tab === 'journal') setJournalModal(true);
    if (tab === 'decisions') { setDecisionTitle(''); setDecisionReasoning(''); setDecisionModal(true); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.header}>📦 ARCHIVE</Text>
      <TabBar tabs={TABS} activeTab={tab} onTabPress={setTab} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Artifacts */}
        {tab === 'artifacts' && (
          <>
            {store.artifacts.map(a => {
              const cfg = DOMAIN_CONFIG[a.domain];
              return (
                <View key={a.id} style={[s.card, { borderLeftWidth: 3, borderLeftColor: cfg.color }]}>
                  <View style={s.artifactHeader}>
                    <Text style={s.artifactEmoji}>{cfg.emoji}</Text>
                    <Text style={s.artifactName}>{a.name}</Text>
                    <Text style={[s.artifactDomain, { color: cfg.color }]}>{a.domain}</Text>
                  </View>
                  <Text style={s.artifactDesc}>{a.description}</Text>
                  <Text style={s.artifactMeta}>{relativeDate(a.date)} · +{a.xpEarned} XP</Text>
                </View>
              );
            })}
            {store.artifacts.length === 0 && <Text style={s.emptyText}>No artifacts shipped yet. Get to work.</Text>}
          </>
        )}

        {/* Journal */}
        {tab === 'journal' && (
          <>
            {store.journalEntries.map(j => (
              <View key={j.id} style={s.card}>
                <Text style={s.journalDate}>{relativeDate(j.date)}</Text>
                <Text style={s.journalContent}>{j.content}</Text>
              </View>
            ))}
            {store.journalEntries.length === 0 && <Text style={s.emptyText}>No journal entries yet.</Text>}
          </>
        )}

        {/* Decisions */}
        {tab === 'decisions' && (
          <>
            {store.decisions.map(d => (
              <TouchableOpacity key={d.id} style={s.card} onPress={() => setExpandedDecision(expandedDecision === d.id ? null : d.id)} activeOpacity={0.7}>
                <View style={s.decisionHeader}>
                  <Text style={s.decisionTitle}>{d.title}</Text>
                  <Text style={s.decisionDate}>{relativeDate(d.date)}</Text>
                </View>
                {expandedDecision === d.id && (
                  <>
                    <Text style={s.decisionReasoning}>{d.reasoning}</Text>
                    <View style={s.outcomeBadge}>
                      <Text style={s.outcomeText}>📋 Outcome pending</Text>
                    </View>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Insights */}
        {tab === 'insights' && (
          <>
            {store.pinnedInsights.length === 0 && <Text style={s.emptyText}>No pinned insights. Long-press an AI message to pin.</Text>}
            {Array.from(new Set(store.pinnedInsights.map(i => i.topic))).map(topic => (
              <View key={topic}>
                <Text style={s.insightTopic}>{topic}</Text>
                {store.pinnedInsights.filter(i => i.topic === topic).map(i => (
                  <View key={i.id} style={s.card}>
                    <Text style={s.insightContent}>{i.content}</Text>
                    <Text style={s.insightMeta}>via {i.source} · {typeof i.createdAt === 'string' && i.createdAt.includes('T') ? i.createdAt.split('T')[0] : relativeDate(i.createdAt)}</Text>
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
              { id: 'ss1', date: '2026-02-10', rank: 'Architect', xp: 500, habits: 8, daysTracked: 25 },
              { id: 'ss2', date: '2026-02-03', rank: 'Operator', xp: 320, habits: 8, daysTracked: 18 },
              { id: 'ss3', date: '2026-01-27', rank: 'Operator', xp: 180, habits: 6, daysTracked: 11 },
            ].map(ss => (
              <View key={ss.id} style={s.card}>
                <View style={s.ssRow}>
                  <Text style={s.ssDate}>{ss.date}</Text>
                  <Text style={s.ssRank}>{ss.rank}</Text>
                  <Text style={s.ssXp}>{ss.xp} XP</Text>
                </View>
                <View style={s.ssStats}>
                  <Text style={s.ssStatItem}>🎯 {ss.habits} habits</Text>
                  <Text style={s.ssStatItem}>📅 {ss.daysTracked} days</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      {showFab && (
        <TouchableOpacity style={s.fab} onPress={handleFab} activeOpacity={0.8}>
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      )}

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

      {/* Decision Modal */}
      <Modal visible={decisionModal} transparent animationType="slide" onRequestClose={() => setDecisionModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>⚖️ Log Decision</Text>
            <TextInput style={s.modalInput} value={decisionTitle} onChangeText={setDecisionTitle} placeholder="Decision title" placeholderTextColor={colors.textMuted} />
            <TextInput style={[s.modalInput, { minHeight: 80 }]} value={decisionReasoning} onChangeText={setDecisionReasoning} placeholder="Reasoning..." placeholderTextColor={colors.textMuted} multiline />
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setDecisionModal(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if (decisionTitle.trim()) { store.addDecision(decisionTitle.trim(), decisionReasoning.trim()); setDecisionModal(false); }
              }}><Text style={s.submitText}>Log</Text></TouchableOpacity>
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
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic', textAlign: 'center', paddingVertical: spacing.xl },
  // Artifacts
  artifactHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  artifactEmoji: { fontSize: fontSize.lg },
  artifactName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', flex: 1 },
  artifactDomain: { fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  artifactDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
  artifactMeta: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm },
  // Journal
  journalDate: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '600', marginBottom: spacing.xs },
  journalContent: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 22 },
  // Decisions
  decisionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  decisionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', flex: 1 },
  decisionDate: { color: colors.textMuted, fontSize: fontSize.xs },
  decisionReasoning: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.md, lineHeight: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  outcomeBadge: { backgroundColor: colors.bgInput, borderRadius: borderRadius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, marginTop: spacing.sm, alignSelf: 'flex-start' },
  outcomeText: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: 'italic' },
  // Insights
  insightTopic: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700', letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm },
  insightContent: { color: colors.textPrimary, fontSize: fontSize.sm, lineHeight: 20, fontStyle: 'italic' },
  insightMeta: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.sm },
  // Save states
  saveActions: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  saveBtn: { flex: 1, borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', minHeight: 44, justifyContent: 'center' },
  saveBtnText: { color: colors.accent, fontWeight: '700', fontSize: fontSize.sm },
  ssRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ssDate: { color: colors.textPrimary, fontSize: fontSize.md },
  ssRank: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },
  ssXp: { color: colors.xp, fontSize: fontSize.sm, fontWeight: '700' },
  ssStats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  ssStatItem: { color: colors.textMuted, fontSize: fontSize.xs },
  // FAB
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: colors.accent, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 8 },
  fabText: { color: colors.textPrimary, fontSize: 28, fontWeight: '600', marginTop: -2 },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, width: '85%' },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.md },
  modalSub: { color: colors.textSecondary, fontSize: fontSize.md, marginBottom: spacing.sm },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, minHeight: 44 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  cancelText: { color: colors.textSecondary, paddingVertical: spacing.sm },
  submitBtn: { backgroundColor: colors.accent, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 44, justifyContent: 'center' },
  submitText: { color: colors.textPrimary, fontWeight: '700' },
});
