import React from 'react';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import Mapbox from '../components/Mapbox';

const Application = (props) => {
  const auth = useAuth();

  const onLogout = (event) => {
    auth.logout();
  }

  return (
    <div style={{ height: '100vh', width: '100hw' }}>
      <h1>Hey, sunshine</h1>
      <Button
        type="button"
        onClick={onLogout}
      >
        Log out
      </Button>
      <Mapbox />
    </div>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application
};
