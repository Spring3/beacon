import io from 'socket.io-client';
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

function SocketManager() {
  this.socket = undefined;
  this.clientId = undefined;
  this.setup = (token) => {
    this.socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
      query: {
        token
      }
    });

    return new Promise((resolve) => {
      this.socket.on('disconnect', (reason) => {
        console.log('socket disconnected due to', reason);
        this.socket = undefined;
        resolve(false);
      });

      this.socket.on('authentication', (res) => {
        console.log('Authentication', res)
        if (res.isAuthorized) {
          this.clientId = res.id;
          sessionStorage.setItem('client_id', this.clientId);
          console.log('Authorized');
          this.socket.emit('msg', 'Hello');
          resolve(true);
        } else {
          console.error('Authentication failed');
          resolve(false);
        }
      })
    });
  };
  
  this.reconnect = (clientId) => {
    this.socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
      query: {
        client: clientId
      }
    });

    return new Promise((resolve) => {
      this.socket.on('disconnect', (reason) => {
        console.log('socket disconnected due to', reason);
        this.socket = undefined;
        resolve(false);
      });

      this.socket.on('authentication', (res) => {
        console.log('Authentication', res)
        if (res.isAuthorized) {
          console.log('Reconnected');
          resolve(true);
        } else {
          console.error('Authentication failed');
          resolve(false)
        }
      });
    });
  }
}

const manager = new SocketManager();

const useAuthContextAPI = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const providers = {
    Slack: 'slack',
    Google: 'google'
  };

  const serverOrigin = process.env.GATSBY_SERVER_ENDPOINT;
  // let socket;
  let clientId = sessionStorage.getItem('client_id') || undefined;

  // const setupSocket = (token) => {
  //   socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
  //     query: {
  //       token
  //     }
  //   });

  //   return new Promise((resolve) => {
  //     socket.on('disconnect', (reason) => {
  //       console.log('socket disconnected due to', reason);
  //       socket = undefined;
  //       resolve(false);
  //     });

  //     socket.on('authentication', (res) => {
  //       console.log('Authentication', res)
  //       if (res.isAuthorized) {
  //         clientId = res.id;
  //         sessionStorage.setItem('client_id', clientId);
  //         console.log('Authorized');
  //         setLoggedIn(true);
  //         socket.emit('msg', 'Hello');
  //         resolve(true);
  //       } else {
  //         setLoggedIn(false);
  //         console.error('Authentication failed');
  //         resolve(false);
  //       }
  //     })
  //   });
  // }

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
          return manager.setup(event.data).then((loggedIn) => {
            setLoggedIn(loggedIn);
            return loggedIn;
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
    if (!clientId) {
      return Promise.resolve(false);
    }

    if (isLoggedIn) {
      return Promise.resolve(true);
    }

    const loggedIn = await manager.reconnect(clientId);
    setLoggedIn(loggedIn);
    return loggedIn;

    // socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
    //   query: {
    //     client: clientId
    //   }
    // });

    // return new Promise((resolve) => {
    //   socket.on('disconnect', (reason) => {
    //     console.log('socket disconnected due to', reason);
    //     socket = undefined;
    //     resolve(false);
    //   });

    //   socket.on('authentication', (res) => {
    //     console.log('Authentication', res)
    //     if (res.isAuthorized) {
    //       console.log('Reconnected');
    //       setLoggedIn(true);
    //       resolve(true);
    //     } else {
    //       console.error('Authentication failed');
    //       resolve(false)
    //     }
    //   });
    // });
  };

  // console.log('socket', socket);
  console.log('socket', manager.socket);

  const logout = async () => {
    console.log('logging out');
    // socket.emit('logout');
    manager.socket.emit('logout');
    const res = await fetch(`${serverOrigin}/logout`, { method: 'POST' });
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
