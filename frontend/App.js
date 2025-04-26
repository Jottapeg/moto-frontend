import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ptBR } from '@mui/material/locale';

// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { ListingProvider } from './contexts/ListingContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { MessageProvider } from './contexts/MessageContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

// Componentes de Layout
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Páginas Públicas
import Home from './pages/Home';
import MotorcycleDetail from './pages/MotorcycleDetail';
import ContactSeller from './pages/ContactSeller';

// Páginas de Autenticação
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Verification from './pages/Auth/Verification';

// Páginas do Dashboard
import Dashboard from './pages/Dashboard/Dashboard';
import UserProfile from './pages/Dashboard/UserProfile';
import UserListings from './pages/Dashboard/UserListings';
import Messages from './pages/Dashboard/Messages';
import Favorites from './pages/Dashboard/Favorites';
import Subscriptions from './pages/Dashboard/Subscriptions';

// Páginas de Anúncios
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Payment from './pages/Payment/Payment';

// Rotas Protegidas
import PrivateRoute from './components/PrivateRoute';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff5722',
      light: '#ff8a50',
      dark: '#c41c00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2196f3',
      light: '#6ec6ff',
      dark: '#0069c0',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
        },
      },
    },
  },
}, ptBR);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ListingProvider>
          <PaymentProvider>
            <MessageProvider>
              <SubscriptionProvider>
                <Router>
                  <Header />
                  <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/motorcycles/:id" element={<MotorcycleDetail />} />
                    <Route path="/contact/:id" element={<ContactSeller />} />
                    
                    {/* Rotas de Autenticação */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    
                    {/* Rotas Protegidas */}
                    <Route path="/verification" element={
                      <PrivateRoute>
                        <Verification />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard" element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/profile" element={
                      <PrivateRoute>
                        <UserProfile />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/listings" element={
                      <PrivateRoute>
                        <UserListings />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/messages" element={
                      <PrivateRoute>
                        <Messages />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/favorites" element={
                      <PrivateRoute>
                        <Favorites />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/subscriptions" element={
                      <PrivateRoute>
                        <Subscriptions />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/listings/create" element={
                      <PrivateRoute>
                        <CreateListing />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/listings/edit/:id" element={
                      <PrivateRoute>
                        <EditListing />
                      </PrivateRoute>
                    } />
                    
                    <Route path="/dashboard/payment/:id" element={
                      <PrivateRoute>
                        <Payment />
                      </PrivateRoute>
                    } />
                    
                    {/* Rota de Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Footer />
                </Router>
              </SubscriptionProvider>
            </MessageProvider>
          </PaymentProvider>
        </ListingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
