import { create } from 'zustand';
import { Driver, DriverStatus } from '../types';
import { DUMMY_DRIVER } from '../data/dummy';
import { apiClient, mapBackendDriver } from '../services/api';

interface DriverStore {
  driver: Driver | null;
  isLoading: boolean;
  setDriver: (driver: Driver) => void;
  updateStatus: (status: DriverStatus) => void;
  updateEarnings: (amount: number) => void;
  updateVerificationStatus: (status: Driver['verificationStatus']) => void;
  updateProfilePhoto: (uri: string) => void;
  setDriverFromForm: (data: Partial<Driver>) => void;
  registerDriver: (data: Partial<Driver>) => Promise<void>;
  loadDummyDriver: () => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  driver: null,
  isLoading: false,
  setDriver: (driver) => set({ driver }),
  updateStatus: (status) =>
    set((state) => {
      if (state.driver) {
        apiClient.updateDriverStatus(status === 'online').catch(() => undefined);
      }
      return {
        driver: state.driver ? { ...state.driver, status } : null,
      };
    }),
  updateEarnings: (amount) =>
    set((state) => ({
      driver: state.driver
        ? {
            ...state.driver,
            earnings: {
              ...state.driver.earnings,
              today: state.driver.earnings.today + amount,
              total: state.driver.earnings.total + amount,
            },
          }
        : null,
    })),
  updateVerificationStatus: (status) =>
    set((state) => ({
      driver: state.driver ? { ...state.driver, verificationStatus: status } : null,
    })),
  updateProfilePhoto: (uri) =>
    set((state) => ({
      driver: state.driver ? { ...state.driver, profilePhoto: uri } : null,
    })),
  setDriverFromForm: (data) =>
    set((state) => ({
      driver: state.driver ? { ...state.driver, ...data } : null,
    })),
  registerDriver: async (data) => {
    set({ isLoading: true });
    const phoneNumber = data.phoneNumber ?? '';
    const backendDriver = await apiClient.registerDriver({
      fullName: data.fullName ?? 'SHIFTLY Driver',
      vehicleType: data.vehicleType ?? 'E-Rickshaw',
      vehicleNumber: data.vehicleNumber ?? '',
      aadhaarUrl: data.aadhaarUrl,
      licenseUrl: data.drivingLicenseUrl,
      profilePhoto: data.profilePhoto,
    });
    set({
      driver: {
        ...mapBackendDriver(backendDriver, phoneNumber, data.fullName),
        upiId: data.upiId ?? '',
        bankDetails: data.bankDetails ?? {
          accountHolder: '',
          accountNumber: '',
          ifscCode: '',
        },
      },
      isLoading: false,
    });
  },
  loadDummyDriver: () => set({ driver: DUMMY_DRIVER }),
}));
