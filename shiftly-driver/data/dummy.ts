import { Driver, Trip, IncomingJob } from '../types';

export const DUMMY_DRIVER: Driver = {
  id: 'DRV-001',
  fullName: 'Rajesh Kumar',
  phoneNumber: '+91 98765 43210',
  vehicleType: 'E-Rickshaw',
  vehicleNumber: 'DL-01-ER-1234',
  profilePhoto: null,
  aadhaarUrl: null,
  drivingLicenseUrl: null,
  upiId: 'rajesh@upi',
  bankDetails: {
    accountHolder: 'Rajesh Kumar',
    accountNumber: 'XXXXXXXX1234',
    ifscCode: 'SBIN0012345',
  },
  rating: 4.8,
  totalTrips: 342,
  verificationStatus: 'approved',
  status: 'online',
  currentTrips: [],
  completedTrips: [],
  earnings: {
    today: 845,
    weekly: 4250,
    total: 142500,
    incentives: 350,
    pendingPayout: 1200,
  },
};

export const DUMMY_TRIPS: Trip[] = [
  {
    id: 'TRP-101',
    customerName: 'Amit Sharma',
    customerPhone: '+91 98765 12345',
    pickup: {
      latitude: 28.6129,
      longitude: 77.2295,
      address: 'Raj Furniture, Sector 12, Noida',
    },
    drop: {
      latitude: 28.6309,
      longitude: 77.2175,
      address: 'Sector 14, Noida, UP',
    },
    itemCategory: 'Furniture',
    itemDescription: 'Sofa set - 3 seater',
    fare: 120,
    distance: 3.2,
    estimatedDeliveryTime: '15 mins',
    status: 'accepted',
    isShared: false,
    createdAt: '2026-05-22T10:30:00Z',
  },
  {
    id: 'TRP-102',
    customerName: 'Priya Mehta',
    customerPhone: '+91 98765 67890',
    pickup: {
      latitude: 28.5355,
      longitude: 77.3910,
      address: 'Meera Grocery, Sector 22, Noida',
    },
    drop: {
      latitude: 28.5809,
      longitude: 77.3295,
      address: 'Sector 62, Noida, UP',
    },
    itemCategory: 'Groceries',
    itemDescription: 'Monthly grocery stock - 8 bags',
    fare: 85,
    distance: 4.5,
    estimatedDeliveryTime: '20 mins',
    status: 'accepted',
    isShared: false,
    createdAt: '2026-05-22T10:45:00Z',
  },
];

export const DUMMY_INCOMING_JOB: IncomingJob = {
  id: 'JOB-201',
  pickup: {
    latitude: 28.6209,
    longitude: 77.2295,
    address: 'Sharma Hardware, Sector 15, Noida',
  },
  drop: {
    latitude: 28.6409,
    longitude: 77.2395,
    address: 'Sector 18, Noida, UP',
  },
  distance: '2.8 km',
  fare: 95,
  itemCategory: 'Hardware',
  estimatedDeliveryTime: '12 mins',
  isShared: false,
};

export const DUMMY_SHARED_JOB: IncomingJob = {
  id: 'JOB-202',
  pickup: {
    latitude: 28.6129,
    longitude: 77.2295,
    address: 'Raj Furniture, Sector 12, Noida',
  },
  drop: {
    latitude: 28.6459,
    longitude: 77.2195,
    address: 'Sector 16, Noida, UP',
  },
  distance: '1.5 km',
  fare: 135,
  itemCategory: 'Hardware Tools',
  estimatedDeliveryTime: '8 mins',
  isShared: true,
  extraEarnings: 40,
};

export const EARNINGS_HISTORY = [
  { day: 'Mon', amount: 520 },
  { day: 'Tue', amount: 680 },
  { day: 'Wed', amount: 450 },
  { day: 'Thu', amount: 780 },
  { day: 'Fri', amount: 610 },
  { day: 'Sat', amount: 845 },
  { day: 'Sun', amount: 395 },
];

export const VEHICLE_TYPES = [
  { label: 'E-Rickshaw', value: 'E-Rickshaw' as const },
  { label: 'Rickshaw', value: 'Rickshaw' as const },
  { label: '3 Wheeler Tampo', value: '3 Wheeler Tampo' as const },
  { label: 'Bolero', value: 'Bolero' as const },
  { label: 'Chota Hathi', value: 'Chota Hathi' as const },
];
