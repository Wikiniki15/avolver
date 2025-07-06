import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { COLORS, SPACING, SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('usuario@test.com');
  const [password, setPassword] = useState('123456');
  const [selectedMode, setSelectedMode] = useState('passenger');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, selectedMode);
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Error al iniciar sesión');
    }
    setIsLoading(false);
  };

  const ModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'passenger' && styles.modeButtonActive
        ]}
        onPress={() => setSelectedMode('passenger')}
      >
        <Icon 
          name="person" 
          size={16} 
          color={selectedMode === 'passenger' ? COLORS.white : COLORS.gray[600]} 
        />
        <Text style={[
          styles.modeButtonText,
          selectedMode === 'passenger' && styles.modeButtonTextActive
        ]}>
          Pasajero
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.modeButton,
          selectedMode === 'driver' && styles.modeButtonActive
        ]}
        onPress={() => setSelectedMode('driver')}
      >
        <Icon 
          name="car" 
          size={16} 
          color={selectedMode === 'driver' ? COLORS.white : COLORS.gray[600]} 
        />
        <Text style={[
          styles.modeButtonText,
          selectedMode === 'driver' && styles.modeButtonTextActive
        ]}>
          Conductor
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Logo y Título */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Icon name="navigate" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>A Volver</Text>
            <Text style={styles.subtitle}>Tu transporte universitario</Text>
          </View>

          {/* Selector de Modo */}
          <ModeSelector />

          {/* Formulario */}
          <View style={styles.form}>
            <Input
              label="Correo Electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />
            
            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              leftIcon="lock-closed-outline"
            />
          </View>

          {/* Botón de Login */}
          <Button
            title={`Iniciar Sesión como ${selectedMode === 'passenger' ? 'Pasajero' : 'Conductor'}`}
            onPress={handleLogin}
            style={styles.loginButton}
          />

          {/* Enlaces adicionales */}
          <View style={styles.links}>
            <TouchableOpacity>
              <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>Crear cuenta nueva</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.white,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.white,
    opacity: 0.8,
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    marginLeft: SPACING.xs,
    fontSize: SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray[600],
  },
  modeButtonTextActive: {
    color: COLORS.white,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  loginButton: {
    marginBottom: SPACING.lg,
  },
  links: {
    alignItems: 'center',
  },
  linkText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    marginVertical: SPACING.xs,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;