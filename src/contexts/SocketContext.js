import io from 'socket.io-client';
import React, { createContext, useContext, useState } from 'react';
import { ServerEvents, ClientEvents } from '../enums/socketEvents';

const SocketContext = createContext();

const useSocketApi = () => {
  let clientId = localStorage.getItem('client_id') || undefined;
  const [socket, setSocket] = useState();
  const connect = ({ token, isReconnect }) => {
    if (!clientId && !token) {
      return Promise.resolve(false);
    }

    const socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
      query: token ? { token } : { client: clientId } 
    });

    setSocket(socket);

    return new Promise((resolve) => {
      socket.on(ServerEvents.disconnect, (reason) => {
        console.log('socket disconnected due to', reason);
        if (!isReconnect && reason === 'io server disconnect') {
          return connect();
        } else if (!isReconnect) {
          setSocket(undefined);
        }
        resolve(false);
      });

      socket.on(ServerEvents.authentication, (res) => {
        console.log('Authentication', res)
        if (res.isAuthorized) {
          if (token) {
            clientId = res.id;
            localStorage.setItem('client_id', clientId);
            console.log('Authorized');
          } else {
            console.log('Reconnected');
          }
          resolve(true);
        } else {
          console.error('Authentication failed');
          resolve(false);
        }
      })
    });
  };

  const disconnect = () => {
    if (socket) {
      socket.emit(ClientEvents.logout);
      clientId = undefined;
    }
  };

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data)
    } else {
      console.warn(event, 'event was emitted before the socket was initialized');
    }
  };

  const on = (event, listener) => {
    if (socket) {
      socket.on(event, listener);
    } else {
      console.warn('attempted to subscribe to ', event, 'event before the socket was initialized');
    }
  }

  const once = (event, listener) => {
    if (socket) {
      socket.on(event, listener);
    } else {
      console.warn('attempted to subscribe to ', event, 'event before the socket was initialized');
    }
  }

  const removeListener = (event, listener) => {
    if (socket) {
      socket.removeListener(event, listener);
    } else {
      console.warn('attempted to unsubscribe from ', event, 'event before the socket was initialized');
    }
  }

  const isConnected = !!socket;

  return {
    connect,
    emit,
    on,
    once,
    id: () => socket ? socket.id : undefined,
    isConnected,
    removeListener,
    disconnect
  };
}

const SocketProvider = ({ children }) => {
  const api = useSocketApi();
  return (
    <SocketContext.Provider value={api}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export {
  SocketProvider,
  SocketContext,
  useSocket
};
