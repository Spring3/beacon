import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState();
  const [error, setError] = useState();
  const [isGeolocationEnabled, setEnabled] = useState(false);
  
  const isGeolocationAvailable = !!(navigator.geolocation && navigator.geolocation.getCurrentPosition && navigator.geolocation.watchPosition);

  useEffect(() => {
    let watcherId;
    if (isGeolocationAvailable) {
      const PERMISSION_DENIED = 1;
      const config = {
        enableHighAccuracy: true,
        maximumAge: 3000
      };

      const onSuccess = (position) => {
        const { coords } = position;
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed
        });

        if (!isGeolocationEnabled) {
          setEnabled(true);
        }

        if (error) {
          setError(null);
        }
      };

      const onError = (error) => {
        if (error.code === PERMISSION_DENIED) {
          setEnabled(false);
        }
        setError(error);
      };

      watcherId = navigator.geolocation.watchPosition(onSuccess, onError, config);
      navigator.geolocation.getCurrentPosition(onSuccess, onError, config);
    }
    return () => {
      if (isGeolocationEnabled && watcherId) {
        navigator.geolocation.clearWatch(watcherId);
      }
    }
  }, []);

  console.log('location', location);

  return [location, isGeolocationAvailable, isGeolocationEnabled, error];
}

export { useGeolocation };
