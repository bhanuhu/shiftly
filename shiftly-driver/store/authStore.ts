import { create } from 'zustand';
import { apiClient, mapBackendDriver } from '../services/api';
import { useDriverStore } from './driverStore';

interface AuthStore {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  otpSent: boolean;
  isNewUser: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<boolean>;
  setNewUser: (value: boolean) => void;
  completeRegistration: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  phoneNumber: null,
  otpSent: false,
  isNewUser: false,
  isLoading: false,
  accessToken: null,
  refreshToken: null,
  sendOtp: async (phone: string) => {
    set({ isLoading: true });
    await apiClient.sendOtp(phone);
    set({
      phoneNumber: phone,
      otpSent: true,
      isLoading: false,
    });
  },
  verifyOtp: async (otp: string) => {
    set({ isLoading: true });
    const phone = get().phoneNumber;
    if (!phone) {
      set({ isLoading: false });
      return false;
    }
    try {
      const tokenPair = await apiClient.verifyOtp(phone, otp);
      let isNewUser = true;
      try {
        const backendDriver = await apiClient.getDriverProfile();
        useDriverStore
          .getState()
          .setDriver(mapBackendDriver(backendDriver, tokenPair.user.phone, tokenPair.user.name));
        isNewUser = false;
      } catch {
        isNewUser = true;
      }
      set({
        isAuthenticated: true,
        isLoading: false,
        isNewUser,
        accessToken: tokenPair.access_token,
        refreshToken: tokenPair.refresh_token,
      });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },
  setNewUser: (value: boolean) => set({ isNewUser: value }),
  completeRegistration: () => {
    set({ isNewUser: false, isAuthenticated: true });
  },
  logout: () => {
    apiClient.setTokens({ accessToken: null, refreshToken: null });
    set({
      isAuthenticated: false,
      phoneNumber: null,
      otpSent: false,
      isNewUser: false,
      accessToken: null,
      refreshToken: null,
    });
  },
}));
