import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import IncognitoIcon from 'mdi-react/IncognitoIcon';
import IncognitoOffIcon from 'mdi-react/IncognitoOffIcon';
import CrossHairsGpsIcon from 'mdi-react/CrosshairsGpsIcon';
import MapGL, { LinearInterpolator, WebMercatorViewport, GeolocateControl, FlyToInterpolator } from 'react-map-gl';
import bbox from '@turf/bbox';
import { easeCubic } from 'd3-ease';

import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useGeolocation } from '../hooks/geolocation';
import { UserMarker } from './UserMarker';
import { ServerEvents, ClientEvents } from '../enums/socketEvents';
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

  svg {
    cursor: pointer;
  }

  svg:first-child {
    margin-bottom: 1rem;
  }
`;

const Mapbox = () => {
  const auth = useAuth();
  const socketApi = useSocket();
  const settings = useSettings();

  const map = useRef();
  const [location, isGeolocationAvailable, isGeolocationEnabled, geolocationError] = useGeolocation();
  const [viewport, setViewport] = useState();
  const [userLocations, setUserLocations] = useState({});
  const [userData, setUserData] = useState({});
  
  const { user } = auth;

  useEffect(() => {
    const handleLocationUpdate = (payload) => {
      console.log('received [location-update]', payload);
      const { data } = payload;
      // we don't want to show ourselves twice
      delete data[socketApi.id()];
      setUserLocations(userLocations => Object.entries({ ...userLocations, ...data})
        .reduce((acc, [key, value]) => {
          return !!value ? { ...acc, [key]: value } : acc;
        }, {})
      );
      console.log('updatedUserLocations', userLocations);
    }

    const handleProfileVisibilityUpdate = (payload) => {
      console.log('received [visibility-update]', payload);
      const { id, data } = payload;
      setUserData(userData => ({
        ...userData,
        [id]: data
      }));
    };

    const handleSync = (syncPayload) => {
      console.log('received [sync]', syncPayload);
      const locations = {};
      const data = {};
      for (const [key, payload] of Object.entries(syncPayload)) {
        if (payload.location) {
          locations[key] = payload.location;
        }
        if (payload.data) {
          data[key] = payload.data;
        }
      }
      setUserLocations(locations);
      setUserData(data);
    }


    if (socketApi.isConnected) {
      socketApi.on(ServerEvents.locationUpdate, handleLocationUpdate);
      socketApi.on(ServerEvents.visibilityUpdate, handleProfileVisibilityUpdate);
      socketApi.on(ServerEvents.sync, handleSync);
      socketApi.emit(ClientEvents.sync);
    }
    return () => {
      socketApi.removeListener(ServerEvents.locationUpdate, handleLocationUpdate);
      socketApi.removeListener(ServerEvents.visibilityUpdate, handleProfileVisibilityUpdate);
      socketApi.removeListener(ServerEvents.sync, handleSync);
    }
  }, [socketApi.isConnected]);

  // when the geolocation api retuned the locaiton for the first time
  // trigger auto zoom
  useEffect(() => {
    if (isGeolocationEnabled) {
      setViewport({
        ...location,
        zoom: 10,
        transitionDuration: 5000,
        transitionInterpolator: new FlyToInterpolator(),
        transitionEasing: easeCubic
      });
    }
  }, [isGeolocationEnabled]);

  // on each location update, update the server
  useEffect(() => {
    if (location) {
      const payload = { location };

      socketApi.emit(ClientEvents.locationUpdate, payload);
    }
  }, [location])

  // const onClick = (event) => {
  //   const feature = event.features[0];
  //   if (feature) {
  //     // calculate the bounding box of the feature
  //     const [minLng, minLat, maxLng, maxLat] = bbox(feature);
  //     // construct a viewport instance from the current state
  //     const convertedViewport = new WebMercatorViewport(viewport);
  //     const {longitude, latitude, zoom} = convertedViewport.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
  //       padding: 40
  //     });

  //     this.setState({
  //       longitude,
  //       latitude,
  //       zoom,
  //       transitionInterpolator: new LinearInterpolator({
  //         around: [event.offsetCenter.x, event.offsetCenter.y]
  //       }),
  //       transitionDuration: 1000
  //     });
  //   }
  // }

  const updateViewport = (viewport) => {
    setViewport({ ...viewport });
  }

  if (!isGeolocationAvailable) {
    return <div>Geolocation is not supported by your browser...</div>;
  }

  const safeViewport = viewport || {};

  return (
    <>
      <MapGL
        ref={map}
        mapStyle={mapStyle}
        interactiveLayerIds={['sf-neighborhoods-fill']}
        {...safeViewport}
        width='100%'
        height='100%'
        // onClick={onClick}
        onViewportChange={updateViewport}
        mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
      >
        {/* <GeolocateControl
          positionOptions={{ enableHighAccuracy: true, timeout: 3000 }}
          trackUserLocation={true}
          showAccuracyCircle={true}
          showUserLocation={true}
        /> */}
        {isGeolocationEnabled
          ? (
            <UserMarker
              {...location}
              avatar={user.photo}
              name={user.name}
            />
          )
          : null
        }
        {Object.entries(userLocations).map(([id, location]) => {
          const { photo, name } = userData[id] || {};
          return (
            <UserMarker
              key={id}
              {...location}
              avatar={photo}
              name={name}
            />
          );
        })}
      </MapGL>
      <FloatingButtonsList>
        <RoundFloatingButton
          icon={CrossHairsGpsIcon}
          onClick={() => {
            // TODO: animate while isGeolocationEnabled = false
            if (viewport && isGeolocationEnabled) {
              setViewport({
                ...viewport,
                ...location,
                zoom: 10,
                transitionDuration: 5000,
                transitionInterpolator: new FlyToInterpolator(),
                transitionEasing: easeCubic
              })
            }
          }}
        />
        <RoundFloatingButton
          icon={settings.isPublicProfile ? IncognitoIcon : IncognitoOffIcon}
          onClick={() => {
            const newValue = settings.toggleProfileVisibility();
            socketApi.emit(ClientEvents.settingsUpdate, { data: { isPublicProfile: newValue } });
          }}
        />
      </FloatingButtonsList>
    </>
  );
};

export default Mapbox;
