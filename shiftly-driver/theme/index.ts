export const COLORS = {
  background: '#F6F8F3',
  backgroundLight: '#FFFFFF',
  backgroundCard: '#FFFFFF',
  accent: '#6F8F3A',
  accentLight: '#E8F0DA',
  accentDark: '#4F6F24',
  white: '#07142C',
  onDark: '#FFFFFF',
  textPrimary: '#07142C',
  textSecondary: '#526174',
  textMuted: '#8A95A3',
  border: '#E3E8D8',
  borderLight: '#D2DBC5',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  online: '#22C55E',
  offline: '#94A3B8',
  incoming: '#6F8F3A',
  overlay: 'rgba(7, 20, 44, 0.55)',
};

export const FONTS = {
  regular: { fontFamily: 'System', fontWeight: '400' },
  medium: { fontFamily: 'System', fontWeight: '500' },
  semibold: { fontFamily: 'System', fontWeight: '600' },
  bold: { fontFamily: 'System', fontWeight: '700' },
  black: { fontFamily: 'System', fontWeight: '900' },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 20,
  full: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#07142C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#07142C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#07142C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
  },
};
