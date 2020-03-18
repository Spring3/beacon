import React, { createContext, useContext, useState } from 'react';
import SocketManager from '../utils/socketManager';

const AuthContext = createContext();
const manager = new SocketManager();

const useAuthContextAPI = () => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
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
          const loggedIn = await manager.connect(event.data);
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
      loggedIn = await manager.connect();
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

  console.log('socket', manager.getSocket());

  const logout = async () => {
    console.log('logging out');
    manager.getSocket().emit('logout');
    manager.resetId();
    const res = await fetch(`${serverOrigin}/logout`, { method: 'POST', credentials: 'include' });
    const wasLoggedOut = res.status === 200;
    if (wasLoggedOut) {
      setLoggedIn(false);
    }
    return wasLoggedOut;
  }

  const me = async () => window.fetch(`${serverOrigin}/me`, { credentials: 'include' })
    .then((res) => res.json())
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
    reconnect,
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
