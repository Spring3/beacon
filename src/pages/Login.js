import React from 'react';
import styled from '@emotion/styled';
import GoogleIcon from 'mdi-react/GoogleIcon';
import SlackIcon from 'mdi-react/SlackIcon';
import { withTheme } from 'emotion-theming';
import io from 'socket.io-client';

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
          color='white'
          bold={true}
          fluid={true}
          fill={true}
          onClick={() => auth.login(auth.providers.Google)}
        >
          <GoogleIcon/>&nbsp;&nbsp;Sign in with Google
        </Button>
        <Button
          type="button"
          color='white'
          bold={true}
          fluid={true}
          fill={true}
          onClick={() => auth.login(auth.providers.Slack)}
        >
          <SlackIcon/>&nbsp;&nbsp;Sign in with Slack
        </Button>
      </ButtonsGroup>
    </LoginPage>
  )
});

export {
  LoginView as Login
};
