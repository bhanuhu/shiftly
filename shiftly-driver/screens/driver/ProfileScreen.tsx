import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { DriverAvatar } from '../../components/DriverAvatar';
import { StatusBadge } from '../../components/StatusBadge';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useDriverStore } from '../../store/driverStore';
import { useAuthStore } from '../../store/authStore';
import { formatCurrency } from '../../utils/format';

export const ProfileScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { driver } = useDriverStore();
  const { logout } = useAuthStore();

  if (!driver) return null;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: '🚚',
      label: 'Vehicle Info',
      value: `${driver.vehicleType} · ${driver.vehicleNumber}`,
    },
    {
      icon: '📄',
      label: 'Documents',
      value: 'Aadhaar, Driving License uploaded',
    },
    {
      icon: '💳',
      label: 'Payment Details',
      value: driver.upiId,
    },
    {
      icon: '⭐',
      label: 'Rating',
      value: `${driver.rating} · ${driver.totalTrips} trips`,
    },
    { icon: '❓', label: 'Help & Support', value: 'FAQs, Contact us' },
    { icon: '📋', label: 'Terms of Service', value: 'Version 1.0' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <DriverAvatar
            name={driver.fullName}
            photoUri={driver.profilePhoto}
            size={80}
            rating={driver.rating}
          />
          <Text style={styles.name}>{driver.fullName}</Text>
          <Text style={styles.phone}>{driver.phoneNumber}</Text>
          <StatusBadge status={driver.verificationStatus} />
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statsCard}>
            <Text style={styles.statsNum}>
              {formatCurrency(driver.earnings.total)}
            </Text>
            <Text style={styles.statsLabel}>Total Earnings</Text>
          </Card>
          <Card style={styles.statsCard}>
            <Text style={styles.statsNum}>{driver.totalTrips}</Text>
            <Text style={styles.statsLabel}>Total Trips</Text>
          </Card>
        </View>

        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => {}}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuValue} numberOfLines={1}>
                  {item.value}
                </Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Button
          title="Logout"
          variant="danger"
          size="md"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <Text style={styles.version}>SHIFTLY Driver v1.0.0</Text>
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
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
  },
  name: {
    color: COLORS.white,
    fontSize: 22,
    ...FONTS.bold,
    marginTop: SPACING.md,
  },
  phone: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.regular,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  statsNum: {
    color: COLORS.white,
    fontSize: 22,
    ...FONTS.bold,
  },
  statsLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    ...FONTS.medium,
    marginTop: 2,
  },
  menuCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md + 2,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 28,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    color: COLORS.white,
    fontSize: 15,
    ...FONTS.semibold,
  },
  menuValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    ...FONTS.regular,
    marginTop: 2,
  },
  menuArrow: {
    color: COLORS.textMuted,
    fontSize: 22,
    ...FONTS.medium,
  },
  logoutBtn: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  version: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    ...FONTS.regular,
  },
});
