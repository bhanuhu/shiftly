import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { DriverStatus, TripStatus, VerificationStatus } from '../types';

interface StatusBadgeProps {
  status: DriverStatus | TripStatus | VerificationStatus;
}

const getColors = (status: string) => {
  switch (status) {
    case 'online':
    case 'approved':
    case 'delivered':
      return { bg: '#22C55E20', text: COLORS.success };
    case 'offline':
    case 'rejected':
      return { bg: '#EF444420', text: COLORS.error };
    case 'pending':
    case 'accepted':
      return { bg: '#F59E0B20', text: COLORS.warning };
    case 'in_transit':
    case 'picked_up':
      return { bg: `${COLORS.accent}20`, text: COLORS.accent };
    case 'arrived':
      return { bg: '#3B82F620', text: '#3B82F6' };
    default:
      return { bg: '#94A3B820', text: COLORS.textSecondary };
  }
};

const formatLabel = (status: string) => {
  switch (status) {
    case 'picked_up':
      return 'Picked Up';
    case 'in_transit':
      return 'In Transit';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { bg, text } = getColors(status);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: text }]} />
      <Text style={[styles.label, { color: text }]}>{formatLabel(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: SPACING.xs,
  },
  label: {
    fontSize: 12,
    ...FONTS.semibold,
  },
});
