import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Criar contexto de mensagens
const MessageContext = createContext();

// Provedor de mensagens
export const MessageProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Obter todas as conversas do usuário
  const getConversations = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/v1/conversations');
      
      setConversations(res.data.data);
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter conversas. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter mensagens de uma conversa específica
  const getMessages = async (conversationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/v1/conversations/${conversationId}/messages`);
      
      setMessages(res.data.data);
      
      // Atualizar conversa atual
      const conversation = conversations.find(c => c._id === conversationId);
      setCurrentConversation(conversation);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter mensagens. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Iniciar uma nova conversa
  const startConversation = async (listingId, initialMessage) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('/api/v1/conversations', {
        listing: listingId,
        message: initialMessage
      });
      
      // Atualizar lista de conversas
      setConversations([...conversations, res.data.data]);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao iniciar conversa. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Enviar uma mensagem
  const sendMessage = async (conversationId, content) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(`/api/v1/conversations/${conversationId}/messages`, {
        content
      });
      
      // Atualizar lista de mensagens
      setMessages([...messages, res.data.data]);
      
      // Atualizar última mensagem na conversa
      setConversations(conversations.map(conversation => {
        if (conversation._id === conversationId) {
          return {
            ...conversation,
            lastMessage: {
              content,
              sender: currentUser._id,
              createdAt: new Date().toISOString()
            }
          };
        }
        return conversation;
      }));
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao enviar mensagem. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Marcar conversa como lida
  const markAsRead = async (conversationId) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/conversations/${conversationId}/read`);
      
      // Atualizar status da conversa
      setConversations(conversations.map(conversation => {
        if (conversation._id === conversationId) {
          return {
            ...conversation,
            unreadCount: 0
          };
        }
        return conversation;
      }));
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao marcar como lida. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Valores do contexto
  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    getConversations,
    getMessages,
    startConversation,
    sendMessage,
    markAsRead
  };
  
  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

// Hook personalizado para usar o contexto de mensagens
export const useMessage = () => {
  return useContext(MessageContext);
};
