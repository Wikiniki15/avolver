// services/auth.request.js
import axios from 'axios';

// ⚠️ Reemplaza con tu IP del backend Java y el puerto correcto
const API_URL = 'http://10.0.2.2:5005/api/Usuarios'; // ✅ Sirve desde emulador Android


export const registrarUsuario = async (nombre, email, password, tipoUsuario) => {
  try {
    const response = await axios.post(`${API_URL}/EnviarDatosUsuario`, {
      nombre,
      email,
      password,
      tipoUsuario,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error al registrar usuario', error?.response?.data || error);
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        'Ocurrió un error al registrar el usuario',
    };
  }
};
