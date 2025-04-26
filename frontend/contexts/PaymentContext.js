import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Criar contexto de pagamentos
const PaymentContext = createContext();

// Provedor de pagamentos
export const PaymentProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Obter todos os pagamentos do usuário
  const getUserPayments = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/v1/payments');
      
      setPayments(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter pagamentos. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter um pagamento específico
  const getPayment = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/v1/payments/${id}`);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter pagamento. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Criar um novo pagamento
  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/payments', paymentData);
      
      // Atualizar lista de pagamentos
      setPayments([...payments, res.data.data]);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao processar pagamento. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Renovar anúncio
  const renewListing = async (listingId, paymentMethod) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`/api/v1/payments/renew/${listingId}`, {
        paymentMethod
      });
      
      // Atualizar lista de pagamentos
      setPayments([...payments, res.data.data.payment]);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao renovar anúncio. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Processar pagamento com cartão de crédito
  const processCardPayment = async (listingId, planType, cardDetails) => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentData = {
        listingId,
        planType,
        paymentMethod: 'credit_card',
        ...cardDetails
      };
      
      const res = await createPayment(paymentData);
      
      return res;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao processar pagamento com cartão. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Gerar boleto
  const generateBoleto = async (listingId, planType) => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentData = {
        listingId,
        planType,
        paymentMethod: 'boleto'
      };
      
      const res = await createPayment(paymentData);
      
      return res;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao gerar boleto. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Gerar PIX
  const generatePix = async (listingId, planType) => {
    try {
      setLoading(true);
      setError(null);
      
      const paymentData = {
        listingId,
        planType,
        paymentMethod: 'pix'
      };
      
      const res = await createPayment(paymentData);
      
      return res;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao gerar PIX. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Valores do contexto
  const value = {
    payments,
    loading,
    error,
    getUserPayments,
    getPayment,
    createPayment,
    renewListing,
    processCardPayment,
    generateBoleto,
    generatePix
  };
  
  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};

// Hook personalizado para usar o contexto de pagamentos
export const usePayment = () => {
  return useContext(PaymentContext);
};
