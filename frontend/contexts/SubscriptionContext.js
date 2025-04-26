import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Criar contexto de assinaturas
const SubscriptionContext = createContext();

// Provedor de assinaturas
export const SubscriptionProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Planos disponíveis
  const plans = [
    {
      id: 'basic',
      name: 'Plano Básico',
      price: 49.90,
      description: 'Ideal para vendedores ocasionais',
      features: [
        { text: 'Até 5 anúncios simultâneos', included: true },
        { text: 'Duração de 30 dias por anúncio', included: true },
        { text: 'Fotos em alta resolução', included: true },
        { text: 'Estatísticas básicas', included: true },
        { text: 'Destaque na busca', included: false },
        { text: 'Renovação automática de anúncios', included: false },
      ]
    },
    {
      id: 'standard',
      name: 'Plano Padrão',
      price: 89.90,
      description: 'Perfeito para vendedores regulares',
      features: [
        { text: 'Até 15 anúncios simultâneos', included: true },
        { text: 'Duração de 45 dias por anúncio', included: true },
        { text: 'Fotos em alta resolução', included: true },
        { text: 'Estatísticas detalhadas', included: true },
        { text: 'Destaque na busca', included: true },
        { text: 'Renovação automática de anúncios', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Plano Premium',
      price: 149.90,
      description: 'Para vendedores frequentes',
      features: [
        { text: 'Até 30 anúncios simultâneos', included: true },
        { text: 'Duração de 60 dias por anúncio', included: true },
        { text: 'Fotos em alta resolução', included: true },
        { text: 'Estatísticas avançadas', included: true },
        { text: 'Destaque na busca', included: true },
        { text: 'Renovação automática de anúncios', included: true },
      ]
    },
    {
      id: 'unlimited',
      name: 'Plano Ilimitado',
      price: 199.90,
      description: 'Para revendedores e profissionais',
      features: [
        { text: 'Anúncios ilimitados', included: true },
        { text: 'Duração de 90 dias por anúncio', included: true },
        { text: 'Fotos em alta resolução', included: true },
        { text: 'Estatísticas avançadas', included: true },
        { text: 'Destaque máximo na busca', included: true },
        { text: 'Renovação automática de anúncios', included: true },
      ]
    }
  ];
  
  // Obter assinaturas do usuário
  const getSubscriptions = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/v1/subscriptions');
      
      setSubscriptions(res.data.data);
      
      // Verificar se há uma assinatura ativa
      const active = res.data.data.find(sub => sub.status === 'active');
      if (active) {
        setActiveSubscription(active);
      } else {
        setActiveSubscription(null);
      }
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter assinaturas. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter uma assinatura específica
  const getSubscription = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/v1/subscriptions/${id}`);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter assinatura. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Criar nova assinatura
  const createSubscription = async (planId, paymentMethod, paymentDetails) => {
    try {
      setLoading(true);
      setError(null);
      
      const subscriptionData = {
        plan: planId,
        paymentMethod,
        paymentDetails
      };
      
      const res = await axios.post('/api/v1/subscriptions', subscriptionData);
      
      // Atualizar lista de assinaturas
      setSubscriptions([...subscriptions, res.data.data]);
      setActiveSubscription(res.data.data);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao criar assinatura. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar assinatura
  const cancelSubscription = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/subscriptions/${id}/cancel`);
      
      // Atualizar lista de assinaturas
      const updatedSubscriptions = subscriptions.map(sub => {
        if (sub._id === id) {
          return { ...sub, status: 'canceled', autoRenew: false };
        }
        return sub;
      });
      
      setSubscriptions(updatedSubscriptions);
      setActiveSubscription(null);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao cancelar assinatura. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Renovar assinatura
  const renewSubscription = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/subscriptions/${id}/renew`);
      
      // Atualizar lista de assinaturas
      const updatedSubscriptions = subscriptions.map(sub => {
        if (sub._id === id) {
          return res.data.data;
        }
        return sub;
      });
      
      setSubscriptions(updatedSubscriptions);
      setActiveSubscription(res.data.data);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao renovar assinatura. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Verificar se o usuário pode criar um novo anúncio
  const canCreateListing = () => {
    if (!currentUser) return false;
    
    // Se não tem assinatura ativa, pode criar anúncios pagando por unidade
    if (!activeSubscription) return true;
    
    // Se tem assinatura ilimitada, sempre pode criar
    if (activeSubscription.plan === 'unlimited') return true;
    
    // Verificar quantos anúncios ativos o usuário tem
    // Esta lógica depende da implementação do backend para contar anúncios ativos
    // Aqui estamos apenas simulando
    return true;
  };
  
  // Obter limite de anúncios com base no plano
  const getListingLimit = () => {
    if (!activeSubscription) return 0;
    
    switch (activeSubscription.plan) {
      case 'basic':
        return 5;
      case 'standard':
        return 15;
      case 'premium':
        return 30;
      case 'unlimited':
        return Infinity;
      default:
        return 0;
    }
  };
  
  // Carregar assinaturas ao iniciar
  useEffect(() => {
    if (currentUser) {
      getSubscriptions();
    }
  }, [currentUser]);
  
  // Valores do contexto
  const value = {
    subscriptions,
    activeSubscription,
    loading,
    error,
    plans,
    getSubscriptions,
    getSubscription,
    createSubscription,
    cancelSubscription,
    renewSubscription,
    canCreateListing,
    getListingLimit
  };
  
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};

// Hook personalizado para usar o contexto de assinaturas
export const useSubscription = () => {
  return useContext(SubscriptionContext);
};
