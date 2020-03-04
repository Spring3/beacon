import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { navigate } from '@reach/router';

const withAuth = (Component) => (props) => {
  const { isLoggedIn } = useAuth();

  console.log('withAuth -> isLoggedIn', isLoggedIn());

  if (!isLoggedIn()) {
    navigate('/');
    return null;
  }

  return (
    <Component {...props} />
  );
}

export { withAuth };
