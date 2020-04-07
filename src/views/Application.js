import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useWindowSize } from '../hooks/useWindowSize';
import { useAuth } from '../contexts/AuthContext';
import Mapbox from '../components/Mapbox';
import { ClientEvents } from '../enums/socketEvents';
import { Navbar } from '../components/Navbar';

const MapWrapper = styled.div`
  position: relative;
  height: ${props => props.height - 60}px;
  width: 100%;
`;

const Map = () => {  
  const windowSize = useWindowSize();
  return useMemo(() => (
    <MapWrapper height={windowSize.height}>
      <Mapbox/>
    </MapWrapper>
  ), [windowSize.height, windowSize.width]);
};

const ApplicationWrapper = styled.div`
`;

const Application = ({ children }) => {
  const auth = useAuth();

  const onLogout = (event) => {
    auth.logout();
  }

  return (
    <ApplicationWrapper>
      {/* <Button
        type="button"
        onClick={onLogout}
      >
        Log out
      </Button>
      <label htmlFor="public">Public profile</label>
      <input
        name="public"
        type="checkbox"
        onChange={() => {
          socketApi.emit(ClientEvents.settingsUpdate, { isPublicProfile: !settings.isPublicProfile, autoNotify: settings.autoNotify });
          settings.toggleProfileVisibility();
        }}
        checked={settings.isPublicProfile}
      />
      <label htmlFor="autoNotify">Notify Automatically</label>
      <input
        name="autoNotify"
        type="checkbox"
        onChange={() => {
          socketApi.emit(ClientEvents.settingsUpdate, { isPublicProfile: settings.isPublicProfile, autoNotify: !settings.autoNotify });
          settings.toggleAutomaticNotification();
        }}
        checked={settings.autoNotify}
      /> */}
      {children}
      <Navbar />
    </ApplicationWrapper>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application,
  Map
};
