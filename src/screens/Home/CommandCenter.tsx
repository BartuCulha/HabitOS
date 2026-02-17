import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View, Text, Modal, TouchableOpacity, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { MissionBanner } from '../../components/MissionBanner';
import { StatusBar } from '../../components/StatusBar';
import { FourDScanner } from '../../components/FourDScanner';
import { HabitChecklist } from '../../components/HabitChecklist';
import { QuickActions } from '../../components/QuickActions';
import { RankUpModal } from '../../components/RankUpModal';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import { DEFAULT_SHADOW_PATTERNS } from '../../utils/mockData';
import type { ArtifactDomain, BlockCategory } from '../../types';

const DOMAINS: ArtifactDomain[] = ['music', 'code', 'writing', 'system', 'physical', 'other'];
const BLOCK_CATEGORIES: BlockCategory[] = ['creative', 'structural', 'physical', 'learning'];

export const CommandCenter: React.FC = () => {
  const store = useAppStore();
  const today = new Date().toISOString().split('T')[0];

  // Mission modal
  const [missionModal, setMissionModal] = useState(false);
  const [missionText, setMissionText] = useState('');

  // Shadow modal
  const [shadowModal, setShadowModal] = useState(false);
  const [shadowPattern, setShadowPattern] = useState(DEFAULT_SHADOW_PATTERNS[0].name);
  const [shadowTrigger, setShadowTrigger] = useState('');
  const [shadowIntensity, setShadowIntensity] = useState(5);
  const [shadowIntervention, setShadowIntervention] = useState('');
  const [shadowResolved, setShadowResolved] = useState(false);

  // Artifact modal
  const [artifactModal, setArtifactModal] = useState(false);
  const [artifactName, setArtifactName] = useState('');
  const [artifactDesc, setArtifactDesc] = useState('');
  const [artifactDomain, setArtifactDomain] = useState<ArtifactDomain>('code');

  // Block modal
  const [blockModal, setBlockModal] = useState(false);
  const [blockCategory, setBlockCategory] = useState<BlockCategory>('creative');
  const [blockNote, setBlockNote] = useState('');
  const [blockTimer, setBlockTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (store.activeBlock) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(store.activeBlock!.startTime).getTime()) / 1000);
        setBlockTimer(elapsed);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBlockTimer(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [store.activeBlock]);

  const formatTimer = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>HABIT<Text style={styles.logoAccent}>OS</Text></Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>

        <StatusBar rank={store.profile.rank} totalXp={store.profile.totalXp} streak={store.profile.currentStreak} todayXp={store.todayXP()} />

        <MissionBanner
          mission={store.todayMission?.statement || null}
          onEdit={() => { setMissionText(store.todayMission?.statement || ''); setMissionModal(true); }}
        />

        {/* Active Block Banner */}
        {store.activeBlock && (
          <TouchableOpacity style={styles.activeBlock} onPress={() => setBlockModal(true)}>
            <Text style={styles.activeBlockLabel}>⏱ EXECUTING: {store.activeBlock.category.toUpperCase()}</Text>
            <Text style={styles.activeBlockTimer}>{formatTimer(blockTimer)}</Text>
          </TouchableOpacity>
        )}

        <FourDScanner
          onSubmit={(scores) => store.setTodayScan({ id: `scan-${Date.now()}`, userId: 'demo', date: today, timeOfDay: 'morning', ...scores, createdAt: new Date().toISOString() })}
          initialValues={store.todayScan ? { somatic: store.todayScan.somatic, structural: store.todayScan.structural, noetic: store.todayScan.noetic, sovereign: store.todayScan.sovereign } : undefined}
        />

        <HabitChecklist
          habits={store.habits}
          completions={store.todayCompletions}
          isMinimumViableDay={store.isMinimumViableDay()}
          onToggle={(id) => store.toggleHabitCompletion(id, today)}
        />

        <QuickActions
          onLogShadow={() => setShadowModal(true)}
          onLogArtifact={() => setArtifactModal(true)}
          onStartBlock={() => setBlockModal(true)}
        />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Mission Modal */}
      <Modal visible={missionModal} transparent animationType="slide" onRequestClose={() => setMissionModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>TODAY'S MISSION</Text>
            <TextInput
              style={styles.modalInput}
              value={missionText}
              onChangeText={setMissionText}
              placeholder="Define your mission..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setMissionModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={() => { store.setTodayMission(missionText); setMissionModal(false); }}>
                <Text style={styles.modalSubmitText}>Set Mission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Shadow Log Modal */}
      <Modal visible={shadowModal} transparent animationType="slide" onRequestClose={() => setShadowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>👁 SHADOW LOG</Text>

            <Text style={styles.fieldLabel}>Pattern</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {DEFAULT_SHADOW_PATTERNS.map(p => (
                <TouchableOpacity key={p.id} style={[styles.chip, shadowPattern === p.name && styles.chipActive]} onPress={() => setShadowPattern(p.name)}>
                  <Text style={[styles.chipText, shadowPattern === p.name && styles.chipTextActive]}>{p.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Trigger</Text>
            <TextInput style={styles.modalInput} value={shadowTrigger} onChangeText={setShadowTrigger} placeholder="What triggered this?" placeholderTextColor={colors.textMuted} />

            <Text style={styles.fieldLabel}>Intensity: {shadowIntensity}</Text>
            <Slider style={{ height: 40 }} minimumValue={1} maximumValue={10} step={1} value={shadowIntensity} onValueChange={v => setShadowIntensity(Math.round(v))} minimumTrackTintColor={colors.danger} maximumTrackTintColor={colors.bgInput} thumbTintColor={colors.danger} />

            <Text style={styles.fieldLabel}>Intervention</Text>
            <TextInput style={styles.modalInput} value={shadowIntervention} onChangeText={setShadowIntervention} placeholder="What did you do about it?" placeholderTextColor={colors.textMuted} />

            <View style={styles.toggleRow}>
              <Text style={styles.fieldLabel}>Resolved</Text>
              <Switch value={shadowResolved} onValueChange={setShadowResolved} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShadowModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                store.addShadowEntry({ patternName: shadowPattern, trigger: shadowTrigger, intensity: shadowIntensity, intervention: shadowIntervention || null, resolved: shadowResolved, date: today });
                setShadowModal(false); setShadowTrigger(''); setShadowIntervention(''); setShadowIntensity(5); setShadowResolved(false);
              }}>
                <Text style={styles.modalSubmitText}>Log Shadow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Artifact Log Modal */}
      <Modal visible={artifactModal} transparent animationType="slide" onRequestClose={() => setArtifactModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚡ LOG ARTIFACT</Text>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput style={styles.modalInput} value={artifactName} onChangeText={setArtifactName} placeholder="What did you ship?" placeholderTextColor={colors.textMuted} />
            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput style={styles.modalInput} value={artifactDesc} onChangeText={setArtifactDesc} placeholder="Details..." placeholderTextColor={colors.textMuted} multiline />
            <Text style={styles.fieldLabel}>Domain</Text>
            <View style={styles.chipWrap}>
              {DOMAINS.map(d => (
                <TouchableOpacity key={d} style={[styles.chip, artifactDomain === d && styles.chipActive]} onPress={() => setArtifactDomain(d)}>
                  <Text style={[styles.chipText, artifactDomain === d && styles.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.xpNote}>+50 XP on log</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setArtifactModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmit} onPress={() => {
                if (!artifactName) return;
                store.addArtifact({ name: artifactName, description: artifactDesc, domain: artifactDomain, date: today });
                setArtifactModal(false); setArtifactName(''); setArtifactDesc('');
              }}>
                <Text style={styles.modalSubmitText}>Ship It</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Execution Block Modal */}
      <Modal visible={blockModal} transparent animationType="slide" onRequestClose={() => setBlockModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>▶️ EXECUTION BLOCK</Text>
            {store.activeBlock ? (
              <>
                <Text style={styles.timerDisplay}>{formatTimer(blockTimer)}</Text>
                <Text style={styles.timerCategory}>{store.activeBlock.category.toUpperCase()}</Text>
                <Text style={styles.fieldLabel}>Note</Text>
                <TextInput style={styles.modalInput} value={blockNote} onChangeText={setBlockNote} placeholder="What did you accomplish?" placeholderTextColor={colors.textMuted} multiline />
                <TouchableOpacity style={[styles.modalSubmit, { backgroundColor: colors.danger, marginTop: spacing.md }]} onPress={() => {
                  store.stopBlock(blockNote); setBlockModal(false); setBlockNote('');
                }}>
                  <Text style={styles.modalSubmitText}>⏹ Stop Block</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.fieldLabel}>Category</Text>
                <View style={styles.chipWrap}>
                  {BLOCK_CATEGORIES.map(c => (
                    <TouchableOpacity key={c} style={[styles.chip, blockCategory === c && styles.chipActive]} onPress={() => setBlockCategory(c)}>
                      <Text style={[styles.chipText, blockCategory === c && styles.chipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.xpNote}>+10 XP on completion</Text>
                <TouchableOpacity style={[styles.modalSubmit, { marginTop: spacing.md }]} onPress={() => {
                  store.startBlock(blockCategory);
                }}>
                  <Text style={styles.modalSubmitText}>▶ Start Block</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={[styles.modalCancel, { marginTop: spacing.sm }]} onPress={() => setBlockModal(false)}>
              <Text style={styles.modalCancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <RankUpModal visible={store.showRankUpModal} rank={store.newRank} onDismiss={store.dismissRankUp} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  logo: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800', letterSpacing: -1 },
  logoAccent: { color: colors.accent },
  date: { color: colors.textSecondary, fontSize: fontSize.sm },
  activeBlock: { backgroundColor: `${colors.success}20`, borderWidth: 1, borderColor: colors.success, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeBlockLabel: { color: colors.success, fontWeight: '700', fontSize: fontSize.sm, letterSpacing: 1 },
  activeBlockTimer: { color: colors.success, fontWeight: '800', fontSize: fontSize.xl, fontFamily: 'Courier' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.bgElevated, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, paddingBottom: spacing.xxl, maxHeight: '85%' },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '800', letterSpacing: 1, marginBottom: spacing.lg },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, fontSize: fontSize.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, minHeight: 44 },
  modalActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  modalCancel: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  modalCancelText: { color: colors.textSecondary, fontSize: fontSize.md },
  modalSubmit: { flex: 2, backgroundColor: colors.accent, borderRadius: borderRadius.md, alignItems: 'center', paddingVertical: spacing.sm },
  modalSubmitText: { color: colors.textPrimary, fontWeight: '700', fontSize: fontSize.md },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs, letterSpacing: 0.5 },
  chipRow: { marginBottom: spacing.md, flexGrow: 0 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgInput },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  chipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  chipTextActive: { color: colors.textPrimary, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  xpNote: { color: colors.xp, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.sm },
  timerDisplay: { color: colors.success, fontSize: 48, fontWeight: '800', textAlign: 'center', fontFamily: 'Courier', marginVertical: spacing.md },
  timerCategory: { color: colors.textSecondary, fontSize: fontSize.md, textAlign: 'center', letterSpacing: 2, marginBottom: spacing.lg },
});
