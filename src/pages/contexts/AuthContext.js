import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

const getAuthContextAPI = () => {
  const providers = {
    Slack: 'slack',
    Google: 'google'
  };

  const login = (provider) => {
    switch (provider) {
      case providers.Google:
        window.open('https://beacon-auth.herokuapp.com/auth/google', '__blank');
        break;
      default:
        window.open('https://beacon-auth.herokuapp.com/auth/google', '__blank');
    }
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
