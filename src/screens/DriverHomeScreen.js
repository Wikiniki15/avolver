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

import Button from '../components/common/Button';
import { COLORS, SPACING, SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';
import { useAuth } from '../context/AuthContext';
import { Modal, TextInput } from 'react-native';

const DriverHomeScreen = () => {
  const { user, logout, getUnitInfo, saveUnitInfo } = useAuth();
  const [driverStatus, setDriverStatus] = useState('offline');
  const [currentLocation, setCurrentLocation] = useState('Quito Centro');
  const [dailyStats, setDailyStats] = useState({
    trips: 12,
    earnings: 45.50,
    onlineTime: '6h 30m',
    rating: 4.8
  });
  const [refreshing, setRefreshing] = useState(false);
  const [unitInfo, setUnitInfo] = useState(null);  // ← ESTA LÍNEA
  const [showUnitModal, setShowUnitModal] = useState(false);
const [unitFormData, setUnitFormData] = useState({
  unitNumber: '',
  cooperative: '',
  routeNumber: '',
  operationZone: ''
});

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
  
// Componente UnitInfo completo (sin estados internos)
const UnitInfo = () => {
  const handleRegisterUnit = () => {
    setShowUnitModal(true);
  };

  // Si no tiene información registrada
  if (!unitInfo) {
    return (
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Información de Unidad</Text>
        
        <View style={styles.noUnitInfo}>
          <Icon name="car-outline" size={64} color={COLORS.gray[300]} />
          <Text style={styles.noUnitInfoTitle}>Sin Información de Unidad</Text>
          <Text style={styles.noUnitInfoText}>
            Registra la información de tu unidad para poder operar
          </Text>
          
          <Button
            title="Registrar Unidad"
            onPress={handleRegisterUnit}
            style={styles.registerUnitButton}
          />
        </View>
      </View>
    );
  }

  // Si ya tiene información registrada
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.subtitle}>Información de Unidad</Text>
      
      <View style={styles.unitInfoContainer}>
        <View style={styles.unitInfoRow}>
          <View style={styles.unitInfoIcon}>
            <Icon name="id-card-outline" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.unitInfoText}>
            <Text style={styles.unitInfoLabel}>Número de Unidad</Text>
            <Text style={styles.unitInfoValue}>{unitInfo.unitNumber}</Text>
          </View>
        </View>

        <View style={styles.unitInfoRow}>
          <View style={styles.unitInfoIcon}>
            <Icon name="business-outline" size={20} color={COLORS.secondary} />
          </View>
          <View style={styles.unitInfoText}>
            <Text style={styles.unitInfoLabel}>Cooperativa</Text>
            <Text style={styles.unitInfoValue}>{unitInfo.cooperative}</Text>
          </View>
        </View>

        <View style={styles.unitInfoRow}>
          <View style={styles.unitInfoIcon}>
            <Icon name="navigate-outline" size={20} color={COLORS.warning} />
          </View>
          <View style={styles.unitInfoText}>
            <Text style={styles.unitInfoLabel}>Número de Ruta</Text>
            <Text style={styles.unitInfoValue}>{unitInfo.routeNumber}</Text>
          </View>
        </View>

        <View style={styles.unitInfoRow}>
          <View style={styles.unitInfoIcon}>
            <Icon name="location-outline" size={20} color={COLORS.danger} />
          </View>
          <View style={styles.unitInfoText}>
            <Text style={styles.unitInfoLabel}>Zona de Operación</Text>
            <Text style={styles.unitInfoValue}>{unitInfo.operationZone}</Text>
          </View>
        </View>
      </View>

      <Button
        title="Editar Información"
        variant="secondary"
        size="small"
        onPress={handleRegisterUnit}
        style={styles.editInfoButton}
      />
    </View>
  );
};

const handleSaveUnit = () => {
  // Validar número de unidad
  if (!unitFormData.unitNumber || unitFormData.unitNumber.length !== 4) {
    Alert.alert('Error', 'El número de unidad debe tener 4 dígitos');
    return;
  }
  
  if (!unitFormData.cooperative.trim()) {
    Alert.alert('Error', 'La cooperativa es obligatoria');
    return;
  }
  
  if (!unitFormData.routeNumber.trim()) {
    Alert.alert('Error', 'El número de ruta es obligatorio');
    return;
  }
  
  if (!unitFormData.operationZone.trim()) {
    Alert.alert('Error', 'La zona de operación es obligatoria');
    return;
  }

  // Crear la información de unidad
  const newUnitInfo = {
    unitNumber: unitFormData.unitNumber,
    cooperative: unitFormData.cooperative.trim(),
    routeNumber: unitFormData.routeNumber.trim(),
    operationZone: unitFormData.operationZone.trim()
  };
  
  // ACTUALIZAR en el componente UnitInfo
  setUnitInfo(newUnitInfo);
  
  // Cerrar modal
  setShowUnitModal(false);
  
  // Limpiar formulario
  setUnitFormData({
    unitNumber: '',
    cooperative: '',
    routeNumber: '',
    operationZone: ''
  });
  
  Alert.alert('¡Éxito!', 'Tu información de unidad ha sido registrada correctamente');
};

const closeModal = () => {
  setShowUnitModal(false);
  setUnitFormData({
    unitNumber: '',
    cooperative: '',
    routeNumber: '',
    operationZone: ''
  });
};

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
    <Modal
  visible={showUnitModal}
  animationType="slide"
  transparent={true}
  onRequestClose={closeModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Header del Modal */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Registrar Unidad</Text>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Icon name="close" size={24} color={COLORS.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Icono Central */}
      <View style={styles.modalIcon}>
        <Icon name="car" size={40} color={COLORS.secondary} />
      </View>

      {/* Formulario */}
      <View style={styles.modalForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de Unidad</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ej: 1247"
            value={unitFormData.unitNumber}
            onChangeText={(text) => setUnitFormData(prev => ({...prev, unitNumber: text}))}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Cooperativa</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ej: Cooperativa Pichincha"
            value={unitFormData.cooperative}
            onChangeText={(text) => setUnitFormData(prev => ({...prev, cooperative: text}))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de Ruta</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ej: Línea 15"
            value={unitFormData.routeNumber}
            onChangeText={(text) => setUnitFormData(prev => ({...prev, routeNumber: text}))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Zona de Operación</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Ej: Centro Histórico - Norte"
            value={unitFormData.operationZone}
            onChangeText={(text) => setUnitFormData(prev => ({...prev, operationZone: text}))}
          />
        </View>
      </View>

      {/* Botones */}
      {/* Botones Centrados */}
<View style={styles.modalButtons}>
  <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
    <Text style={styles.cancelButtonText}>Cancelar</Text>
  </TouchableOpacity>
  
  <TouchableOpacity onPress={handleSaveUnit} style={styles.saveButton}>
    <Text style={styles.saveButtonText}>Guardar</Text>
  </TouchableOpacity>
</View>
    </View>
  </View>
</Modal>
        <StatusToggle />
        <LocationCard />
        <UnitInfo /> 
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
  // REEMPLAZAR todos los estilos del modal con estos:
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: SPACING.lg,
},
modalContent: {
  backgroundColor: COLORS.white,
  borderRadius: 20,
  width: '100%',
  maxWidth: 400,
  maxHeight: '85%',
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.3,
  shadowRadius: 20,
  elevation: 10,
},
modalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: SPACING.lg,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.gray[100],
},
modalTitle: {
  fontSize: SIZES.xl,
  fontWeight: 'bold',
  color: COLORS.gray[800],
},
closeButton: {
  padding: SPACING.xs,
},
modalIcon: {
  alignItems: 'center',
  paddingVertical: SPACING.lg,
},
modalForm: {
  padding: SPACING.lg,
  paddingTop: 0,
},
inputGroup: {
  marginBottom: SPACING.md,
},
inputLabel: {
  fontSize: SIZES.sm,
  fontWeight: '600',
  color: COLORS.gray[700],
  marginBottom: SPACING.xs,
},
modalInput: {
  borderWidth: 1,
  borderColor: COLORS.gray[300],
  borderRadius: 12,
  padding: SPACING.md,
  fontSize: SIZES.md,
  backgroundColor: COLORS.gray[50],
  color: COLORS.gray[800],
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'center',        // ← CENTRAR
  alignItems: 'center',            // ← CENTRAR
  padding: SPACING.lg,
  paddingTop: SPACING.md,
  gap: SPACING.md,                 // ← ESPACIADO ENTRE BOTONES
},
cancelButton: {
  backgroundColor: COLORS.gray[100],
  borderRadius: 12,
  paddingVertical: SPACING.md,
  paddingHorizontal: SPACING.xl,   // ← BOTONES MÁS ANCHOS
  alignItems: 'center',
  minWidth: 120,                   // ← ANCHO MÍNIMO
},
cancelButtonText: {
  fontSize: SIZES.md,
  fontWeight: '600',
  color: COLORS.gray[700],
},
saveButton: {
  backgroundColor: COLORS.secondary,
  borderRadius: 12,
  paddingVertical: SPACING.md,
  paddingHorizontal: SPACING.xl,   // ← BOTONES MÁS ANCHOS
  alignItems: 'center',
  minWidth: 120,                   // ← ANCHO MÍNIMO
},
saveButtonText: {
  fontSize: SIZES.md,
  fontWeight: 'bold',
  color: COLORS.white,
},
// Agregar estos estilos al final del StyleSheet (antes del });)
unitInfoContainer: {
  marginTop: SPACING.md,
},
unitInfoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: SPACING.sm,
  borderBottomWidth: 1,
  borderBottomColor: COLORS.gray[100],
},
unitInfoIcon: {
  width: 40,
  height: 40,
  backgroundColor: COLORS.gray[100],
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: SPACING.sm,
},
unitInfoText: {
  flex: 1,
},
unitInfoLabel: {
  fontSize: SIZES.sm,
  color: COLORS.gray[600],
  marginBottom: SPACING.xs,
},
unitInfoValue: {
  fontSize: SIZES.md,
  fontWeight: '600',
  color: COLORS.gray[800],
},
editInfoButton: {
  marginTop: SPACING.md,
},
noUnitInfo: {
  alignItems: 'center',
  paddingVertical: SPACING.xxl,
},
noUnitInfoTitle: {
  fontSize: SIZES.lg,
  fontWeight: '600',
  color: COLORS.gray[700],
  marginTop: SPACING.md,
  marginBottom: SPACING.xs,
},
noUnitInfoText: {
  fontSize: SIZES.sm,
  color: COLORS.gray[600],
  textAlign: 'center',
  marginBottom: SPACING.lg,
  paddingHorizontal: SPACING.md,
},
registerUnitButton: {
  paddingHorizontal: SPACING.xl,
},
});

export default DriverHomeScreen;