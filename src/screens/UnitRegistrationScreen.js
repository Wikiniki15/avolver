import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { COLORS, SPACING, SIZES } from '../utils/constants';
import { globalStyles } from '../styles/globalStyles';

const UnitRegistrationScreen = ({ navigation }) => {
  const [unitNumber, setUnitNumber] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [operationZone, setOperationZone] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveUnitInfo } = useAuth();

  const handleSaveUnitInfo = async () => {
    // Validaciones
    if (!unitNumber.trim() || unitNumber.trim().length !== 4) {
      Alert.alert('Error', 'El número de unidad debe tener exactamente 4 dígitos');
      return;
    }

    if (!cooperative.trim()) {
      Alert.alert('Error', 'La cooperativa es obligatoria');
      return;
    }

    if (!routeNumber.trim()) {
      Alert.alert('Error', 'El número de ruta es obligatorio');
      return;
    }

    if (!operationZone.trim()) {
      Alert.alert('Error', 'La zona de operación es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const result = await saveUnitInfo({
        unitNumber: unitNumber.trim(),
        cooperative: cooperative.trim(),
        routeNumber: routeNumber.trim(),
        operationZone: operationZone.trim(),
      });

      if (result.success) {
        Alert.alert(
          'Información Guardada',
          'La información de tu unidad ha sido registrada exitosamente.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo guardar la información');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Icon name="car" size={40} color={COLORS.secondary} />
            </View>
            <Text style={styles.title}>Registrar Unidad</Text>
            <Text style={styles.subtitle}>
              Completa la información de tu unidad de transporte
            </Text>
          </View>

          {/* Formulario */}
          <View style={styles.form}>
            <Input
              label="Número de Unidad"
              value={unitNumber}
              onChangeText={setUnitNumber}
              placeholder="Ej: 1247"
              keyboardType="numeric"
              maxLength={4}
              leftIcon="id-card-outline"
            />

            <Input
              label="Cooperativa"
              value={cooperative}
              onChangeText={setCooperative}
              placeholder="Ej: Cooperativa Pichincha"
              leftIcon="business-outline"
              autoCapitalize="words"
            />

            <Input
              label="Número de Ruta"
              value={routeNumber}
              onChangeText={setRouteNumber}
              placeholder="Ej: Línea 15, Ruta A, etc."
              leftIcon="navigate-outline"
            />

            <Input
              label="Zona de Operación"
              value={operationZone}
              onChangeText={setOperationZone}
              placeholder="Ej: Centro Histórico - Norte"
              leftIcon="location-outline"
              autoCapitalize="words"
            />
          </View>

          {/* Información Adicional */}
          <View style={styles.infoCard}>
            <Icon name="information-circle-outline" size={24} color={COLORS.primary} />
            <Text style={styles.infoText}>
              Esta información será visible para los pasajeros y las autoridades de transporte.
              Asegúrate de que todos los datos sean correctos.
            </Text>
          </View>

          {/* Botones */}
          <View style={styles.buttons}>
            <Button
              title="Guardar Información"
              onPress={handleSaveUnitInfo}
              loading={loading}
              style={styles.saveButton}
            />
            
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            />
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
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.secondary + '20',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray[800],
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.sm,
    color: COLORS.gray[700],
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  buttons: {
    gap: SPACING.sm,
  },
  saveButton: {
    marginBottom: SPACING.sm,
  },
  cancelButton: {
    marginBottom: SPACING.lg,
  },
});

export default UnitRegistrationScreen;