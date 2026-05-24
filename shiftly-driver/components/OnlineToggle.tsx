import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

export const OnlineToggle: React.FC<OnlineToggleProps> = ({
  isOnline,
  onToggle,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.statusText}>
          {isOnline ? 'Online' : 'Offline'}
        </Text>
        <Text style={styles.subText}>
          {isOnline
            ? 'You are visible to nearby customers'
            : 'You are not accepting orders'}
        </Text>
      </View>
      <View
        style={[
          styles.switchWrap,
          isOnline ? styles.switchOnline : styles.switchOffline,
        ]}
      >
        <Switch
          value={isOnline}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: COLORS.borderLight, true: COLORS.accentDark }}
          thumbColor={isOnline ? COLORS.accent : COLORS.textMuted}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  info: {
    flex: 1,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.regular,
    marginTop: 2,
  },
  switchWrap: {
    padding: 4,
    borderRadius: RADIUS.full,
  },
  switchOnline: {
    backgroundColor: `${COLORS.accent}20`,
  },
  switchOffline: {
    backgroundColor: 'transparent',
  },
});
