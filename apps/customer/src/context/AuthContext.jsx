import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('customer_access_token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('customer_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [storeId, setStoreIdState] = useState(() => localStorage.getItem('customer_store_id') || 'demo-store-id');

  const setStoreId = (id) => {
    setStoreIdState(id);
    localStorage.setItem('customer_store_id', id);
  };

  const login = (userData, accessToken, targetStoreId) => {
    setToken(accessToken);
    setUser(userData);
    if (targetStoreId) {
      setStoreId(targetStoreId);
    }
    localStorage.setItem('customer_access_token', accessToken);
    localStorage.setItem('customer_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('customer_access_token');
    localStorage.removeItem('customer_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, storeId, setStoreId, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
