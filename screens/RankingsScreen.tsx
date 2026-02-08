import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { rankingService } from '@/services/api';
import { Ranking, AgeGroup, MatchLevel } from '@/types';

type RankingSelection = 'district' | 'state' | 'national';

export default function RankingsScreen() {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<RankingSelection>('district');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | 'all'>('all');
  const [selectedState, setSelectedState] = useState('');
  const headerAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;

  const ageGroups: { label: string; value: AgeGroup | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'U13', value: 'u13' },
    { label: 'U16', value: 'u16' },
    { label: 'U19', value: 'u19' },
    { label: 'U23', value: 'u23' },
    { label: 'Senior', value: 'senior' },
  ];

  const states = [
    'All',
    'Andhra Pradesh',
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Delhi',
    'Punjab',
  ];

  useEffect(() => {
    loadRankings();
  }, [selectedLevel, selectedAgeGroup, selectedState]);

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

  const getMockRankings = (): Ranking[] => {
    const mockData: Ranking[] = [
      {
        id: 'rank-1',
        playerId: 'player-1',
        playerName: 'Virat Sharma',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2850,
        position: 1,
        matchesPlayed: 28,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-2',
        playerId: 'player-2',
        playerName: 'Rajesh Kumar',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2720,
        position: 2,
        matchesPlayed: 26,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-3',
        playerId: 'player-3',
        playerName: 'Arjun Singh',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2680,
        position: 3,
        matchesPlayed: 25,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-4',
        playerId: 'player-4',
        playerName: 'Aditya Patel',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2450,
        position: 4,
        matchesPlayed: 23,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-5',
        playerId: 'player-5',
        playerName: 'Karan Verma',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2360,
        position: 5,
        matchesPlayed: 22,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-6',
        playerId: 'player-6',
        playerName: 'Sanjay Desai',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2290,
        position: 6,
        matchesPlayed: 21,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-7',
        playerId: 'player-7',
        playerName: 'Ashok Tiwari',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2150,
        position: 7,
        matchesPlayed: 20,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-8',
        playerId: 'player-8',
        playerName: 'Prakash Nair',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 2080,
        position: 8,
        matchesPlayed: 19,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-9',
        playerId: 'player-9',
        playerName: 'Hamid Khan',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 1950,
        position: 9,
        matchesPlayed: 18,
        lastUpdated: new Date().toISOString(),
      },
      {
        id: 'rank-10',
        playerId: 'player-10',
        playerName: 'Ravi Chopra',
        ageGroup: 'u19' as const,
        level: 'district' as const,
        points: 1880,
        position: 10,
        matchesPlayed: 17,
        lastUpdated: new Date().toISOString(),
      },
    ];
    return mockData;
  };

  const loadRankings = async () => {
    try {
      setLoading(true);
      let response: any;
      const ageGroupParam = selectedAgeGroup !== 'all' ? selectedAgeGroup : undefined;

      if (selectedLevel === 'district') {
        response = await rankingService.getDistrictRankings(ageGroupParam);
      } else if (selectedLevel === 'state') {
        response = await rankingService.getStateRankings(
          selectedState || 'Maharashtra',
          ageGroupParam
        );
      } else {
        response = await rankingService.getNationalRankings(ageGroupParam);
      }

      if (response.success && response.data) {
        setRankings(response.data.data || response.data);
      } else {
        setRankings(getMockRankings());
      }
    } catch (error) {
      console.error('Failed to load rankings:', error);
      // Use mock data as fallback
      setRankings(getMockRankings());
    } finally {
      setLoading(false);
    }
  };

  const getRankingBadgeColor = (position: number) => {
    if (position === 1) return '#FFD700';
    if (position === 2) return '#C0C0C0';
    if (position === 3) return '#CD7F32';
    return '#1976d2';
  };

  const getRankingBadgeEmoji = (position: number) => {
    if (position === 1) return '1';
    if (position === 2) return '2';
    if (position === 3) return '3';
    return '-';
  };

  const renderRankingItem = ({ item, index }: { item: Ranking; index: number }) => {
    const isTopThree = item.position <= 3;
    const topThreeGradients: Record<number, readonly [string, string, ...string[]]> = {
      1: ['#FFD700', '#FFA500', '#FF8C00'],
      2: ['#E0E0E0', '#BDBDBD', '#9E9E9E'] as const,
      3: ['#CD7F32', '#B8860B', '#8B4513'] as const,
    };
    
    return (
      <TouchableOpacity style={styles.rankingCard} activeOpacity={0.9}>
        <LinearGradient
          colors={isTopThree ? (topThreeGradients[item.position] || ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)'] as const) : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)'] as const}
          style={styles.rankingCardGradient}
        >
          <View style={styles.rankingContent}>
            {/* Position Badge */}
            <View style={styles.positionSection}>
              <View style={[
                styles.positionBadge, 
                { backgroundColor: isTopThree ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 229, 255, 0.15)' }
              ]}>
                {isTopThree && (
                  <Text style={styles.badgeEmoji}>{getRankingBadgeEmoji(item.position)}</Text>
                )}
                <Text style={[styles.positionText, isTopThree && styles.positionTextMedal]}>
                  #{item.position}
                </Text>
              </View>
            </View>

            {/* Player Info */}
            <View style={styles.playerSection}>
              <View style={styles.playerInfo}>
                <LinearGradient
                  colors={isTopThree ? ['#FF6B6B', '#C92A2A'] as const : ['#00E5FF', '#00B8D4'] as const}
                  style={styles.playerInitial}
                >
                  <Text style={styles.initialText}>{item.playerName?.charAt(0).toUpperCase()}</Text>
                </LinearGradient>

                <View style={styles.playerDetails}>
                  <Text style={[styles.playerName, isTopThree && styles.playerNameMedal]}>
                    {item.playerName}
                  </Text>
                  <View style={styles.playerMeta}>
                    <Text style={styles.metaItem}>Age {item.ageGroup.toUpperCase()}</Text>
                    <Text style={styles.metaDot}>-</Text>
                    <Text style={styles.metaItem}>Matches {item.matchesPlayed}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Points */}
            <View style={styles.pointsSection}>
              <LinearGradient
                colors={isTopThree ? ['rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.2)'] as const : ['rgba(0, 229, 255, 0.2)', 'rgba(0, 184, 212, 0.1)'] as const}
                style={styles.pointsContainer}
              >
                <Text style={[styles.pointsValue, isTopThree && styles.pointsValueMedal]}>
                  {item.points}
                </Text>
                <Text style={[styles.pointsLabel, isTopThree && styles.pointsLabelMedal]}>
                  Points
                </Text>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>NO</Text>
      <Text style={styles.emptyStateTitle}>No Rankings Available</Text>
      <Text style={styles.emptyStateText}>Check back soon for updated rankings</Text>
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

        {/* Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Rankings</Text>
              <Text style={styles.screenTitle}>Leaderboard</Text>
            </View>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.trophyBadge}
            >
              <Text style={styles.trophyIcon}>TOP</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={listAnimatedStyle}>
        {/* Level Selection */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Competition Level</Text>
          <View style={styles.levelRow}>
            {(['district', 'state', 'national'] as RankingSelection[]).map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedLevel(level)}
                activeOpacity={0.8}
                style={styles.levelButtonWrapper}
              >
                <LinearGradient
                  colors={selectedLevel === level ? ['#00E5FF', '#00B8D4'] : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.levelButton}
                >
                  <Text
                    style={[
                      styles.levelButtonText,
                      selectedLevel === level && styles.levelButtonTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* State Selection for State Rankings */}
        {selectedLevel === 'state' && (
          <View style={styles.stateContainer}>
            <Text style={styles.filterLabel}>State:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {states.map((state) => (
                <TouchableOpacity
                  key={state}
                  style={[
                    styles.stateButton,
                    (selectedState === state || (state === 'All' && !selectedState)) &&
                      styles.stateButtonActive,
                  ]}
                  onPress={() => setSelectedState(state === 'All' ? '' : state)}
                >
                  <Text
                    style={[
                      styles.stateButtonText,
                      (selectedState === state || (state === 'All' && !selectedState)) &&
                        styles.stateButtonTextActive,
                    ]}
                  >
                    {state}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Age Group Selection */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Age Group</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ageGroupScroll}
          >
            {ageGroups.map((group) => (
              <TouchableOpacity
                key={group.value}
                onPress={() => setSelectedAgeGroup(group.value)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedAgeGroup === group.value ? ['#00E5FF', '#00B8D4'] : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.ageGroupChip}
                >
                  <Text
                    style={[
                      styles.ageGroupText,
                      selectedAgeGroup === group.value && styles.ageGroupTextActive,
                    ]}
                  >
                    {group.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Rankings List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00E5FF" />
          </View>
        ) : rankings.length > 0 ? (
          <FlatList
            data={rankings}
            renderItem={renderRankingItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled={false}
            contentContainerStyle={styles.listContent}
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
    top: -60,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(0, 229, 255, 0.06)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 50,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 184, 212, 0.04)',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  trophyBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  trophyIcon: {
    fontSize: 28,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 10,
  },
  levelButtonWrapper: {
    flex: 1,
  },
  levelButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelButtonText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  levelButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  ageGroupScroll: {
    paddingRight: 20,
  },
  ageGroupChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  ageGroupText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  ageGroupTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 8,
  },
  rankingCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  rankingCardGradient: {
    padding: 18,
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionSection: {
    marginRight: 14,
  },
  positionBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  positionText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  positionTextMedal: {
    color: '#fff',
    fontWeight: '800',
  },
  playerSection: {
    flex: 1,
    marginRight: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInitial: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  initialText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  playerNameMedal: {
    fontSize: 18,
    fontWeight: '800',
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '500',
  },
  metaDot: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  pointsSection: {
    minWidth: 85,
  },
  pointsContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  pointsValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
  },
  pointsValueMedal: {
    fontSize: 24,
  },
  pointsLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  pointsLabelMedal: {
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 72,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    lineHeight: 22,
  },
  stateContainer: {
    marginBottom: 20,
  },
  stateButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  stateButtonActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  stateButtonText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  stateButtonTextActive: {
    color: '#00E5FF',
    fontWeight: '700',
  },
});
