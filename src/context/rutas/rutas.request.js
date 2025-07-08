// services/apiRutas.js
import axios from 'axios';

const API_URL = 'http://10.0.2.2:5005/api/UbicacionRutas';

export const obtenerUbicacionesRutas = async () => {
  try {
    const response = await axios.get(`${API_URL}/GetUbicacionActual`);
    return response.data; // Esto debería ser un array de rutas
  } catch (error) {
    console.error('Error obteniendo ubicaciones de rutas:', error);
    return [];
  }
};
