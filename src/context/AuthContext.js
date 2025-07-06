import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState('passenger'); // 'passenger' or 'driver'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const savedUser = await AsyncStorage.getItem('userData');
      const savedMode = await AsyncStorage.getItem('userMode');
      
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
        setUserMode(savedMode || 'passenger');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, mode) => {
    try {
      setLoading(true);
      
      // Simulación de API call - reemplazar con llamada real
      const userData = {
        id: 1,
        name: mode === 'passenger' ? 'Juan Pérez' : 'Carlos Conductor',
        email: email,
        phone: '+593 99 123 4567',
        mode: mode
      };

      const token = 'fake-jwt-token'; // Reemplazar con token real del backend

      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userMode', mode);

      setUser(userData);
      setUserMode(mode);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData', 'userMode']);
      setUser(null);
      setUserMode('passenger');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const value = {
    user,
    userMode,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};