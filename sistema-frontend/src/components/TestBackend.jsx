import { useState } from 'react';
import api from '../services/api';

function TestBackend() {
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const probarConexion = async () => {
    console.log('1️⃣ Botón clickeado - Iniciando prueba');
    setCargando(true);
    setError('');
    setMensaje('');
    
    console.log('2️⃣ Llamando a API con GET /test/hello');
    
    // Llamamos al endpoint /test/hello de Spring Boot
    const { data, error: errorFetch } = await api.get('/grupo');
    
    console.log('3️⃣ Respuesta recibida:', { data, errorFetch });
    
    if (data) {
      console.log('4️⃣ Data recibida correctamente:', data);
      setMensaje(data.message);
    } else {
      console.log('4️⃣ Error recibido:', errorFetch);
      setError(errorFetch || 'No se pudo conectar con el backend');
    }
    
    console.log('5️⃣ Estado final - cargando: false');
    setCargando(false);
  };

  console.log('Componente TestBackend renderizado');

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>🔌 Prueba de Conexión React ↔ Spring Boot</h3>
      
      <button 
        onClick={probarConexion} 
        disabled={cargando}
        style={{
          padding: '10px 20px',
          backgroundColor: '#aa3bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {cargando ? 'Conectando...' : 'Probar conexión'}
      </button>
      
      {mensaje && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px' }}>
          ✅ {mensaje}
        </div>
      )}
      
      {error && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '5px' }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

export default TestBackend;