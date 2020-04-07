import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import Mapbox from '../components/Mapbox';
import { ClientEvents } from '../enums/socketEvents';
import { Navbar } from '../components/Navbar';

const MapWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  position: relative;
`;

const Map = () => {  
  return useMemo(() => (
    <MapWrapper>
      <Mapbox/>
    </MapWrapper>
  ), []);
};

const Application = ({ children }) => {
  const auth = useAuth();
  const socketApi = useSocket();

  const onLogout = (event) => {
    auth.logout();
  }

  return (
    <div>
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
    </div>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application,
  Map
};
