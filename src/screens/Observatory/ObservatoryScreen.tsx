import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, borderRadius } from '../../constants/theme';
import { TabBar } from '../../components/TabBar';
import { SAMPLE_CHRONOS_REPORT, SAMPLE_CORRELATIONS, DEFAULT_SHADOW_PATTERNS, SAMPLE_MILESTONES, DAILY_SCORES } from '../../utils/mockData';

type Tab = 'chronos' | 'patterns' | 'correlations' | 'streaks' | 'milestones';

const TABS: { key: Tab; label: string; emoji: string }[] = [
  { key: 'chronos', label: 'Chronos', emoji: '📊' },
  { key: 'patterns', label: 'Patterns', emoji: '🔮' },
  { key: 'correlations', label: 'Correlations', emoji: '🔗' },
  { key: 'streaks', label: 'Streaks', emoji: '🔥' },
  { key: 'milestones', label: 'Timeline', emoji: '🏁' },
];

const RANK_BADGES: Record<string, string> = {
  Novice: '🟤', Operator: '⚪', Architect: '🔵', Warlord: '🔴', Sovereign: '🟣', Archon: '👑',
};

export const ObservatoryScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('chronos');
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const report = SAMPLE_CHRONOS_REPORT;

  // Streak heatmap: 7 cols x ~5 rows
  const heatmapData = DAILY_SCORES.slice(-28); // last 28 days for clean 7-col grid

  return (
    <SafeAreaView style={s.safe}>
      <Text style={s.header}>🔭 OBSERVATORY</Text>
      <TabBar tabs={TABS} activeTab={tab} onTabPress={setTab} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Chronos Report */}
        {tab === 'chronos' && (
          <>
            <View style={s.card}>
              <Text style={s.cardTitle}>WEEKLY REPORT CARD</Text>
              <View style={s.reportGrid}>
                <View style={s.reportCol}>
                  <Text style={s.reportColTitle}>This Week</Text>
                  <Text style={s.reportStat}>{report.currentWeek.avgScore}<Text style={s.reportUnit}> avg</Text></Text>
                  <Text style={s.reportDetail}>Habits: {report.currentWeek.habitsCompleted}/{report.currentWeek.habitsTotal}</Text>
                  <Text style={s.reportDetail}>Blocks: {report.currentWeek.blocksCompleted}</Text>
                  <Text style={s.reportDetail}>Artifacts: {report.currentWeek.artifactsShipped}</Text>
                </View>
                <View style={s.reportDivider} />
                <View style={s.reportCol}>
                  <Text style={s.reportColTitle}>Last Week</Text>
                  <Text style={s.reportStat}>{report.lastWeek.avgScore}<Text style={s.reportUnit}> avg</Text></Text>
                  <Text style={s.reportDetail}>Habits: {report.lastWeek.habitsCompleted}/{report.lastWeek.habitsTotal}</Text>
                  <Text style={s.reportDetail}>Blocks: {report.lastWeek.blocksCompleted}</Text>
                  <Text style={s.reportDetail}>Artifacts: {report.lastWeek.artifactsShipped}</Text>
                </View>
              </View>
            </View>

            <View style={[s.card, { borderLeftWidth: 3, borderLeftColor: colors.success }]}>
              <Text style={s.sectionTitle}>📈 Growth Vectors</Text>
              {report.growthVectors.map((v, i) => <Text key={i} style={s.growthItem}>• {v}</Text>)}
            </View>

            <View style={[s.card, { borderLeftWidth: 3, borderLeftColor: colors.warning }]}>
              <Text style={s.sectionTitle}>⚠️ Stagnation Points</Text>
              {report.stagnationPoints.map((v, i) => <Text key={i} style={s.stagnationItem}>• {v}</Text>)}
            </View>

            <View style={s.card}>
              <Text style={s.sectionTitle}>🔗 Correlations</Text>
              {report.correlations.map((v, i) => <Text key={i} style={s.bulletItem}>• {v}</Text>)}
            </View>

            <View style={[s.card, { borderLeftWidth: 3, borderLeftColor: colors.info }]}>
              <Text style={s.sectionTitle}>💡 Recommendation</Text>
              <Text style={s.recText}>{report.recommendation}</Text>
            </View>

            <View style={s.card}>
              <Text style={s.sectionTitle}>👁 Shadow Frequency</Text>
              {Object.entries(report.shadowFrequency).map(([name, count]) => {
                const maxFreq = Math.max(...Object.values(report.shadowFrequency));
                return (
                  <View key={name} style={s.freqRow}>
                    <Text style={s.freqName}>{name}</Text>
                    <View style={s.freqBarBg}>
                      <View style={[s.freqBarFill, { width: `${((count as number) / maxFreq) * 100}%` }]} />
                    </View>
                    <Text style={s.freqCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Pattern Library */}
        {tab === 'patterns' && (
          <>
            {DEFAULT_SHADOW_PATTERNS.map(p => {
              const trendArrow = p.trend === 'increasing' ? '↑' : p.trend === 'decreasing' ? '↓' : '→';
              const trendColor = p.trend === 'increasing' ? colors.danger : p.trend === 'decreasing' ? colors.success : colors.textMuted;
              const expanded = expandedPattern === p.id;
              const maxFreq = Math.max(...DEFAULT_SHADOW_PATTERNS.map(pp => pp.frequencyLast30));
              return (
                <TouchableOpacity key={p.id} style={s.card} onPress={() => setExpandedPattern(expanded ? null : p.id)} activeOpacity={0.7}>
                  <View style={s.patternHeader}>
                    <Text style={s.patternName}>{p.name}</Text>
                    <Text style={[s.patternTrend, { color: trendColor }]}>{trendArrow} {p.frequencyLast30}</Text>
                  </View>
                  {/* Frequency bar */}
                  <View style={s.patternBarBg}>
                    <View style={[s.patternBarFill, { width: `${(p.frequencyLast30 / maxFreq) * 100}%`, backgroundColor: trendColor }]} />
                  </View>
                  <Text style={s.patternDesc}>{p.description}</Text>
                  {expanded && (
                    <View style={s.patternDetails}>
                      <Text style={s.detailLabel}>Trigger</Text>
                      <Text style={s.detailText}>{p.typicalTrigger}</Text>
                      <Text style={s.detailLabel}>Payoff</Text>
                      <Text style={s.detailText}>{p.typicalPayoff}</Text>
                      <Text style={s.detailLabel}>Cost</Text>
                      <Text style={s.detailText}>{p.cost}</Text>
                      <Text style={s.detailLabel}>Countermove</Text>
                      <Text style={[s.detailText, { color: colors.success }]}>{p.countermove}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Correlations — color coded by strength */}
        {tab === 'correlations' && (
          <>
            <Text style={s.corNote}>Correlations visible after 3+ days of data.</Text>
            {SAMPLE_CORRELATIONS.map(c => {
              const abs = Math.abs(c.coefficient);
              const strengthColor = abs > 0.7 ? colors.success : abs >= 0.5 ? colors.warning : colors.textMuted;
              const strengthLabel = abs > 0.7 ? 'Strong' : abs >= 0.5 ? 'Moderate' : 'Weak';
              return (
                <View key={c.id} style={[s.card, { borderLeftWidth: 3, borderLeftColor: strengthColor }]}>
                  <View style={s.corHeader}>
                    <Text style={s.corFactors}>{c.factorA} ↔ {c.factorB}</Text>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={[s.corCoeff, { color: c.direction === 'positive' ? colors.success : colors.danger }]}>
                        {c.direction === 'negative' ? '-' : ''}{c.coefficient.toFixed(2)}
                      </Text>
                      <Text style={[s.corStrength, { color: strengthColor }]}>{strengthLabel}</Text>
                    </View>
                  </View>
                  <Text style={s.corInsight}>{c.insight}</Text>
                </View>
              );
            })}
          </>
        )}

        {/* Streaks — proper 7-column heatmap */}
        {tab === 'streaks' && (
          <>
            <View style={s.card}>
              <Text style={s.cardTitle}>30-DAY HEATMAP</Text>
              <View style={s.heatmapDayHeaders}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <Text key={i} style={s.heatmapDayLabel}>{d}</Text>
                ))}
              </View>
              <View style={s.heatmapGrid}>
                {heatmapData.map((d, i) => {
                  const bg = d.score >= 70 ? colors.success : d.score >= 40 ? colors.warning : colors.danger;
                  const opacity = 0.3 + (d.score / 100) * 0.7;
                  return (
                    <View key={i} style={[s.heatmapCell, { backgroundColor: bg, opacity }]}>
                      <Text style={s.heatmapCellText}>{d.score}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={s.heatmapLegend}>
                <Text style={s.heatmapLegendText}>Low</Text>
                <View style={[s.heatmapLegendDot, { backgroundColor: colors.danger }]} />
                <View style={[s.heatmapLegendDot, { backgroundColor: colors.warning }]} />
                <View style={[s.heatmapLegendDot, { backgroundColor: colors.success }]} />
                <Text style={s.heatmapLegendText}>High</Text>
              </View>
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>WEEK COMPARISON</Text>
              {[
                { label: 'Best Week', value: 82, color: colors.success },
                { label: 'Current Week', value: 72, color: colors.accent },
                { label: 'Worst Week', value: 41, color: colors.danger },
              ].map(w => (
                <View key={w.label} style={s.weekRow}>
                  <Text style={s.weekLabel}>{w.label}</Text>
                  <View style={s.weekBarBg}>
                    <View style={[s.weekBarFill, { width: `${w.value}%`, backgroundColor: w.color }]} />
                  </View>
                  <Text style={[s.weekVal, { color: w.color }]}>{w.value}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Milestones — with connecting line and rank badges */}
        {tab === 'milestones' && (
          <View style={s.timeline}>
            {SAMPLE_MILESTONES.map((m, i) => (
              <View key={m.id} style={s.timelineItem}>
                <View style={s.timelineLine}>
                  <View style={[s.timelineDot, i === SAMPLE_MILESTONES.length - 1 && { backgroundColor: colors.xp }]} />
                  {i < SAMPLE_MILESTONES.length - 1 && <View style={s.timelineConnector} />}
                </View>
                <View style={s.timelineContent}>
                  <Text style={s.timelineDate}>{m.date}</Text>
                  <Text style={s.timelineTitle}>{m.title}</Text>
                  <Text style={s.timelineDesc}>{m.description}</Text>
                  <View style={s.timelineMeta}>
                    <Text style={s.timelineRankBadge}>{RANK_BADGES[m.rankAtTime] ?? '⚪'} {m.rankAtTime}</Text>
                    <Text style={s.timelineXp}>{m.xpAtTime} XP</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  scroll: { flex: 1 },
  content: { padding: spacing.lg },
  card: { backgroundColor: colors.bgCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  cardTitle: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 2, marginBottom: spacing.md },
  sectionTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', marginBottom: spacing.sm },
  bulletItem: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.xs, lineHeight: 20 },
  growthItem: { color: colors.success, fontSize: fontSize.sm, marginBottom: spacing.xs, lineHeight: 20 },
  stagnationItem: { color: colors.warning, fontSize: fontSize.sm, marginBottom: spacing.xs, lineHeight: 20 },
  recText: { color: colors.textPrimary, fontSize: fontSize.md, lineHeight: 22, fontStyle: 'italic' },
  // Report grid
  reportGrid: { flexDirection: 'row', gap: spacing.md },
  reportCol: { flex: 1 },
  reportColTitle: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, marginBottom: spacing.sm },
  reportStat: { color: colors.textPrimary, fontSize: fontSize.xxl, fontWeight: '800' },
  reportUnit: { color: colors.textMuted, fontSize: fontSize.sm },
  reportDetail: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs },
  reportDivider: { width: 1, backgroundColor: colors.border },
  // Shadow frequency
  freqRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  freqName: { color: colors.textSecondary, fontSize: fontSize.sm, width: 100 },
  freqBarBg: { flex: 1, height: 8, backgroundColor: colors.bgInput, borderRadius: 4, marginHorizontal: spacing.sm, overflow: 'hidden' },
  freqBarFill: { height: '100%', backgroundColor: colors.danger, borderRadius: 4 },
  freqCount: { color: colors.textMuted, fontSize: fontSize.sm, width: 20, textAlign: 'right' },
  // Patterns
  patternHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  patternName: { color: colors.textPrimary, fontSize: fontSize.lg, fontWeight: '700' },
  patternTrend: { fontSize: fontSize.md, fontWeight: '700' },
  patternBarBg: { height: 6, backgroundColor: colors.bgInput, borderRadius: 3, marginVertical: spacing.sm, overflow: 'hidden' },
  patternBarFill: { height: '100%', borderRadius: 3 },
  patternDesc: { color: colors.textSecondary, fontSize: fontSize.sm },
  patternDetails: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  detailLabel: { color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '700', letterSpacing: 1, marginTop: spacing.sm },
  detailText: { color: colors.textPrimary, fontSize: fontSize.sm, lineHeight: 20 },
  // Correlations
  corNote: { color: colors.textMuted, fontSize: fontSize.sm, marginBottom: spacing.md, fontStyle: 'italic' },
  corHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
  corFactors: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '600', flex: 1 },
  corCoeff: { fontSize: fontSize.xl, fontWeight: '800' },
  corStrength: { fontSize: fontSize.xs, fontWeight: '600', marginTop: 2 },
  corInsight: { color: colors.textSecondary, fontSize: fontSize.sm, lineHeight: 20 },
  // Heatmap
  heatmapDayHeaders: { flexDirection: 'row', marginBottom: spacing.xs },
  heatmapDayLabel: { width: `${100 / 7}%` as unknown as number, textAlign: 'center', color: colors.textMuted, fontSize: fontSize.xs, fontWeight: '600' },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  heatmapCell: { width: `${100 / 7}%` as unknown as number, aspectRatio: 1, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 3 },
  heatmapCellText: { color: colors.textPrimary, fontSize: 8, fontWeight: '700' },
  heatmapLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.sm },
  heatmapLegendText: { color: colors.textMuted, fontSize: fontSize.xs },
  heatmapLegendDot: { width: 12, height: 12, borderRadius: 3 },
  weekRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  weekLabel: { color: colors.textSecondary, fontSize: fontSize.sm, width: 100 },
  weekBarBg: { flex: 1, height: 12, backgroundColor: colors.bgInput, borderRadius: 6, overflow: 'hidden', marginHorizontal: spacing.sm },
  weekBarFill: { height: '100%', borderRadius: 6 },
  weekVal: { fontSize: fontSize.md, fontWeight: '700', width: 30, textAlign: 'right' },
  // Timeline
  timeline: { paddingLeft: spacing.sm },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLine: { width: 24, alignItems: 'center' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent, marginTop: 4 },
  timelineConnector: { width: 2, flex: 1, backgroundColor: colors.border, marginVertical: 4 },
  timelineContent: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.lg },
  timelineDate: { color: colors.textMuted, fontSize: fontSize.xs },
  timelineTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '700', marginTop: 2 },
  timelineDesc: { color: colors.textSecondary, fontSize: fontSize.sm, marginTop: spacing.xs, lineHeight: 20 },
  timelineMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  timelineRankBadge: { color: colors.accent, fontSize: fontSize.xs, fontWeight: '700' },
  timelineXp: { color: colors.xp, fontSize: fontSize.xs, fontWeight: '700' },
});
