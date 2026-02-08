import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { playerService } from '@/services/api';
import { PlayerProfile } from '@/types';

export default function PlayerProfileScreen() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState<Partial<PlayerProfile>>({});
  const introAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  useEffect(() => {
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [introAnim]);

  useEffect(() => {
    // Set mock profile immediately as fallback
    if (!profile) {
      const mockProfile = getMockProfile();
      setProfile(mockProfile);
      setUpdatedData(mockProfile);
    }
  }, []);

  const getMockProfile = (): PlayerProfile => {
    const userId = user?.id || 'guest-user';
    return {
      id: 'profile-1',
      userId: userId,
      ageGroup: 'u19' as const,
      academy: 'Mumbai Cricket Academy',
      jerseyNumber: 7,
      battingStyle: 'right' as const,
      bowlingStyle: 'right-arm-medium' as const,
      height: 175,
      weight: 70,
      bio: 'Talented young cricketer with excellent fielding skills',
      stats: {
        matchesPlayed: 28,
        runsScored: 1250,
        wicketsTaken: 12,
        fifties: 2,
        centuries: 0,
        highestScore: 89,
        bestBowling: '3/24',
        average: 44.64,
        strikeRate: 128.5,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const loadProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await playerService.getProfile(user.id);
      if (response.success && response.data) {
        setProfile(response.data);
        setUpdatedData(response.data);
      } else {
        const mockProfile = getMockProfile();
        if (mockProfile) {
          setProfile(mockProfile);
          setUpdatedData(mockProfile);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Use mock data as fallback
      const mockProfile = getMockProfile();
      if (mockProfile) {
        setProfile(mockProfile);
        setUpdatedData(mockProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await playerService.updateProfile(user.id, updatedData);
      if (response.success && response.data) {
        setProfile(response.data);
        setEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const introAnimatedStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  if (loading && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976d2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#1A237E', '#283593']}
        style={styles.backgroundGradient}
      >
        {/* Header with Profile */}
        <Animated.View style={[styles.header, introAnimatedStyle]}>
          <LinearGradient
            colors={['#00E5FF', '#00B8D4', '#0091EA']}
            style={styles.profileBanner}
          >
            <View style={styles.decorativePattern} />
          </LinearGradient>

          <View style={styles.profileSection}>
            <View style={styles.profileImageWrapper}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.profileImageBorder}
              >
                <View style={styles.profileImage}>
                  {profile?.userId ? (
                    <Text style={styles.initials}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </Text>
                  ) : null}
                </View>
              </LinearGradient>
              <LinearGradient
                colors={['#4CAF50', '#388E3C']}
                style={styles.statusBadge}
              >
                <Text style={styles.statusText}>ON</Text>
              </LinearGradient>
            </View>

            <View style={styles.userInfoSection}>
              <Text style={styles.userName}>{user?.name}</Text>
              <View style={styles.roleBadgeContainer}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.roleBadge}
                >
                  <Text style={styles.roleEmoji}>CR</Text>
                  <Text style={styles.userRole}>{user?.role.toUpperCase()}</Text>
                </LinearGradient>
              </View>
            </View>

            {!editing && (
              <TouchableOpacity 
                style={styles.editIconButton}
                onPress={() => setEditing(true)}
              >
                <LinearGradient
                  colors={['#00E5FF', '#00B8D4']}
                  style={styles.editIconGradient}
                >
                  <Text style={styles.editIcon}>EDIT</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={introAnimatedStyle}>
        {/* Stats Grid */}
        {profile?.stats && (
          <View style={styles.statsGrid}>
            <StatCard label="Matches" value={profile.stats.matchesPlayed.toString()} icon="M" gradient={['#FF6B6B', '#C92A2A']} />
            <StatCard label="Runs" value={profile.stats.runsScored.toString()} icon="R" gradient={['#51CF66', '#2F9E44']} />
            <StatCard label="Wickets" value={profile.stats.wicketsTaken.toString()} icon="W" gradient={['#FF8C42', '#FD7E14']} />
            <StatCard label="Average" value={profile.stats.average.toFixed(2)} icon="AVG" gradient={['#748FFC', '#5C7CFA']} />
          </View>
        )}

        {/* Profile Details */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
          </View>

          <View style={styles.detailsCard}>
            <DetailRow
              label="Age Group"
              value={profile?.ageGroup || 'N/A'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, ageGroup: val as any })
              }
            />
            <DetailRow
              label="Academy"
              value={profile?.academy || 'Not Specified'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, academy: val })
              }
            />
            <DetailRow
              label="Jersey Number"
              value={profile?.jerseyNumber?.toString() || 'N/A'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, jerseyNumber: parseInt(val) || 0 })
              }
            />
            <DetailRow
              label="Batting Style"
              value={profile?.battingStyle || 'N/A'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, battingStyle: val as any })
              }
            />
            <DetailRow
              label="Bowling Style"
              value={profile?.bowlingStyle || 'None'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, bowlingStyle: val as any })
              }
            />
            <DetailRow
              label="Height (cm)"
              value={profile?.height?.toString() || 'N/A'}
              editable={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, height: parseInt(val) || 0 })
              }
            />
            <DetailRow
              label="Bio"
              value={profile?.bio || 'Add your bio'}
              editable={editing}
              multiline={editing}
              onChangeText={(val) =>
                setUpdatedData({ ...updatedData, bio: val })
              }
            />
          </View>
        </View>

        {/* Career Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Statistics</Text>
          <View style={styles.detailsCard}>
            <StatRow label="Hundreds" value={profile?.stats.centuries || 0} icon="H" />
            <StatRow label="Fifties" value={profile?.stats.fifties || 0} icon="F" />
            <StatRow label="Highest Score" value={profile?.stats.highestScore || 0} icon="HS" />
            <StatRow label="Best Bowling" value={profile?.stats.bestBowling || 'N/A'} icon="BB" />
            <StatRow label="Strike Rate" value={profile?.stats.strikeRate?.toFixed(2) || 'N/A'} icon="SR" />
          </View>
        </View>

        {editing && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#00E5FF', '#00B8D4', '#0091EA']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditing(false)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        </Animated.View>
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const StatCard = ({ label, value, icon, gradient }: { label: string; value: string; icon: string; gradient: readonly [string, string, ...string[]] }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={gradient}
      style={styles.statCardGradient}
    >
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </LinearGradient>
  </View>
);

const DetailRow = ({
  label,
  value,
  editable,
  multiline,
  onChangeText,
}: {
  label: string;
  value: string | number;
  editable: boolean;
  multiline?: boolean;
  onChangeText?: (text: string) => void;
}) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    {editable ? (
      <TextInput
        style={[styles.detailInput, multiline && styles.detailInputMultiline]}
        value={String(value)}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        placeholderTextColor="rgba(255, 255, 255, 0.3)"
      />
    ) : (
      <Text style={styles.detailValue}>{value}</Text>
    )}
  </View>
);

const StatRow = ({ label, value, icon }: { label: string; value: string | number; icon: string }) => (
  <View style={styles.statRow}>
    <View style={styles.statRowLeft}>
      <Text style={styles.statRowIcon}>{icon}</Text>
      <Text style={styles.statRowLabel}>{label}</Text>
    </View>
    <Text style={styles.statRowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  backgroundGradient: {
    flex: 1,
  },
  header: {
   position: 'relative',
  },
  profileBanner: {
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativePattern: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileSection: {
    paddingHorizontal: 20,
    marginTop: -60,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImageBorder: {
    padding: 4,
    borderRadius: 52,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 40,
    fontWeight: '800',
    color: '#00B8D4',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#0A0E27',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
  },
  userInfoSection: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  roleEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  userRole: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  editIconButton: {
    marginBottom: 8,
  },
  editIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  editIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    width: (Dimensions.get('window').width - 64) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  statCardGradient: {
    padding: 18,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  detailInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  detailInputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statRowIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  statRowLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  statRowValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
});
