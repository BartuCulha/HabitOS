import type {
  Habit, ShadowEntry, Artifact, Pattern, PinnedInsight,
  Conversation, ConversationMessage, FourDScan, ExecutionBlock,
  EnergyEntry, Phase, DailyScore, ArtifactDomain, BlockCategory,
  ISOSMode, AIProvider,
} from '../types';

const uid = 'demo';
const today = new Date().toISOString().split('T')[0];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

// ── Habits ──────────────────────────────────────────
export const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', userId: uid, name: 'Morning Activation Protocol', category: 'physical', xpWeight: 15, minimumViableVersion: '5 min stretch', why: 'Sets circadian rhythm', phaseId: null, isActive: true, sortOrder: 0, createdAt: '' },
  { id: 'h2', userId: uid, name: 'Cold Exposure', category: 'physical', xpWeight: 10, minimumViableVersion: 'Cold face wash', why: 'Norepinephrine + discipline', phaseId: null, isActive: true, sortOrder: 1, createdAt: '' },
  { id: 'h3', userId: uid, name: 'Sleep Protocol', category: 'physical', xpWeight: 20, minimumViableVersion: 'Screens off by midnight', why: 'Foundation of everything', phaseId: null, isActive: true, sortOrder: 2, createdAt: '' },
  { id: 'h4', userId: uid, name: 'Creative Block (30min+)', category: 'creative', xpWeight: 15, minimumViableVersion: '15 min creative touch', why: 'Music is non-negotiable', phaseId: null, isActive: true, sortOrder: 3, createdAt: '' },
  { id: 'h5', userId: uid, name: 'Structured Meals', category: 'sovereign', xpWeight: 10, minimumViableVersion: 'At least 2 real meals', why: 'Counter grazing pattern', phaseId: null, isActive: true, sortOrder: 4, createdAt: '' },
  { id: 'h6', userId: uid, name: 'Daily Audit', category: 'structural', xpWeight: 5, minimumViableVersion: '4D evening scan', why: 'Close the loop', phaseId: null, isActive: true, sortOrder: 5, createdAt: '' },
  { id: 'h7', userId: uid, name: 'Reading (20min+)', category: 'creative', xpWeight: 10, minimumViableVersion: '10 min reading', why: 'Feed the noetic dimension', phaseId: null, isActive: true, sortOrder: 6, createdAt: '' },
  { id: 'h8', userId: uid, name: 'Movement / Training', category: 'physical', xpWeight: 15, minimumViableVersion: 'Walk 15 min', why: 'Body is the vehicle', phaseId: null, isActive: true, sortOrder: 7, createdAt: '' },
];

// ── Shadow Patterns ─────────────────────────────────
export const DEFAULT_SHADOW_PATTERNS: Pattern[] = [
  { id: 'p1', userId: uid, name: 'Perfectionism', description: 'Refusing to start or ship until conditions are ideal', typicalTrigger: 'Complex creative task or public-facing work', typicalPayoff: 'Avoids judgment and failure', cost: 'Nothing ships. Stagnation disguised as standards.', countermove: 'Ship ugly. Set a 25-min timer and publish whatever exists.', frequencyLast30: 12, trend: 'stable', createdAt: '' },
  { id: 'p2', userId: uid, name: 'Analysis Paralysis', description: 'Researching endlessly instead of deciding', typicalTrigger: 'Multiple good options with unclear winner', typicalPayoff: 'Feels productive without commitment risk', cost: 'Days lost to "research" that never converts to action', countermove: 'Two-minute rule: if you\'ve researched >15 min, pick one and commit for 48h.', frequencyLast30: 8, trend: 'decreasing', createdAt: '' },
  { id: 'p3', userId: uid, name: 'Grazing', description: 'Unstructured snacking instead of real meals', typicalTrigger: 'Boredom, stress, or avoiding a hard task', typicalPayoff: 'Dopamine micro-hits, procrastination cover', cost: 'Energy crashes, weight gain, broken meal structure', countermove: 'Prep meals in advance. When urge hits, drink water and set 10-min timer.', frequencyLast30: 15, trend: 'increasing', createdAt: '' },
  { id: 'p4', userId: uid, name: 'Morning Latency', description: 'Lying in bed scrolling instead of activating', typicalTrigger: 'Poor sleep, no clear morning priority', typicalPayoff: 'Comfort, avoidance of cold start', cost: 'First 2 hours wasted. Sets low-agency tone for entire day.', countermove: 'Phone charges outside bedroom. First action: feet on floor, cold water.', frequencyLast30: 10, trend: 'stable', createdAt: '' },
  { id: 'p5', userId: uid, name: 'Avoidance', description: 'Redirecting to easy tasks when hard ones loom', typicalTrigger: 'Ambiguous or emotionally charged task', typicalPayoff: 'Feels productive (inbox zero!) without real progress', cost: 'Important work stays undone. Anxiety compounds.', countermove: 'Name the avoidance out loud. Do 5 min of the hard thing.', frequencyLast30: 7, trend: 'decreasing', createdAt: '' },
  { id: 'p6', userId: uid, name: 'Dopamine Seeking', description: 'Compulsive checking of feeds, notifications, novelty', typicalTrigger: 'Low stimulation, transition moments, fatigue', typicalPayoff: 'Instant gratification, social validation', cost: 'Fractured attention, shallow work, time evaporation', countermove: 'Block apps during focus blocks. Replace with 2-min breathing.', frequencyLast30: 18, trend: 'increasing', createdAt: '' },
];

// ── Shadow Log Entries ──────────────────────────────
export const SAMPLE_SHADOW_ENTRIES: ShadowEntry[] = [
  { id: 'se1', userId: uid, patternName: 'Grazing', trigger: 'Bored while waiting for build', intensity: 6, intervention: 'Drank water, went for walk', resolved: true, date: today, createdAt: '' },
  { id: 'se2', userId: uid, patternName: 'Morning Latency', trigger: 'Stayed up late, no alarm urgency', intensity: 7, intervention: null, resolved: false, date: daysAgo(1), createdAt: '' },
  { id: 'se3', userId: uid, patternName: 'Dopamine Seeking', trigger: 'Transition between tasks', intensity: 5, intervention: 'Closed phone, did 2 min breathwork', resolved: true, date: daysAgo(1), createdAt: '' },
  { id: 'se4', userId: uid, patternName: 'Perfectionism', trigger: 'About to publish blog post', intensity: 8, intervention: 'Set timer, shipped as-is', resolved: true, date: daysAgo(2), createdAt: '' },
  { id: 'se5', userId: uid, patternName: 'Avoidance', trigger: 'Tax paperwork due', intensity: 9, intervention: null, resolved: false, date: daysAgo(3), createdAt: '' },
];

// ── Artifacts ───────────────────────────────────────
export const SAMPLE_ARTIFACTS: Artifact[] = [
  { id: 'a1', userId: uid, name: 'Lo-fi Beat Pack Vol.3', description: '8 beats, mastered and uploaded to Spotify', domain: 'music', xpEarned: 50, date: daysAgo(2), createdAt: '' },
  { id: 'a2', userId: uid, name: 'HabitOS MVP', description: 'React Native app scaffold with 4D scanner', domain: 'code', xpEarned: 50, date: daysAgo(1), createdAt: '' },
  { id: 'a3', userId: uid, name: 'Shadow Integration Essay', description: '2000-word essay on shadow work methodology', domain: 'writing', xpEarned: 50, date: daysAgo(5), createdAt: '' },
  { id: 'a4', userId: uid, name: 'Home Studio Reorganization', description: 'Optimized cable management, new monitor placement', domain: 'physical', xpEarned: 50, date: daysAgo(7), createdAt: '' },
  { id: 'a5', userId: uid, name: 'Personal Knowledge Base', description: 'Obsidian vault with 50+ interlinked notes', domain: 'system', xpEarned: 50, date: daysAgo(10), createdAt: '' },
];

// ── Journal Entries ─────────────────────────────────
export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  date: string;
  createdAt: string;
}

export const SAMPLE_JOURNAL: JournalEntry[] = [
  { id: 'j1', userId: uid, content: 'Noticed the grazing pattern kicks in hardest around 3pm. Need to preload an afternoon execution block.', date: today, createdAt: '' },
  { id: 'j2', userId: uid, content: 'First day hitting all 8 habits. The MVD system really works — even on a 4/10 somatic day I could do the minimum versions.', date: daysAgo(1), createdAt: '' },
  { id: 'j3', userId: uid, content: 'Pantheon Council session was surprisingly useful. The Strategos perspective helped me see I was optimizing tactics without a clear campaign objective.', date: daysAgo(3), createdAt: '' },
  { id: 'j4', userId: uid, content: 'Sleep protocol is the keystone. When I nail it, everything else follows. When I don\'t, I\'m fighting uphill all day.', date: daysAgo(5), createdAt: '' },
];

// ── Decisions ───────────────────────────────────────
export interface Decision {
  id: string;
  userId: string;
  title: string;
  reasoning: string;
  date: string;
  createdAt: string;
}

export const SAMPLE_DECISIONS: Decision[] = [
  { id: 'd1', userId: uid, title: 'Switched to blood type diet protocol', reasoning: 'Three weeks of tracking showed clear energy correlation. Type O protocol eliminates wheat and dairy — both correlated with afternoon crashes in my data.', date: daysAgo(3), createdAt: '' },
  { id: 'd2', userId: uid, title: 'Reduced habit count from 12 to 8', reasoning: 'Completion rate was 45% with 12 habits. The Architect mode analysis showed diminishing returns past 8. Better to nail 8 than half-ass 12.', date: daysAgo(7), createdAt: '' },
  { id: 'd3', userId: uid, title: 'Morning phone stays outside bedroom', reasoning: 'Morning Latency pattern averaged 45 min/day. Single environmental change: phone charges in kitchen. Latency dropped to ~10 min.', date: daysAgo(14), createdAt: '' },
];

// ── Execution Blocks ────────────────────────────────
export const SAMPLE_BLOCKS: ExecutionBlock[] = [
  { id: 'eb1', userId: uid, category: 'creative', startTime: `${today}T09:00:00`, endTime: `${today}T10:30:00`, durationMinutes: 90, note: 'Beat production session — finished 2 loops', xpEarned: 10, createdAt: '' },
  { id: 'eb2', userId: uid, category: 'structural', startTime: `${today}T11:00:00`, endTime: `${today}T12:00:00`, durationMinutes: 60, note: 'HabitOS UI development', xpEarned: 10, createdAt: '' },
  { id: 'eb3', userId: uid, category: 'learning', startTime: `${daysAgo(1)}T14:00:00`, endTime: `${daysAgo(1)}T15:00:00`, durationMinutes: 60, note: 'Reading: Mastery by Robert Greene', xpEarned: 10, createdAt: '' },
  { id: 'eb4', userId: uid, category: 'physical', startTime: `${daysAgo(1)}T07:00:00`, endTime: `${daysAgo(1)}T08:00:00`, durationMinutes: 60, note: 'Gym session — push day', xpEarned: 10, createdAt: '' },
];

// ── Phases ──────────────────────────────────────────
export const SAMPLE_PHASES: Phase[] = [
  { id: 'ph1', userId: uid, name: 'Foundation Reset', description: 'Rebuild core habits and tracking systems', goal: 'Consistent 80%+ habit completion for 30 days', isActive: true, startDate: daysAgo(14), endDate: null, createdAt: '' },
  { id: 'ph2', userId: uid, name: 'Creative Sprint', description: 'Ship 3 music projects in 6 weeks', goal: '3 released tracks + 1 beat pack', isActive: false, startDate: '', endDate: null, createdAt: '' },
];

// ── 30-Day 4D Scan History ──────────────────────────
export const SCAN_HISTORY: FourDScan[] = Array.from({ length: 30 }, (_, i) => ({
  id: `scan-${i}`,
  userId: uid,
  date: daysAgo(29 - i),
  timeOfDay: 'morning' as const,
  somatic: Math.max(1, Math.min(10, Math.round(5 + Math.sin(i * 0.5) * 2 + (Math.random() - 0.5) * 3))),
  structural: Math.max(1, Math.min(10, Math.round(6 + Math.cos(i * 0.4) * 2 + (Math.random() - 0.5) * 2))),
  noetic: Math.max(1, Math.min(10, Math.round(5.5 + Math.sin(i * 0.3) * 1.5 + (Math.random() - 0.5) * 3))),
  sovereign: Math.max(1, Math.min(10, Math.round(6 + Math.sin(i * 0.6) * 2 + (Math.random() - 0.5) * 2))),
  createdAt: '',
}));

// ── Conversations ───────────────────────────────────
const MOCK_RESPONSES: Record<ISOSMode, string[]> = {
  default: [
    "Based on your 4D scan today, your somatic dimension is running low. Consider front-loading physical habits before they compound into evening avoidance.",
    "Your habit completion rate has been trending up over the past week. The MVD system seems to be working well for you.",
  ],
  warlord: [
    "Stop theorizing. You have 90 minutes before your energy window closes. Pick the hardest creative task and execute. No research, no planning — production only. Move.",
    "Your shadow log shows 3 grazing episodes this week. That's not a habit — it's a retreat. Install the countermove or accept the cost. There is no middle ground.",
  ],
  architect: [
    "Looking at your system architecture: the morning routine has a single point of failure — sleep quality. I'd recommend adding a degraded-mode pathway that still preserves the first 3 keystone habits even on poor sleep days.",
    "Your execution block allocation is 60% creative, 10% structural. The system is becoming fragile — consider a 40/30/20/10 split across creative/structural/physical/learning.",
  ],
  sovereign: [
    "The question isn't whether to ship the beat pack. The question is: who are you becoming by shipping it? Each artifact is a vote for an identity. What identity does this artifact reinforce?",
    "You've been operating in reactive mode for 3 days. Sovereign state requires proactive scheduling. Block tomorrow's first 2 hours before you sleep tonight.",
  ],
  noetic: [
    "Interesting pattern emerging: your highest noetic scores correlate with days where you read before creating. The input→processing→output pipeline seems to have a 24-hour latency for you.",
    "The essay you wrote on shadow integration shows synthetic thinking across multiple frameworks. That's rare. Consider: what would happen if you applied that same cross-domain synthesis to your music?",
  ],
  somatic: [
    "Your body is sending clear signals. Three consecutive days of somatic scores below 5 typically precedes a crash. Prioritize: sleep 8+ hours, cold exposure in the morning, no screens after 10pm.",
    "Heart rate variability and somatic scores track together in your data. Your afternoon energy dips may be postprandial — try the blood type protocol meal timing: largest meal at noon, light dinner by 6pm.",
  ],
  shadow: [
    "The grazing pattern isn't really about food. It's a displacement activity for the anxiety you feel when creative work gets ambiguous. The real pattern: uncertainty → discomfort → oral soothing → guilt → more avoidance. Break the chain at step 2.",
    "Perfectionism and avoidance are the same pattern wearing different masks. One says 'not yet good enough,' the other says 'not yet ready to try.' Both serve the same master: fear of being seen as inadequate.",
  ],
  pantheon: [
    "**[Strategos]** Campaign assessment: you're winning tactical battles but losing strategic ground. Three shipped artifacts this month, but none advance the primary objective. Recommend: define your Q1 campaign target and filter all execution blocks through it.\n\n**[Bio-Digital Lab]** Somatic data shows a 72-hour stress cycle that correlates with your creative output spikes. You're running on cortisol, not capability. Recommend: forced recovery day every 4th day.\n\n**[Ethereal Archive]** Cross-referencing your journal entries with historical pattern data: you're in a phase transition. The old system is dying but the new one isn't born yet. This discomfort is not a bug — it's the signal that transformation is happening. Don't retreat to comfort.",
  ],
};

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  { id: 'c1', userId: uid, provider: 'claude', mode: 'architect', title: 'System Architecture Review', tags: ['system', 'planning'], createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'c2', userId: uid, provider: 'claude', mode: 'shadow', title: 'Grazing Pattern Deep Dive', tags: ['shadow', 'nutrition'], createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 'c3', userId: uid, provider: 'gemini', mode: 'pantheon', title: 'Pantheon Council: Q1 Strategy', tags: ['strategy', 'pantheon'], createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  { id: 'c4', userId: uid, provider: 'claude', mode: 'warlord', title: 'Execution Protocol', tags: ['execution', 'productivity'], createdAt: daysAgo(5), updatedAt: daysAgo(5) },
];

export const SAMPLE_MESSAGES: ConversationMessage[] = [
  { id: 'm1', conversationId: 'c1', role: 'user', content: 'Analyze my current habit system. Am I over-indexed on any category?', provider: 'claude', isPinned: false, createdAt: '' },
  { id: 'm2', conversationId: 'c1', role: 'assistant', content: MOCK_RESPONSES.architect[1], provider: 'claude', isPinned: true, createdAt: '' },
  { id: 'm3', conversationId: 'c2', role: 'user', content: 'I grazed 3 times today despite eating a full lunch. What\'s really going on?', provider: 'claude', isPinned: false, createdAt: '' },
  { id: 'm4', conversationId: 'c2', role: 'assistant', content: MOCK_RESPONSES.shadow[0], provider: 'claude', isPinned: true, createdAt: '' },
  { id: 'm5', conversationId: 'c3', role: 'user', content: 'Council, I need a strategic assessment of my current trajectory.', provider: 'gemini', isPinned: false, createdAt: '' },
  { id: 'm6', conversationId: 'c3', role: 'assistant', content: MOCK_RESPONSES.pantheon[0], provider: 'gemini', isPinned: false, createdAt: '' },
];

// ── Pinned Insights ─────────────────────────────────
export const SAMPLE_INSIGHTS: PinnedInsight[] = [
  { id: 'pi1', userId: uid, content: 'Your execution block allocation is 60% creative, 10% structural. The system is becoming fragile.', source: 'claude', conversationId: 'c1', topic: 'System Design', createdAt: daysAgo(1) },
  { id: 'pi2', userId: uid, content: 'The grazing pattern isn\'t really about food. It\'s a displacement activity for creative ambiguity anxiety.', source: 'claude', conversationId: 'c2', topic: 'Shadow Work', createdAt: daysAgo(2) },
  { id: 'pi3', userId: uid, content: 'Perfectionism and avoidance are the same pattern wearing different masks.', source: 'claude', conversationId: 'c2', topic: 'Shadow Work', createdAt: daysAgo(2) },
];

// ── Chronos Report ──────────────────────────────────
export const SAMPLE_CHRONOS_REPORT = {
  weekOf: daysAgo(7),
  currentWeek: {
    avgScore: 72,
    habitsCompleted: 45,
    habitsTotal: 56,
    blocksCompleted: 9,
    artifactsShipped: 2,
    avgSomatic: 5.8,
    avgStructural: 6.4,
    avgNoetic: 5.2,
    avgSovereign: 6.8,
  },
  lastWeek: {
    avgScore: 65,
    habitsCompleted: 38,
    habitsTotal: 56,
    blocksCompleted: 7,
    artifactsShipped: 1,
    avgSomatic: 5.2,
    avgStructural: 5.9,
    avgNoetic: 5.5,
    avgSovereign: 6.1,
  },
  growthVectors: [
    'Habit completion up 18% week-over-week',
    'Sovereign dimension trending upward for 3 consecutive weeks',
    'Shadow log usage increasing — better pattern awareness',
  ],
  stagnationPoints: [
    'Noetic dimension flat — reading habit inconsistent',
    'Creative blocks bunched to mornings — afternoon creative capacity untapped',
    'Sleep protocol compliance dropping on weekends',
  ],
  correlations: [
    'Sleep quality → Next-day sovereign score: r=0.78',
    'Morning activation → Daily habit completion rate: r=0.72',
    'Shadow logging → Pattern frequency reduction (7-day lag): r=-0.65',
  ],
  recommendation: 'Focus on sleep protocol consistency through the weekend. Your data shows the Monday slump is primarily sleep-debt driven. Consider a "Sunday Reset Protocol" with enforced 10pm screens-off.',
  shadowFrequency: {
    'Grazing': 4,
    'Morning Latency': 3,
    'Dopamine Seeking': 5,
    'Perfectionism': 2,
    'Avoidance': 1,
  },
};

// ── Correlations ────────────────────────────────────
export interface Correlation {
  id: string;
  factorA: string;
  factorB: string;
  coefficient: number;
  direction: 'positive' | 'negative';
  insight: string;
}

export const SAMPLE_CORRELATIONS: Correlation[] = [
  { id: 'cor1', factorA: 'Sleep quality', factorB: 'Sovereign score', coefficient: 0.78, direction: 'positive', insight: 'Better sleep directly predicts higher agency and decision quality next day' },
  { id: 'cor2', factorA: 'Morning activation', factorB: 'Daily completion rate', coefficient: 0.72, direction: 'positive', insight: 'Completing the morning protocol is the strongest predictor of a productive day' },
  { id: 'cor3', factorA: 'Shadow logging', factorB: 'Pattern frequency', coefficient: 0.65, direction: 'negative', insight: 'Simply logging shadow patterns reduces their occurrence within a week' },
  { id: 'cor4', factorA: 'Execution blocks', factorB: 'Artifact output', coefficient: 0.81, direction: 'positive', insight: 'More focused blocks = more shipped artifacts. No blocks = nothing ships.' },
  { id: 'cor5', factorA: 'Screen time (evening)', factorB: 'Next-day somatic score', coefficient: 0.59, direction: 'negative', insight: 'Evening screen exposure degrades sleep quality and next-day physical state' },
];

// ── Milestones ──────────────────────────────────────
export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
  xpAtTime: number;
  rankAtTime: string;
}

export const SAMPLE_MILESTONES: Milestone[] = [
  { id: 'ms1', title: 'System Online', description: 'HabitOS initialized. First 4D scan completed.', date: daysAgo(30), xpAtTime: 0, rankAtTime: 'Novice' },
  { id: 'ms2', title: 'First Full Day', description: 'All 8 keystone habits completed in a single day.', date: daysAgo(21), xpAtTime: 95, rankAtTime: 'Novice' },
  { id: 'ms3', title: 'Operator Rank', description: 'Reached 100 XP. Promoted from Novice to Operator.', date: daysAgo(18), xpAtTime: 100, rankAtTime: 'Operator' },
  { id: 'ms4', title: 'Shadow Awakening', description: 'First shadow pattern resolved with logged intervention.', date: daysAgo(15), xpAtTime: 180, rankAtTime: 'Operator' },
  { id: 'ms5', title: '7-Day Streak', description: 'Seven consecutive days of 60%+ habit completion.', date: daysAgo(10), xpAtTime: 320, rankAtTime: 'Operator' },
  { id: 'ms6', title: 'Architect Rank', description: 'Reached 500 XP. System thinking unlocked.', date: daysAgo(5), xpAtTime: 500, rankAtTime: 'Architect' },
  { id: 'ms7', title: 'First Artifact', description: 'Lo-fi Beat Pack Vol.3 shipped to the world.', date: daysAgo(2), xpAtTime: 580, rankAtTime: 'Architect' },
];

// ── Daily Score History ─────────────────────────────
export const DAILY_SCORES: DailyScore[] = Array.from({ length: 30 }, (_, i) => ({
  id: `ds-${i}`,
  userId: uid,
  date: daysAgo(29 - i),
  score: Math.max(20, Math.min(100, Math.round(60 + Math.sin(i * 0.4) * 15 + (Math.random() - 0.5) * 20))),
  xpEarned: Math.round(30 + Math.random() * 50),
  habitsCompleted: Math.round(3 + Math.random() * 5),
  habitsTotal: 8,
  blocksCompleted: Math.round(Math.random() * 3),
  artifactsShipped: Math.random() > 0.8 ? 1 : 0,
  createdAt: '',
}));

// ── Energy Entries ──────────────────────────────────
export const SAMPLE_ENERGY: EnergyEntry[] = [
  { id: 'e1', userId: uid, date: today, morning: 7, afternoon: 5, evening: 4, createdAt: '' },
  { id: 'e2', userId: uid, date: daysAgo(1), morning: 6, afternoon: 6, evening: 5, createdAt: '' },
];

// ── Mock AI Response Generator ──────────────────────
export function getMockAIResponse(mode: ISOSMode, _userMessage: string): string {
  const responses = MOCK_RESPONSES[mode];
  return responses[Math.floor(Math.random() * responses.length)];
}

// ── Sobriety ────────────────────────────────────────
export const SOBRIETY_START_DATE = daysAgo(23);
