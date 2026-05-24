import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';
import { Trip } from '../types';
import { formatCurrency } from '../utils/format';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <StatusBadge status={trip.status} />
          <Text style={styles.fare}>{formatCurrency(trip.fare)}</Text>
        </View>

        <View style={styles.locationRow}>
          <View style={styles.dotWrap}>
            <View style={[styles.dot, styles.pickupDot]} />
            <View style={styles.line} />
            <View style={[styles.dot, styles.dropDot]} />
          </View>
          <View style={styles.addresses}>
            <Text style={styles.address} numberOfLines={1}>
              {trip.pickup.address}
            </Text>
            <View style={styles.addressSpacer} />
            <Text style={styles.address} numberOfLines={1}>
              {trip.drop.address}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Item</Text>
            <Text style={styles.footerValue}>{trip.itemCategory}</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Distance</Text>
            <Text style={styles.footerValue}>{trip.distance} km</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerLabel}>Customer</Text>
            <Text style={styles.footerValue} numberOfLines={1}>
              {trip.customerName}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  fare: {
    color: COLORS.accent,
    fontSize: 18,
    ...FONTS.bold,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  dotWrap: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pickupDot: {
    backgroundColor: COLORS.accent,
  },
  dropDot: {
    backgroundColor: COLORS.error,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 3,
  },
  addresses: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  address: {
    color: COLORS.white,
    fontSize: 14,
    ...FONTS.medium,
  },
  addressSpacer: {
    height: 16,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  footerItem: {
    flex: 1,
  },
  footerLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 2,
  },
  footerValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.semibold,
  },
});
