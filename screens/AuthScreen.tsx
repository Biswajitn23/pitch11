import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

type AuthMode = 'login' | 'register';
type UserRole = 'player' | 'coach' | 'scorer' | 'umpire' | 'admin' | 'ground_staff';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<UserRole>('player');

  const roles: { label: string; value: UserRole }[] = [
    { label: 'Player', value: 'player' },
    { label: 'Coach', value: 'coach' },
    { label: 'Scorer', value: 'scorer' },
    { label: 'Umpire', value: 'umpire' },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !name || !mobile) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await register(name, email, mobile, password, role);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#1A237E', '#283593']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated background circles */}
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />
        
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.logoBadge}
                >
                  <Text style={styles.cricketEmoji}>🏏</Text>
                </LinearGradient>
                <Text style={styles.logo}>PITCH11</Text>
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>✨ PREMIUM</Text>
                </View>
              </View>
              <Text style={styles.tagline}>Elite Cricket Platform for Champions</Text>
            </View>

            {mode === 'login' ? (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.titleEmoji}>👋</Text>
                </View>
                <Text style={styles.subtitle}>Sign in to access your cricket dashboard</Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      editable={!loading}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#424242', '#616161'] : ['#00E5FF', '#00B8D4', '#0091EA']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Sign In</Text>
                        <Text style={styles.buttonArrow}>→</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.switchMode}>
                  <Text style={styles.switchText}>New to PITCH11? </Text>
                  <TouchableOpacity onPress={() => setMode('register')}>
                    <Text style={styles.switchLink}>Create Account →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <View style={styles.formHeader}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.titleEmoji}>🎯</Text>
                </View>
                <Text style={styles.subtitle}>Join the elite cricket community</Text>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your name"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      value={name}
                      onChangeText={setName}
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      editable={!loading}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>📱</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter mobile number"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      keyboardType="phone-pad"
                      value={mobile}
                      onChangeText={setMobile}
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.inputIconContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                  </View>
                  <View style={styles.inputContent}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor="rgba(255, 255, 255, 0.4)"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                      editable={!loading}
                    />
                  </View>
                </View>

                <View style={styles.roleSelector}>
                  <Text style={styles.roleSelectorTitle}>Select Your Role</Text>
                  <View style={styles.rolesGrid}>
                    {roles.map((r) => (
                      <TouchableOpacity
                        key={r.value}
                        style={[
                          styles.roleCard,
                          role === r.value && styles.roleCardActive,
                        ]}
                        onPress={() => setRole(r.value)}
                        disabled={loading}
                        activeOpacity={0.7}
                      >
                        <LinearGradient
                          colors={role === r.value ? ['#00E5FF', '#00B8D4'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
                          style={styles.roleCardGradient}
                        >
                          <Text style={styles.roleEmoji}>
                            {r.value === 'player' ? '🏏' : r.value === 'coach' ? '👨‍🏫' : r.value === 'scorer' ? '📊' : '⚖️'}
                          </Text>
                          <Text style={[styles.roleCardText, role === r.value && styles.roleCardTextActive]}>
                            {r.label}
                          </Text>
                          {role === r.value && (
                            <View style={styles.roleCheckmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.button, loading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={loading ? ['#424242', '#616161'] : ['#00E5FF', '#00B8D4', '#0091EA']}
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Create Account</Text>
                        <Text style={styles.buttonArrow}>→</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.switchMode}>
                  <Text style={styles.switchText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => setMode('login')}>
                    <Text style={styles.switchLink}>Sign In →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  circleTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(0, 184, 212, 0.08)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cricketEmoji: {
    fontSize: 44,
  },
  logo: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 229, 255, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 8,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: 32,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginRight: 12,
  },
  titleEmoji: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  inputIconContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  inputIcon: {
    fontSize: 24,
  },
  inputContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    color: '#fff',
    padding: 0,
  },
  roleSelector: {
    marginBottom: 28,
  },
  roleSelectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roleCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  roleCardGradient: {
    aspectRatio: 1.5,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  roleCardActive: {
    transform: [{ scale: 1.02 }],
  },
  roleCheckmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#00B8D4',
    fontSize: 14,
    fontWeight: 'bold',
  },
  roleEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  roleCardText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  roleCardTextActive: {
    color: '#fff',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    padding: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  buttonArrow: {
    color: '#fff',
    fontSize: 22,
    marginLeft: 12,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  switchMode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
  },
  switchLink: {
    color: '#00E5FF',
    fontSize: 15,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 229, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
