import React from 'react';
import styled from '@emotion/styled';

const StyledErrorMessage = styled.div`
  margin-top: 2rem;
  background: red;
  padding: 5px;
  color: ${props => props.theme.colors.white};
`;

const ErrorMessage = ({ children }) => (
  <StyledErrorMessage>
    {children}
  </StyledErrorMessage>
)

export {
  ErrorMessage
}
