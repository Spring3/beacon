import React, { useState, useEffect } from 'react';
import { Redirect } from '@reach/router';

import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Loading } from '../components/Loading';

const withAuth = (Component) => (props) => {
  const auth = useAuth();
  const socketApi = useSocket();
  const [isLoading, setLoading] = useState(!auth.isLoggedIn)

  useEffect(() => {
    async function reconnect() {
      if ((isLoading && !auth.isLoggedIn) || !socketApi.isConnected) {
        await auth.reconnect();
        setLoading(false);
      }
    }
    reconnect();
  }, [isLoading, auth.isLoggedIn]);

  console.log('withAuth -> isLoggedIn', auth.isLoggedIn);
  console.log('withAuth -> isLoading', isLoading)

  if (isLoading) {
    return <Loading />
  }

  if (auth.isLoggedIn) {
    return <Component {...props} />;
  }

  return <Redirect to='/' noThrow />;
}

export { withAuth };
