export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type VerificationStatus = "pending" | "approved" | "rejected" | "suspended";
export type BookingStatus =
  | "pending"
  | "searching_driver"
  | "driver_assigned"
  | "driver_arriving"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  verificationStatus: VerificationStatus;
  onlineStatus: boolean;
  rating: number;
  totalTrips: number;
  earnings: number;
  currentLat?: number;
  currentLng?: number;
};

export type Booking = {
  id: string;
  customer: string;
  assignedDriver?: string;
  bookingType: "express" | "shared";
  status: BookingStatus;
  fare: number;
  commission: number;
  pickup: string;
  drop: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  bookingId: string;
  customer: string;
  driver: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
  method: string;
  createdAt: string;
};

export type DashboardMetrics = {
  totalBookingsToday: number;
  activeDeliveries: number;
  onlineDrivers: number;
  pendingApprovals: number;
  revenueToday: number;
  totalCommission: number;
  failedDeliveries: number;
  sharedDeliveries: number;
};
