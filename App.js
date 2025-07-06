import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import PassengerHomeScreen from './src/screens/PassengerHomeScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import LoadingSpinner from './src/components/common/LoadingSpinner';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, userMode, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          userMode === 'passenger' ? (
            <Stack.Screen name="PassengerHome" component={PassengerHomeScreen} />
          ) : (
            <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
          )
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}