import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Button } from '../../components/Button';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useAuthStore } from '../../store/authStore';
import { useDriverStore } from '../../store/driverStore';

export const VerificationPendingScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { isAuthenticated } = useAuthStore();
  const { driver } = useDriverStore();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleCheckStatus = () => {
    useAuthStore.getState().completeRegistration();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>✓</Text>
          </View>
        </View>

        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          We're reviewing your documents{dots} This usually takes 24-48 hours.
          We'll notify you once your account is verified.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Under Review</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Documents</Text>
            <Text style={styles.infoValue}>3/3 Submitted</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle</Text>
            <Text style={styles.infoValue}>
              {driver?.vehicleType || 'E-Rickshaw'}
            </Text>
          </View>
        </View>

        <Text style={styles.help}>
          Need help? Contact support at support@shiftly.in
        </Text>

        <Button
          title="Check Status (Demo: Skip to App)"
          variant="primary"
          size="lg"
          onPress={handleCheckStatus}
          style={styles.cta}
        />

        <Button
          title="Back to Home"
          variant="ghost"
          size="sm"
          onPress={() => useAuthStore.getState().completeRegistration()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  iconWrap: {
    marginBottom: SPACING.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.warning + '20',
    borderWidth: 3,
    borderColor: COLORS.warning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: COLORS.warning,
    fontSize: 36,
    ...FONTS.bold,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    ...FONTS.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    ...FONTS.regular,
    marginBottom: SPACING.xxl,
  },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.medium,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: 14,
    ...FONTS.semibold,
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}15`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
    marginRight: SPACING.xs,
  },
  statusText: {
    color: COLORS.warning,
    fontSize: 12,
    ...FONTS.semibold,
  },
  help: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    ...FONTS.regular,
    marginBottom: SPACING.xxl,
  },
  cta: {
    width: '100%',
    marginBottom: SPACING.md,
  },
});
