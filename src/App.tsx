import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LeaseDataProvider } from './context/LeaseDataContext';
import Header from './components/Header';
import LocationList from './pages/LocationList';
import LocationDetail from './pages/LocationDetail';
import ClausesList from './pages/ClausesList';
import FieldsList from './pages/FieldsList';
import DocumentDetails from './pages/DocumentDetails';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <LeaseDataProvider>
      <BrowserRouter>
        <Header />
        <div className="app">
          <Routes>
            <Route path="/" element={<LocationList />} />
            <Route path="/location/:locationId" element={<LocationDetail />}>
              <Route index element={<Navigate to="clauses" replace />} />
              <Route path="clauses" element={<ClausesList />} />
              <Route path="fields" element={<FieldsList />} />
              <Route path="details" element={<DocumentDetails />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </LeaseDataProvider>
  );
}

export default App;
