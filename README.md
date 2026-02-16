# HabitOS

A personal AI-powered life operating system. Track, analyze, and gamify every dimension of your existence through a unified command console.

## Stack

- **React Native (Expo)** — iOS + Android
- **Supabase** — Auth, Postgres, real-time
- **Claude** — Primary AI (OAuth)
- **Gemini** — Secondary AI (OAuth)

## Architecture

```
src/
├── components/       # Reusable UI components
├── constants/        # Theme, config
├── navigation/       # Tab + stack navigators
├── screens/          # Screen components
│   ├── Home/         # Command Center
│   ├── AIConsole/    # Claude/Gemini chat
│   ├── Tracking/     # Habits, blocks, metrics
│   ├── Observatory/  # Chronos, patterns, correlations
│   ├── Archive/      # Artifacts, journals, insights
│   └── Settings/     # Config, phases, habits editor
├── services/         # Supabase, AI clients
├── stores/           # Zustand state management
├── types/            # TypeScript definitions
└── utils/            # Helpers
```

## Phases

### Phase 1 — Foundation (Current)
- [x] Project scaffold
- [x] Navigation (5-tab layout)
- [x] Command Center with 4D Scanner
- [x] Habit checklist with MVD support
- [x] XP/Rank status bar
- [x] Quick action buttons
- [ ] Supabase auth (Google/Apple OAuth)
- [ ] Supabase DB schema + migrations
- [ ] Persistent habit data

### Phase 2 — Core Intelligence
- [ ] Claude OAuth integration
- [ ] Gemini OAuth integration
- [ ] AI Console chat UI
- [ ] Context injection engine
- [ ] ISOS mode selection
- [ ] Pantheon Council mode
- [ ] Execution block timer
- [ ] Shadow log capture
- [ ] Artifact logging

### Phase 3 — Pattern Observatory
- [ ] Chronos weekly reports
- [ ] Correlation dashboard (3-day threshold)
- [ ] Pattern library
- [ ] Streak analytics
- [ ] Milestone timeline
- [ ] Insight pinning

### Phase 4 — Polish & Integrations
- [ ] Apple Health integration
- [ ] Calendar awareness
- [ ] Notifications
- [ ] Data export
- [ ] Voice input
- [ ] App Store submission

## Run

```bash
cd HabitOS
npm start
# Scan QR with Expo Go app
```
