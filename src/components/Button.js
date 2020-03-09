import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Button = styled.button`
  padding: .7rem .9rem;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.colors.border};
  font-family: 'Noto Sans';
  font-size: 1rem;
  text-align: center;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};  
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  outline: none;
  transition: background .3s ease;
  transition: box-shadow .2s ease;
  transition: color .3s ease;
  transition: border-color .2s ease;
  width: ${(props) => props.fluid ? '100%' : 'auto'};
  cursor: pointer;
  
  svg {
    vertical-align: middle;
    margin-right: .75rem;
  }

  &:hover,
  &:focus {
    box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.shadow};
  }
  
  &:active {
    box-shadow: 0px 0px 0px transparent;
    background: ${props => props.theme.colors.shadowLight};
  }
`;

Button.propTypes = {
  bold: PropTypes.bool,
  fill: PropTypes.bool,
  fluid: PropTypes.bool
};

Button.defaultProps = {
  bold: false,
  fill: true,
  fluid: false
};

export {
  Button
};
