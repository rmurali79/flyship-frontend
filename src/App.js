import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateShipment from './pages/CreateShipment';
import ShipmentDetails from './pages/ShipmentDetails';
import Home from './pages/Home';
import CreateTravelPlan from './pages/CreateTravelPlan';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RiskDisclosure from './pages/RiskDisclosure';
import ShipperAgreement from './pages/ShipperAgreement';
import TravelerAgreement from './pages/TravelerAgreement';
import RefundPolicy from './pages/RefundPolicy';
import PaymentTerms from './pages/PaymentTerms';
import CookiePolicy from './pages/CookiePolicy';
import Wallet from './pages/Wallet';
import OTPVerification from './pages/OTPVerification';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/risk-disclosure" element={<RiskDisclosure />} />
              <Route path="/shipper-agreement" element={<ShipperAgreement />} />
              <Route path="/traveler-agreement" element={<TravelerAgreement />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/payment-terms" element={<PaymentTerms />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<OTPVerification />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/create-shipment" element={
                <PrivateRoute>
                  <CreateShipment />
                </PrivateRoute>
              } />
              <Route path="/create-travel-plan" element={
                <PrivateRoute>
                  <CreateTravelPlan />
                </PrivateRoute>
              } />
              <Route path="/shipment/:id" element={
                <PrivateRoute>
                  <ShipmentDetails />
                </PrivateRoute>
              } />
              <Route path="/wallet" element={
                <PrivateRoute>
                  <Wallet />
                </PrivateRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;
