const API_URL = 'http://localhost:8080/api';

console.log('🔧 API Configurada con URL:', API_URL);

// Función para manejar las peticiones
const api = {
  // GET - Para obtener datos
  get: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 GET: ${url}`);
    
    try {
      const response = await fetch(url);
      console.log(`📥 Response status: ${response.status} ${response.statusText}`);
      console.log(`📥 Response headers:`, response.headers);
      
      if (!response.ok) {
        console.error(`❌ Error HTTP: ${response.status}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Data recibida:`, data);
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en GET:`, error);
      console.error(`❌ Tipo de error: ${error.name}`);
      console.error(`❌ Mensaje: ${error.message}`);
      return { data: null, error: error.message };
    }
  },
  
  // POST - Para crear datos
  post: async (endpoint, body) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 POST: ${url}`, body);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Data recibida:`, data);
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en POST:`, error);
      return { data: null, error: error.message };
    }
  },
  
  // 👇 NUEVO: PUT - Para actualizar datos
  put: async (endpoint, body) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 PUT: ${url}`, body);
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Data recibida:`, data);
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en PUT:`, error);
      return { data: null, error: error.message };
    }
  },
  
  // 👇 NUEVO: DELETE - Para eliminar datos
  delete: async (endpoint) => {
    const url = `${API_URL}${endpoint}`;
    console.log(`📤 DELETE: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // DELETE puede no devolver datos, pero si devuelve algo lo parseamos
      let data = null;
      try {
        data = await response.json();
        console.log(`✅ Data recibida:`, data);
      } catch (e) {
        console.log(`✅ Eliminado exitosamente (sin respuesta) #${e.message}`);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error(`❌ Error en DELETE:`, error);
      return { data: null, error: error.message };
    }
  }
};

export default api;