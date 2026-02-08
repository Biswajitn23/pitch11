import { Tabs, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');

  const headerRight = useMemo(
    () => (
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <IconSymbol size={18} name="person.fill" color="#00E5FF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.push('/(tabs)/explore')}
        >
          <IconSymbol size={18} name="gearshape.fill" color="#00E5FF" />
        </TouchableOpacity>
      </View>
    ),
    [router]
  );

  const headerTitle = useMemo(
    () => (
      <View style={styles.headerSearchWrap}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchValue}
          onChangeText={setSearchValue}
          style={styles.headerSearchInput}
          returnKeyType="search"
        />
      </View>
    ),
    [searchValue]
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00E5FF',
        tabBarInactiveTintColor: '#90CAF9',
        tabBarActiveBackgroundColor: 'rgba(0, 229, 255, 0.12)',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 10,
          paddingBottom: 8,
          borderRadius: 18,
          marginHorizontal: 6,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: 'transparent',
          height: 84,
        },
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerBackground: () => (
          <BlurView intensity={30} tint="dark" style={styles.headerBackground}>
            <LinearGradient
              colors={['rgba(10, 14, 39, 0.85)', 'rgba(26, 35, 126, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerBackground}
            />
          </BlurView>
        ),
        headerTitle: () => headerTitle,
        headerRight: () => headerRight,
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
          color: '#FFFFFF',
        },
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          height: 72,
          paddingHorizontal: 10,
          paddingBottom: 10,
          paddingTop: 8,
          borderRadius: 24,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: 'rgba(0, 229, 255, 0.15)',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 16,
        },
        tabBarBackground: () => (
          <BlurView intensity={30} tint="dark" style={{ flex: 1, borderRadius: 24 }}>
            <LinearGradient
              colors={['rgba(10, 14, 39, 0.75)', 'rgba(26, 35, 126, 0.85)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, borderRadius: 24 }}
            />
          </BlurView>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browse Matches',
          tabBarLabel: 'Matches',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="cricket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rankings"
        options={{
          title: 'Rankings',
          tabBarLabel: 'Rankings',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="chart.bar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={30} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
  },
  headerSearchWrap: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  headerSearchInput: {
    color: '#FFFFFF',
    fontSize: 14,
    paddingVertical: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 8,
  },
  headerIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
});
