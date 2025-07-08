// hooks/useRegister.js
import { registrarUsuario } from './auth.request';

export const useRegister = () => {
  const register = async (nombre, email, password, tipoUsuario) => {
    return await registrarUsuario(nombre, email, password, tipoUsuario);
  };

  return { register };
};
