import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { matchService } from '@/services/api';
import { Match, MatchLevel } from '@/types';

export default function MatchBrowsingScreen({ navigation }: any) {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<MatchLevel | 'all'>('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const levels: { label: string; value: MatchLevel | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'District', value: 'district' },
    { label: 'State', value: 'state' },
    { label: 'National', value: 'national' },
    { label: 'Academy', value: 'academy' },
    { label: 'Local', value: 'local' },
  ];

  useEffect(() => {
    loadMatches();
  }, [selectedLevel, selectedCity]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(listAnim, {
        toValue: 1,
        duration: 550,
        delay: 120,
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerAnim, listAnim]);

  const getMockMatches = (): Match[] => {
    return [
      {
        id: '1',
        title: 'U-19 District Championship',
        level: 'district',
        venue: 'Mumbai Cricket Club',
        city: 'Mumbai',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '09:00',
        format: 'T20',
        status: 'upcoming',
        team1: { id: 't1-1', name: 'Mumbai Lions', players: [] },
        team2: { id: 't1-2', name: 'Delhi Tigers', players: [] },
        registrationFee: 500,
        spotsAvailable: 12,
        groundId: 'ground-1',
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'U-23 State Tournament',
        level: 'state',
        venue: 'Arun Jaitley Stadium',
        city: 'Delhi',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '14:00',
        format: 'ODI',
        status: 'upcoming',
        team1: { id: 't2-1', name: 'Delhi Dragons', players: [] },
        team2: { id: 't2-2', name: 'Bangalore Bears', players: [] },
        registrationFee: 800,
        spotsAvailable: 15,
        groundId: 'ground-2',
        createdBy: 'user-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Senior League Match',
        level: 'national',
        venue: 'Eden Gardens',
        city: 'Kolkata',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '11:00',
        format: 'T20',
        status: 'upcoming',
        team1: { id: 't3-1', name: 'Kolkata Knights', players: [] },
        team2: { id: 't3-2', name: 'Mumbai Magic', players: [] },
        registrationFee: 1000,
        spotsAvailable: 20,
        groundId: 'ground-3',
        createdBy: 'user-3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        title: 'Academy Cricket Cup',
        level: 'academy',
        venue: 'Sports Authority of India',
        city: 'Bangalore',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '10:00',
        format: 'T20',
        status: 'upcoming',
        team1: { id: 't4-1', name: 'Bangalore Breakers', players: [] },
        team2: { id: 't4-2', name: 'Chennai Chargers', players: [] },
        registrationFee: 400,
        spotsAvailable: 14,
        groundId: 'ground-4',
        createdBy: 'user-4',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '5',
        title: 'Local Area Friendly Match',
        level: 'local',
        venue: 'Municipal Ground',
        city: 'Pune',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: '16:00',
        format: '6-overs',
        status: 'upcoming',
        team1: { id: 't5-1', name: 'Pune Warriors', players: [] },
        team2: { id: 't5-2', name: 'Poona Pioneers', players: [] },
        registrationFee: 200,
        spotsAvailable: 11,
        groundId: 'ground-5',
        createdBy: 'user-5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  };

  const loadMatches = async () => {
    try {
      setLoading(true);
      const filters: any = {
        status: 'upcoming',
        page: 1,
        limit: 20,
      };

      if (selectedLevel !== 'all') {
        filters.level = selectedLevel;
      }
      if (selectedCity) {
        filters.city = selectedCity;
      }

      const response = await matchService.getMatches(filters);
      if (response.success && response.data) {
        setMatches(response.data.data || response.data);
      } else {
        setMatches(getMockMatches());
      }
    } catch (error) {
      console.error('Failed to load matches:', error);
      // Use mock data as fallback
      setMatches(getMockMatches());
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const handleJoinMatch = async (matchId: string) => {
    if (!user?.id) return;

    try {
      Alert.alert('Confirm', 'Do you want to join this match?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Join',
          onPress: async () => {
            try {
              setLoading(true);
              const response = await matchService.joinMatch(matchId, user.id);
              if (response.success) {
                Alert.alert('Success', 'You have joined the match successfully!');
                loadMatches();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to join match');
            } finally {
              setLoading(false);
            }
          },
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredMatches = matches.filter(
    (match) =>
      match.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      district: '#FF9800',
      state: '#2196F3',
      national: '#4CAF50',
      academy: '#9C27B0',
      local: '#607D8B',
    };
    return colors[level.toLowerCase()] || '#757575';
  };

  const renderMatchCard = ({ item }: { item: Match }) => (
    <TouchableOpacity style={styles.matchCard} activeOpacity={0.9}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
        style={styles.matchCardContent}
      >
        {/* Level Badge - Floating */}
        <View style={[styles.matchLevelBadge, { backgroundColor: getLevelColor(item.level) }]}>
          <Text style={styles.matchLevelText}>{item.level.toUpperCase()}</Text>
        </View>

        {/* Match Title & Date */}
        <View style={styles.matchHeader}>
          <View style={styles.matchTitleSection}>
            <Text style={styles.matchTitle} numberOfLines={2}>{item.title}</Text>
            <View style={styles.matchDateBox}>
              <Text style={styles.dateEmoji}>DATE</Text>
              <View>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                <Text style={styles.timeText}>Time {item.startTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Match Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>VEN</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Venue</Text>
              <Text style={styles.detailValue} numberOfLines={1}>{item.venue}</Text>
            </View>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>SPT</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Spots</Text>
              <Text style={styles.detailValue}>{item.spotsAvailable}</Text>
            </View>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>FEE</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailValue}>INR {item.registrationFee}</Text>
            </View>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>FMT</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={styles.detailValue}>{item.format}</Text>
            </View>
          </View>
        </View>

        {/* Teams & Action */}
        <View style={styles.matchFooter}>
          <View style={styles.teamSection}>
            <View style={styles.teamCard}>
              <Text style={styles.teamName} numberOfLines={1}>{item.team1.name}</Text>
            </View>
            <LinearGradient
              colors={['#00E5FF', '#00B8D4']}
              style={styles.vsContainer}
            >
              <Text style={styles.vsText}>VS</Text>
            </LinearGradient>
            <View style={styles.teamCard}>
              <Text style={styles.teamName} numberOfLines={1}>{item.team2.name}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => handleJoinMatch(item.id)}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00E5FF', '#00B8D4', '#0091EA']}
              style={styles.joinButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.joinButtonText}>Join Match</Text>
              <Text style={styles.joinButtonArrow}>&gt;</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>NO</Text>
      <Text style={styles.emptyStateTitle}>No Matches Found</Text>
      <Text style={styles.emptyStateText}>Try different filters or check back later</Text>
    </View>
  );

  const headerAnimatedStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  const listAnimatedStyle = {
    opacity: listAnim,
    transform: [
      {
        translateY: listAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#1A237E', '#283593']}
        style={styles.backgroundGradient}
      >
        {/* Decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Discover</Text>
              <Text style={styles.screenTitle}>Cricket Matches</Text>
            </View>
            <View style={styles.profileBadge}>
              <Text style={styles.profileEmoji}>U</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>S</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search matches, venues..."
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Level Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
            contentContainerStyle={styles.filterScrollContent}
          >
            {levels.map((level) => (
              <TouchableOpacity
                key={level.value}
                onPress={() => setSelectedLevel(level.value)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    selectedLevel === level.value
                      ? ['#00E5FF', '#00B8D4']
                      : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']
                  }
                  style={styles.filterChip}
                >
                  <Text
                    style={[
                      styles.filterText,
                      selectedLevel === level.value && styles.filterTextActive,
                    ]}
                  >
                    {level.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled={true}
      >
        <Animated.View style={listAnimatedStyle}>
          {/* Matches List */}
          {loading && !matches.length ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00E5FF" />
            </View>
          ) : filteredMatches.length > 0 ? (
            <FlatList
              data={filteredMatches}
              renderItem={renderMatchCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              nestedScrollEnabled={false}
            />
          ) : (
            renderEmptyState()
          )}
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
    top: -50,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 184, 212, 0.05)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  profileBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  profileEmoji: {
    fontSize: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: '#fff',
  },
  filterScroll: {
    marginTop: 8,
  },
  filterScrollContent: {
    paddingRight: 20,
  },
  filterChip: {
    marginRight: 10,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  matchCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  matchCardContent: {
    padding: 20,
  },
  matchLevelBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  matchLevelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  matchHeader: {
    marginBottom: 16,
  },
  matchTitleSection: {
    paddingRight: 100,
  },
  matchTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 26,
  },
  matchDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dateEmoji: {
    fontSize: 18,
    marginRight: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#00E5FF',
    fontWeight: '600',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  detailBox: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 3,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  matchFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  teamCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  vsContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  vsText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  joinButtonGradient: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  joinButtonArrow: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 8,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
});
