import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import {
  HomeDashboardScreen,
  TripDetailsScreen,
  MultiOrderScreen,
  EarningsScreen,
  ProfileScreen,
} from '../screens';
import { MainTabParamList, HomeStackParamList } from './types';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const TabIcon: React.FC<{
  label: string;
  icon: string;
  focused: boolean;
}> = ({ label, icon, focused }) => (
  <View style={tabStyles.iconContainer}>
    <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>
      {icon}
    </Text>
    <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>
      {label}
    </Text>
  </View>
);

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  iconActive: {
    fontSize: 24,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    ...FONTS.medium,
  },
  labelActive: {
    color: COLORS.accentDark,
    ...FONTS.semibold,
  },
});

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
        animation: 'slide_from_right',
      }}
    >
      <HomeStack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <HomeStack.Screen name="TripDetails" component={TripDetailsScreen} />
    </HomeStack.Navigator>
  );
}

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
          shadowColor: '#07142C',
          shadowOpacity: 0.08,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 12,
        },
        tabBarActiveTintColor: COLORS.accentDark,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" icon="🏠" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Deliveries"
        component={MultiOrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Deliveries" icon="📦" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Earnings" icon="💰" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" icon="👤" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
