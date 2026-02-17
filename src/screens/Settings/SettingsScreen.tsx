import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import type { Habit, Phase, HabitCategory } from '../../types';

const CATEGORIES: HabitCategory[] = ['physical', 'creative', 'structural', 'sovereign'];

export const SettingsScreen: React.FC = () => {
  const store = useAppStore();
  const [section, setSection] = useState<string | null>(null);

  // Habit editing
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState<HabitCategory>('physical');
  const [habitXp, setHabitXp] = useState('10');
  const [habitMvd, setHabitMvd] = useState('');
  const [habitWhy, setHabitWhy] = useState('');

  // Phase editing
  const [phaseModal, setPhaseModal] = useState(false);
  const [phaseName, setPhaseName] = useState('');
  const [phaseDesc, setPhaseDesc] = useState('');
  const [phaseGoal, setPhaseGoal] = useState('');

  // Confirm modals
  const [exportModal, setExportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const openHabitEdit = (h: Habit) => {
    setEditHabit(h); setHabitName(h.name); setHabitCategory(h.category);
    setHabitXp(String(h.xpWeight)); setHabitMvd(h.minimumViableVersion); setHabitWhy(h.why);
  };

  const saveHabit = () => {
    if (!editHabit) return;
    store.updateHabit(editHabit.id, {
      name: habitName, category: habitCategory,
      xpWeight: parseInt(habitXp, 10) || 10,
      minimumViableVersion: habitMvd, why: habitWhy,
    });
    setEditHabit(null);
  };

  type SectionItem = { key: string; label: string; emoji: string };
  const sections: SectionItem[] = [
    { key: 'habits', label: 'Habit Editor', emoji: '🎯' },
    { key: 'phases', label: 'Phase Manager', emoji: '🔄' },
    { key: 'ai', label: 'AI Configuration', emoji: '🤖' },
    { key: 'notifs', label: 'Notifications', emoji: '🔔' },
    { key: 'appearance', label: 'Appearance', emoji: '🎨' },
    { key: 'data', label: 'Data', emoji: '💾' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        <Text style={s.header}>SETTINGS</Text>

        {sections.map(sec => (
          <View key={sec.key}>
            <TouchableOpacity style={s.sectionHeader} onPress={() => setSection(section === sec.key ? null : sec.key)}>
              <Text style={s.sectionEmoji}>{sec.emoji}</Text>
              <Text style={s.sectionLabel}>{sec.label}</Text>
              <Text style={s.sectionArrow}>{section === sec.key ? '▾' : '▸'}</Text>
            </TouchableOpacity>

            {section === sec.key && sec.key === 'habits' && (
              <View style={s.sectionBody}>
                {store.habits.map((h, i) => (
                  <TouchableOpacity key={h.id} style={s.habitItem} onPress={() => openHabitEdit(h)}>
                    <Text style={s.habitOrder}>☰</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.habitName}>{h.name}</Text>
                      <Text style={s.habitMeta}>{h.category} · {h.xpWeight} XP</Text>
                    </View>
                    <Text style={s.editIcon}>✏️</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {section === sec.key && sec.key === 'phases' && (
              <View style={s.sectionBody}>
                {store.phases.map(p => (
                  <View key={p.id} style={s.phaseItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.phaseName}>{p.name}</Text>
                      <Text style={s.phaseDesc}>{p.description}</Text>
                      <Text style={s.phaseGoal}>{p.goal}</Text>
                    </View>
                    <Switch value={p.isActive} onValueChange={() => store.togglePhase(p.id)} trackColor={{ true: colors.success, false: colors.bgInput }} thumbColor={colors.textPrimary} />
                  </View>
                ))}
                <TouchableOpacity style={s.addBtn} onPress={() => { setPhaseName(''); setPhaseDesc(''); setPhaseGoal(''); setPhaseModal(true); }}>
                  <Text style={s.addBtnText}>+ Add Phase</Text>
                </TouchableOpacity>
              </View>
            )}

            {section === sec.key && sec.key === 'ai' && (
              <View style={s.sectionBody}>
                <View style={s.toggleRow}>
                  <Text style={s.toggleLabel}>Model Preference</Text>
                  <View style={s.modelToggle}>
                    {(['claude', 'gemini'] as const).map(m => (
                      <TouchableOpacity key={m} style={[s.modelBtn, store.settings.modelPreference === m && s.modelBtnActive]} onPress={() => store.updateSettings('modelPreference', m)}>
                        <Text style={[s.modelBtnText, store.settings.modelPreference === m && s.modelBtnTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={s.subHeader}>Context Injection</Text>
                {Object.entries(store.settings.contextInjection).map(([key, val]) => (
                  <View key={key} style={s.toggleRow}>
                    <Text style={s.toggleLabel}>{key.charAt(0).toUpperCase() + key.slice(1)} data</Text>
                    <Switch value={val} onValueChange={v => store.updateSettings(`contextInjection.${key}`, v)} trackColor={{ true: colors.accent, false: colors.bgInput }} thumbColor={colors.textPrimary} />
                  </View>
                ))}
              </View>
            )}

            {section === sec.key && sec.key === 'notifs' && (
              <View style={s.sectionBody}>
                {Object.entries(store.settings.notifications).map(([key, val]) => {
                  const labels: Record<string, string> = { morning: 'Morning Reminder', evening: 'Evening Audit', streakWarning: 'Streak Warning' };
                  return (
                    <View key={key} style={s.toggleRow}>
                      <Text style={s.toggleLabel}>{labels[key] || key}</Text>
                      <Switch value={val} onValueChange={v => store.updateSettings(`notifications.${key}`, v)} trackColor={{ true: colors.accent, false: colors.bgInput }} thumbColor={colors.textPrimary} />
                    </View>
                  );
                })}
              </View>
            )}

            {section === sec.key && sec.key === 'appearance' && (
              <View style={s.sectionBody}>
                <View style={s.toggleRow}>
                  <Text style={s.toggleLabel}>Dark Mode</Text>
                  <Switch value={true} disabled trackColor={{ true: colors.accent, false: colors.bgInput }} thumbColor={colors.textPrimary} />
                </View>
                <Text style={s.disabledNote}>Dark mode is locked. This is the way.</Text>
              </View>
            )}

            {section === sec.key && sec.key === 'data' && (
              <View style={s.sectionBody}>
                <TouchableOpacity style={s.dataBtn} onPress={() => setExportModal(true)}>
                  <Text style={s.dataBtnText}>📤 Export All Data</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.dataBtn, { borderColor: colors.danger }]} onPress={() => setDeleteModal(true)}>
                  <Text style={[s.dataBtnText, { color: colors.danger }]}>🗑 Delete Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Habit Edit Modal */}
      <Modal visible={!!editHabit} transparent animationType="slide" onRequestClose={() => setEditHabit(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Edit Habit</Text>
            <Text style={s.fieldLabel}>Name</Text>
            <TextInput style={s.modalInput} value={habitName} onChangeText={setHabitName} placeholderTextColor={colors.textMuted} />
            <Text style={s.fieldLabel}>Category</Text>
            <View style={s.chipWrap}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[s.chip, habitCategory === c && s.chipActive]} onPress={() => setHabitCategory(c)}>
                  <Text style={[s.chipText, habitCategory === c && s.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.fieldLabel}>XP Weight</Text>
            <TextInput style={s.modalInput} value={habitXp} onChangeText={setHabitXp} keyboardType="numeric" placeholderTextColor={colors.textMuted} />
            <Text style={s.fieldLabel}>MVD Version</Text>
            <TextInput style={s.modalInput} value={habitMvd} onChangeText={setHabitMvd} placeholderTextColor={colors.textMuted} />
            <Text style={s.fieldLabel}>Why</Text>
            <TextInput style={s.modalInput} value={habitWhy} onChangeText={setHabitWhy} placeholderTextColor={colors.textMuted} />
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setEditHabit(null)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={saveHabit}><Text style={s.submitText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Phase Modal */}
      <Modal visible={phaseModal} transparent animationType="slide" onRequestClose={() => setPhaseModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>New Phase</Text>
            <TextInput style={s.modalInput} value={phaseName} onChangeText={setPhaseName} placeholder="Phase name" placeholderTextColor={colors.textMuted} />
            <TextInput style={s.modalInput} value={phaseDesc} onChangeText={setPhaseDesc} placeholder="Description" placeholderTextColor={colors.textMuted} />
            <TextInput style={s.modalInput} value={phaseGoal} onChangeText={setPhaseGoal} placeholder="Goal" placeholderTextColor={colors.textMuted} />
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setPhaseModal(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={s.submitBtn} onPress={() => {
                if (phaseName.trim()) {
                  store.addPhase({ name: phaseName, description: phaseDesc, goal: phaseGoal, isActive: false, startDate: new Date().toISOString().split('T')[0], endDate: null });
                  setPhaseModal(false);
                }
              }}><Text style={s.submitText}>Create</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Confirm */}
      <Modal visible={exportModal} transparent animationType="fade" onRequestClose={() => setExportModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>📤 Export Data</Text>
            <Text style={s.modalSub}>Your data would be exported as JSON. (UI only — no actual export in this build.)</Text>
            <TouchableOpacity style={s.submitBtn} onPress={() => setExportModal(false)}><Text style={s.submitText}>OK</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirm */}
      <Modal visible={deleteModal} transparent animationType="fade" onRequestClose={() => setDeleteModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>🗑 Delete Account</Text>
            <Text style={s.modalSub}>This would permanently delete all data. Are you sure?</Text>
            <Text style={s.modalSub}>(UI only — nothing actually happens.)</Text>
            <View style={s.modalActions}>
              <TouchableOpacity onPress={() => setDeleteModal(false)}><Text style={s.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={[s.submitBtn, { backgroundColor: colors.danger }]} onPress={() => setDeleteModal(false)}>
                <Text style={s.submitText}>Delete</Text>
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
  sectionHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: 1, borderWidth: 1, borderColor: colors.border },
  sectionEmoji: { fontSize: fontSize.lg, marginRight: spacing.sm },
  sectionLabel: { flex: 1, color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' },
  sectionArrow: { color: colors.textMuted, fontSize: fontSize.lg },
  sectionBody: { backgroundColor: colors.bgCard, borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  // Habits
  habitItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  habitOrder: { color: colors.textMuted, fontSize: fontSize.lg, marginRight: spacing.md },
  habitName: { color: colors.textPrimary, fontSize: fontSize.md },
  habitMeta: { color: colors.textMuted, fontSize: fontSize.xs },
  editIcon: { fontSize: fontSize.md },
  // Phases
  phaseItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  phaseName: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600' },
  phaseDesc: { color: colors.textSecondary, fontSize: fontSize.sm },
  phaseGoal: { color: colors.accent, fontSize: fontSize.xs, marginTop: 2 },
  addBtn: { backgroundColor: colors.accentDim, borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.sm, alignItems: 'center', marginTop: spacing.md },
  addBtnText: { color: colors.accent, fontWeight: '700' },
  // AI
  subHeader: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, marginTop: spacing.md, marginBottom: spacing.sm },
  modelToggle: { flexDirection: 'row', gap: spacing.xs },
  modelBtn: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border },
  modelBtnActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  modelBtnText: { color: colors.textMuted, fontSize: fontSize.sm },
  modelBtnTextActive: { color: colors.textPrimary, fontWeight: '600' },
  // Toggles
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  toggleLabel: { color: colors.textPrimary, fontSize: fontSize.md },
  disabledNote: { color: colors.textMuted, fontSize: fontSize.xs, fontStyle: 'italic', marginTop: spacing.xs },
  // Data
  dataBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: borderRadius.md, padding: spacing.md, alignItems: 'center', marginBottom: spacing.md },
  dataBtnText: { color: colors.accent, fontWeight: '700' },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.bgElevated, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, paddingBottom: spacing.xxl },
  modalTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.md },
  modalSub: { color: colors.textSecondary, fontSize: fontSize.md, marginBottom: spacing.sm },
  modalInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.md, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border },
  chipActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  chipText: { color: colors.textMuted, fontSize: fontSize.sm },
  chipTextActive: { color: colors.textPrimary, fontWeight: '600' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.md },
  cancelText: { color: colors.textSecondary, paddingVertical: spacing.sm },
  submitBtn: { backgroundColor: colors.accent, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  submitText: { color: colors.textPrimary, fontWeight: '700' },
});
