// src/services/api.js
const API_URL = 'http://localhost:8080/api';

console.log('🔧 API Configurada con URL:', API_URL);

// Función para obtener el token del localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Función para obtener headers con autenticación
const getHeaders = (customHeaders = {}, isBlob = false) => {
  const token = getToken();
  const headers = {
    ...customHeaders
  };
  
  // Si no es blob, agregamos Content-Type
  if (!isBlob) {
    headers['Content-Type'] = 'application/json';
  }
  
  // Si hay token, lo agregamos al header
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Función para manejar respuestas no autorizadas
const handleUnauthorized = (status) => {
  if (status === 401 || status === 403) {
    console.log('🔒 Sesión expirada o no autorizada');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Disparar un evento personalizado
    window.dispatchEvent(new CustomEvent('auth:logout'));
    
    window.location.href = '/login';
    return true;
  }
  return false;
};

const api = {
  get: async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 GET: ${url}`);
    
    try {
      const isBlob = options.responseType === 'blob';
      const headers = getHeaders(options.headers, isBlob);
      
      const fetchOptions = {
        method: 'GET',
        headers: headers,
        ...options
      };
      
      // Eliminar responseType de fetchOptions porque no es válido para fetch
      delete fetchOptions.responseType;
      
      const response = await fetch(url, fetchOptions);
      console.log(`📥 Response status: ${response.status}`);
      
      // Verificar si la respuesta es 401 o 403 (no autorizado)
      if (handleUnauthorized(response.status)) {
        return { data: null, error: 'No autorizado' };
      }
      
      // Verificar si la respuesta es un PDF o blob
      const contentType = response.headers.get('content-type');
      
      if (options.responseType === 'blob' || (contentType && contentType.includes('application/pdf'))) {
        const blob = await response.blob();
        return { data: blob, error: null, status: response.status };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en GET:`, error);
      return { data: null, error: error.message };
    }
  },
  
  post: async (endpoint, body, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 POST: ${url}`, body);
    
    try {
      const headers = getHeaders(options.headers);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
        ...options
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      // Verificar si la respuesta es 401 o 403 (no autorizado)
      if (handleUnauthorized(response.status)) {
        return { data: null, error: 'No autorizado' };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en POST:`, error);
      return { data: null, error: error.message };
    }
  },
  
  put: async (endpoint, body, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 PUT: ${url}`, body);
    
    try {
      const headers = getHeaders(options.headers);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
        ...options
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      // Verificar si la respuesta es 401 o 403 (no autorizado)
      if (handleUnauthorized(response.status)) {
        return { data: null, error: 'No autorizado' };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en PUT:`, error);
      return { data: null, error: error.message };
    }
  },
  
  delete: async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 DELETE: ${url}`);
    
    try {
      const headers = getHeaders(options.headers);
      
      const response = await fetch(url, {
        method: 'DELETE',
        headers: headers,
        ...options
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      // Verificar si la respuesta es 401 o 403 (no autorizado)
      if (handleUnauthorized(response.status)) {
        return { data: null, error: 'No autorizado' };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
      }
      
      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.log(`✅ Eliminado exitosamente ${e}`);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en DELETE:`, error);
      return { data: null, error: error.message };
    }
  }
};

export default api;