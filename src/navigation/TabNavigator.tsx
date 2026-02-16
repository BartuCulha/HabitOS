import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { CommandCenter } from '../screens/Home/CommandCenter';
import { AIConsoleScreen } from '../screens/AIConsole/AIConsoleScreen';
import { TrackingScreen } from '../screens/Tracking/TrackingScreen';
import { ObservatoryScreen } from '../screens/Observatory/ObservatoryScreen';
import { ArchiveScreen } from '../screens/Archive/ArchiveScreen';
import { colors, fontSize } from '../constants/theme';

const Tab = createBottomTabNavigator();

const tabIcon = (emoji: string) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.bgCard,
        borderTopColor: colors.border,
        borderTopWidth: 1,
        height: 80,
        paddingBottom: 20,
        paddingTop: 8,
      },
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarLabelStyle: {
        fontSize: fontSize.xs,
        fontWeight: '600',
        letterSpacing: 0.5,
      },
    }}
  >
    <Tab.Screen
      name="Command"
      component={CommandCenter}
      options={{ tabBarIcon: tabIcon('⚡'), tabBarLabel: 'Command' }}
    />
    <Tab.Screen
      name="AI"
      component={AIConsoleScreen}
      options={{ tabBarIcon: tabIcon('🧠'), tabBarLabel: 'AI' }}
    />
    <Tab.Screen
      name="Track"
      component={TrackingScreen}
      options={{ tabBarIcon: tabIcon('📊'), tabBarLabel: 'Track' }}
    />
    <Tab.Screen
      name="Observe"
      component={ObservatoryScreen}
      options={{ tabBarIcon: tabIcon('🔭'), tabBarLabel: 'Observe' }}
    />
    <Tab.Screen
      name="Archive"
      component={ArchiveScreen}
      options={{ tabBarIcon: tabIcon('📦'), tabBarLabel: 'Archive' }}
    />
  </Tab.Navigator>
);
