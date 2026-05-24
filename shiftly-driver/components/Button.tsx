import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const bgColor = isPrimary
    ? COLORS.textPrimary
    : isSecondary
    ? COLORS.backgroundCard
    : isOutline
    ? 'transparent'
    : isGhost
    ? 'transparent'
    : isDanger
    ? COLORS.error
    : COLORS.accent;

  const textColor =
    isPrimary
      ? COLORS.onDark
    : isOutline
      ? COLORS.textPrimary
    : isGhost
      ? COLORS.textSecondary
    : isDanger
      ? COLORS.onDark
      : COLORS.white;

  const borderColor = isOutline ? COLORS.borderLight : 'transparent';

  const height = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: isOutline ? 1.5 : 0,
          height,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              { color: textColor, fontSize, marginLeft: icon ? SPACING.sm : 0 },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.sm,
  },
  text: {
    ...FONTS.semibold,
  },
});
