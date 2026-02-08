import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { liveScoringService, matchService } from '@/services/api';
import { Match, BallEntry } from '@/types';

interface LiveScoreData {
  match: Match;
  team1Score: {
    runs: number;
    wickets: number;
    overs: string;
  };
  team2Score: {
    runs: number;
    wickets: number;
    overs: string;
  };
  balls: BallEntry[];
  currentBatter?: string;
  currentBowler?: string;
  striker?: string;
  nonStriker?: string;
}

export default function LiveScoringScreen({ matchId, onClose }: { matchId: string; onClose: () => void }) {
  const [liveScore, setLiveScore] = useState<LiveScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBallEntryModal, setShowBallEntryModal] = useState(false);
  const [ballRuns, setBallRuns] = useState('0');
  const [ballType, setBallType] = useState<'normal' | 'wide' | 'no-ball' | 'bye' | 'leg-bye'>('normal');
  const [isWicket, setIsWicket] = useState(false);

  useEffect(() => {
    loadLiveScore();
    const interval = setInterval(loadLiveScore, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [matchId]);

  const loadLiveScore = async () => {
    try {
      const response = await liveScoringService.getMatchLiveScore(matchId);
      if (response.success && response.data) {
        setLiveScore(response.data);
      }
    } catch (error) {
      console.error('Failed to load live score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBall = async () => {
    try {
      const newBall: any = {
        overNumber: 1,
        ballNumber: 1,
        runs: parseInt(ballRuns) || 0,
        type: ballType,
        isWicket,
      };

      const response = await liveScoringService.addBallEntry(matchId, newBall);
      if (response.success) {
        Alert.alert('Success', 'Ball entry added successfully');
        setShowBallEntryModal(false);
        setBallRuns('0');
        setBallType('normal');
        setIsWicket(false);
        loadLiveScore();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add ball entry');
    }
  };

  const renderBallEntry = ({ item }: { item: BallEntry }) => (
    <View style={styles.ballEntryItem}>
      <Text style={styles.ballNumber}>
        Over {item.overNumber}.{item.ballNumber}
      </Text>
      <Text style={styles.ballRuns}>{item.runs}</Text>
      {item.type !== 'normal' && <Text style={styles.ballType}>{item.type}</Text>}
      {item.isWicket && <Text style={styles.wicketBadge}>W</Text>}
    </View>
  );

  if (loading || !liveScore) {
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Match Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{liveScore.match.title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Score Cards */}
        <View style={styles.scoresContainer}>
          <ScoreCard
            teamName={liveScore.match.team1.name}
            runs={liveScore.team1Score.runs}
            wickets={liveScore.team1Score.wickets}
            overs={liveScore.team1Score.overs}
            isActive={true}
          />
          <View style={styles.vsContainer}>
            <Text style={styles.vs}>vs</Text>
          </View>
          <ScoreCard
            teamName={liveScore.match.team2.name}
            runs={liveScore.team2Score.runs}
            wickets={liveScore.team2Score.wickets}
            overs={liveScore.team2Score.overs}
            isActive={false}
          />
        </View>

        {/* Current Match Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Striker</Text>
            <Text style={styles.infoValue}>{liveScore.striker || 'N/A'}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Bowler</Text>
            <Text style={styles.infoValue}>{liveScore.currentBowler || 'N/A'}</Text>
          </View>
        </View>

        {/* Recent Balls */}
        <View style={styles.ballsSection}>
          <Text style={styles.sectionTitle}>Recent Deliveries</Text>
          <FlatList
            data={liveScore.balls.slice(-12)}
            renderItem={renderBallEntry}
            keyExtractor={(item) => item.id}
            numColumns={6}
            scrollEnabled={false}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.addBallButton}
            onPress={() => setShowBallEntryModal(true)}
          >
            <Text style={styles.addBallButtonText}>Add Ball</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.endInningsButton}>
            <Text style={styles.endInningsButtonText}>End Innings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Ball Entry Modal */}
      <Modal
        visible={showBallEntryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBallEntryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Ball Entry</Text>

            {/* Runs Input */}
            <Text style={styles.inputLabel}>Runs on Ball:</Text>
            <View style={styles.runsButtonGroup}>
              {[0, 1, 2, 3, 4, 5, 6].map((run) => (
                <TouchableOpacity
                  key={run}
                  style={[
                    styles.runButton,
                    ballRuns === run.toString() && styles.runButtonActive,
                  ]}
                  onPress={() => setBallRuns(run.toString())}
                >
                  <Text
                    style={[
                      styles.runButtonText,
                      ballRuns === run.toString() && styles.runButtonTextActive,
                    ]}
                  >
                    {run}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Ball Type */}
            <Text style={styles.inputLabel}>Ball Type:</Text>
            <View style={styles.typeButtonGroup}>
              {(['normal', 'wide', 'no-ball', 'bye', 'leg-bye'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    ballType === type && styles.typeButtonActive,
                  ]}
                  onPress={() => setBallType(type)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      ballType === type && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Wicket Checkbox */}
            <TouchableOpacity
              style={styles.wicketCheckbox}
              onPress={() => setIsWicket(!isWicket)}
            >
              <View style={[styles.checkbox, isWicket && styles.checkboxActive]}>
                {isWicket && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Is Wicket</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowBallEntryModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleAddBall}
              >
                <Text style={styles.modalSaveButtonText}>Add Ball</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const ScoreCard = ({
  teamName,
  runs,
  wickets,
  overs,
  isActive,
}: {
  teamName: string;
  runs: number;
  wickets: number;
  overs: string;
  isActive: boolean;
}) => (
  <View style={[styles.scoreCard, isActive && styles.scoreCardActive]}>
    <Text style={styles.teamName}>{teamName}</Text>
    <View style={styles.scoreDisplay}>
      <Text style={styles.scoreRuns}>{runs}</Text>
      <Text style={styles.scoreWickets}>/{wickets}</Text>
    </View>
    <Text style={styles.scoreOvers}>{overs}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  vsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  vs: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  scoreCardActive: {
    borderColor: '#1976d2',
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreRuns: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  scoreWickets: {
    fontSize: 20,
    color: '#999',
    marginLeft: 4,
  },
  scoreOvers: {
    fontSize: 12,
    color: '#666',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  ballsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ballEntryItem: {
    width: '16.6%',
    aspectRatio: 1,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    padding: 4,
  },
  ballNumber: {
    fontSize: 10,
    color: '#999',
  },
  ballRuns: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  ballType: {
    fontSize: 8,
    color: '#999',
  },
  wicketBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addBallButton: {
    flex: 1,
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addBallButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  endInningsButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  endInningsButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  runsButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  runButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  runButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  runButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  runButtonTextActive: {
    color: '#fff',
  },
  typeButtonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  wicketCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  modalSaveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
