import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    // Redirecionar para login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário verificou o telefone
  if (currentUser && !currentUser.verifications?.phoneVerified && window.location.pathname !== '/verification') {
    return <Navigate to="/verification" replace />;
  }

  return children;
};

export default PrivateRoute;
