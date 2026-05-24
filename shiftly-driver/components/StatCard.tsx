import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accent = false,
}) => {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, accent && styles.accentIcon]}>
        {icon}
      </View>
      <Text style={[styles.value, accent && styles.accentValue]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.xs,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  accentIcon: {
    backgroundColor: `${COLORS.accent}25`,
  },
  value: {
    color: COLORS.white,
    fontSize: 20,
    ...FONTS.bold,
    marginBottom: 2,
  },
  accentValue: {
    color: COLORS.accent,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.medium,
  },
});
