import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { useDriverStore } from '../../store/driverStore';
import { useTripStore } from '../../store/tripStore';
import { OnlineToggle } from '../../components/OnlineToggle';
import { StatCard } from '../../components/StatCard';
import { TripCard } from '../../components/TripCard';
import { IncomingJobCard } from '../../components/IncomingJobCard';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { formatCurrency } from '../../utils/format';
import { DUMMY_SHARED_JOB } from '../../data/dummy';
import { Trip } from '../../types';
import { incomingJobFromMessage } from '../../services/api';

const { width } = Dimensions.get('window');
const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:8000';

export const HomeDashboardScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { driver, updateStatus } = useDriverStore();
  const {
    incomingJob,
    currentTrips,
    sharedJob,
    showSharedJob,
    acceptJob,
    rejectJob,
    acceptSharedJob,
    declineSharedJob,
    setIncomingJob,
  } = useTripStore();

  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (incomingJob) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [incomingJob]);

  useEffect(() => {
    if (!driver || driver.status !== 'online') return;
    const socket = new WebSocket(`${WS_BASE_URL}/ws/driver/${driver.id}`);
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.event === 'new_booking_request') {
          setIncomingJob(incomingJobFromMessage(message));
        }
      } catch {
        // Ignore malformed realtime messages.
      }
    };
    return () => socket.close();
  }, [driver?.id, driver?.status, setIncomingJob]);

  if (!driver) return null;

  const handleAcceptJob = () => {
    if (!incomingJob) return;
    const trip: Trip = {
      id: incomingJob.id,
      customerName: 'Amit Sharma',
      customerPhone: '+91 98765 12345',
      pickup: incomingJob.pickup,
      drop: incomingJob.drop,
      itemCategory: incomingJob.itemCategory,
      itemDescription: 'General delivery',
      fare: incomingJob.fare,
      distance: parseFloat(incomingJob.distance),
      estimatedDeliveryTime: incomingJob.estimatedDeliveryTime,
      status: 'accepted',
      isShared: false,
      createdAt: new Date().toISOString(),
    };
    acceptJob(incomingJob, trip);
  };

  const handleAcceptShared = () => {
    if (!sharedJob) return;
    const trip: Trip = {
      id: sharedJob.id,
      customerName: 'Suresh Patel',
      customerPhone: '+91 98765 56789',
      pickup: sharedJob.pickup,
      drop: sharedJob.drop,
      itemCategory: sharedJob.itemCategory,
      itemDescription: 'Shared delivery',
      fare: sharedJob.fare,
      distance: parseFloat(sharedJob.distance),
      estimatedDeliveryTime: sharedJob.estimatedDeliveryTime,
      status: 'accepted',
      isShared: true,
      createdAt: new Date().toISOString(),
    };
    acceptSharedJob(sharedJob, trip);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenBackdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Good morning 👋</Text>
              <Text style={styles.driverName}>{driver.fullName}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.profileIcon}>
              <Text style={styles.profileInitial}>
                {driver.fullName.charAt(0)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <OnlineToggle
          isOnline={driver.status === 'online'}
          onToggle={(val) => updateStatus(val ? 'online' : 'offline')}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}
          contentContainerStyle={styles.statsContent}
        >
          <StatCard
            label="Today's Earnings"
            value={formatCurrency(driver.earnings.today)}
            icon={<Text style={styles.statIcon}>💰</Text>}
            accent
          />
          <StatCard
            label="Trips Today"
            value={String(driver.totalTrips)}
            icon={<Text style={styles.statIcon}>🚚</Text>}
          />
          <StatCard
            label="Active"
            value={String(currentTrips.length)}
            icon={<Text style={styles.statIcon}>📦</Text>}
          />
        </ScrollView>

        {incomingJob && (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <IncomingJobCard
              job={incomingJob}
              onAccept={handleAcceptJob}
              onReject={rejectJob}
            />
          </Animated.View>
        )}

        {showSharedJob && sharedJob && (
          <Card variant="elevated" style={styles.sharedCard}>
            <View style={styles.sharedHeader}>
              <Text style={styles.sharedIcon}>🔄</Text>
              <Text style={styles.sharedTitle}>
                Compatible Shared Order Available
              </Text>
            </View>
            <Text style={styles.sharedSubtext}>
              Same pickup zone · Similar drop direction · Vehicle capacity
              available
            </Text>
            <View style={styles.sharedEarnings}>
              <Text style={styles.sharedEarningLabel}>Extra Earnings</Text>
              <Text style={styles.sharedEarningValue}>
                +{formatCurrency(sharedJob.extraEarnings || 0)}
              </Text>
            </View>
            <View style={styles.sharedActions}>
              <Button
                title="Decline"
                variant="ghost"
                size="sm"
                onPress={declineSharedJob}
                style={{ flex: 1 }}
              />
              <Button
                title="Accept"
                variant="primary"
                size="sm"
                onPress={handleAcceptShared}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        {!incomingJob && !showSharedJob && currentTrips.length === 0 && (
          <Card style={styles.idleCard}>
            <Text style={styles.idleIcon}>🛵</Text>
            <Text style={styles.idleTitle}>Waiting for Requests</Text>
            <Text style={styles.idleSubtext}>
              New delivery requests will appear here when nearby customers place
              orders.
            </Text>
          </Card>
        )}

        {currentTrips.length > 0 && (
          <View style={styles.tripsSection}>
            <Text style={styles.sectionTitle}>
              Current Deliveries ({currentTrips.length})
            </Text>
            {currentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() =>
                  navigation.navigate('TripDetails', { tripId: trip.id })
                }
              />
            ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {},
  greetingText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.regular,
  },
  driverName: {
    color: COLORS.white,
    fontSize: 22,
    ...FONTS.bold,
  },
  profileBtn: {
    marginLeft: SPACING.lg,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: COLORS.accent,
    fontSize: 20,
    ...FONTS.bold,
  },
  statsRow: {
    marginVertical: SPACING.lg,
    marginHorizontal: -SPACING.lg,
  },
  statsContent: {
    paddingHorizontal: SPACING.lg,
  },
  statIcon: {
    fontSize: 18,
  },
  sharedCard: {
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.warning}40`,
  },
  sharedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sharedIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  sharedTitle: {
    color: COLORS.warning,
    fontSize: 16,
    ...FONTS.bold,
  },
  sharedSubtext: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.regular,
    marginBottom: SPACING.md,
  },
  sharedEarnings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}10`,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sharedEarningLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  sharedEarningValue: {
    color: COLORS.warning,
    fontSize: 18,
    ...FONTS.bold,
  },
  sharedActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  idleCard: {
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: SPACING.lg,
  },
  idleIcon: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  idleTitle: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  idleSubtext: {
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    ...FONTS.regular,
    maxWidth: '80%',
  },
  tripsSection: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    ...FONTS.bold,
    marginBottom: SPACING.md,
  },
});
