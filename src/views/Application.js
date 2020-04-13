import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useWindowSize } from '../hooks/useWindowSize';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Mapbox from '../components/Mapbox';
import { ClientEvents } from '../enums/socketEvents';
import { Navbar } from '../components/Navbar';
import { WelcomeModal } from '../modals/Welcome';

const MapWrapper = styled.div`
  position: relative;
  height: ${props => props.height - 60}px;
  width: 100%;
`;

const Map = () => {  
  const { user } = useAuth();
  const windowSize = useWindowSize();

  return useMemo(() => (
    <MapWrapper height={windowSize.height}>
      <Mapbox/>
      {!user.departments && !user.teams && (
        <WelcomeModal />
      )}
    </MapWrapper>
  ), [windowSize.height]);
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
