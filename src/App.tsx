import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LeaseDataProvider } from './context/LeaseDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import LocationList from './pages/LocationList';
import LocationDetail from './pages/LocationDetail';
import ClausesList from './pages/ClausesList';
import FieldsList from './pages/FieldsList';
import DocumentDetails from './pages/DocumentDetails';
import Dashboard from './pages/Dashboard';
import AllLocationsDashboard from './pages/AllLocationsDashboard';
import Settings from './pages/Settings';
import Loader from './components/Loader';
import Notifications from './components/Notifications';
import './App.css';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main layout with sidebar
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`app-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="main-content">
        <Header />
        <div className="app">
          {children}
        </div>
      </div>
    </div>
  );
};

// App routes component (needs to be inside AuthProvider)
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <LeaseDataProvider>
              <Notifications />
              <MainLayout>
                <Routes>
                  <Route path="/" element={<LocationList />} />
                  <Route path="/dashboard" element={<AllLocationsDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/location/:locationId" element={<LocationDetail />}>
                    <Route index element={<Navigate to="clauses" replace />} />
                    <Route path="clauses" element={<ClausesList />} />
                    <Route path="fields" element={<FieldsList />} />
                    <Route path="details" element={<DocumentDetails />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </MainLayout>
            </LeaseDataProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
