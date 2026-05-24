import { Driver, IncomingJob, Trip, TripStatus, VehicleType } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

type TokenPair = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    phone: string;
    name: string | null;
    role: 'driver' | 'customer' | 'admin';
  };
};

let accessToken: string | null = null;
let refreshToken: string | null = null;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiResponse<T> | { error?: { message?: string } };
  if (!response.ok) {
    throw new Error('error' in payload ? payload.error?.message ?? 'Request failed' : 'Request failed');
  }
  return (payload as ApiResponse<T>).data;
}

export const apiClient = {
  setTokens(tokens: { accessToken: string | null; refreshToken: string | null }) {
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  },
  get refreshToken() {
    return refreshToken;
  },
  sendOtp(phone: string) {
    return request<{ dev_otp?: string }>('/api/v1/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, role: 'driver' }),
    });
  },
  async verifyOtp(phone: string, otp: string) {
    const tokens = await request<TokenPair>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, role: 'driver' }),
    });
    accessToken = tokens.access_token;
    refreshToken = tokens.refresh_token;
    return tokens;
  },
  getDriverProfile() {
    return request<BackendDriver>('/api/v1/drivers/me');
  },
  registerDriver(payload: {
    fullName: string;
    vehicleType: VehicleType;
    vehicleNumber: string;
    aadhaarUrl?: string | null;
    licenseUrl?: string | null;
    profilePhoto?: string | null;
  }) {
    return request<BackendDriver>('/api/v1/drivers/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: payload.fullName,
        vehicle_type: payload.vehicleType,
        vehicle_number: payload.vehicleNumber || 'NOT-REQUIRED',
        aadhaar_url: payload.aadhaarUrl,
        license_url: payload.licenseUrl,
        profile_photo: payload.profilePhoto,
      }),
    });
  },
  updateDriverStatus(online: boolean) {
    return request<BackendDriver>('/api/v1/drivers/status', {
      method: 'PATCH',
      body: JSON.stringify({ online_status: online }),
    });
  },
  updateLocation(latitude: number, longitude: number) {
    return request<BackendDriver>('/api/v1/drivers/location', {
      method: 'PATCH',
      body: JSON.stringify({ lat: latitude, lng: longitude }),
    });
  },
  acceptBooking(bookingId: string) {
    return request(`/api/v1/bookings/${bookingId}/accept`, { method: 'POST' });
  },
  rejectBooking(bookingId: string) {
    return request(`/api/v1/bookings/${bookingId}/reject`, { method: 'POST' });
  },
};

export type BackendDriver = {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_number: string;
  verification_status: 'pending' | 'approved' | 'rejected' | 'suspended';
  online_status: boolean;
  current_lat: string | number | null;
  current_lng: string | number | null;
  rating: string | number;
  total_trips: number;
  created_at: string;
};

export function mapBackendDriver(driver: BackendDriver, phoneNumber: string, fullName?: string | null): Driver {
  return {
    id: driver.id,
    fullName: fullName || 'SHIFTLY Driver',
    phoneNumber,
    vehicleType: driver.vehicle_type as VehicleType,
    vehicleNumber: driver.vehicle_number,
    profilePhoto: null,
    aadhaarUrl: null,
    drivingLicenseUrl: null,
    upiId: '',
    bankDetails: {
      accountHolder: '',
      accountNumber: '',
      ifscCode: '',
    },
    rating: Number(driver.rating),
    totalTrips: driver.total_trips,
    verificationStatus: driver.verification_status === 'suspended' ? 'rejected' : driver.verification_status,
    status: driver.online_status ? 'online' : 'offline',
    currentTrips: [],
    completedTrips: [],
    earnings: {
      today: 0,
      weekly: 0,
      total: 0,
      incentives: 0,
      pendingPayout: 0,
    },
  };
}

export function incomingJobFromMessage(message: any): IncomingJob {
  return {
    id: String(message.booking_id),
    pickup: {
      latitude: Number(message.pickup_lat ?? 0),
      longitude: Number(message.pickup_lng ?? 0),
      address: message.pickup_address ?? 'Pickup',
    },
    drop: {
      latitude: Number(message.drop_lat ?? 0),
      longitude: Number(message.drop_lng ?? 0),
      address: message.drop_address ?? 'Drop',
    },
    distance: message.distance ?? 'Near you',
    fare: Number(message.estimated_fare ?? 0),
    itemCategory: message.item_type ?? 'Goods',
    estimatedDeliveryTime: message.estimatedDeliveryTime ?? '45 min',
    isShared: Boolean(message.isShared),
  };
}

export function tripFromJob(job: IncomingJob, status: TripStatus = 'accepted'): Trip {
  return {
    id: job.id,
    customerName: 'SHIFTLY Customer',
    customerPhone: '',
    pickup: job.pickup,
    drop: job.drop,
    itemCategory: job.itemCategory,
    itemDescription: job.itemCategory,
    fare: job.fare,
    distance: Number.parseFloat(job.distance) || 0,
    estimatedDeliveryTime: job.estimatedDeliveryTime,
    status,
    isShared: job.isShared,
    createdAt: new Date().toISOString(),
  };
}
