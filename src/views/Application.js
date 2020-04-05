import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import IncognitoIcon from 'mdi-react/IncognitoIcon';
import IncognitoOffIcon from 'mdi-react/IncognitoOffIcon';
import CrossHairsGpsIcon from 'mdi-react/CrosshairsGpsIcon';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Mapbox from '../components/Mapbox';
import { ClientEvents } from '../enums/socketEvents';
import { Navbar } from '../components/Navbar';

const MapWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 60px);
  position: relative;
`;

const RoundFloatingButton = ({ icon, ...props }) => {
  const Icon = styled(icon)`
    background: white;
    padding: 1rem;
    border-radius: 50%;
    box-shadow: 0px 0px 10px lightgrey;
  `;

  return <Icon {...props} />;
};

const FloatingButtonsList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 50px;
  right: .7rem;
  display: flex;
  flex-direction: column;

  svg:first-child {
    margin-bottom: 1rem;
  }
`;

const Map = () => {
  const settings = useSettings();
  return useMemo(() => (
    <MapWrapper>
      <Mapbox/>
      <FloatingButtonsList>
        <RoundFloatingButton
          icon={CrossHairsGpsIcon}
          onClick={() => {}}
        />
        <RoundFloatingButton
          icon={settings.isPublicProfile ? IncognitoIcon : IncognitoOffIcon}
          onClick={settings.toggleProfileVisibility}
        />
      </FloatingButtonsList>
    </MapWrapper>
  ), [settings.isPublicProfile]);
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
