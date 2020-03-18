import React, { memo } from 'react';
import { Marker } from 'react-map-gl';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';


const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(231,90,95, 0.3),
                0 0 0 .5em rgba(231,90,95, 0.2);
  }
  50% {
    box-shadow: 0 0 0 .25em rgba(231,90,95, 0.3),
                0 0 0 .5em rgba(231,90,95, 0.2);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(231,90,95, 0.3),
                0 0 0 .5em rgba(231,90,95, 0.2);
  }
`;

const UserPositionMarger = styled.div`
  background-color: #E75A5F;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  animation: ${ripple} 1.5s linear infinite;
`;


const UserMarker = memo(({ latitude, longitude }) => {
  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
    >
      <UserPositionMarger />
    </Marker>
  );
});

UserMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};

export { UserMarker };
