"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

import { ApiResponse } from "@/types";

type AdminUser = {
  id: string;
  name: string;
  role: "admin";
  phoneOrEmail: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  login: (phoneOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
};

type TokenPair = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string | null;
    role: "admin";
    phone: string;
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      login: async (phoneOrEmail, password) => {
        const response = await axios.post<ApiResponse<TokenPair>>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/api/v1/auth/admin-login`,
          {
            phone_or_email: phoneOrEmail,
            password
          }
        );
        const tokenPair = response.data.data;
        set({
          accessToken: tokenPair.access_token,
          refreshToken: tokenPair.refresh_token,
          user: {
            id: tokenPair.user.id,
            name: tokenPair.user.name ?? "SHIFTLY Admin",
            role: "admin",
            phoneOrEmail
          }
        });
      },
      logout: () => set({ accessToken: null, refreshToken: null, user: null })
    }),
    { name: "shiftly-admin-auth" }
  )
);
