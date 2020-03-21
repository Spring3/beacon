import React from 'react';
import styled from '@emotion/styled';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import Mapbox from '../components/Mapbox';

const MapWrapper = styled.div`
  width: 100%;
  height: 100vh;
`;

const Application = (props) => {
  const auth = useAuth();
  const settings = useSettings();

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
      <label htmlFor="public">Public profile</label>
      <input
        name="public"
        type="checkbox"
        onChange={() => {
          const socket = auth.socket();
          if (socket) {
            socket.emit('settings-update', { isPublicProfile: !settings.isPublicProfile, autoNotify: settings.autoNotify });
          }
          settings.toggleProfileVisibility();
        }}
        checked={settings.isPublicProfile}
      />
      <label htmlFor="autoNotify">Notify Automatically</label>
      <input
        name="autoNotify"
        type="checkbox"
        onChange={() => {
          const socket = auth.socket();
          if (socket) {
            socket.emit('settings-update', { isPublicProfile: !settings.isPublicProfile, autoNotify: settings.autoNotify });
          }
          settings.toggleAutomaticNotification();
        }}
        checked={settings.autoNotify}
      />
      <MapWrapper>
        <Mapbox/>
      </MapWrapper>
    </div>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application
};
