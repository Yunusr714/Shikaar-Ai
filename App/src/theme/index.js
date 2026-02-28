export const COLORS = {
  primary: '#FF4500',
  primaryLight: '#FF6B3D',
  primaryDark: '#E03E00',
  primaryBg: '#FFF5F0',
  secondary: '#1A1A2E',
  secondaryLight: '#2D2D44',
  white: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceAlt: '#FFF8F5',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E8ECF0',
  borderLight: '#F0F2F5',
  success: '#10B981',
  successBg: '#ECFDF5',
  warning: '#F59E0B',
  warningBg: '#FFFBEB',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  info: '#3B82F6',
  infoBg: '#EFF6FF',
  overlay: 'rgba(0,0,0,0.5)',
  shadow: '#000000',
  gold: '#D4A017',
  goldBg: '#FFF9E6',
};

export const FONTS = {
  light: 'Poppins_300Light',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
};

export const SIZES = {
  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,

  // Border radius
  radiusSm: 8,
  radius: 12,
  radiusMd: 16,
  radiusLg: 20,
  radiusXl: 24,
  radiusFull: 999,

  // Font sizes
  fontXs: 10,
  fontSm: 12,
  fontBase: 14,
  fontMd: 16,
  fontLg: 18,
  fontXl: 20,
  fontXxl: 24,
  fontXxxl: 28,
  fontDisplay: 32,

  // Icon sizes
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 28,

  // Component sizes
  buttonHeight: 54,
  inputHeight: 50,
  tabBarHeight: 70,
  headerHeight: 56,
  avatarSm: 36,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 90,
};

export const SHADOWS = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  button: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
