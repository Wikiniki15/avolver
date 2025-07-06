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

  const register = async (name, email, phone, password, mode) => {
    try {
      setLoading(true);
      
      // Verificar si ya existe una cuenta con este email para este modo
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Buscar si ya existe este email con este modo específico
      const existingUser = users.find(u => u.email === email && u.mode === mode);
      if (existingUser) {
        return { 
          success: false, 
          error: `Ya existe una cuenta ${mode === 'passenger' ? 'de pasajero' : 'de conductor'} con este correo electrónico` 
        };
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        mode: mode,
        password: password, // En producción, esto debe estar hasheado
        createdAt: new Date().toISOString()
      };
      
      // Guardar en la lista de usuarios registrados
      users.push(newUser);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
      
      return { success: true, user: newUser };
      
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, mode) => {
    try {
      setLoading(true);
      
      // Buscar en usuarios registrados
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Buscar usuario con email, password Y modo específico
      const foundUser = users.find(u => 
        u.email === email.toLowerCase().trim() && 
        u.password === password && 
        u.mode === mode
      );
      
      if (!foundUser) {
        return { 
          success: false, 
          error: `Credenciales incorrectas para ${mode === 'passenger' ? 'pasajero' : 'conductor'}` 
        };
      }
      
      // Crear datos de sesión
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        mode: foundUser.mode
      };

      const token = `token-${foundUser.id}-${Date.now()}`;

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

  // Función para debugging - ver todos los usuarios registrados
  const getRegisteredUsers = async () => {
    try {
      const users = await AsyncStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  // Función para limpiar todos los usuarios (para testing)
  const clearAllUsers = async () => {
    try {
      await AsyncStorage.removeItem('registeredUsers');
      console.log('All users cleared');
    } catch (error) {
      console.error('Error clearing users:', error);
    }
  };

  const saveUnitInfo = async (unitInfo) => {
  try {
    if (!user) return { success: false, error: 'Usuario no encontrado' };
    
    // Guardar info de unidad para el usuario actual
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
    getRegisteredUsers, // Para debugging
    clearAllUsers, // Para testing
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;


};