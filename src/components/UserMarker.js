import React, { memo } from 'react';
import { Marker } from 'react-map-gl';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { keyframes, css } from '@emotion/core';


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

const UserPositionMarker = styled.div`
  background-color: ${props => props.theme.colors.red};
  transition: width 1s ease;
  transition: height 1s ease;
  border-radius: 50%;
  ${props => props.isPublic && css({
    background: `url('${props.image}') center center`,
    backgroundSize: 'contain'
  })}
  width: ${props => props.isPublic ? '2rem' : '.5rem'};
  height: ${props => props.isPublic ? '2rem' : '.5rem'};
  animation: ${ripple} 1.5s linear infinite;
`;

const MarkerInfoWrapper = styled.div`  
  position: relative;
  top: 10px;
  left: -33%;
  background: rgba(255, 255, 255, .6);
  padding: 0px 5px;
  border-radius: 5px;

  div {
    font-size: .75rem;
    font-weight: bold;
  }
`;


const UserMarker = memo(({ userPhoto, userName, latitude, longitude }) => {
  const onClick = () => {
    console.log('Click');
  };

  const isPublic = userPhoto && userName;

  return (
    <Marker
      latitude={latitude}
      longitude={longitude}
      captureClick={true}
      onClick={onClick}
    >
      <UserPositionMarker
        image={userPhoto}
        isPublic={isPublic}
      />
      { isPublic && (
        <MarkerInfoWrapper> 
          <div>{userName}</div>
        </MarkerInfoWrapper>
      )}
    </Marker>
  );
});

UserMarker.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  userPhoto: PropTypes.string,
  userName: PropTypes.string
};

export { UserMarker };
