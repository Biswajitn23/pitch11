import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const introAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [introAnim]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: (value: boolean) => void;
  }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingContent}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {value !== undefined && onToggle && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#423F5D', true: '#00E5FF' }}
          thumbColor={value ? '#00B8D4' : '#90CAF9'}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#1A237E', '#283593']}
        style={styles.backgroundGradient}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={{
              opacity: introAnim,
              transform: [
                {
                  translateY: introAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            }}
          >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <LinearGradient
              colors={['rgba(0, 229, 255, 0.1)', 'rgba(0, 184, 212, 0.05)']}
              style={styles.profileCard}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.profileAvatar}
              >
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user?.role.toUpperCase()}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="PR"
                  title="Edit Profile"
                  subtitle="Update your profile information"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="PW"
                  title="Change Password"
                  subtitle="Update your password"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="EM"
                  title="Email Preferences"
                  subtitle="Manage email notifications"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.sectionContent}>
              <View style={styles.settingRowCard}>
                <SettingRow
                  icon="PN"
                  title="Push Notifications"
                  subtitle="Get match and update alerts"
                  value={notifications}
                  onToggle={setNotifications}
                />
              </View>
              <View style={styles.settingRowCard}>
                <SettingRow
                  icon="LC"
                  title="Location Services"
                  subtitle="Allow location access for nearby matches"
                  value={locationServices}
                  onToggle={setLocationServices}
                />
              </View>
            </View>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Settings</Text>
            <View style={styles.sectionContent}>
              <View style={styles.settingRowCard}>
                <SettingRow
                  icon="DM"
                  title="Dark Mode"
                  subtitle="Use dark theme"
                  value={darkMode}
                  onToggle={setDarkMode}
                />
              </View>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="LG"
                  title="Language"
                  subtitle="English"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow icon="AV" title="App Version" subtitle="1.0.0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="TC"
                  title="Terms & Conditions"
                  subtitle="Read our terms"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="PP"
                  title="Privacy Policy"
                  subtitle="Our privacy practices"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingRowCard}>
                <SettingRow
                  icon="HS"
                  title="Help & Support"
                  subtitle="Get help from our team"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            <View style={styles.sectionContent}>
              <TouchableOpacity
                style={[styles.settingRowCard, styles.logoutButton]}
                onPress={handleLogout}
              >
                <View style={styles.logoutContent}>
                  <Text style={styles.logoutIcon}>LO</Text>
                  <View style={styles.logoutText}>
                    <Text style={styles.logoutTitle}>Logout</Text>
                    <Text style={styles.logoutSubtitle}>
                      Sign out from your account
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.settingRowCard, styles.deleteButton]}>
                <View style={styles.deleteContent}>
                  <Text style={styles.deleteIcon}>DL</Text>
                  <View style={styles.deleteText}>
                    <Text style={styles.deleteTitle}>Delete Account</Text>
                    <Text style={styles.deleteSubtitle}>
                      Permanently delete your account
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>PITCH11 (c) 2026</Text>
            <Text style={styles.footerSubtext}>Your Cricket Companion</Text>
          </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  backgroundGradient: {
    flex: 1,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
    top: -50,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
    bottom: 100,
    left: -50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    padding: 16,
    paddingTop: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00E5FF',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingRowCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  settingSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  logoutText: {
    flex: 1,
  },
  logoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  logoutSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 107, 107, 0.7)',
    marginTop: 2,
  },
  deleteButton: {
    borderBottomWidth: 0,
  },
  deleteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  deleteText: {
    flex: 1,
  },
  deleteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C42',
  },
  deleteSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 140, 66, 0.7)',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 4,
  },
});
