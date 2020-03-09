import React, { useRef } from 'react';
import MapGL, {LinearInterpolator, WebMercatorViewport} from 'react-map-gl';
import { withAuth } from '../hocs/withAuth';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

import MAP_STYLE from './map-style-basic-v8.json';

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

const Application = (props) => {
  const auth = useAuth();
  const map = useRef();

  const viewport = {
    latitude: 37.785164,
    longitude: -122.4,
    zoom: 11,
    bearing: 0,
    pitch: 0
  };


  const onLogout = (event) => {
    auth.logout();
  }

  const onClick = (event) => {
  }

  const updateViewport = (viewport) => {}

  return (
    <div style={{ height: '100vh', width: '100hw' }}>
      <h1>Hey, sunshine</h1>
      <Button
        type="button"
        onClick={onLogout}
      >
        Log out
      </Button>

      <MapGL
        ref={map}
        mapStyle={MAP_STYLE}
        interactiveLayerIds={['sf-neighborhoods-fill']}
        {...viewport}
        width="100%"
        height="100%"
        onClick={onClick}
        onViewportChange={updateViewport}
        mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
      >
        { /* <ControlPanel containerComponent={this.props.containerComponent} /> */ }
      </MapGL>
    </div>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application
};
