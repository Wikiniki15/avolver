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
import Input from '../components/common/Input';
import { COLORS, SPACING, SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

const PassengerHomeScreen = () => {
  const { user, logout } = useAuth();
  const [activeRequest, setActiveRequest] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [nearbyBuses, setNearbyBuses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simular buses cercanos
  useEffect(() => {
    loadNearbyBuses();
  }, []);

  const loadNearbyBuses = () => {
    const mockBuses = [
      { id: 1, plate: 'ABC-123', distance: '2 min', available: true },
      { id: 2, plate: 'DEF-456', distance: '5 min', available: true },
      { id: 3, plate: 'GHI-789', distance: '8 min', available: false },
    ];
    setNearbyBuses(mockBuses);
  };

  const handleTransportRequest = async () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Error', 'Por favor completa origen y destino');
      return;
    }

    setLoading(true);
    
    // Crear solicitud
    const newRequest = {
      id: Date.now(),
      origin: origin.trim(),
      destination: destination.trim(),
      status: 'searching',
      requestedAt: new Date(),
    };
    
    setActiveRequest(newRequest);
    
    // Simular búsqueda de conductor
    setTimeout(() => {
      setActiveRequest(prev => ({
        ...prev,
        status: 'assigned',
        driver: {
          id: 1,
          name: 'Carlos Conductor',
          plate: 'ABC-123',
          rating: 4.8,
          phone: '+593 99 987 6543',
          estimatedArrival: 3
        }
      }));
      setLoading(false);
    }, 3000);
    
    // Limpiar formulario
    setOrigin('');
    setDestination('');
  };

  const handleCancelRequest = () => {
    Alert.alert(
      'Cancelar Solicitud',
      '¿Estás seguro de que deseas cancelar esta solicitud?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: () => setActiveRequest(null)
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    loadNearbyBuses();
    setRefreshing(false);
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
            <Icon name="person" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.welcomeText}>¡Hola, {user?.name}!</Text>
            <Text style={styles.subtitleText}>¿A dónde vamos hoy?</Text>
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

  // Componente de Estado del Viaje
  const TripStatus = () => {
    if (!activeRequest) return null;

    const getStatusInfo = () => {
      switch (activeRequest.status) {
        case 'searching':
          return {
            text: 'Buscando conductor...',
            color: COLORS.warning,
            icon: 'search-outline'
          };
        case 'assigned':
          return {
            text: 'Conductor asignado',
            color: COLORS.success,
            icon: 'checkmark-circle-outline'
          };
        default:
          return {
            text: 'En progreso',
            color: COLORS.primary,
            icon: 'car-outline'
          };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <View style={globalStyles.card}>
        <View style={styles.statusHeader}>
          <Text style={globalStyles.subtitle}>Estado del Viaje</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Icon name={statusInfo.icon} size={16} color={COLORS.white} />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.routeItem}>
            <Icon name="location-outline" size={20} color={COLORS.success} />
            <View style={styles.routeText}>
              <Text style={globalStyles.textBold}>Origen</Text>
              <Text style={globalStyles.text}>{activeRequest.origin}</Text>
            </View>
          </View>

          <View style={styles.routeItem}>
            <Icon name="flag-outline" size={20} color={COLORS.danger} />
            <View style={styles.routeText}>
              <Text style={globalStyles.textBold}>Destino</Text>
              <Text style={globalStyles.text}>{activeRequest.destination}</Text>
            </View>
          </View>
        </View>

        {/* Información del Conductor */}
        {activeRequest.driver && (
          <View style={styles.driverInfo}>
            <View style={styles.driverHeader}>
              <View style={styles.driverAvatar}>
                <Icon name="person" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.driverDetails}>
                <Text style={globalStyles.textBold}>{activeRequest.driver.name}</Text>
                <Text style={globalStyles.text}>Placa: {activeRequest.driver.plate}</Text>
              </View>
              <View style={styles.driverStats}>
                <View style={styles.rating}>
                  <Icon name="star" size={16} color={COLORS.warning} />
                  <Text style={styles.ratingText}>{activeRequest.driver.rating}</Text>
                </View>
                <Text style={styles.arrivalText}>
                  Llegada: {activeRequest.driver.estimatedArrival} min
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones de Acción */}
        <View style={styles.actions}>
          {activeRequest.status === 'searching' && (
            <Button
              title="Cancelar Solicitud"
              variant="danger"
              onPress={handleCancelRequest}
              style={styles.actionButton}
            />
          )}
          
          {activeRequest.driver && (
            <View style={styles.driverActions}>
              <Button
                title="Llamar"
                variant="secondary"
                size="small"
                style={styles.callButton}
              />
              <Button
                title="Ver en Mapa"
                size="small"
                style={styles.mapButton}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  // Componente de Solicitud de Transporte
  const TransportRequest = () => {
    if (activeRequest) return null;

    return (
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Buscar Transporte</Text>        
        <View style={styles.form}>
          <Input
            label="Punto de Origen"
            value={origin}
            onChangeText={setOrigin}
            placeholder="Ej: Universidad Central del Ecuador"
            leftIcon="location-outline"
          />
          
          <Input
            label="Destino"
            value={destination}
            onChangeText={setDestination}
            placeholder="Ej: Plaza San Francisco"
            leftIcon="flag-outline"
          />
          
          <Button
            title="Solicitar Rutas"
            onPress={handleTransportRequest}
            disabled={!origin.trim() || !destination.trim()}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </View>
    );
  };

  // Componente de Buses Cercanos
  const NearbyBuses = () => {
    if (activeRequest) return null;

    return (
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Buses Cercanos</Text>
        
        <View style={styles.busList}>
          {nearbyBuses.map(bus => (
            <View key={bus.id} style={styles.busItem}>
              <View style={styles.busIcon}>
                <Icon name="bus-outline" size={20} color={COLORS.primary} />
              </View>
              
              <View style={styles.busInfo}>
                <Text style={globalStyles.textBold}>Placa: {bus.plate}</Text>
                <Text style={[
                  globalStyles.text, 
                  { color: bus.available ? COLORS.success : COLORS.gray[400] }
                ]}>
                  {bus.available ? 'Disponible' : 'No disponible'}
                </Text>
              </View>
              
              <View style={styles.busDistance}>
                <Text style={styles.distanceText}>{bus.distance}</Text>
                <Text style={styles.distanceLabel}>de distancia</Text>
              </View>
            </View>
          ))}
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
        <TripStatus />
        <TransportRequest />
        <NearbyBuses />
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  statusText: {
    color: COLORS.white,
    fontSize: SIZES.sm,
    fontWeight: '500',
    marginLeft: SPACING.xs,
  },
  routeInfo: {
    marginBottom: SPACING.md,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  routeText: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  driverInfo: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  driverStats: {
    alignItems: 'flex-end',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  ratingText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    marginLeft: SPACING.xs,
    color: COLORS.gray[700],
  },
  arrivalText: {
    fontSize: SIZES.sm,
    color: COLORS.gray[600],
  },
  driverActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  callButton: {
    flex: 0.48,
  },
  mapButton: {
    flex: 0.48,
  },
  form: {
    marginTop: SPACING.md,
  },
  submitButton: {
    marginTop: SPACING.sm,
  },
  busList: {
    marginTop: SPACING.md,
  },
  busItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  busIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primary + '20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  busInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  busDistance: {
    alignItems: 'flex-end',
  },
  distanceText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  distanceLabel: {
    fontSize: SIZES.sm,
    color: COLORS.gray[600],
  },
});

export default PassengerHomeScreen;