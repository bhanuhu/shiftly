import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { StatusBadge } from '../../components/StatusBadge';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useTripStore } from '../../store/tripStore';
import { useDriverStore } from '../../store/driverStore';
import { formatCurrency, formatPhone } from '../../utils/format';
import { TripStatus } from '../../types';

export const TripDetailsScreen: React.FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { tripId } = route.params;
  const { currentTrips, updateTripStatus, completeTrip } = useTripStore();
  const { updateEarnings } = useDriverStore();
  const [loading, setLoading] = useState(false);

  const trip = currentTrips.find((t) => t.id === tripId);
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenBackdrop />
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Trip not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleCall = () => {
    Linking.openURL(`tel:${trip.customerPhone}`);
  };

  const handleNavigate = () => {
    const { latitude, longitude } = trip.pickup;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleProgress = async (nextStatus: TripStatus) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    updateTripStatus(trip.id, nextStatus);

    if (nextStatus === 'delivered') {
      updateEarnings(trip.fare);
      await new Promise((r) => setTimeout(r, 500));
      completeTrip(trip.id);
      Alert.alert('Trip Completed', `You earned ${formatCurrency(trip.fare)}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
    setLoading(false);
  };

  const getNextAction = (): {
    label: string;
    status: TripStatus;
  } | null => {
    switch (trip.status) {
      case 'accepted':
        return { label: 'Arrived at Pickup', status: 'arrived' };
      case 'arrived':
        return { label: 'Confirm Pickup', status: 'picked_up' };
      case 'picked_up':
        return { label: 'Start Trip', status: 'in_transit' };
      case 'in_transit':
        return { label: 'Mark Delivered', status: 'delivered' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <StatusBadge status={trip.status} />
        </View>

        <ProgressIndicator currentStatus={trip.status} />

        <Card style={styles.customerCard}>
          <View style={styles.customerHeader}>
            <View style={styles.customerAvatar}>
              <Text style={styles.customerAvatarText}>
                {trip.customerName.charAt(0)}
              </Text>
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{trip.customerName}</Text>
              <Text style={styles.customerPhone}>
                {formatPhone(trip.customerPhone)}
              </Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
              <Text style={styles.callIcon}>📞</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationDotPickup} />
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress}>{trip.pickup.address}</Text>
            </View>
          </View>
          <View style={styles.locationConnector} />
          <View style={styles.locationRow}>
            <View style={styles.locationDotDrop} />
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>Drop</Text>
              <Text style={styles.locationAddress}>{trip.drop.address}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.detailCard}>
          <Text style={styles.detailTitle}>Delivery Details</Text>
          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Item</Text>
              <Text style={styles.detailValue}>{trip.itemCategory}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.detailValue}>{trip.itemDescription}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Distance</Text>
              <Text style={styles.detailValue}>{trip.distance} km</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Est. Time</Text>
              <Text style={styles.detailValue}>
                {trip.estimatedDeliveryTime}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.fareCard}>
          <Text style={styles.fareLabel}>Trip Fare</Text>
          <Text style={styles.fareValue}>{formatCurrency(trip.fare)}</Text>
        </Card>

        {trip.isShared && (
          <Card style={styles.sharedCard}>
            <Text style={styles.sharedText}>
              This is a shared delivery. Additional pickup/drop may be
              available.
            </Text>
          </Card>
        )}

        {nextAction && trip.status !== 'delivered' && (
          <View style={styles.actions}>
            <Button
              title="Open Navigation"
              variant="outline"
              size="md"
              onPress={handleNavigate}
              style={styles.actionBtn}
            />
            <Button
              title={nextAction.label}
              variant="primary"
              size="md"
              onPress={() => handleProgress(nextAction.status)}
              loading={loading}
              style={styles.actionBtn}
            />
          </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    ...FONTS.medium,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    ...FONTS.semibold,
  },
  customerCard: {
    marginBottom: SPACING.md,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  customerAvatarText: {
    color: COLORS.textPrimary,
    fontSize: 20,
    ...FONTS.bold,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: COLORS.white,
    fontSize: 17,
    ...FONTS.bold,
  },
  customerPhone: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.regular,
    marginTop: 2,
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${COLORS.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIcon: {
    fontSize: 20,
  },
  locationCard: {
    marginBottom: SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDotPickup: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    marginTop: 4,
    marginRight: SPACING.md,
  },
  locationDotDrop: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.error,
    marginTop: 4,
    marginRight: SPACING.md,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    ...FONTS.medium,
    marginBottom: 2,
  },
  locationAddress: {
    color: COLORS.white,
    fontSize: 15,
    ...FONTS.medium,
  },
  locationConnector: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.borderLight,
    marginLeft: 5,
    marginVertical: 6,
  },
  detailCard: {
    marginBottom: SPACING.md,
  },
  detailTitle: {
    color: COLORS.white,
    fontSize: 16,
    ...FONTS.bold,
    marginBottom: SPACING.md,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: SPACING.md,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    ...FONTS.medium,
    marginBottom: 2,
  },
  detailValue: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.semibold,
  },
  fareCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  fareLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
    ...FONTS.medium,
  },
  fareValue: {
    color: COLORS.accent,
    fontSize: 28,
    ...FONTS.bold,
  },
  sharedCard: {
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.warning}30`,
    backgroundColor: `${COLORS.warning}08`,
  },
  sharedText: {
    color: COLORS.warning,
    fontSize: 13,
    ...FONTS.medium,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  actionBtn: {
    flex: 1,
  },
});
