import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import { CollapsibleCard } from '../../components/CollapsibleCard';
import type { BlockCategory } from '../../types';

const CATEGORY_COLORS: Record<BlockCategory, string> = { creative: colors.noetic, structural: colors.structural, physical: colors.somatic, learning: colors.sovereign };
const ENERGY_COLORS = { morning: '#FFD93D', afternoon: '#FF6B6B', evening: '#6C5CE7' };

// Mini sparkline: renders a simple SVG-less line chart using Views
const MiniSparkline: React.FC<{ data: number[]; color?: string }> = ({ data, color = colors.accent }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  return (
    <View style={sparkStyles.container}>
      {data.map((v, i) => (
        <View key={i} style={[sparkStyles.bar, { height: ((v - min) / range) * 30 + 4, backgroundColor: color }]} />
      ))}
    </View>
  );
};

const sparkStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 34 },
  bar: { width: 4, borderRadius: 2 },
});

export const TrackingScreen: React.FC = () => {
  const store = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const todayBlocks = store.executionBlocks.filter(b => b.startTime.startsWith(today));
  const todayEnergy = store.energyEntries.find(e => e.date === today);
  const totalMinutesToday = todayBlocks.reduce((sum, b) => sum + (b.durationMinutes ?? 0), 0);

  const [resetModal, setResetModal] = useState(false);
  const [resetTrigger, setResetTrigger] = useState('');

  const weightTarget = { min: 70.5, max: 71.0 };
  const weightProgress = Math.max(0, Math.min(1, 1 - Math.abs(store.bodyWeight - 70.75) / 2));

  // Mock weight history for sparkline
  const weightHistory = [72.1, 71.8, 71.5, 71.4, 71.2, 71.3, store.bodyWeight];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.header}>📊 TRACKING</Text>

        {/* Execution Blocks */}
        <CollapsibleCard
          title="EXECUTION BLOCKS"
          emoji="▶️"
          rightContent={totalMinutesToday > 0 ? <Text style={s.totalTime}>{totalMinutesToday}m today</Text> : undefined}
        >
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
        </CollapsibleCard>

        {/* Shadow Log */}
        <CollapsibleCard title="SHADOW LOG" emoji="👁">
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
        </CollapsibleCard>

        {/* Energy Curve */}
        <CollapsibleCard title="ENERGY CURVE" emoji="⚡">
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
                  minimumTrackTintColor={ENERGY_COLORS[period]} maximumTrackTintColor={colors.bgInput} thumbTintColor={ENERGY_COLORS[period]}
                />
                <Text style={s.energyVal}>{val}</Text>
              </View>
            );
          })}
          {/* Colored bar chart */}
          <View style={s.energyBars}>
            {(['morning', 'afternoon', 'evening'] as const).map(p => {
              const v = todayEnergy?.[p] ?? 5;
              return (
                <View key={p} style={s.energyBarCol}>
                  <View style={[s.energyBar, { height: v * 8, backgroundColor: ENERGY_COLORS[p] }]} />
                  <Text style={s.energyBarLabel}>{p.slice(0, 3)}</Text>
                  <Text style={[s.energyBarVal, { color: ENERGY_COLORS[p] }]}>{v}</Text>
                </View>
              );
            })}
          </View>
        </CollapsibleCard>

        {/* Nutrition */}
        <CollapsibleCard title="NUTRITION" emoji="🍽">
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>Structured Meals</Text>
            <Switch value={store.todayNutrition.structuredMeals} onValueChange={v => store.setNutrition('structuredMeals', v)} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
          </View>
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>Blood Type Protocol</Text>
            <Switch value={store.todayNutrition.bloodTypeProtocol} onValueChange={v => store.setNutrition('bloodTypeProtocol', v)} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
          </View>
        </CollapsibleCard>

        {/* Body Metrics */}
        <CollapsibleCard title="BODY METRICS" emoji="⚖️">
          <View style={s.weightRow}>
            <Text style={s.weightLabel}>Weight (kg)</Text>
            <MiniSparkline data={weightHistory} color={weightProgress > 0.7 ? colors.success : colors.warning} />
            <TextInput style={s.weightInput} value={String(store.bodyWeight)} onChangeText={t => { const n = parseFloat(t); if (!isNaN(n)) store.setBodyWeight(n); }} keyboardType="decimal-pad" />
          </View>
          <Text style={s.weightTarget}>Target: {weightTarget.min}–{weightTarget.max} kg</Text>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${weightProgress * 100}%`, backgroundColor: weightProgress > 0.7 ? colors.success : weightProgress > 0.3 ? colors.warning : colors.danger }]} />
          </View>
          <TextInput style={s.notesInput} value={store.bodyNotes} onChangeText={store.setBodyNotes} placeholder="Notes..." placeholderTextColor={colors.textMuted} multiline />
        </CollapsibleCard>

        {/* Sobriety Tracker */}
        <CollapsibleCard title="SOBRIETY" emoji="🛡">
          <View style={s.sobrietyCenter}>
            <Text style={s.sobrietyCount}>{store.sobrietyDays()}</Text>
            <Text style={s.sobrietyLabel}>DAYS CLEAN</Text>
          </View>
          <TouchableOpacity style={s.resetBtn} onPress={() => setResetModal(true)}>
            <Text style={s.resetBtnText}>Reset Counter</Text>
          </TouchableOpacity>
        </CollapsibleCard>

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

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  header: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800', marginBottom: spacing.lg },
  emptyText: { color: colors.textMuted, fontSize: fontSize.sm, fontStyle: 'italic' },
  totalTime: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '700', marginRight: spacing.sm },
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
  energyBars: { flexDirection: 'row', justifyContent: 'space-around', marginTop: spacing.md, height: 100, alignItems: 'flex-end' },
  energyBarCol: { alignItems: 'center' },
  energyBar: { width: 32, borderRadius: borderRadius.sm },
  energyBarLabel: { color: colors.textMuted, fontSize: fontSize.xs, marginTop: spacing.xs },
  energyBarVal: { fontSize: fontSize.sm, fontWeight: '700', marginTop: 2 },
  // Nutrition
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, minHeight: 44 },
  toggleLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  // Body
  weightRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  weightLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  weightInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, color: colors.textPrimary, width: 80, textAlign: 'center', borderWidth: 1, borderColor: colors.border, minHeight: 44 },
  weightTarget: { color: colors.textMuted, fontSize: fontSize.sm, marginTop: spacing.sm },
  progressBg: { height: 8, backgroundColor: colors.bgInput, borderRadius: 4, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  notesInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.sm, color: colors.textPrimary, marginTop: spacing.md, borderWidth: 1, borderColor: colors.border, minHeight: 44 },
  // Sobriety
  sobrietyCenter: { alignItems: 'center', paddingVertical: spacing.md },
  sobrietyCount: { color: colors.success, fontSize: 64, fontWeight: '800', fontFamily: 'Courier' },
  sobrietyLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 3, marginTop: spacing.xs },
  resetBtn: { backgroundColor: `${colors.danger}20`, borderWidth: 1, borderColor: colors.danger, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', marginTop: spacing.md, minHeight: 44, justifyContent: 'center' },
  resetBtnText: { color: colors.danger, fontWeight: '700' },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, width: '85%' },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.sm },
  modalSub: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, minHeight: 60 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  cancelText: { color: colors.textSecondary, fontSize: fontSize.md, paddingVertical: spacing.sm },
  confirmBtn: { backgroundColor: colors.danger, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, minHeight: 44, justifyContent: 'center' },
  confirmText: { color: colors.textPrimary, fontWeight: '700' },
});
