import React from 'react';
import PropTypes from 'prop-types';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { withTheme } from 'emotion-theming';

const LogoSVG = styled.svg`
  overflow: visible; 
`;

const spin = keyframes`
  from {
    transform: rotateZ(0deg);
  }
  51% {
    transform: rotateZ(360deg);
  }
  60%, 100% {
    transform: rotateZ(360deg);
  }
`;

const spinning = css`
  transform-origin: center;
  animation: ${spin} 1s linear infinite;
`;

const composeUp = keyframes`
  from {
    transform: translateY(0px);
  }
  10%, 50% {
    transform: translateY(-60px);
  }
  60%, 100% {
    transform: translateY(0px);
  }
`;

const composeRight = keyframes`
  from {
    transform: translateX(0px);
  }
  10%, 50% {
    transform: translateX(60px);
  }
  60%, 100% {
    transform: translateX(0px);
  }
`;

const composeLeft = keyframes`
  from {
    transform: translateX(0px);
  }
  10%, 50% {
    transform: translateX(-60px);
  }
  60%, 100% {
    transform: translateX(0px);
  }
`;

const composingUp = css`
  animation: ${composeUp} 1s linear infinite;
`;

const composingRight = css`
  animation: ${composeRight} 1s linear infinite;
`;

const composingLeft = css`
  animation: ${composeLeft} 1s linear infinite;
`;

const Logo = withTheme(({ size, animate, theme }) => {
  const { colors } = theme;
  return (
    <LogoSVG
      id="logo"
      data-name="logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 325.00002 375"
      width={size}
      height={size}
    >
      <title>Beacon</title>
      <polygon
        css={animate && composingUp}
        className="outer-blue"
        fill={colors.blue}
        points="0,93.83 162.53,0 325.05,93.83 283.68,117.86 163.03,48.2 42.38,117.86"
      />
      <polygon
        css={animate && composingLeft}
        className="outer-yellow"
        fill={colors.yellow}
        points="0.06,93.94 0.38,281.73 162.91,375.56 163.09,326.94 42.44,257.29 42.44,117.97"
      />
      <polygon
        css={animate && composingRight}
        className="outer-red"
        fill={colors.red}
        points="324.95,93.89 325.33,281.63 162.75,375.5 162.94,326.89 283.59,257.23 283.59,117.91"
      />
      <polygon
        css={animate && spinning}
        className="inner-blue"
        fill={colors.blue}
        points="253.89,135.22 162.9,82.69 71.92,135.22 119.66,162.41 162.97,137.4 206.28,162.41"
      />
      <polygon
        css={animate && spinning}
        className="inner-yellow"
        fill={colors.yellow}
        points="71.92,135.22 71.92,240.28 162.9,292.81 162.97,237.42 119.66,212.41 119.66,162.41"
      />
      <polygon
        css={animate && spinning}
        className="inner-red"
        fill={colors.red}
        points="253.89,135.22 253.89,240.28 162.9,292.81 162.97,237.42 206.28,212.41 206.28,162.41"
      />
    </LogoSVG>
  );
});

Logo.propTypes = {
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }),
  animate: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

Logo.defaultProps = {
  animate: false,
  size: 50
};

export {
  Logo
};
