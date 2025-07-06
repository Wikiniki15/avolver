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

  // Reemplazar el componente TripStatus con este:
const BusRoutes = () => {
  if (!activeRequest) return null;

  const busRoutes = [
    {
      id: 1,
      name: 'Línea 15 - Centro Histórico',
      duration: '25 min',
      frequency: 'Cada 8 minutos',
      nextBus: '3 min',
      route: 'Universidad → Plaza Grande → Destino'
    },
    {
      id: 2,
      name: 'Línea 23 - Quitumbe',
      duration: '32 min',
      frequency: 'Cada 12 minutos',
      nextBus: '7 min',
      route: 'Universidad → Terminal Sur → Destino'
    },
    {
      id: 3,
      name: 'Línea 8 - La Marín',
      duration: '28 min',
      frequency: 'Cada 10 minutos',
      nextBus: '15 min',
      route: 'Universidad → La Marín → Destino'
    }
  ];

  const handleBusPress = (bus) => {
    Alert.alert(
      bus.name,
      `Ruta: ${bus.route}\n\nFrecuencia: ${bus.frequency}\nPróximo bus: ${bus.nextBus}\nTiempo al destino: ${bus.duration}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ver Horarios Completos', onPress: () => {
          // Aquí podrías navegar a una pantalla de horarios detallados
          Alert.alert('Horarios', 'Función de horarios detallados próximamente');
        }}
      ]
    );
  };

  return (
    <View style={globalStyles.card}>
      <View style={styles.routesHeader}>
        <Text style={globalStyles.subtitle}>Rutas Disponibles</Text>
        <TouchableOpacity onPress={() => setActiveRequest(null)}>
          <Icon name="close-outline" size={24} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <Icon name="location-outline" size={16} color={COLORS.success} />
          <Text style={styles.routeLocationText}>{activeRequest.origin}</Text>
        </View>
        <View style={styles.routeArrow}>
          <Icon name="arrow-down-outline" size={16} color={COLORS.gray[400]} />
        </View>
        <View style={styles.routeItem}>
          <Icon name="flag-outline" size={16} color={COLORS.danger} />
          <Text style={styles.routeLocationText}>{activeRequest.destination}</Text>
        </View>
      </View>

      <View style={styles.busList}>
        {busRoutes.map(bus => (
          <TouchableOpacity 
            key={bus.id} 
            style={styles.busRouteItem}
            onPress={() => handleBusPress(bus)}
          >
            <View style={styles.busIcon}>
              <Icon name="bus-outline" size={20} color={COLORS.primary} />
            </View>
            
            <View style={styles.busRouteInfo}>
              <Text style={styles.busName}>{bus.name}</Text>
              <Text style={styles.busRoute}>{bus.route}</Text>
              <View style={styles.busDetails}>
                <Text style={styles.busFrequency}>{bus.frequency}</Text>
                <Text style={styles.busSeparator}>•</Text>
                <Text style={styles.busNext}>Próximo: {bus.nextBus}</Text>
              </View>
            </View>
            
            <View style={styles.busDuration}>
              <Text style={styles.durationText}>{bus.duration}</Text>
              <Text style={styles.durationLabel}>al destino</Text>
              <Icon name="chevron-forward-outline" size={16} color={COLORS.gray[400]} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Nueva Búsqueda"
        variant="secondary"
        onPress={() => setActiveRequest(null)}
        style={styles.newSearchButton}
      />
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
        <BusRoutes />
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
  routeText: {
    marginLeft: SPACING.sm,
    flex: 1,
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
routesHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: SPACING.md,
},
routeInfo: {
  alignItems: 'center',
  marginBottom: SPACING.lg,
  paddingVertical: SPACING.md,
  backgroundColor: COLORS.gray[50],
  borderRadius: 8,
},
routeItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: SPACING.xs,
},
routeLocationText: {
  marginLeft: SPACING.xs,
  fontSize: SIZES.sm,
  color: COLORS.gray[700],
  fontWeight: '500',
},
routeArrow: {
  marginVertical: SPACING.xs,
},
busRouteItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.white,
  borderRadius: 12,
  padding: SPACING.md,
  marginBottom: SPACING.sm,
  borderWidth: 1,
  borderColor: COLORS.gray[200],
},
busRouteInfo: {
  flex: 1,
  marginLeft: SPACING.sm,
},
busName: {
  fontSize: SIZES.md,
  fontWeight: '600',
  color: COLORS.gray[800],
  marginBottom: SPACING.xs,
},
busRoute: {
  fontSize: SIZES.sm,
  color: COLORS.gray[600],
  marginBottom: SPACING.xs,
},
busDetails: {
  flexDirection: 'row',
  alignItems: 'center',
},
busFrequency: {
  fontSize: SIZES.xs,
  color: COLORS.success,
  fontWeight: '500',
},
busSeparator: {
  fontSize: SIZES.xs,
  color: COLORS.gray[400],
  marginHorizontal: SPACING.xs,
},
busNext: {
  fontSize: SIZES.xs,
  color: COLORS.primary,
  fontWeight: '500',
},
busDuration: {
  alignItems: 'flex-end',
},
durationText: {
  fontSize: SIZES.md,
  fontWeight: '600',
  color: COLORS.primary,
},
durationLabel: {
  fontSize: SIZES.xs,
  color: COLORS.gray[600],
  marginBottom: SPACING.xs,
},
newSearchButton: {
  marginTop: SPACING.md,
},
});

export default PassengerHomeScreen;