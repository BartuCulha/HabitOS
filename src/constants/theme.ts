// HabitOS — Mission Control Visual Language
// Dark, sharp, functional. Not a wellness app.

export const colors = {
  // Base
  bg: '#0A0A0F',
  bgCard: '#12121A',
  bgElevated: '#1A1A25',
  bgInput: '#1E1E2A',

  // Text
  textPrimary: '#E8E8F0',
  textSecondary: '#8888A0',
  textMuted: '#555570',

  // Accent
  accent: '#6C5CE7',
  accentLight: '#8B7CF0',
  accentDim: '#3D3580',

  // 4D Dimension Colors
  somatic: '#FF6B6B',
  structural: '#4ECDC4',
  noetic: '#FFD93D',
  sovereign: '#6C5CE7',

  // Status
  success: '#00D68F',
  warning: '#FFB020',
  danger: '#FF4757',
  info: '#3498DB',

  // XP / Rank
  xp: '#FFD700',
  rankGlow: '#6C5CE7',

  // Borders
  border: '#2A2A3A',
  borderLight: '#3A3A4A',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier',
} as const;
