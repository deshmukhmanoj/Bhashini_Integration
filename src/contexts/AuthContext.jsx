import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Load token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('bhashini_auth_token');
    if (savedToken) {
      setAuthToken(savedToken);
      setIsTokenSet(true);
    }
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem('bhashini_auth_token', authToken);
      setIsTokenSet(true);
    } else {
      localStorage.removeItem('bhashini_auth_token');
      setIsTokenSet(false);
    }
  }, [authToken]);

  const updateAuthToken = (token) => {
    setAuthToken(token);
  };

  const clearAuthToken = () => {
    setAuthToken('');
    setIsTokenSet(false);
    localStorage.removeItem('bhashini_auth_token');
  };

  const value = {
    authToken,
    isTokenSet,
    updateAuthToken,
    clearAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
