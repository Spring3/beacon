import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MapGL, { LinearInterpolator, WebMercatorViewport, GeolocateControl } from 'react-map-gl';
import bbox from '@turf/bbox';

import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { useGeolocation } from '../hooks/geolocation';
import { UserMarker } from './UserMarker';
import MAP_STYLE from '../utils/map-style-basic-v8.json';

// Make a copy of the map style
const mapStyle = {
  ...MAP_STYLE,
  sources: {...MAP_STYLE.sources},
  layers: MAP_STYLE.layers.slice()
};

mapStyle.sources['sf-neighborhoods'] = {
  type: 'geojson',
  data:
    'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/feature-example-sf.json'
};

mapStyle.layers.push(
  {
    id: 'sf-neighborhoods-fill',
    source: 'sf-neighborhoods',
    type: 'fill',
    paint: {
      'fill-outline-color': '#0040c8',
      'fill-color': '#fff',
      'fill-opacity': 0
    }
  },
  {
    id: 'sf-neighborhoods-outline',
    source: 'sf-neighborhoods',
    type: 'line',
    paint: {
      'line-width': 2,
      'line-color': '#0080ef'
    }
  }
);

const Mapbox = () => {
  const auth = useAuth();
  const settings = useSettings();

  const map = useRef();
  const [location, isGeolocationAvailable, isGeolocationEnabled, geolocationError] = useGeolocation();
  const [viewport, setViewport] = useState();
  const [userLocations, setUserLocations] = useState({});
  
  const { user, socket } = auth;
  console.log('viewport', viewport);

  useEffect(() => {
    const handleLocationUpdate = (payload) => {
      console.log('received [location-update]', payload);
      const { id, notify, profile = {}, location } = payload;
      setUserLocations({
        ...userLocations,
        [id]: {
          location,
          profile,
          notify
        }
      });
    }
    const sock = socket();
    sock.on('location-update', handleLocationUpdate);
    return () => {
      sock.removeListener('location-update', handleLocationUpdate);
    }
  }, []);

  useEffect(() => {
    if (!viewport && location) {
      setViewport(location);
    }

    if (location) {
      const payload = { location };

      if (settings.isPublicProfile) {
        payload.profile = {
          photo: auth.user.photo,
          name: auth.user.name
        };
      }

      if (settings.autoNotify) {
        payload.notify = true;
      }

      socket().emit('location-update', payload);
    }
  }, [location])

  const onClick = (event) => {
    const feature = event.features[0];
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);
      // construct a viewport instance from the current state
      const convertedViewport = new WebMercatorViewport(viewport);
      const {longitude, latitude, zoom} = convertedViewport.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: 40
      });

      this.setState({
        longitude,
        latitude,
        zoom,
        transitionInterpolator: new LinearInterpolator({
          around: [event.offsetCenter.x, event.offsetCenter.y]
        }),
        transitionDuration: 1000
      });
    }
  }

  const updateViewport = (viewport) => {
    console.log('setting viewport to', viewport);
    setViewport({ ...viewport })
  }

  if (!isGeolocationEnabled || !isGeolocationAvailable || !viewport) {
    return <div>Loading...</div>;
  }

  return (
    <MapGL
      ref={map}
      mapStyle={mapStyle}
      interactiveLayerIds={['sf-neighborhoods-fill']}
      {...viewport}
      width='100%'
      height='100%'
      onClick={onClick}
      onViewportChange={updateViewport}
      mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
    >
      {/* <GeolocateControl
        positionOptions={{ enableHighAccuracy: true, timeout: 3000 }}
        trackUserLocation={true}
        showAccuracyCircle={true}
        showUserLocation={true}
      /> */}
      <UserMarker
        {...location}
        userPhoto={user.photo}
        userName={user.name}
      />
      {Object.entries(userLocations).map(([id, payload]) => (
        <UserMarker
          key={id}
          {...payload.location}
          userPhoto={payload.profile.photo}
          userName={payload.profile.name}
        />
      ))}
    </MapGL>
  );
};

export default Mapbox;
