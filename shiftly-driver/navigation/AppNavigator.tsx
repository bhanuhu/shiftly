import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { useDriverStore } from '../store/driverStore';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { DriverRegistrationScreen, VerificationPendingScreen } from '../screens';
import { LoadingScreen } from '../components/LoadingScreen';
import { COLORS, FONTS } from '../theme';

const RootStack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isNewUser } = useAuthStore();
  const { driver } = useDriverStore();
  const [bootLoading, setBootLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBootLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (bootLoading) {
    return <LoadingScreen message="SHIFTLY Driver" />;
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: COLORS.accent,
          background: COLORS.background,
          card: COLORS.backgroundCard,
          text: COLORS.white,
          border: COLORS.border,
          notification: COLORS.accent,
        },
        fonts: {
          regular: FONTS.regular,
          medium: FONTS.medium,
          bold: FONTS.bold,
          heavy: FONTS.black,
        },
      }}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {!isAuthenticated ? (
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ animation: 'fade' }}
          />
        ) : isNewUser ? (
          <>
            <RootStack.Screen
              name="DriverRegistration"
              component={DriverRegistrationScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <RootStack.Screen
              name="VerificationPending"
              component={VerificationPendingScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : (
          <RootStack.Screen
            name="Main"
            component={MainNavigator}
            options={{ animation: 'fade' }}
          />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
