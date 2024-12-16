import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PackageList from './components/PackageList';
import PackageDetails from './components/PackageDetails';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import InvoicePage from './components/InvoicePage';

// Wrapper for protected routes
const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <Router basename="/">
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<PackageList />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;