import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';

// Criar contexto de autenticação
const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Verificar se o usuário está autenticado ao carregar a aplicação
  React.useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Configurar cabeçalho de autorização
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Obter dados do usuário
          const res = await axios.get('/api/v1/auth/me');
          
          setCurrentUser(res.data.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    checkUserLoggedIn();
  }, []);
  
  // Registrar usuário
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/auth/register', userData);
      
      if (res.data.success) {
        // Salvar token no localStorage
        localStorage.setItem('token', res.data.token);
        
        // Configurar cabeçalho de autorização
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Obter dados do usuário
        const userRes = await axios.get('/api/v1/auth/me');
        
        setCurrentUser(userRes.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao registrar. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Login de usuário
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/auth/login', { email, password });
      
      if (res.data.success) {
        // Salvar token no localStorage
        localStorage.setItem('token', res.data.token);
        
        // Configurar cabeçalho de autorização
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Obter dados do usuário
        const userRes = await axios.get('/api/v1/auth/me');
        
        setCurrentUser(userRes.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Credenciais inválidas. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout de usuário
  const logout = async () => {
    try {
      await axios.get('/api/v1/auth/logout');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      // Remover token do localStorage
      localStorage.removeItem('token');
      
      // Remover cabeçalho de autorização
      delete axios.defaults.headers.common['Authorization'];
      
      // Limpar usuário atual
      setCurrentUser(null);
    }
  };
  
  // Verificar email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/v1/auth/verify-email/${token}`);
      
      if (res.data.success) {
        // Atualizar dados do usuário
        const userRes = await axios.get('/api/v1/auth/me');
        setCurrentUser(userRes.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao verificar email. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar telefone
  const verifyPhone = async (code) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/auth/verify-phone', { code });
      
      if (res.data.success) {
        // Atualizar dados do usuário
        const userRes = await axios.get('/api/v1/auth/me');
        setCurrentUser(userRes.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Código inválido. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reenviar código de verificação de telefone
  const resendPhoneVerification = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/v1/auth/resend-phone-verification');
      
      return res.data.success;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao reenviar código. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Esqueci minha senha
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/auth/forgot-password', { email });
      
      return res.data.success;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao enviar email de redefinição. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Redefinir senha
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/auth/reset-password/${token}`, { password });
      
      if (res.data.success) {
        // Salvar token no localStorage
        localStorage.setItem('token', res.data.token);
        
        // Configurar cabeçalho de autorização
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        
        // Obter dados do usuário
        const userRes = await axios.get('/api/v1/auth/me');
        
        setCurrentUser(userRes.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao redefinir senha. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar detalhes do usuário
  const updateDetails = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('/api/v1/auth/update-details', userData);
      
      if (res.data.success) {
        setCurrentUser(res.data.data);
        return true;
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao atualizar dados. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar senha
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('/api/v1/auth/update-password', {
        currentPassword,
        newPassword
      });
      
      return res.data.success;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao atualizar senha. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Valores do contexto
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    verifyEmail,
    verifyPhone,
    resendPhoneVerification,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};
