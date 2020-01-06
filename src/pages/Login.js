import React from 'react';
import styled from '@emotion/styled';
import GoogleIcon from 'mdi-react/GoogleIcon';
import AccountBadgeHorizontalOutlineIcon from 'mdi-react/AccountBadgeHorizontalOutlineIcon';
import { withTheme } from 'emotion-theming';

import { Logo } from './components/Logo';
import { Button } from './components/Button';
import { useAuth } from './contexts/AuthContext';


const LoginPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 100vh;
`;

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  button:first-child {
    margin-bottom: 1rem;
  }
`;

const LoginView = withTheme(({ theme }) => {
  const auth = useAuth();
  return (
    <LoginPage>
      <Logo animate={true} size={80} />
      <ButtonsGroup>
        <Button
          type="button"
          color='green'
          bold={true}
          fluid={true}
          fill={true}
          onClick={() => auth.login(auth.providers.Bamboo)}
        >
          <AccountBadgeHorizontalOutlineIcon/>&nbsp;&nbsp;Sign in with BambooHR
        </Button>
      </ButtonsGroup>
    </LoginPage>
  )
});

export {
  LoginView as Login
};
