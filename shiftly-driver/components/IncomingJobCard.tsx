import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';
import { Card } from './Card';
import { Button } from './Button';
import { IncomingJob } from '../types';
import { formatCurrency } from '../utils/format';

const { width } = Dimensions.get('window');

interface IncomingJobCardProps {
  job: IncomingJob;
  onAccept: () => void;
  onReject: () => void;
}

export const IncomingJobCard: React.FC<IncomingJobCardProps> = ({
  job,
  onAccept,
  onReject,
}) => {
  return (
    <Card variant="elevated" style={styles.card}>
      <View style={styles.pulseDot}>
        <View style={styles.pulseInner} />
      </View>
      <Text style={styles.title}>New Delivery Request</Text>

      <View style={styles.quickRow}>
        <View style={styles.quickItem}>
          <Text style={styles.quickLabel}>Distance</Text>
          <Text style={styles.quickValue}>{job.distance}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.quickItem}>
          <Text style={styles.quickLabel}>Est. Time</Text>
          <Text style={styles.quickValue}>{job.estimatedDeliveryTime}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.quickItem}>
          <Text style={styles.quickLabel}>Category</Text>
          <Text style={styles.quickValue}>{job.itemCategory}</Text>
        </View>
      </View>

      {job.isShared && job.extraEarnings && (
        <View style={styles.sharedBanner}>
          <Text style={styles.sharedText}>
            Compatible shared order · +{formatCurrency(job.extraEarnings)} extra
          </Text>
        </View>
      )}

      <View style={styles.locationSection}>
        <View style={styles.locationRow}>
          <View style={[styles.locDot, styles.pickupDot]} />
          <View style={styles.locContent}>
            <Text style={styles.locLabel}>Pickup</Text>
            <Text style={styles.locAddress} numberOfLines={1}>
              {job.pickup.address}
            </Text>
          </View>
        </View>
        <View style={styles.connector} />
        <View style={styles.locationRow}>
          <View style={[styles.locDot, styles.dropDot]} />
          <View style={styles.locContent}>
            <Text style={styles.locLabel}>Drop</Text>
            <Text style={styles.locAddress} numberOfLines={1}>
              {job.drop.address}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.fareRow}>
        <Text style={styles.fareLabel}>Estimated Fare</Text>
        <Text style={styles.fareValue}>{formatCurrency(job.fare)}</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Decline"
          variant="outline"
          size="md"
          onPress={onReject}
          style={styles.actionBtn}
        />
        <Button
          title="Accept"
          variant="primary"
          size="md"
          onPress={onAccept}
          style={styles.actionBtn}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: SPACING.lg,
    borderWidth: 1,
    borderColor: `${COLORS.accent}30`,
  },
  pulseDot: {
    position: 'absolute',
    top: -6,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: `${COLORS.accent}30`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: SPACING.lg,
  },
  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  quickItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 2,
  },
  quickValue: {
    color: COLORS.white,
    fontSize: 14,
    ...FONTS.semibold,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  sharedBanner: {
    backgroundColor: `${COLORS.warning}15`,
    borderWidth: 1,
    borderColor: `${COLORS.warning}30`,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  sharedText: {
    color: COLORS.warning,
    fontSize: 13,
    ...FONTS.semibold,
    textAlign: 'center',
  },
  locationSection: {
    marginBottom: SPACING.lg,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
    marginRight: SPACING.md,
  },
  pickupDot: {
    backgroundColor: COLORS.accent,
  },
  dropDot: {
    backgroundColor: COLORS.error,
  },
  locContent: {
    flex: 1,
  },
  locLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    ...FONTS.medium,
    marginBottom: 2,
  },
  locAddress: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  connector: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.borderLight,
    marginLeft: 4,
    marginVertical: 4,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  fareLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  fareValue: {
    color: COLORS.accent,
    fontSize: 24,
    ...FONTS.bold,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionBtn: {
    flex: 1,
  },
});
