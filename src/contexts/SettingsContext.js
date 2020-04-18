import React, { createContext, useEffect, useContext, useState } from 'react';
import { useSocket } from './SocketContext';
import { ServerEvents } from '../enums/socketEvents';

const SettingsContext = createContext();

const useSettingsContext = () => {
  const [settings, setSettings] = useState({
    isPublicProfile: false,
    autoNotify: false,
    departments: undefined
  });
  const socketApi = useSocket();

  useEffect(() => { 
    const handleAuthentication = ({ isAuthorized, settings }) => {
      console.log('handling auth in settings', isAuthorized, settings);
      if (isAuthorized && settings) {
        setSettings(settings);
      }
    };
    if (socketApi.isConnected) {
      socketApi.on(ServerEvents.authentication, handleAuthentication);
    }
    return () => {
      socketApi.removeListener(ServerEvents.authentication, handleAuthentication);
    }
  }, [socketApi.isConnected]);

  const toggleProfileVisibility = () => {
    setSettings({ ...settings, isPublicProfile: !settings.isPublicProfile });
  };

  const toggleAutomaticNotification = () => {
    setSettings({ ...settings, autoNotify: !settings.autoNotify });
  };

  const setDepartments = (arrayOfDepartments) => {
    setSettings({
      ...settings,
      departments: arrayOfDepartments
    });
  }

  return {
    ...settings,
    toggleProfileVisibility,
    toggleAutomaticNotification,
    setDepartments
  };
}

const SettingsContextProvider = ({ children }) => {
  const value = useSettingsContext();

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
};

const useSettings = () => useContext(SettingsContext);

export {
  SettingsContext,
  SettingsContextProvider,
  useSettings
};
