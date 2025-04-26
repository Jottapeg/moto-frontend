import React, { useState, useContext, createContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Criar contexto de anúncios
const ListingContext = createContext();

// Provedor de anúncios
export const ListingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [userListings, setUserListings] = useState([]);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Buscar anúncios com filtros
  const searchListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir query string a partir dos filtros
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      const res = await axios.get(`/api/v1/listings?${queryParams.toString()}`);
      
      setListings(res.data.data);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao buscar anúncios. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter um anúncio específico
  const getListing = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`/api/v1/listings/${id}`);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter anúncio. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter anúncios do usuário atual
  const getUserListings = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get('/api/v1/listings?seller=' + currentUser._id);
      
      setUserListings(res.data.data);
      return res.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter seus anúncios. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Criar um novo anúncio
  const createListing = async (listingData, images) => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      
      // Adicionar dados do anúncio
      Object.keys(listingData).forEach(key => {
        if (typeof listingData[key] === 'object' && listingData[key] !== null) {
          formData.append(key, JSON.stringify(listingData[key]));
        } else {
          formData.append(key, listingData[key]);
        }
      });
      
      // Adicionar imagens
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const res = await axios.post('/api/v1/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Atualizar lista de anúncios do usuário
      setUserListings([...userListings, res.data.data]);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao criar anúncio. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar um anúncio existente
  const updateListing = async (id, listingData, images) => {
    try {
      setLoading(true);
      setError(null);
      
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      
      // Adicionar dados do anúncio
      Object.keys(listingData).forEach(key => {
        if (typeof listingData[key] === 'object' && listingData[key] !== null) {
          formData.append(key, JSON.stringify(listingData[key]));
        } else {
          formData.append(key, listingData[key]);
        }
      });
      
      // Adicionar novas imagens
      if (images && images.length > 0) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      const res = await axios.put(`/api/v1/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Atualizar lista de anúncios do usuário
      setUserListings(userListings.map(listing => 
        listing._id === id ? res.data.data : listing
      ));
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao atualizar anúncio. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Excluir um anúncio
  const deleteListing = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`/api/v1/listings/${id}`);
      
      // Atualizar lista de anúncios do usuário
      setUserListings(userListings.filter(listing => listing._id !== id));
      
      return true;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao excluir anúncio. Por favor, tente novamente.'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Marcar anúncio como vendido
  const markAsSold = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/listings/${id}/sold`);
      
      // Atualizar lista de anúncios do usuário
      setUserListings(userListings.map(listing => 
        listing._id === id ? res.data.data : listing
      ));
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao marcar anúncio como vendido. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Adicionar anúncio aos favoritos
  const addToFavorites = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/listings/${id}/favorite`);
      
      // Atualizar lista de favoritos
      setFavoriteListings([...favoriteListings, id]);
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao adicionar aos favoritos. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Remover anúncio dos favoritos
  const removeFromFavorites = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(`/api/v1/listings/${id}/unfavorite`);
      
      // Atualizar lista de favoritos
      setFavoriteListings(favoriteListings.filter(listingId => listingId !== id));
      
      return res.data.data;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao remover dos favoritos. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Obter anúncios favoritos
  const getFavoriteListings = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Obter IDs de favoritos do usuário
      const userRes = await axios.get('/api/v1/auth/me');
      const favoriteIds = userRes.data.data.favorites || [];
      
      if (favoriteIds.length === 0) {
        setFavoriteListings([]);
        return [];
      }
      
      // Buscar detalhes dos anúncios favoritos
      const promises = favoriteIds.map(id => axios.get(`/api/v1/listings/${id}`));
      const responses = await Promise.all(promises);
      
      const favorites = responses.map(res => res.data.data);
      setFavoriteListings(favorites);
      
      return favorites;
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Erro ao obter favoritos. Por favor, tente novamente.'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Valores do contexto
  const value = {
    listings,
    userListings,
    favoriteListings,
    loading,
    error,
    searchListings,
    getListing,
    getUserListings,
    createListing,
    updateListing,
    deleteListing,
    markAsSold,
    addToFavorites,
    removeFromFavorites,
    getFavoriteListings
  };
  
  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>;
};

// Hook personalizado para usar o contexto de anúncios
export const useListing = () => {
  return useContext(ListingContext);
};
