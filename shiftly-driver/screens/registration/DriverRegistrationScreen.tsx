import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { ScreenBackdrop } from '../../components/ScreenBackdrop';
import { VEHICLE_TYPES } from '../../data/dummy';
import { useAuthStore } from '../../store/authStore';
import { useDriverStore } from '../../store/driverStore';
import { VehicleType } from '../../types';

const NO_VEHICLE_NUMBER_TYPES: VehicleType[] = ['Rickshaw'];

export const DriverRegistrationScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { phoneNumber } = useAuthStore();
  const { registerDriver } = useDriverStore();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('E-Rickshaw');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [upiId, setUpiId] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step1Attempted, setStep1Attempted] = useState(false);
  const [step2Attempted, setStep2Attempted] = useState(false);
  const [vehiclePickerOpen, setVehiclePickerOpen] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState({
    photo: false,
    aadhaar: false,
    license: false,
  });

  const needsVehicleNumber = !NO_VEHICLE_NUMBER_TYPES.includes(vehicleType);

  const hasIdDoc = uploadedDocs.aadhaar || uploadedDocs.license;
  const allRequiredDocs = uploadedDocs.photo && hasIdDoc;

  const isStep1Valid =
    fullName.trim().length >= 3 &&
    (!needsVehicleNumber || vehicleNumber.trim().length >= 4) &&
    allRequiredDocs;

  const isStep2Valid =
    upiId.trim().length > 0 ||
    (accountHolder.trim().length > 0 &&
      accountNumber.trim().length > 0 &&
      ifscCode.trim().length > 0);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await registerDriver({
        fullName,
        phoneNumber: phoneNumber ?? '',
        vehicleType,
        vehicleNumber: needsVehicleNumber ? vehicleNumber : 'NOT-REQUIRED',
        profilePhoto: uploadedDocs.photo ? 'local://profile-photo' : null,
        aadhaarUrl: uploadedDocs.aadhaar ? 'local://aadhaar' : null,
        drivingLicenseUrl: uploadedDocs.license ? 'local://license' : null,
        upiId,
        bankDetails: {
          accountHolder,
          accountNumber,
          ifscCode,
        },
      });
      navigation.replace('VerificationPending');
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickFromCamera = async (type: 'photo' | 'aadhaar' | 'license') => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Denied', 'Camera access is required to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setUploadedDocs((prev) => ({ ...prev, [type]: true }));
    }
  };

  const pickFromGallery = async (type: 'photo' | 'aadhaar' | 'license') => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission Denied', 'Gallery access is required to select a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setUploadedDocs((prev) => ({ ...prev, [type]: true }));
    }
  };

  const pickFile = (type: 'photo' | 'aadhaar' | 'license') => {
    Alert.alert(
      'Upload Document',
      `Choose option for ${type}`,
      [
        {
          text: 'Take Photo',
          onPress: () => pickFromCamera(type),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickFromGallery(type),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackdrop />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.stepPill}>
              <Text style={styles.stepIndicator}>Step {step} of 2</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
            <View
              style={[
                styles.progressFill,
                step === 1 && styles.progressFillInactive,
              ]}
            />
          </View>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Please fill in your details to start earning with SHIFTLY
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <Card style={styles.formCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>Driver details</Text>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.sectionDescription}>
                  Keep these details accurate so pickup and payout support can
                  reach you quickly.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.avatarUpload}
                activeOpacity={0.8}
                onPress={() => pickFile('photo')}
              >
                <View
                  style={[
                    styles.avatarCircle,
                    uploadedDocs.photo && styles.avatarCircleDone,
                  ]}
                >
                  <Text style={styles.avatarIcon}>
                    {uploadedDocs.photo ? '✓' : '👤'}
                  </Text>
                </View>
                <Text style={styles.avatarTitle}>Profile Photo</Text>
                <Text style={styles.avatarHint}>
                  {uploadedDocs.photo
                    ? 'Uploaded successfully'
                  : 'Tap to add a clear face photo'}
                </Text>
              </TouchableOpacity>
              {step1Attempted && !uploadedDocs.photo && (
                <Text style={styles.avatarError}>Profile Photo is required</Text>
              )}

              <Input
                label="Full Name *"
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Rajesh Kumar"
                error={
                  step1Attempted && fullName.trim().length < 3
                    ? 'Full Name is required'
                    : undefined
                }
              />

              <Input
                label="Vehicle Type *"
                value={vehicleType}
                editable={false}
                rightIcon={
                  <Text style={styles.selectChevron}>⌄</Text>
                }
                onPress={() => setVehiclePickerOpen(true)}
              />

              {needsVehicleNumber ? (
                <Input
                  label="Vehicle Number *"
                  value={vehicleNumber}
                  onChangeText={setVehicleNumber}
                  placeholder="e.g. DL-01-ER-1234"
                  error={
                    step1Attempted && vehicleNumber.trim().length < 4
                      ? 'Vehicle Number is required'
                      : undefined
                  }
                />
              ) : (
                <Input
                  label="Vehicle Number"
                  value="Not required for Rickshaw"
                  editable={false}
                />
              )}

              <View style={styles.documentHeader}>
                <View>
                  <Text style={styles.sectionEyebrow}>Verification</Text>
                  <Text style={styles.sectionTitle}>Documents</Text>
                </View>
                <Text style={styles.docCount}>
                  {allRequiredDocs ? 'Ready' : 'Required'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  uploadedDocs.aadhaar && styles.uploadBtnDone,
                ]}
                onPress={() => pickFile('aadhaar')}
              >
                <View
                  style={[
                    styles.uploadIcon,
                    uploadedDocs.aadhaar && styles.uploadIconDone,
                  ]}
                >
                  <Text style={styles.uploadIconText}>
                    {uploadedDocs.aadhaar ? '✓' : '🆔'}
                  </Text>
                </View>
                <View style={styles.uploadInfo}>
                  <Text style={styles.uploadLabel}>Aadhaar Card</Text>
                  <Text style={styles.uploadHint}>
                    {uploadedDocs.aadhaar
                      ? 'Uploaded successfully'
                      : 'Front & Back (PDF or Image)'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.uploadStatus,
                    uploadedDocs.aadhaar && styles.uploadStatusDone,
                  ]}
                >
                  {uploadedDocs.aadhaar ? 'Done' : 'Add'}
                </Text>
              </TouchableOpacity>

              <View style={styles.inlineOr}>
                <View style={styles.inlineOrLine} />
                <Text style={styles.inlineOrText}>OR</Text>
                <View style={styles.inlineOrLine} />
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  uploadedDocs.license && styles.uploadBtnDone,
                ]}
                onPress={() => pickFile('license')}
              >
                <View
                  style={[
                    styles.uploadIcon,
                    uploadedDocs.license && styles.uploadIconDone,
                  ]}
                >
                  <Text style={styles.uploadIconText}>
                    {uploadedDocs.license ? '✓' : '🚗'}
                  </Text>
                </View>
                <View style={styles.uploadInfo}>
                  <Text style={styles.uploadLabel}>Driving License</Text>
                  <Text style={styles.uploadHint}>
                    {uploadedDocs.license
                      ? 'Uploaded successfully'
                      : 'Upload front & back'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.uploadStatus,
                    uploadedDocs.license && styles.uploadStatusDone,
                  ]}
                >
                  {uploadedDocs.license ? 'Done' : 'Add'}
                </Text>
              </TouchableOpacity>

              {step1Attempted && !hasIdDoc && (
                <Text style={styles.docError}>
                  Aadhaar Card or Driving License is required
                </Text>
              )}
            </Card>
          )}

          {step === 2 && (
            <Card style={styles.formCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionEyebrow}>Payout setup</Text>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <Text style={styles.sectionDescription}>
                  Add UPI for fastest payouts, or enter bank details for weekly
                  settlement.
                </Text>
              </View>

              <Input
                label="UPI ID (Optional)"
                value={upiId}
                onChangeText={setUpiId}
                placeholder="e.g. rajesh@upi"
              />

              <Text style={styles.orDivider}>OR</Text>

              <Input
                label="Bank Account Holder Name"
                value={accountHolder}
                onChangeText={setAccountHolder}
                placeholder="Full name as per bank"
              />

              <Input
                label="Bank Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="XXXXXXXX1234"
                keyboardType="numeric"
                maxLength={18}
              />

              <Input
                label="IFSC Code"
                value={ifscCode}
                onChangeText={setIfscCode}
                placeholder="e.g. SBIN0012345"
              />
              <View style={styles.secureNote}>
                <Text style={styles.secureNoteTitle}>Secure payout review</Text>
                <Text style={styles.secureNoteText}>
                  Your payment details are used only for driver settlements.
                </Text>
              </View>
              {step2Attempted && !isStep2Valid && (
                <Text style={styles.docError}>
                  Please provide at least UPI or bank details.
                </Text>
              )}
            </Card>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={step === 1 ? 'Next: Payment Details' : 'Submit for Review'}
            onPress={() => {
              if (step === 1) {
                setStep1Attempted(true);
                if (!isStep1Valid) {
                  return;
                }
                setStep(2);
              } else {
                setStep2Attempted(true);
                if (!isStep2Valid) {
                  return;
                }
                handleSubmit();
              }
            }}
            loading={loading}
            size="lg"
          />
        </View>

        <Modal
          transparent
          visible={vehiclePickerOpen}
          animationType="fade"
          onRequestClose={() => setVehiclePickerOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setVehiclePickerOpen(false)}
          >
            <Pressable style={styles.vehicleSheet}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Select Vehicle Type</Text>
              <Text style={styles.sheetSubtitle}>
                Choose the vehicle you will use for deliveries.
              </Text>
              {VEHICLE_TYPES.map((vehicle) => {
                const selected = vehicleType === vehicle.value;
                return (
                  <TouchableOpacity
                    key={vehicle.value}
                    activeOpacity={0.8}
                    style={[
                      styles.vehicleOption,
                      selected && styles.vehicleOptionSelected,
                    ]}
                    onPress={() => {
                      setVehicleType(vehicle.value);
                      setVehiclePickerOpen(false);
                    }}
                  >
                    <View
                      style={[
                        styles.vehicleRadio,
                        selected && styles.vehicleRadioSelected,
                      ]}
                    >
                      {selected && <View style={styles.vehicleRadioDot} />}
                    </View>
                    <Text
                      style={[
                        styles.vehicleOptionText,
                        selected && styles.vehicleOptionTextSelected,
                      ]}
                    >
                      {vehicle.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  stepPill: {
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  stepIndicator: {
    color: COLORS.textSecondary,
    fontSize: 12,
    ...FONTS.semibold,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  progressFill: {
    flex: 1,
    height: 5,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textPrimary,
  },
  progressFillInactive: {
    backgroundColor: COLORS.border,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    lineHeight: 34,
    ...FONTS.black,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    ...FONTS.regular,
    marginTop: SPACING.xs,
    lineHeight: 21,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
  },
  formCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.xl,
  },
  sectionEyebrow: {
    color: COLORS.accentDark,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
    ...FONTS.bold,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 19,
    ...FONTS.black,
  },
  sectionDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: SPACING.xs,
    ...FONTS.regular,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.lg,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  avatarUpload: {
    alignItems: 'center',
    backgroundColor: '#F8FAF3',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarCircleDone: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}10`,
  },
  avatarIcon: {
    fontSize: 30,
  },
  avatarTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    ...FONTS.bold,
  },
  avatarHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 3,
    ...FONTS.regular,
  },
  avatarError: {
    color: COLORS.error,
    fontSize: 12,
    textAlign: 'center',
    marginTop: -SPACING.md,
    marginBottom: SPACING.lg,
    ...FONTS.medium,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAF3',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadIconText: {
    fontSize: 20,
  },
  uploadInfo: {
    flex: 1,
  },
  uploadLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    ...FONTS.bold,
  },
  uploadHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    ...FONTS.regular,
    marginTop: 2,
  },
  orDivider: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -SPACING.xs,
    marginBottom: SPACING.lg,
    ...FONTS.medium,
  },
  uploadBtnDone: {
    borderColor: COLORS.success,
    backgroundColor: '#F3F8EE',
  },
  uploadIconDone: {
    backgroundColor: `${COLORS.success}20`,
  },
  docCount: {
    color: COLORS.accentDark,
    fontSize: 12,
    backgroundColor: `${COLORS.accent}20`,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    ...FONTS.semibold,
  },
  docError: {
    color: COLORS.error,
    fontSize: 13,
    ...FONTS.medium,
    marginTop: -SPACING.sm,
    marginBottom: SPACING.sm,
  },
  inlineOr: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -SPACING.xs,
    marginBottom: SPACING.md,
  },
  inlineOrLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  inlineOrText: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 1,
    marginHorizontal: SPACING.md,
    ...FONTS.bold,
  },
  footer: {
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  uploadStatus: {
    color: COLORS.textSecondary,
    fontSize: 12,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.backgroundCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginLeft: SPACING.sm,
    ...FONTS.semibold,
  },
  uploadStatusDone: {
    color: COLORS.success,
    borderColor: `${COLORS.success}30`,
    backgroundColor: `${COLORS.success}10`,
  },
  selectChevron: {
    color: COLORS.textSecondary,
    fontSize: 20,
    marginTop: -3,
    ...FONTS.bold,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  vehicleSheet: {
    backgroundColor: COLORS.backgroundCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.xxl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  sheetTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    ...FONTS.black,
  },
  sheetSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
    ...FONTS.regular,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F8FAF3',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  vehicleOptionSelected: {
    borderColor: COLORS.textPrimary,
    backgroundColor: '#EEF4E4',
  },
  vehicleRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  vehicleRadioSelected: {
    borderColor: COLORS.textPrimary,
  },
  vehicleRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textPrimary,
  },
  vehicleOptionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    ...FONTS.semibold,
  },
  vehicleOptionTextSelected: {
    color: COLORS.textPrimary,
    ...FONTS.bold,
  },
  secureNote: {
    borderRadius: RADIUS.lg,
    backgroundColor: '#F8FAF3',
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  secureNoteTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 2,
    ...FONTS.bold,
  },
  secureNoteText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    ...FONTS.regular,
  },
});
