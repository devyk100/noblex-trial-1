import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>


      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="house.fill" color={color} style={{ opacity: focused ? 1 : 0.5 }} />,
        }}
      />
      <Tabs.Screen
        name="experientia/index"
        options={{
          title: 'Experientia',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="paperplane.fill" color={color} style={{ opacity: focused ? 1 : 0.5 }} />,
        }}
      />

      <Tabs.Screen
        name="campus-buzz/index"
        options={{
          title: 'Campus Buzz',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="megaphone.fill" color={color} style={{ opacity: focused ? 1 : 0.5 }} />,
        }}
      />

      <Tabs.Screen name="networking/index"
        options={{
          title: "Networking",
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="person.2.fill" color={color} style={{ opacity: focused ? 1 : 0.5 }} />,
        }} />

      <Tabs.Screen name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <IconSymbol size={28} name="person.fill" color={color} style={{ opacity: focused ? 1 : 0.5 }} />,
        }}
      />
    </Tabs>
  );
}
