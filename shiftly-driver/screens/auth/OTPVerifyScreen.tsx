import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Button } from '../../components/Button';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { useAuthStore } from '../../store/authStore';

export const OTPVerifyScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);
  const { verifyOtp, isLoading, phoneNumber } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Incomplete', 'Please enter the full OTP.');
      return;
    }
    const success = await verifyOtp(code);
    if (!success) {
      Alert.alert('Invalid OTP', 'Please try again. Use 123456 for testing.');
    }
  };

  const handleResend = () => {
    if (timer === 0) {
      setTimer(30);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.topSection}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{' '}
            <Text style={styles.phone}>{phoneNumber || '+91 XXXXX XXXXX'}</Text>
          </Text>
        </View>

        <View style={styles.otpSection}>
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                style={[
                  styles.otpInput,
                  digit ? styles.otpFilled : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Didn't receive code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
              <Text
                style={[
                  styles.resendLink,
                  timer > 0 && styles.resendDisabled,
                ]}
              >
                Resend {timer > 0 ? `(${timer}s)` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Verify OTP"
          onPress={handleVerify}
          loading={isLoading}
          size="lg"
          style={styles.cta}
        />
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
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xl,
  },
  backBtn: {
    marginBottom: SPACING.xxl,
  },
  backText: {
    color: COLORS.accent,
    fontSize: 16,
    ...FONTS.semibold,
  },
  topSection: {
    marginBottom: 40,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    ...FONTS.bold,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    ...FONTS.regular,
    lineHeight: 22,
  },
  phone: {
    color: COLORS.accent,
    ...FONTS.semibold,
  },
  otpSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  otpRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    color: COLORS.white,
    fontSize: 22,
    textAlign: 'center',
    ...FONTS.bold,
  },
  otpFilled: {
    borderColor: COLORS.accent,
    backgroundColor: `${COLORS.accent}10`,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.regular,
  },
  resendLink: {
    color: COLORS.accent,
    fontSize: 14,
    ...FONTS.semibold,
  },
  resendDisabled: {
    color: COLORS.textMuted,
  },
  cta: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});
