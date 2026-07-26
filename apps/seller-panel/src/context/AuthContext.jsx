import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('sellerToken') || localStorage.getItem('seller_access_token') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sellerUser') || localStorage.getItem('seller_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('sellerToken', accessToken);
    localStorage.setItem('seller_access_token', accessToken);
    localStorage.setItem('sellerUser', JSON.stringify(userData));
    localStorage.setItem('seller_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('seller_access_token');
    localStorage.removeItem('sellerUser');
    localStorage.removeItem('seller_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
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
