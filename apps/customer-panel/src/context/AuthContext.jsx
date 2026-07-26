import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('customerToken') || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('customerUser');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('customerToken', accessToken);
    localStorage.setItem('customerUser', JSON.stringify(userData));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
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
