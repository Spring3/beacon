import io from 'socket.io-client';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const useAuthContextAPI = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const providers = {
    Slack: 'slack',
    Google: 'google'
  };

  const serverOrigin = process.env.GATSBY_SERVER_ENDPOINT;
  let clientId = sessionStorage.getItem('client_id') || undefined;
  let socket;

  const setupSocket = (token) => {
    socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
      query: {
        token
      }
    });

    return new Promise((resolve) => {
      socket.on('disconnect', (reason) => {
        console.log('socket disconnected due to', reason);
        socket = undefined;
        resolve(false);
      });

      socket.on('authentication', (res) => {
        console.log('Authentication', res)
        if (res.isAuthorized) {
          clientId = res.id;
          sessionStorage.setItem('client_id', clientId);
          console.log('Authorized');
          setLoggedIn(true);
          socket.emit('msg', 'Hello');
          resolve(true);
        } else {
          setLoggedIn(false);
          console.error('Authentication failed');
          resolve(false);
        }
      })
    });
  }

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
          return setupSocket(event.data).then(resolve);
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

  const reconnect = () => {
    return new Promise((resolve) => {
      if (!clientId) {
        return resolve(false);
      }

      if (!isLoggedIn) {
        socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
          query: {
            client: clientId
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('socket disconnected due to', reason);
          socket = undefined;
          resolve(false);
        });

        socket.on('authentication', (res) => {
          console.log('Authentication', res)
          if (res.isAuthorized) {
            console.log('Reconnected');
            clientId = res.id;
            setLoggedIn(true);
            resolve(true);
          } else {
            console.error('Authentication failed');
            resolve(false)
          }
        });
      }
    });
  };

  const me = async () => {
    const res = await window.fetch(`${origin}/me`);
    console.log('me', res);
    return res;
  };

  return {
    isLoggedIn,
    providers,
    login,
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
