import React, { useState, useEffect } from 'react';
import { Redirect } from '@reach/router';

import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { Loading } from '../components/Loading';

const withAuth = (Component) => (props) => {
  const auth = useAuth();
  const settings = useSettings();
  const [isLoading, setLoading] = useState(!auth.isLoggedIn)

  useEffect(() => {
    const updateSettings = () => {
      const config = sessionStorage.getItem('beacon-settings');
      if (config) {
        settings.updateSettings(JSON.parse(config));
        sessionStorage.removeItem('beacon-settings');
      }
    }
    async function reconnect() {
      if ((isLoading && !auth.isLoggedIn) || !auth.socket()) {
        await auth.reconnect();
        updateSettings();
        setLoading(false);
      }
    }
    reconnect();

    if (auth.isLoggedIn) {
      updateSettings();
    }
  }, [isLoading, auth.isLoggedIn]);

  console.log('withAuth -> isLoggedIn', auth.isLoggedIn);
  console.log('withAuth -> isLoading', isLoading)

  if (isLoading) {
    return <Loading />
  }

  if (auth.isLoggedIn) {
    return <Component {...props} />;
  }

  return <Redirect to='/' noThrow />;
}

export { withAuth };
