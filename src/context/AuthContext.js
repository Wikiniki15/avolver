// Adaptado para que use la API en vez de guardar usuarios localmente
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/api/usuarios'; // ← Cambia según tu IP si no usas emulador
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
  const [userMode, setUserMode] = useState('passenger');
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

  const register = async (name, email, password, mode) => {
    try {
      setLoading(true);
      const tipoUsuario = mode === 'passenger' ? 'ciudadano' : 'conductor';

      const res = await axios.post(`${API_URL}`, {
        nombre: name,
        email: email,
        password: password,
        tipoUsuario: tipoUsuario,
      });

      const registeredUser = res.data;

      const userData = {
        id: registeredUser.id,
        name: registeredUser.nombre,
        email: registeredUser.email,
        tipoUsuario: registeredUser.tipoUsuario,
      };

      const token = `token-${userData.id}-${Date.now()}`;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userMode', mode);

      setUser(userData);
      setUserMode(mode);

      return { success: true };
    } catch (error) {
      console.error('Register error:', error?.response?.data || error);
      return { success: false, error: error?.response?.data?.message || 'Error en el registro' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, mode) => {
    try {
      setLoading(true);
      const tipoUsuario = mode === 'passenger' ? 'ciudadano' : 'conductor';

      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
        tipoUsuario,
      });

      const loggedUser = res.data;

      const userData = {
        id: loggedUser.id,
        name: loggedUser.nombre,
        email: loggedUser.email,
        tipoUsuario: loggedUser.tipoUsuario,
      };

      const token = `token-${userData.id}-${Date.now()}`;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      await AsyncStorage.setItem('userMode', mode);

      setUser(userData);
      setUserMode(mode);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error?.response?.data || error);
      return {
        success: false,
        error: error?.response?.data?.message || `Credenciales incorrectas para ${mode === 'passenger' ? 'pasajero' : 'conductor'}`,
      };
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

  const saveUnitInfo = async (unitInfo) => {
    try {
      if (!user) return { success: false, error: 'Usuario no encontrado' };

      const unitData = {
        unitNumber: unitInfo.unitNumber,
        cooperative: unitInfo.cooperative,
        routeNumber: unitInfo.routeNumber,
        operationZone: unitInfo.operationZone,
        userId: user.id,
        updatedAt: new Date().toISOString()
      };

      await AsyncStorage.setItem(`unitInfo_${user.id}`, JSON.stringify(unitData));

      return { success: true };
    } catch (error) {
      console.error('Error saving unit info:', error);
      return { success: false, error: error.message };
    }
  };

  const getUnitInfo = async () => {
    try {
      if (!user) return null;

      const unitData = await AsyncStorage.getItem(`unitInfo_${user.id}`);
      return unitData ? JSON.parse(unitData) : null;
    } catch (error) {
      console.error('Error getting unit info:', error);
      return null;
    }
  };

  const value = {
    user,
    userMode,
    loading,
    login,
    register,
    logout,
    saveUnitInfo,
    getUnitInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
