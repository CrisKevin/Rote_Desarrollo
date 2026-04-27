import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import TeachingPosition from './pages/TeachingPosition';
import TipoCargo from './pages/TipoCargo';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/grupos"
            element={
              <DashboardLayout>
                <Groups />
              </DashboardLayout>
            }
          />
          <Route
            path="/docente_cargo"
            element={
              <DashboardLayout>
                <TeachingPosition />
              </DashboardLayout>
            }
          />
          <Route
            path="/tipo_cargo"
            element={
              <DashboardLayout>
                <TipoCargo />
              </DashboardLayout>
            }
          />
          <Route
            path="/reportes"
            element={
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            }
          />
          <Route
            path="/configuracion"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
