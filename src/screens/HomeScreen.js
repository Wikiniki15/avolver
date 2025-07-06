import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = () => {
  const { user, userMode, logout } = useAuth();

  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={styles.welcome}>
          ¡Bienvenido, {user?.name}!
        </Text>
        <Text style={styles.mode}>
          Modo: {userMode === 'passenger' ? 'Pasajero' : 'Conductor'}
        </Text>
        <Button
          title="Cerrar Sesión"
          onPress={logout}
          variant="danger"
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray[800],
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  mode: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  logoutButton: {
    marginTop: SPACING.lg,
  },
});

export default HomeScreen;