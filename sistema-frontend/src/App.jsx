import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import TeachingPosition from './pages/TeachingPosition';
import TipoCargo from './pages/TipoCargo';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';
import Docentes from './pages/Docentes';
import TipoDocente from './pages/TipoDocente';
import Unidades from './pages/Unidades';
import TipoUnidad from './pages/tipoUnidad';
import Asignaturas from './pages/Asignaturas';
import Gestiones from './pages/Gestiones';
import TipoPeriodo from './pages/TipoPeriodo';
import Periodos from './pages/Periodos';
import AsignarDocente from './pages/AsignarDocente';
import Reportes from './pages/Reportes';
import Login from './pages/Login';

// Componente para proteger rutas que requieren autenticación
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Componente para proteger rutas por rol
const RoleRoute = ({ children, allowedRoles = ['ROLE_ADMIN', 'ROLE_USER'] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role || 'ROLE_USER';
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Dashboard - todos pueden ver */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* Grupos - todos pueden ver */}
          <Route
            path="/grupos"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Groups />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* Docentes - todos pueden ver */}
          <Route
            path="/docentes"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Docentes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* Asignaturas - todos pueden ver */}
          <Route
            path="/asignaturas"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Asignaturas />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* Reporte PDF - todos pueden ver */}
          <Route
            path="/reporte"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Reportes />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* Reportes - todos pueden ver */}
          <Route
            path="/reportes"
            element={
              <PrivateRoute>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </PrivateRoute>
            }
          />
          
          {/* ========== RUTAS SOLO PARA ROLE_ADMIN ========== */}
          
          {/* Cargo de Docente - solo admin */}
          <Route
            path="/docente_cargo"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <TeachingPosition />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Tipo de Cargo - solo admin */}
          <Route
            path="/tipo_cargo"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <TipoCargo />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Tipo de Docente - solo admin */}
          <Route
            path="/tipo_docente"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <TipoDocente />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Tipo de Unidad - solo admin */}
          <Route
            path="/tipo_unidad"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <TipoUnidad />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Unidades - solo admin */}
          <Route
            path="/unidades"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <Unidades />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Gestiones - solo admin */}
          <Route
            path="/gestiones"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <Gestiones />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Tipo de Periodo - solo admin */}
          <Route
            path="/tipo_periodo"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <TipoPeriodo />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Asignar Docente - solo admin */}
          <Route
            path="/asignatura_docente"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <AsignarDocente />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Periodos - solo admin */}
          <Route
            path="/periodos"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <Periodos />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Configuración - solo admin */}
          <Route
            path="/configuracion"
            element={
              <RoleRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </RoleRoute>
            }
          />
          
          {/* Redirección para rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;