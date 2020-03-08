import React, { useState, useEffect } from 'react';
import { Redirect } from '@reach/router';

import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/Loading';

const withAuth = (Component) => (props) => {
  const auth = useAuth();
  const [isLoading, setLoading] = useState(!auth.isLoggedIn)

  useEffect(() => {
    async function reconnect() {
      if (isLoading && !auth.isLoggedIn) {
        await auth.reconnect();
        setLoading(false);
      }
    }
    reconnect();
  }, [isLoading, auth.isLoggedIn, auth.reconnect]);

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