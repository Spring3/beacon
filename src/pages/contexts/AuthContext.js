import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

const getAuthContextAPI = () => {
  const providers = {
    Bamboo: 'bamboo',
    Google: 'google'
  };

  const login = (provider) => {

  };

  return {
    providers,
    login
  };
}

const AuthProvider = ({ children }) => {
  const api = getAuthContextAPI();
  return (
    <AuthContext.Provider value={api}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export {
  AuthContext,
  AuthProvider,
  useAuth
};
