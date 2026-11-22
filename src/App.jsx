import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';

// Pages
import DemoLogin from './pages/DemoLogin';
import CitizenHome from './pages/citizen/CitizenHome';
import MedicineSearch from './pages/citizen/MedicineSearch';
import MapView from './pages/citizen/MapView';
import PharmacyRegister from './pages/pharmacy/PharmacyRegister';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import AddMedicine from './pages/pharmacy/AddMedicine';
import PriceHistory from './pages/pharmacy/PriceHistory';
import AdminDashboard from './pages/admin/AdminDashboard';
import PharmacyManagement from './pages/admin/PharmacyManagement';
import PriceMonitoring from './pages/admin/PriceMonitoring';

function RequireRole({ role, children }) {
  const { state } = useApp();
  if (!state.currentUser) return <Navigate to="/" replace />;
  if (role && state.currentUser.role !== role) {
    return <Navigate to={`/${state.currentUser.role}`} replace />;
  }
  return children;
}

function AppRoutes() {
  const { state } = useApp();

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="app-main">
        <Routes>
          {/* Login */}
          <Route path="/" element={
            state.currentUser
              ? <Navigate to={`/${state.currentUser.role}`} replace />
              : <DemoLogin />
          } />

          {/* Citizen routes */}
          <Route path="/citizen" element={
            <RequireRole role="citizen"><CitizenHome /></RequireRole>
          } />
          <Route path="/citizen/search" element={
            <RequireRole role="citizen"><MedicineSearch /></RequireRole>
          } />
          <Route path="/citizen/map" element={
            <RequireRole role="citizen"><MapView /></RequireRole>
          } />

          {/* Pharmacy routes */}
          <Route path="/pharmacy" element={<Navigate to="/pharmacy/dashboard" replace />} />
          <Route path="/pharmacy/register" element={
            state.currentUser?.role === 'pharmacy'
              ? <PharmacyRegister />
              : <PharmacyRegister />  // allow anyone to view register
          } />
          <Route path="/pharmacy/dashboard" element={
            <RequireRole role="pharmacy"><PharmacyDashboard /></RequireRole>
          } />
          <Route path="/pharmacy/medicines" element={
            <RequireRole role="pharmacy"><AddMedicine /></RequireRole>
          } />
          <Route path="/pharmacy/history" element={
            <RequireRole role="pharmacy"><PriceHistory /></RequireRole>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <RequireRole role="admin"><AdminDashboard /></RequireRole>
          } />
          <Route path="/admin/pharmacies" element={
            <RequireRole role="admin"><PharmacyManagement /></RequireRole>
          } />
          <Route path="/admin/prices" element={
            <RequireRole role="admin"><PriceMonitoring /></RequireRole>
          } />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;
