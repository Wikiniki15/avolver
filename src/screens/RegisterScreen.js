import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { COLORS, SPACING, SIZES } from '../utils/constants';

const RegisterScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const userMode = route?.params?.mode || 'passenger';

  const handleRegister = async () => {
  // Validaciones
  if (!name.trim()) {
    Alert.alert('Error', 'El nombre es obligatorio');
    return;
  }
  
  if (!email.trim()) {
    Alert.alert('Error', 'El correo electrónico es obligatorio');
    return;
  }
  
  if (!phone.trim()) {
    Alert.alert('Error', 'El teléfono es obligatorio');
    return;
  }
  
  if (!password || password.length < 6) {
    Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  if (password !== confirmPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  setIsLoading(true);
  
  try {
    // Registrar usuario
    const result = await register(name, email, phone, password, userMode);
    
    if (!result.success) {
      Alert.alert('Error', result.error);
      return;
    }
    
    Alert.alert(
      'Cuenta Creada',
      `Tu cuenta de ${userMode === 'passenger' ? 'pasajero' : 'conductor'} ha sido creada exitosamente.`,
      [
        {
          text: 'Iniciar Sesión',
          onPress: async () => {
            // Automaticamente hacer login después del registro
            const loginResult = await login(email, password, userMode);
            if (!loginResult.success) {
              Alert.alert('Error', 'Error al iniciar sesión automáticamente');
            }
          }
        }
      ]
    );
    
  } catch (error) {
    Alert.alert('Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
  } finally {
    setIsLoading(false);
  }
};

  const goToLogin = () => {
    navigation.goBack();
  };


  if (isLoading) {
    return <LoadingSpinner text="Creando cuenta..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Logo y Título */}
            <View style={styles.logoContainer}>
  <View style={styles.logoCircle}>
    <Icon name="person-add" size={40} color={COLORS.primary} />
  </View>
  <Text style={styles.title}>Crear Cuenta</Text>
  <Text style={styles.subtitle}>Únete a A Volver</Text>
</View>
            {/* Formulario */}
            <View style={styles.form}>
              <Input
                label="Nombre Completo"
                value={name}
                onChangeText={setName}
                placeholder="Ej: Juan Pérez"
                leftIcon="person-outline"
                autoCapitalize="words"
              />
              
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
                label="Teléfono"
                value={phone}
                onChangeText={setPhone}
                placeholder="+593 99 123 4567"
                keyboardType="phone-pad"
                leftIcon="call-outline"
              />
              
              <Input
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                leftIcon="lock-closed-outline"
              />
              
              <Input
                label="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repite tu contraseña"
                secureTextEntry
                leftIcon="lock-closed-outline"
              />
            </View>

            {/* Botón de Registro */}
            <Button
  title={`Crear Cuenta ${userMode === 'passenger' ? 'de Pasajero' : 'de Conductor'}`}
  onPress={handleRegister}
  style={styles.registerButton}
/>

            {/* Enlace a Login */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={goToLogin}>
                <Text style={styles.loginLinkButton}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
},
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: COLORS.secondary,
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
  registerButton: {
    marginBottom: SPACING.lg,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
  },
  loginLinkButton: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;