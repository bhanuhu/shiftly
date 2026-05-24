export type AuthStackParamList = {
  PhoneLogin: undefined;
  OTPVerify: undefined;
};

export type RegistrationStackParamList = {
  DriverRegistration: undefined;
  VerificationPending: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Deliveries: undefined;
  Earnings: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeDashboard: undefined;
  TripDetails: { tripId: string };
};
