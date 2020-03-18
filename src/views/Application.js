import React from 'react';
import styled from '@emotion/styled';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import Mapbox from '../components/Mapbox';

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;

const Application = (props) => {
  const auth = useAuth();

  const onLogout = (event) => {
    auth.logout();
  }

  return (
    <div> 
      <Button
        type="button"
        onClick={onLogout}
      >
        Log out
      </Button>
      <MapWrapper>
        <Mapbox />
      </MapWrapper>
    </div>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application
};
