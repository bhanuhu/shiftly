import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

interface InputProps {
  label?: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  maxLength?: number;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  style?: ViewStyle;
  editable?: boolean;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  secureTextEntry = false,
  multiline = false,
  error,
  style,
  editable = true,
  rightIcon,
  onRightIconPress,
  onPress,
}) => {
  const [focused, setFocused] = useState(false);

  const wrapper = (
    <View
      style={[
        styles.inputWrapper,
        focused && styles.inputFocused,
        error && styles.inputError,
        multiline && { minHeight: 80 },
        !editable && onPress && styles.inputReadonly,
      ]}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          multiline && { minHeight: 80, textAlignVertical: 'top' },
        ]}
      />
      {rightIcon && (
        <TouchableOpacity
          onPress={onRightIconPress || onPress}
          style={styles.iconWrap}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      {!editable && onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
          {wrapper}
        </TouchableOpacity>
      ) : (
        wrapper
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.xs,
    ...FONTS.medium,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
  },
  inputFocused: {
    borderColor: COLORS.accent,
    backgroundColor: '#F7FAF0',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputReadonly: {
    opacity: 0.9,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
    ...FONTS.regular,
  },
  iconWrap: {
    padding: SPACING.sm,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
    ...FONTS.medium,
  },
});
