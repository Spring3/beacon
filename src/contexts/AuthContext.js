import React, { createContext, useContext, useState } from 'react';
import SocketManager from '../utils/socketManager';

const AuthContext = createContext();
const manager = new SocketManager();

const useAuthContextAPI = () => {
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

      const messageHandler = (event) => {
        console.log('message', event);
        clearTimeout(timeout);
        if (event.origin === serverOrigin) {
          event.source.close();
          window.removeEventListener('message', messageHandler);
          return manager.connect(event.data).then((loggedIn) => {
            setLoggedIn(loggedIn);
            return resolve(loggedIn);
          });
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

    const loggedIn = await manager.connect();
    setLoggedIn(loggedIn);
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

  const me = async () => {
    const res = await window.fetch(`${origin}/me`);
    console.log('me', res);
    return res;
  };

  return {
    isLoggedIn,
    providers,
    login,
    logout,
    reconnect,
    me
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
