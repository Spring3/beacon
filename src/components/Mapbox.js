import React, { useRef, useState, useEffect } from 'react';
import MapGL, { LinearInterpolator, WebMercatorViewport, GeolocateControl } from 'react-map-gl';
import bbox from '@turf/bbox';
import { geolocated } from 'react-geolocated';

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

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

const Mapbox = ({
  coords,
  /*: {
    latitude,
    longitude,
    altitude,
    accuracy,
    altitudeAccuracy,
    heading,
    speed,
  }*/
  isGeolocationAvailable, // boolean flag indicating that the browser supports the Geolocation API
  isGeolocationEnabled, // boolean flag indicating that the user has allowed the use of the Geolocation API
  positionError // object with the error returned from the Geolocation API call
}) => {
  const map = useRef();
  const [viewport, setViewport] = useState();

  useEffect(() => {
    if (coords && !viewport) {
      setViewport({
        longitude: coords.longitude,
        latitude: coords.latitude,
        zoom: 11,
        bearing: 0,
        pitch: 0
      });
    }
  }, [coords])

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
    console.log('setting viewport');
    setViewport({ ...viewport })
  }

  console.log('geolocation available', isGeolocationAvailable);
  console.log('geolocation enabled', isGeolocationEnabled);
  console.log('coords', coords);

  if (!isGeolocationEnabled || !isGeolocationAvailable || !viewport) {
    return null;
  }

  return (
    <MapGL
      ref={map}
      mapStyle={mapStyle}
      interactiveLayerIds={['sf-neighborhoods-fill']}
      latitude={viewport.latitude}
      longitude={viewport.longtitude}
      zoom={viewport.zoom}
      bearing={viewport.bearing}
      pitch={viewport.pitch}
      width="50%"
      height="50%"
      onClick={onClick}
      onViewportChange={updateViewport}
      mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
    >
      <GeolocateControl
        style={geolocateStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
    </MapGL>
  );
};

export default geolocated({
  positionOptions: {
      enableHighAccuracy: true
  },
  watchPosition: true,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation,
  isOptimisticGeolocationEnabled: true
})(Mapbox);
