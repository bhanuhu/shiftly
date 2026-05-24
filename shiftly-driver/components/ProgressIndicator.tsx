import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { TripStatus } from '../types';

interface ProgressIndicatorProps {
  currentStatus: TripStatus;
}

const STEPS: { key: TripStatus; label: string }[] = [
  { key: 'accepted', label: 'Accepted' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
];

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStatus,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <View key={step.key} style={styles.stepRow}>
            <View style={styles.stepContent}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.circleCompleted,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                {isCompleted && (
                  <Text style={styles.check}>✓</Text>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  isCompleted && styles.labelCompleted,
                  isCurrent && styles.labelCurrent,
                ]}
              >
                {step.label}
              </Text>
            </View>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.line,
                  index < currentIndex && styles.lineCompleted,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepContent: {
    alignItems: 'center',
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  circleCompleted: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  circleCurrent: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.backgroundCard,
  },
  check: {
    color: COLORS.textPrimary,
    fontSize: 14,
    ...FONTS.bold,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    ...FONTS.medium,
    textAlign: 'center',
  },
  labelCompleted: {
    color: COLORS.accent,
  },
  labelCurrent: {
    color: COLORS.textPrimary,
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  lineCompleted: {
    backgroundColor: COLORS.accent,
  },
});
