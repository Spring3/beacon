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

const UserPositionMarker = styled.img`
  background-color: #E75A5F;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  animation: ${ripple} 1.5s linear infinite;
`;

const MarkerInfoWrapper = styled.div`  
  position: relative;
  top: 10px;
  left: -33%;
`;


const UserMarker = memo(({ userPhoto, userName, latitude, longitude }) => {
  const onClick = () => {
    console.log('Click');
  };

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      captureClick={true}
      onClick={onClick}
    >
      <UserPositionMarker src={userPhoto} alt={userName} />
      <MarkerInfoWrapper> 
        <div>{userName}</div>
      </MarkerInfoWrapper>
    </Marker>
  );
});

UserMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  userPhoto: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired
};

export { UserMarker };
