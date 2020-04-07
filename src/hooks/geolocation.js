import { useState, useEffect } from 'react';

const GeolocationErrors = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3
}

const useGeolocation = () => {
  const [location, setLocation] = useState();
  const [error, setError] = useState();
  const [isGeolocationEnabled, setEnabled] = useState(false);
  
  const isGeolocationAvailable = !!(
    navigator.geolocation
    && navigator.geolocation.getCurrentPosition
    && navigator.geolocation.watchPosition
  );

  useEffect(() => {
    let watcherId;
    if (isGeolocationAvailable) {
      const config = {
        enableHighAccuracy: false,
        maximumAge: 2000
      };

      const onSuccess = (position) => {
        const { coords } = position;
        console.log('watcher updated location');
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude
        });

        if (!isGeolocationEnabled) {
          setEnabled(true);
        }

        if (error) {
          setError(null);
        }
      };

      const onError = (error) => {
        switch (error.code) {
          case GeolocationErrors.PERMISSION_DENIED:
            setEnabled(false);
            break;
          default:
            break;
        }
        setError(error);
        console.error('Error during fetching geolocation', error);
      };

      console.log('initialized gelolocation');
      watcherId = navigator.geolocation.watchPosition(onSuccess, onError, config);
    }
    return () => {
      if (watcherId) {
        console.log('watcher cleared');
        navigator.geolocation.clearWatch(watcherId);
      }
    }
  }, []);

  console.log('location', location);

  return [location, isGeolocationAvailable, isGeolocationEnabled, error];
}

export { useGeolocation };
