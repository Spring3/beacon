import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Redirect } from '@reach/router';

const withAuth = (Component) => (props) => {
  const auth = useAuth();

  console.log('withAuth -> isLoggedIn', auth.isLoggedIn);

  if (!auth.isLoggedIn) {
    return <Redirect to='/' noThrow />;
  }

  return (
    <Component {...props} />
  );
}

export { withAuth };
