import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import type { BlockCategory } from '../../types';

const BLOCK_CATEGORIES: BlockCategory[] = ['creative', 'structural', 'physical', 'learning'];
const CATEGORY_COLORS: Record<BlockCategory, string> = { creative: colors.noetic, structural: colors.structural, physical: colors.somatic, learning: colors.sovereign };

interface CollapsibleProps { title: string; emoji: string; children: React.ReactNode; defaultOpen?: boolean }
const Collapsible: React.FC<CollapsibleProps> = ({ title, emoji, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={cs.card}>
      <TouchableOpacity style={cs.cardHeader} onPress={() => setOpen(!open)}>
        <Text style={cs.cardEmoji}>{emoji}</Text>
        <Text style={cs.cardTitle}>{title}</Text>
        <Text style={cs.cardArrow}>{open ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {open && <View style={cs.cardBody}>{children}</View>}
    </View>
  );
};

export const TrackingScreen: React.FC = () => {
  const store = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const todayBlocks = store.executionBlocks.filter(b => b.startTime.startsWith(today));
  const todayEnergy = store.energyEntries.find(e => e.date === today);

  const [resetModal, setResetModal] = useState(false);
  const [resetTrigger, setResetTrigger] = useState('');

  const weightTarget = { min: 70.5, max: 71.0 };
  const weightProgress = Math.max(0, Math.min(1, 1 - Math.abs(store.bodyWeight - 70.75) / 2));

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.header}>TRACKING</Text>

        {/* Execution Blocks */}
        <Collapsible title="EXECUTION BLOCKS" emoji="▶️">
          {store.activeBlock && (
            <View style={[s.blockItem, { borderColor: colors.success }]}>
              <Text style={s.blockActive}>⏱ IN PROGRESS — {store.activeBlock.category.toUpperCase()}</Text>
            </View>
          )}
          {todayBlocks.length === 0 && !store.activeBlock && <Text style={s.emptyText}>No blocks today. Start one from Command Center.</Text>}
          {todayBlocks.map(b => (
            <View key={b.id} style={[s.blockItem, { borderLeftColor: CATEGORY_COLORS[b.category] }]}>
              <View style={s.blockRow}>
                <Text style={[s.blockCat, { color: CATEGORY_COLORS[b.category] }]}>{b.category.toUpperCase()}</Text>
                <Text style={s.blockDur}>{b.durationMinutes}m</Text>
              </View>
              <Text style={s.blockNote}>{b.note || 'No note'}</Text>
            </View>
          ))}
        </Collapsible>

        {/* Shadow Log */}
        <Collapsible title="SHADOW LOG" emoji="👁">
          {store.shadowEntries.slice(0, 5).map(e => (
            <View key={e.id} style={s.shadowItem}>
              <View style={s.shadowRow}>
                <Text style={s.shadowName}>{e.patternName}</Text>
                <View style={[s.intensityBadge, { backgroundColor: e.intensity >= 7 ? colors.danger : e.intensity >= 4 ? colors.warning : colors.success }]}>
                  <Text style={s.intensityText}>{e.intensity}</Text>
                </View>
                <Text style={e.resolved ? s.resolvedYes : s.resolvedNo}>{e.resolved ? '✓' : '✗'}</Text>
              </View>
              <Text style={s.shadowTrigger}>{e.trigger}</Text>
            </View>
          ))}
          {store.shadowEntries.length === 0 && <Text style={s.emptyText}>No shadow entries yet.</Text>}
        </Collapsible>

        {/* Energy Curve */}
        <Collapsible title="ENERGY CURVE" emoji="⚡">
          {(['morning', 'afternoon', 'evening'] as const).map(period => {
            const val = todayEnergy?.[period] ?? 5;
            const emojiMap = { morning: '🌅', afternoon: '☀️', evening: '🌙' };
            return (
              <View key={period} style={s.energyRow}>
                <Text style={s.energyLabel}>{emojiMap[period]} {period}</Text>
                <Slider
                  style={s.energySlider}
                  minimumValue={1} maximumValue={10} step={1} value={val}
                  onValueChange={v => store.setEnergy(period, Math.round(v))}
                  minimumTrackTintColor={colors.accent} maximumTrackTintColor={colors.bgInput} thumbTintColor={colors.accent}
                />
                <Text style={s.energyVal}>{val}</Text>
              </View>
            );
          })}
          {/* Mini bar visualization */}
          <View style={s.energyBars}>
            {(['morning', 'afternoon', 'evening'] as const).map(p => {
              const v = todayEnergy?.[p] ?? 5;
              return (
                <View key={p} style={s.energyBarCol}>
                  <View style={[s.energyBar, { height: v * 8 }]} />
                  <Text style={s.energyBarLabel}>{p.slice(0, 3)}</Text>
                </View>
              );
            })}
          </View>
        </Collapsible>

        {/* Nutrition */}
        <Collapsible title="NUTRITION" emoji="🍽">
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>Structured Meals</Text>
            <Switch value={store.todayNutrition.structuredMeals} onValueChange={v => store.setNutrition('structuredMeals', v)} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
          </View>
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>Blood Type Protocol</Text>
            <Switch value={store.todayNutrition.bloodTypeProtocol} onValueChange={v => store.setNutrition('bloodTypeProtocol', v)} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
          </View>
        </Collapsible>

        {/* Body Metrics */}
        <Collapsible title="BODY METRICS" emoji="⚖️">
          <View style={s.weightRow}>
            <Text style={s.weightLabel}>Weight (kg)</Text>
            <TextInput style={s.weightInput} value={String(store.bodyWeight)} onChangeText={t => { const n = parseFloat(t); if (!isNaN(n)) store.setBodyWeight(n); }} keyboardType="decimal-pad" />
          </View>
          <Text style={s.weightTarget}>Target: {weightTarget.min}–{weightTarget.max} kg</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${weightProgress * 100}%`, backgroundColor: weightProgress > 0.7 ? colors.success : weightProgress > 0.3 ? colors.warning : colors.danger }]} />
          </View>
          <TextInput style={s.notesInput} value={store.bodyNotes} onChangeText={store.setBodyNotes} placeholder="Notes..." placeholderTextColor={colors.textMuted} multiline />
        </Collapsible>

        {/* Sobriety Tracker */}
        <Collapsible title="SOBRIETY" emoji="🛡">
          <View style={s.sobrietyCenter}>
            <Text style={s.sobrietyCount}>{store.sobrietyDays()}</Text>
            <Text style={s.sobrietyLabel}>DAYS CLEAN</Text>
          </View>
          <TouchableOpacity style={s.resetBtn} onPress={() => setResetModal(true)}>
            <Text style={s.resetBtnText}>Reset Counter</Text>
          </TouchableOpacity>
        </Collapsible>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Sobriety Reset Modal */}
      <Modal visible={resetModal} transparent animationType="fade" onRequestClose={() => setResetModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>⚠️ Reset Sobriety Counter</Text>
            <Text style={s.modalSub}>This requires logging the trigger.</Text>
            <TextInput style={s.modalInput} value={resetTrigger} onChangeText={setResetTrigger} placeholder="What happened?" placeholderTextColor={colors.textMuted} multiline />
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setResetModal(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.confirmBtn} onPress={() => {
                if (!resetTrigger.trim()) return;
                store.resetSobriety(resetTrigger);
                store.addShadowEntry({ patternName: 'Sobriety Reset', trigger: resetTrigger, intensity: 10, intervention: null, resolved: false, date: today });
                setResetModal(false); setResetTrigger('');
              }}>
                <Text style={s.confirmText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const cs = StyleSheet.create({
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  cardEmoji: { fontSize: fontSize.lg, marginRight: spacing.sm },
  cardTitle: { flex: 1, color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 2 },
  cardArrow: { color: colors.textMuted, fontSize: fontSize.lg },
  cardBody: { padding: spacing.md, paddingTop: 0 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  header: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800', marginBottom: spacing.lg },
  emptyText: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' },
  // Blocks
  blockItem: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.sm, marginBottom: spacing.xs, borderLeftWidth: 3, borderLeftColor: colors.accent },
  blockRow: { flexDirection: 'row', justifyContent: 'space-between' },
  blockCat: { fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1 },
  blockDur: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600' },
  blockNote: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
  blockActive: { color: colors.success, fontWeight: '700', fontSize: fontSize.sm },
  // Shadow
  shadowItem: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  shadowRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  shadowName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600', flex: 1 },
  intensityBadge: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  intensityText: { color: colors.bg, fontSize: fontSize.xs, fontWeight: '800' },
  resolvedYes: { color: colors.success, fontSize: fontSize.lg, fontWeight: '700' },
  resolvedNo: { color: colors.danger, fontSize: fontSize.lg, fontWeight: '700' },
  shadowTrigger: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.xs },
  // Energy
  energyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  energyLabel: { color: colors.textSecondary, fontSize: fontSize.sm, width: 90 },
  energySlider: { flex: 1, height: 32 },
  energyVal: { color: colors.accent, fontSize: fontSize.lg, fontWeight: '700', width: 28, textAlign: 'right' },
  energyBars: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md, height: 80, alignItems: 'flex-end' },
  energyBarCol: { alignItems: 'center' },
  energyBar: { width: 24, backgroundColor: colors.accent, borderRadius: borderRadius.sm },
  energyBarLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  // Nutrition
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  toggleLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  // Body
  weightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weightLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  weightInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, color: colors.textPrimary, width: 80, textAlign: 'center', borderWidth: 1, borderColor: colors.border },
  weightTarget: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },
  progressBg: { height: 8, backgroundColor: colors.bgInput, borderRadius: 4, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  notesInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.sm, color: colors.textPrimary, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border, minHeight: 44 },
  // Sobriety
  sobrietyCenter: { alignItems: 'center', paddingVertical: spacing.md },
  sobrietyCount: { color: colors.success, fontSize: 64, fontWeight: '800', fontFamily: 'Courier' },
  sobrietyLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 3, marginTop: spacing.xs },
  resetBtn: { backgroundColor: `${colors.danger}20`, borderWidth: 1, borderColor: colors.danger, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', marginTop: spacing.md },
  resetBtnText: { color: colors.danger, fontWeight: '700' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, width: '85%' },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.sm },
  modalSub: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, minHeight: 60 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  cancelText: { color: colors.textSecondary, fontSize: fontSize.md, paddingVertical: spacing.sm },
  confirmBtn: { backgroundColor: colors.danger, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  confirmText: { color: colors.textPrimary, fontWeight: '700' },
});
