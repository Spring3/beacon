import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Button = styled.button`
  background: ${({ theme, color, fill }) => {
    if (fill) {
      return theme.colors[color];
    }
    return theme.colors.background;
  }};
  padding: .7rem .9rem;
  border-radius: 3px;
  border: 3px solid ${({ theme, color }) => theme.colors[color]};
  font-family: 'Noto Sans';
  font-size: 1rem;
  text-align: center;
  color: ${({ color, theme, fill }) => fill ? theme.colors[`${color}-hover`] : theme.colors[color]};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  outline: none;
  transition: background .3s ease;
  transition: color .3s ease;
  transition: box-shadow .2s ease;
  transition: border-color .2s ease;
  width: ${(props) => props.fluid ? '100%' : 'auto'};
  cursor: pointer;
  
  svg {
    vertical-align: middle;
  }

  &:hover,
  &:focus {
    box-shadow: 0px 0px 10px ${({ theme }) => theme.shadows[theme.name]};
  }
  
  &:active {
    box-shadow: 0px 0px 0px transparent;
    background: ${({ color, theme, fill }) => fill ? theme.colors[`${color}-hover`] : theme.colors[color]};
    color: ${({ color, theme, fill }) => fill ? theme.colors[color] : theme.colors[`${color}-hover`]};
  }
`;

Button.propTypes = {
  color: PropTypes.oneOf([
    'white',
    'black',
    'blue',
    'red',
    'yellow',
    'green'
  ]),
  bold: PropTypes.bool,
  fill: PropTypes.bool,
  fluid: PropTypes.bool
};

Button.defaultProps = {
  color: 'black',
  bold: false,
  fill: true,
  fluid: false
};

export {
  Button
};
