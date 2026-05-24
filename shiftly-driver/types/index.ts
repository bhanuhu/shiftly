export type VehicleType =
  | 'E-Rickshaw'
  | 'Rickshaw'
  | '3 Wheeler Tampo'
  | 'Bolero'
  | 'Chota Hathi';

export type TripStatus =
  | 'accepted'
  | 'arrived'
  | 'picked_up'
  | 'in_transit'
  | 'delivered';

export type DriverStatus = 'online' | 'offline';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Trip {
  id: string;
  customerName: string;
  customerPhone: string;
  pickup: Location;
  drop: Location;
  itemCategory: string;
  itemDescription: string;
  fare: number;
  distance: number;
  estimatedDeliveryTime: string;
  status: TripStatus;
  isShared: boolean;
  sharedWith?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  fullName: string;
  phoneNumber: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  profilePhoto: string | null;
  aadhaarUrl: string | null;
  drivingLicenseUrl: string | null;
  upiId: string;
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
  };
  rating: number;
  totalTrips: number;
  verificationStatus: VerificationStatus;
  status: DriverStatus;
  currentTrips: Trip[];
  completedTrips: string[];
  earnings: {
    today: number;
    weekly: number;
    total: number;
    incentives: number;
    pendingPayout: number;
  };
}

export interface IncomingJob {
  id: string;
  pickup: Location;
  drop: Location;
  distance: string;
  fare: number;
  itemCategory: string;
  estimatedDeliveryTime: string;
  isShared: boolean;
  extraEarnings?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  phoneNumber: string | null;
  otpSent: boolean;
  isNewUser: boolean;
}

export interface Earnings {
  today: number;
  weekly: number;
  total: number;
  incentives: number;
  pendingPayout: number;
  completedTrips: number;
}
