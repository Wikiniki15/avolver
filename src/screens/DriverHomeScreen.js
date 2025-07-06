import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import { COLORS, SPACING, SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

const DriverHomeScreen = () => {
  const { user, logout } = useAuth();
  const [driverStatus, setDriverStatus] = useState('offline');
  const [currentLocation, setCurrentLocation] = useState('Quito Centro');
  const [dailyStats, setDailyStats] = useState({
    trips: 12,
    earnings: 45.50,
    onlineTime: '6h 30m',
    rating: 4.8
  });
  const [refreshing, setRefreshing] = useState(false);

  const handleStatusToggle = async () => {
    const newStatus = driverStatus === 'online' ? 'offline' : 'online';
    
    if (driverStatus === 'online') {
      Alert.alert(
        'Desconectarse',
        '¿Estás seguro de que deseas desconectarte? No recibirás más solicitudes.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desconectar',
            style: 'destructive',
            onPress: () => setDriverStatus(newStatus)
          }
        ]
      );
    } else {
      setDriverStatus(newStatus);
      Alert.alert(
        'Conectado',
        '¡Ahora estás en línea! Comenzarás a recibir solicitudes de transporte.'
      );
    }
  };

  const handleLocationUpdate = () => {
    Alert.alert(
      'Actualizar Ubicación',
      'Tu ubicación se actualizará automáticamente usando GPS',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Actualizar',
          onPress: () => setCurrentLocation('Nueva ubicación GPS')
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setDailyStats(prev => ({
        ...prev,
        trips: prev.trips + 1,
        earnings: prev.earnings + 3.50
      }));
      setRefreshing(false);
    }, 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  // Componente Header
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Icon name="car" size={24} color={COLORS.secondary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>Conductor: {user?.name}</Text>
            <Text style={styles.subtitleText}>Placa: ABC-123</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLogout} style={styles.actionButton}>
            <Icon name="log-out-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Componente de Control de Estado
  const StatusToggle = () => {
    const isOnline = driverStatus === 'online';

    return (
      <View style={globalStyles.card}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusCircle, isOnline ? styles.onlineCircle : styles.offlineCircle]}>
            <View style={[styles.innerCircle, isOnline ? styles.onlineInner : styles.offlineInner]}>
              <Icon name="car" size={32} color={COLORS.white} />
            </View>
          </View>
          
          <Text style={styles.statusTitle}>
            Estado: {isOnline ? 'En Línea' : 'Fuera de Línea'}
          </Text>
          
          <Button
            title={isOnline ? 'Desconectarse' : 'Conectarse'}
            variant={isOnline ? 'danger' : 'secondary'}
            onPress={handleStatusToggle}
            size="large"
            style={styles.toggleButton}
            textStyle={styles.toggleButtonText}
          />
        </View>
      </View>
    );
  };

  // Componente de Ubicación
  const LocationCard = () => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.subtitle}>Ubicación Actual</Text>
      
      <View style={styles.locationInfo}>
        <Icon name="location-outline" size={20} color={COLORS.primary} />
        <Text style={styles.locationText}>{currentLocation}</Text>
      </View>
      
      <Button
        title="Actualizar Ubicación"
        variant="secondary"
        onPress={handleLocationUpdate}
        style={styles.updateButton}
      />
    </View>
  );

  // Componente de Estadísticas
  const DailyStats = () => {
    const statsConfig = [
      {
        icon: 'checkmark-circle-outline',
        value: dailyStats.trips,
        label: 'Viajes Completados',
        color: COLORS.primary,
      },
      {
        icon: 'cash-outline',
        value: `$${dailyStats.earnings}`,
        label: 'Ganancias',
        color: COLORS.success,
      },
      {
        icon: 'time-outline',
        value: dailyStats.onlineTime,
        label: 'Tiempo Online',
        color: COLORS.warning,
      },
      {
        icon: 'star-outline',
        value: dailyStats.rating,
        label: 'Calificación',
        color: '#9333EA',
      },
    ];

    return (
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Estadísticas de Hoy</Text>
        
        <View style={styles.statsGrid}>
          {statsConfig.map((stat, index) => (
            <View 
              key={index} 
              style={[styles.statCard, { backgroundColor: stat.color + '10' }]}
            >
              <Icon name={stat.icon} size={24} color={stat.color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Componente de Solicitudes en Espera
  const WaitingRequests = () => {
    if (driverStatus !== 'online') return null;

    return (
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Esperando Solicitudes...</Text>
        <View style={styles.waitingContainer}>
          <Icon name="time-outline" size={48} color={COLORS.gray[400]} />
          <Text style={styles.waitingText}>
            Te notificaremos cuando recibas una nueva solicitud de transporte
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <Header />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <StatusToggle />
        <LocationCard />
        <DailyStats />
        <WaitingRequests />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    ...globalStyles.shadow,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.gray[800],
  },
  subtitleText: {
    fontSize: SIZES.sm,
    color: COLORS.gray[600],
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  onlineCircle: {
    backgroundColor: COLORS.success + '30',
  },
  offlineCircle: {
    backgroundColor: COLORS.gray[200],
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineInner: {
    backgroundColor: COLORS.success,
  },
  offlineInner: {
    backgroundColor: COLORS.gray[400],
  },
  statusTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray[800],
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  statusDescription: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
 toggleButton: {
  paddingHorizontal: SPACING.xl,
  paddingVertical: SPACING.lg,
  minWidth: 200,
},
 toggleButtonText: { 
  fontSize: SIZES.xxl,    
  fontWeight: 'bold',     
},
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  locationText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginLeft: SPACING.sm,
    flex: 1,
  },
  updateButton: {
    marginTop: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  statIcon: {
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: SIZES.xs,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  waitingText: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});

export default DriverHomeScreen;