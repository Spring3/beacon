import io from 'socket.io-client';

function SocketManager() {
  let socket = undefined;
  let clientId = sessionStorage.getItem('client_id') || undefined;;

  const api = {
    getSocket: () => socket,
    resetId: () => {
      clientId = undefined;
      sessionStorage.removeItem('client_id');
    },
    connect: (token) => {
      if (!clientId && !token) {
        return Promise.resolve(false);
      }

      socket = io(process.env.GATSBY_SOCKET_ENDPOINT, {
        query: token ? { token } : { client: clientId }
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
            if (token) {
              clientId = res.id;
              sessionStorage.setItem('client_id', clientId);
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
    }
  };

  return api;
}


export default SocketManager;
