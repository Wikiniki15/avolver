import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/constants';
import { globalStyles } from '../../styles/globalStyles';

const LoadingSpinner = ({ text = 'Cargando...', size = 'large' }) => {
  return (
    <View style={[globalStyles.container, globalStyles.center]}>
      <ActivityIndicator size={size} color={COLORS.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: SIZES.md,
    color: COLORS.gray[600],
    marginTop: SPACING.md,
    textAlign: 'center',
  },
});

export default LoadingSpinner;