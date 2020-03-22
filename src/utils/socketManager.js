import io from 'socket.io-client';

function SocketManager() {
  let socket = undefined;
  let clientId = localStorage.getItem('client_id') || undefined;;

  const api = {
    getSocket: () => socket,
    resetId: () => {
      clientId = undefined;
    },
    connect: ({ token, isReconnect }) => {
      if (!clientId && !token) {
        return Promise.resolve(false);
      }

      socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
        query: token ? { token } : { client: clientId } 
      });
  
      return new Promise((resolve) => {
        socket.on('disconnect', (reason) => {
          console.log('socket disconnected due to', reason);
          if (!isReconnect && reason === 'io server disconnect') {
            socket.connect();
          } else if (!isReconnect) {
            socket = undefined;
          }
          resolve(false);
        });
  
        socket.on('authentication', (res) => {
          console.log('Authentication', res)
          if (res.isAuthorized) {
            if (token) {
              clientId = res.id;
              localStorage.setItem('client_id', clientId);
              console.log('Authorized');
            } else {
              console.log('Reconnected');
            }
            sessionStorage.setItem('beacon-settings', JSON.stringify(res.settings));
            resolve(true);
          } else {
            console.error('Authentication failed');
            resolve(false);
          }
        })
      });
    }
  };

  return api;
}

const instance = new SocketManager();


export default instance;
