import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { BrandLogo } from '../../components/BrandLogo';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useAuthStore } from '../../store/authStore';

export const PhoneLoginScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOtp } = useAuthStore();

  const handleSendOtp = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    await sendOtp(cleaned);
    setLoading(false);
    navigation.navigate('OTPVerify');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <BrandLogo size={244} />
            </View>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Driver access</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.formHeader}>
              <Text style={styles.eyebrow}>Welcome back</Text>
              <Text style={styles.welcome}>Sign in to start delivering</Text>
              <Text style={styles.subtitle}>
                Enter your mobile number and we will send a secure OTP.
              </Text>
            </View>

            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              maxLength={14}
              style={styles.phoneInput}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOtp}
              loading={loading}
              size="lg"
              style={styles.cta}
            />

            <View style={styles.helperRow}>
              <View style={styles.helperDot} />
              <Text style={styles.helperText}>Secure OTP verification</Text>
            </View>

            <Text style={styles.disclaimer}>
              By continuing, you agree to SHIFTLY's Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xxl,
    paddingTop: 34,
    paddingBottom: 28,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginRight: SPACING.sm,
  },
  statusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.semibold,
  },
  formSection: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.lg,
  },
  formHeader: {
    marginBottom: SPACING.xl,
  },
  eyebrow: {
    color: COLORS.accent,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    ...FONTS.bold,
  },
  welcome: {
    color: COLORS.textPrimary,
    fontSize: 26,
    lineHeight: 32,
    ...FONTS.black,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    ...FONTS.regular,
  },
  phoneInput: {
    marginBottom: SPACING.md,
  },
  cta: {
    marginTop: SPACING.sm,
    borderRadius: RADIUS.lg,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  helperDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
    marginRight: SPACING.sm,
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: 13,
    ...FONTS.medium,
  },
  disclaimer: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: SPACING.lg,
    lineHeight: 17,
    ...FONTS.regular,
  },
});
