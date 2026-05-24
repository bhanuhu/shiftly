import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneLoginScreen, OTPVerifyScreen } from '../screens';
import { AuthStackParamList } from './types';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />
    </Stack.Navigator>
  );
};
