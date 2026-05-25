import api from './api';

export const authService = {
  login: async (usuario, password) => {
    try {
      const response = await api.post('/auth/login', {
        usuario: usuario,
        password: password
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data && response.data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.data.username,
          role: response.data.role
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      if (error.response?.status === 401) {
        return false;
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};