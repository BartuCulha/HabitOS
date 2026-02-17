import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  Modal, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';
import type { AIProvider, ISOSMode, ConversationMessage } from '../../types';

const MODES: ISOSMode[] = ['default', 'warlord', 'architect', 'sovereign', 'noetic', 'somatic', 'shadow', 'pantheon'];
const MODE_LABELS: Record<ISOSMode, string> = {
  default: '🔵 Default', warlord: '⚔️ Warlord', architect: '🏗 Architect', sovereign: '👑 Sovereign',
  noetic: '🧠 Noetic', somatic: '🔴 Somatic', shadow: '👁 Shadow', pantheon: '🏛 Pantheon',
};

const PANTHEON_SPEAKERS = ['Strategos', 'Bio-Digital Lab', 'Ethereal Archive'];

export const AIConsoleScreen: React.FC = () => {
  const store = useAppStore();
  const [input, setInput] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinModalMsg, setPinModalMsg] = useState<ConversationMessage | null>(null);
  const [pinTopic, setPinTopic] = useState('');
  const listRef = useRef<FlatList>(null);

  const currentMessages = store.messages.filter(
    m => m.conversationId === store.activeConversationId
  );

  const send = () => {
    if (!input.trim()) return;
    store.sendMessage(input.trim());
    setInput('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const isPantheon = store.isosMode === 'pantheon';

  const renderMessage = ({ item }: { item: ConversationMessage }) => {
    const isUser = item.role === 'user';
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onLongPress={() => { if (!isUser) { setPinModalMsg(item); setPinTopic(''); } }}
        style={[styles.msgBubble, isUser ? styles.msgUser : styles.msgAI, isPantheon && !isUser && styles.msgPantheon]}
      >
        {isPantheon && !isUser && <Text style={styles.pantheonHeader}>🏛 PANTHEON COUNCIL</Text>}
        {item.isPinned && <Text style={styles.pinnedBadge}>📌 Pinned</Text>}
        <Text style={[styles.msgText, isUser && styles.msgTextUser]}>{item.content}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Top bar: model switcher */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.drawerBtn} onPress={() => setDrawerOpen(true)}>
            <Text style={styles.drawerBtnText}>☰</Text>
          </TouchableOpacity>
          <View style={styles.modelTabs}>
            {(['claude', 'gemini'] as AIProvider[]).map(p => (
              <TouchableOpacity key={p} style={[styles.modelTab, store.aiProvider === p && styles.modelTabActive]} onPress={() => store.setAiProvider(p)}>
                <Text style={[styles.modelTabText, store.aiProvider === p && styles.modelTabTextActive]}>{p === 'claude' ? 'Claude' : 'Gemini'}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => store.startNewConversation()}>
            <Text style={styles.newChat}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* ISOS Mode selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeRow} contentContainerStyle={styles.modeRowContent}>
          {MODES.map(m => (
            <TouchableOpacity key={m} style={[styles.modeChip, store.isosMode === m && styles.modeChipActive, m === 'pantheon' && store.isosMode === 'pantheon' && styles.modeChipPantheon]} onPress={() => store.setIsosMode(m)}>
              <Text style={[styles.modeChipText, store.isosMode === m && styles.modeChipTextActive]}>{MODE_LABELS[m]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={currentMessages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>{isPantheon ? '🏛' : '🧠'}</Text>
              <Text style={styles.emptyTitle}>{isPantheon ? 'PANTHEON COUNCIL' : `${store.isosMode.toUpperCase()} MODE`}</Text>
              <Text style={styles.emptyText}>Start a conversation. Your context is loaded.</Text>
            </View>
          }
        />

        {/* Input */}
        <View style={[styles.inputRow, isPantheon && styles.inputRowPantheon]}>
          <TouchableOpacity style={styles.voiceBtn}>
            <Text style={styles.voiceBtnText}>🎤</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={input}
            onChangeText={setInput}
            placeholder={isPantheon ? 'Address the Council...' : 'Message...'}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={send}>
            <Text style={styles.sendBtnText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Conversation Drawer */}
      <Modal visible={drawerOpen} transparent animationType="slide" onRequestClose={() => setDrawerOpen(false)}>
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={() => setDrawerOpen(false)}>
          <View style={styles.drawer}>
            <Text style={styles.drawerTitle}>CONVERSATIONS</Text>
            <ScrollView>
              {store.conversations.map(c => (
                <TouchableOpacity key={c.id} style={[styles.convItem, store.activeConversationId === c.id && styles.convItemActive]} onPress={() => { store.setActiveConversation(c.id); setDrawerOpen(false); }}>
                  <Text style={styles.convTitle} numberOfLines={1}>{c.title}</Text>
                  <View style={styles.convMeta}>
                    <Text style={styles.convTag}>{c.mode}</Text>
                    <Text style={styles.convProvider}>{c.provider}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Pin Insight Modal */}
      <Modal visible={!!pinModalMsg} transparent animationType="fade" onRequestClose={() => setPinModalMsg(null)}>
        <View style={styles.pinOverlay}>
          <View style={styles.pinCard}>
            <Text style={styles.pinTitle}>📌 Pin Insight</Text>
            <Text style={styles.pinPreview} numberOfLines={3}>{pinModalMsg?.content}</Text>
            <Text style={styles.fieldLabel}>Topic</Text>
            <TextInput style={styles.pinInput} value={pinTopic} onChangeText={setPinTopic} placeholder="e.g. Shadow Work, System Design..." placeholderTextColor={colors.textMuted} />
            <View style={styles.pinActions}>
              <TouchableOpacity onPress={() => setPinModalMsg(null)}>
                <Text style={styles.pinCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pinBtn} onPress={() => {
                if (pinModalMsg) store.pinInsight(pinModalMsg.id, pinTopic || 'General');
                setPinModalMsg(null);
              }}>
                <Text style={styles.pinBtnText}>Pin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  drawerBtn: { padding: spacing.xs },
  drawerBtnText: { color: colors.textPrimary, fontSize: fontSize.xl },
  modelTabs: { flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.xs },
  modelTab: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border },
  modelTabActive: { backgroundColor: colors.accentDim, borderColor: colors.accent },
  modelTabText: { color: colors.textMuted, fontSize: fontSize.md, fontWeight: '600' },
  modelTabTextActive: { color: colors.textPrimary },
  newChat: { color: colors.accent, fontSize: fontSize.sm, fontWeight: '700' },
  modeRow: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: colors.border },
  modeRowContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  modeChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.xl, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCard },
  modeChipActive: { borderColor: colors.accent, backgroundColor: colors.accentDim },
  modeChipPantheon: { borderColor: '#FFD700', backgroundColor: '#2D1B69' },
  modeChipText: { color: colors.textSecondary, fontSize: fontSize.sm },
  modeChipTextActive: { color: colors.textPrimary, fontWeight: '600' },
  messageList: { flex: 1 },
  messageContent: { padding: spacing.md, gap: spacing.md, flexGrow: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '800', letterSpacing: 2 },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, marginTop: spacing.sm },
  msgBubble: { padding: spacing.md, borderRadius: borderRadius.lg, maxWidth: '85%' },
  msgUser: { backgroundColor: colors.accentDim, alignSelf: 'flex-end', borderBottomRightRadius: borderRadius.sm },
  msgAI: { backgroundColor: colors.bgCard, alignSelf: 'flex-start', borderBottomLeftRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border },
  msgPantheon: { borderColor: '#FFD700', borderWidth: 1, backgroundColor: '#1A1030' },
  pantheonHeader: { color: '#FFD700', fontSize: fontSize.xs, fontWeight: '800', letterSpacing: 2, marginBottom: spacing.xs },
  pinnedBadge: { color: colors.xp, fontSize: fontSize.xs, marginBottom: spacing.xs },
  msgText: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 22 },
  msgTextUser: { color: colors.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.xs },
  inputRowPantheon: { borderTopColor: '#FFD700' },
  voiceBtn: { padding: spacing.sm },
  voiceBtnText: { fontSize: 20 },
  textInput: { flex: 1, backgroundColor: colors.bgInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, color: colors.textPrimary, fontSize: fontSize.md, maxHeight: 100, borderWidth: 1, borderColor: colors.border },
  sendBtn: { backgroundColor: colors.accent, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  // Drawer
  drawerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  drawer: { width: '75%', backgroundColor: colors.bgElevated, paddingTop: 60, paddingHorizontal: spacing.md },
  drawerTitle: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 2, marginBottom: spacing.md },
  convItem: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  convItemActive: { borderLeftWidth: 3, borderLeftColor: colors.accent, paddingLeft: spacing.sm },
  convTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '500' },
  convMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
  convTag: { color: colors.accent, fontSize: fontSize.xs },
  convProvider: { color: colors.textMuted, fontSize: fontSize.xs },
  // Pin modal
  pinOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  pinCard: { backgroundColor: colors.bgElevated, borderRadius: borderRadius.lg, padding: spacing.lg, width: '85%' },
  pinTitle: { color: colors.textPrimary, fontSize: fontSize.xl, fontWeight: '700', marginBottom: spacing.md },
  pinPreview: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md, fontStyle: 'italic' },
  fieldLabel: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs },
  pinInput: { backgroundColor: colors.bgInput, borderRadius: borderRadius.md, padding: spacing.sm, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  pinActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  pinCancel: { color: colors.textSecondary, fontSize: fontSize.md, paddingVertical: spacing.sm },
  pinBtn: { backgroundColor: colors.accent, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  pinBtnText: { color: colors.textPrimary, fontWeight: '700' },
});
