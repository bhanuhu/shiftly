import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Card } from '../../components/Card';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useDriverStore } from '../../store/driverStore';
import { formatCurrency } from '../../utils/format';
import { EARNINGS_HISTORY } from '../../data/dummy';

const { width } = Dimensions.get('window');
const CHART_HEIGHT = 120;

export const EarningsScreen: React.FC = () => {
  const { driver } = useDriverStore();

  if (!driver) return null;

  const maxAmount = Math.max(...EARNINGS_HISTORY.map((e) => e.amount));

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.todayCard}>
          <Text style={styles.todayLabel}>Today's Earnings</Text>
          <Text style={styles.todayValue}>
            {formatCurrency(driver.earnings.today)}
          </Text>
          <View style={styles.todayMeta}>
            <Text style={styles.todayTrips}>
              {driver.totalTrips} trips completed
            </Text>
            <Text style={styles.todayIncentive}>
              +{formatCurrency(driver.earnings.incentives)} incentives
            </Text>
          </View>
        </Card>

        <View style={styles.weekCard}>
          <Card style={styles.weekInner}>
            <Text style={styles.weekLabel}>This Week</Text>
            <Text style={styles.weekValue}>
              {formatCurrency(driver.earnings.weekly)}
            </Text>

            <View style={styles.chart}>
              {EARNINGS_HISTORY.map((day, index) => {
                const height = (day.amount / maxAmount) * CHART_HEIGHT;
                return (
                  <View key={day.day} style={styles.barColumn}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(height, 8),
                          backgroundColor:
                            index === EARNINGS_HISTORY.length - 1
                              ? COLORS.accent
                              : COLORS.borderLight,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.barLabel,
                        index === EARNINGS_HISTORY.length - 1 &&
                          styles.barLabelActive,
                      ]}
                    >
                      {day.day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statItem}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>
              {formatCurrency(driver.earnings.total)}
            </Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </Card>
          <Card style={styles.statItem}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statValue}>
              {formatCurrency(driver.earnings.incentives)}
            </Text>
            <Text style={styles.statLabel}>Incentives</Text>
          </Card>
          <Card style={styles.statItem}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={styles.statValue}>
              {formatCurrency(driver.earnings.pendingPayout)}
            </Text>
            <Text style={styles.statLabel}>Pending Payout</Text>
          </Card>
          <Card style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{driver.totalTrips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </Card>
        </View>

        <Card style={styles.payoutCard}>
          <View style={styles.payoutHeader}>
            <Text style={styles.payoutTitle}>Payout Details</Text>
            <Text style={styles.payoutStatus}>Weekly Settlement</Text>
          </View>
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>UPI ID</Text>
            <Text style={styles.payoutValue}>{driver.upiId}</Text>
          </View>
          <View style={styles.payoutDivider} />
          <View style={styles.payoutRow}>
            <Text style={styles.payoutLabel}>Bank Account</Text>
            <Text style={styles.payoutValue}>
              {driver.bankDetails.accountHolder} - XX{driver.bankDetails.accountNumber.slice(-4)}
            </Text>
          </View>
        </Card>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    ...FONTS.bold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  todayCard: {
    marginBottom: SPACING.md,
  },
  todayLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
    marginBottom: SPACING.xs,
  },
  todayValue: {
    color: COLORS.accent,
    fontSize: 42,
    ...FONTS.bold,
  },
  todayMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  todayTrips: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.medium,
  },
  todayIncentive: {
    color: COLORS.success,
    fontSize: 13,
    ...FONTS.semibold,
  },
  weekCard: {
    marginBottom: SPACING.md,
  },
  weekInner: {},
  weekLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
    marginBottom: SPACING.xs,
  },
  weekValue: {
    color: COLORS.white,
    fontSize: 28,
    ...FONTS.bold,
    marginBottom: SPACING.xl,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 30,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: RADIUS.sm,
    minHeight: 8,
  },
  barLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: SPACING.xs,
    ...FONTS.medium,
  },
  barLabelActive: {
    color: COLORS.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SPACING.sm,
  },
  statValue: {
    color: COLORS.white,
    fontSize: 20,
    ...FONTS.bold,
    marginBottom: 2,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    ...FONTS.medium,
  },
  payoutCard: {
    marginBottom: SPACING.lg,
  },
  payoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  payoutTitle: {
    color: COLORS.white,
    fontSize: 16,
    ...FONTS.bold,
  },
  payoutStatus: {
    color: COLORS.accent,
    fontSize: 12,
    ...FONTS.semibold,
  },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  payoutLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  payoutValue: {
    color: COLORS.white,
    fontSize: 14,
    ...FONTS.semibold,
    flex: 1,
    textAlign: 'right',
  },
  payoutDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
});
