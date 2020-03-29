import React, { createContext, useContext, useState } from 'react';
import { useSocket } from './SocketContext';

const AuthContext = createContext();

const useAuthContextAPI = () => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const socketApi = useSocket();

  const providers = {
    Slack: 'slack',
    Google: 'google'
  };

  const serverOrigin = process.env.GATSBY_SERVER_ENDPOINT;

  const login = (provider) => {
    console.log('logging in');
    return new Promise((resolve, reject) => {
      // if not complete in a minute, reject.
      const timeout = setTimeout(reject, 60000);

      const messageHandler = async (event) => {
        console.log('message', event);
        clearTimeout(timeout);
        if (event.origin === serverOrigin) {
          event.source.close();
          const userInfo = await me();
          setUser(userInfo);
          window.removeEventListener('message', messageHandler);
          const loggedIn = await socketApi.connect({ token: event.data });
          setLoggedIn(loggedIn);
          return resolve(loggedIn);
        }
        window.removeEventListener('message', messageHandler);
        event.source.close();
        reject();
      }

      window.addEventListener('message', messageHandler);

      switch (provider) {
        case providers.Google:
          window.open(`${serverOrigin}/auth/google`);
          break;
        default:
          window.open(`${serverOrigin}/auth/google`);
      }
    });
  };

  const reconnect = async () => {
    if (isLoggedIn) {
      return Promise.resolve(true);
    }

    let loggedIn;
    try {
      loggedIn = await socketApi.connect({ isReconnect: true });
      const userInfo = await me();
      setUser(userInfo);
    } catch (error) {
      loggedIn = false;
      // TODO: handle properly
      console.error(error);
    } finally {
      setLoggedIn(loggedIn);
    }
    
    return loggedIn; 
  };

  const logout = async () => {
    console.log('logging out');
    socketApi.disconnect();
    const res = await fetch(`${serverOrigin}/logout`, { method: 'POST', credentials: 'include' });
    const wasLoggedOut = res.status === 200;
    if (wasLoggedOut) {
      localStorage.removeItem('client_id');
      setLoggedIn(false);
    }
    return wasLoggedOut;
  }

  const me = async () => window.fetch(`${serverOrigin}/me`, { credentials: 'include' })
    .then((res) => res.text())
    .then((text) => text ? JSON.parse(text) : null)
    .then((payload) => {
      console.log('userInfo', payload);
      return payload;
    });

  return {
    user,
    isLoggedIn,
    providers,
    login,
    logout,
    reconnect
  };
}

const AuthProvider = ({ children }) => {
  const api = useAuthContextAPI();
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
