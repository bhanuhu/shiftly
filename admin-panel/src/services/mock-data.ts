import { addHours, formatISO, subDays } from "date-fns";

import { Booking, DashboardMetrics, Driver, Payment } from "@/types";

export const drivers: Driver[] = [
  {
    id: "drv-101",
    name: "Ravi Kumar",
    phone: "+91 98765 43210",
    vehicleType: "E-rickshaw",
    vehicleNumber: "DL 1ER 5482",
    verificationStatus: "pending",
    onlineStatus: true,
    rating: 4.8,
    totalTrips: 318,
    earnings: 42850,
    currentLat: 28.6139,
    currentLng: 77.209
  },
  {
    id: "drv-102",
    name: "Imran Sheikh",
    phone: "+91 98111 22334",
    vehicleType: "Tampoo",
    vehicleNumber: "HR 26 TP 4411",
    verificationStatus: "approved",
    onlineStatus: true,
    rating: 4.6,
    totalTrips: 527,
    earnings: 77420,
    currentLat: 28.4595,
    currentLng: 77.0266
  },
  {
    id: "drv-103",
    name: "Mahesh Yadav",
    phone: "+91 98991 11123",
    vehicleType: "Mini tempo",
    vehicleNumber: "UP 16 CT 9021",
    verificationStatus: "suspended",
    onlineStatus: false,
    rating: 4.1,
    totalTrips: 144,
    earnings: 21880
  },
  {
    id: "drv-104",
    name: "Amit Pal",
    phone: "+91 90001 78787",
    vehicleType: "E-rickshaw",
    vehicleNumber: "DL 8ER 3302",
    verificationStatus: "approved",
    onlineStatus: false,
    rating: 4.9,
    totalTrips: 711,
    earnings: 103240
  }
];

export const bookings: Booking[] = [
  {
    id: "BKG-48291",
    customer: "Ananya Stores",
    assignedDriver: "Imran Sheikh",
    bookingType: "express",
    status: "in_transit",
    fare: 540,
    commission: 97,
    pickup: "Lajpat Nagar",
    drop: "Saket",
    createdAt: formatISO(addHours(new Date(), -2))
  },
  {
    id: "BKG-48292",
    customer: "Fresh Cart",
    assignedDriver: "Ravi Kumar",
    bookingType: "shared",
    status: "driver_assigned",
    fare: 360,
    commission: 64,
    pickup: "Karol Bagh",
    drop: "Rajouri Garden",
    createdAt: formatISO(addHours(new Date(), -1))
  },
  {
    id: "BKG-48293",
    customer: "Maya Furnishings",
    bookingType: "express",
    status: "searching_driver",
    fare: 720,
    commission: 130,
    pickup: "Sector 18 Noida",
    drop: "Indirapuram",
    createdAt: formatISO(addHours(new Date(), -0.5))
  },
  {
    id: "BKG-48280",
    customer: "Rohit Traders",
    assignedDriver: "Amit Pal",
    bookingType: "shared",
    status: "delivered",
    fare: 410,
    commission: 74,
    pickup: "Azadpur Mandi",
    drop: "Pitampura",
    createdAt: formatISO(subDays(new Date(), 1))
  }
];

export const payments: Payment[] = [
  {
    id: "PAY-9811",
    bookingId: "BKG-48291",
    customer: "Ananya Stores",
    driver: "Imran Sheikh",
    amount: 540,
    status: "paid",
    method: "UPI",
    createdAt: formatISO(addHours(new Date(), -2))
  },
  {
    id: "PAY-9812",
    bookingId: "BKG-48293",
    customer: "Maya Furnishings",
    driver: "Unassigned",
    amount: 720,
    status: "pending",
    method: "Card",
    createdAt: formatISO(addHours(new Date(), -0.5))
  },
  {
    id: "PAY-9801",
    bookingId: "BKG-48270",
    customer: "Metro Decor",
    driver: "Mahesh Yadav",
    amount: 980,
    status: "failed",
    method: "Netbanking",
    createdAt: formatISO(subDays(new Date(), 1))
  }
];

export const metrics: DashboardMetrics = {
  totalBookingsToday: 86,
  activeDeliveries: 19,
  onlineDrivers: 42,
  pendingApprovals: 7,
  revenueToday: 124800,
  totalCommission: 22464,
  failedDeliveries: 3,
  sharedDeliveries: 24
};

export const chartSeries = [
  { label: "08:00", bookings: 18, revenue: 8200, commission: 1476 },
  { label: "10:00", bookings: 31, revenue: 18400, commission: 3312 },
  { label: "12:00", bookings: 44, revenue: 29800, commission: 5364 },
  { label: "14:00", bookings: 39, revenue: 24200, commission: 4356 },
  { label: "16:00", bookings: 58, revenue: 40100, commission: 7218 },
  { label: "18:00", bookings: 67, revenue: 51200, commission: 9216 }
];

export const zones = [
  { zone: "Lajpat Nagar", active: 18 },
  { zone: "Noida Sec 18", active: 16 },
  { zone: "Karol Bagh", active: 13 },
  { zone: "Gurugram", active: 11 },
  { zone: "Azadpur", active: 9 }
];

export const statusDistribution = [
  { name: "Pending", value: 12 },
  { name: "Assigned", value: 28 },
  { name: "In transit", value: 19 },
  { name: "Delivered", value: 54 },
  { name: "Cancelled", value: 5 }
];
