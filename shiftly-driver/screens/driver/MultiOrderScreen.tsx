import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Card } from '../../components/Card';
import { TripCard } from '../../components/TripCard';
import { Button } from '../../components/Button';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useTripStore } from '../../store/tripStore';
import { formatCurrency } from '../../utils/format';

export const MultiOrderScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { currentTrips } = useTripStore();

  const totalEarnings = currentTrips.reduce((sum, t) => sum + t.fare, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Deliveries</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{currentTrips.length}</Text>
        </View>
      </View>

      {currentTrips.length > 1 && (
        <Card style={styles.batchCard}>
          <View style={styles.batchIconWrap}>
            <Text style={styles.batchIcon}>📦</Text>
          </View>
          <View style={styles.batchInfo}>
            <Text style={styles.batchTitle}>Multi-Order Active</Text>
            <Text style={styles.batchSubtitle}>
              You are carrying {currentTrips.length} orders
            </Text>
          </View>
          <View style={styles.batchEarnings}>
            <Text style={styles.batchEarningsLabel}>Total</Text>
            <Text style={styles.batchEarningsValue}>
              {formatCurrency(totalEarnings)}
            </Text>
          </View>
        </Card>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>
          {currentTrips.length === 0
            ? 'No active deliveries'
            : `Active Deliveries (${currentTrips.length})`}
        </Text>

        {currentTrips.map((trip, index) => (
          <View key={trip.id}>
            {currentTrips.length > 1 && (
              <View style={styles.orderIndex}>
                <View style={styles.orderIndexDot}>
                  <Text style={styles.orderIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.orderIndexLine} />
              </View>
            )}
            <TripCard
              trip={trip}
              onPress={() =>
                navigation.navigate('TripDetails', { tripId: trip.id })
              }
            />
          </View>
        ))}

        {currentTrips.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🛵</Text>
            <Text style={styles.emptyTitle}>No Active Deliveries</Text>
            <Text style={styles.emptySubtext}>
              Accept a delivery request to see it here.
            </Text>
          </Card>
        )}

        {currentTrips.length > 0 && currentTrips.length < 3 && (
          <Card style={styles.capacityTip}>
            <Text style={styles.capacityIcon}>💡</Text>
            <View style={styles.capacityContent}>
              <Text style={styles.capacityTitle}>Capacity Available</Text>
              <Text style={styles.capacityText}>
                Your vehicle has space for {3 - currentTrips.length} more
                order{3 - currentTrips.length > 1 ? 's' : ''}. Enable multi-order to
                earn more.
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    ...FONTS.semibold,
    marginRight: SPACING.lg,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    ...FONTS.bold,
    flex: 1,
  },
  countBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.full,
    minWidth: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  countText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    ...FONTS.bold,
  },
  batchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.accent}30`,
  },
  batchIconWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  batchIcon: {
    fontSize: 22,
  },
  batchInfo: {
    flex: 1,
  },
  batchTitle: {
    color: COLORS.accent,
    fontSize: 15,
    ...FONTS.bold,
  },
  batchSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.regular,
    marginTop: 2,
  },
  batchEarnings: {
    alignItems: 'flex-end',
  },
  batchEarningsLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    ...FONTS.medium,
  },
  batchEarningsValue: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.semibold,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  orderIndex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderIndexDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  orderIndexText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    ...FONTS.bold,
  },
  orderIndexLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    ...FONTS.regular,
  },
  capacityTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  capacityIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    marginTop: 2,
  },
  capacityContent: {
    flex: 1,
  },
  capacityTitle: {
    color: COLORS.white,
    fontSize: 15,
    ...FONTS.semibold,
    marginBottom: 4,
  },
  capacityText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.regular,
    lineHeight: 18,
  },
});
