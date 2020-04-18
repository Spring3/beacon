import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';
import Helmet from 'react-helmet';

import { SocketProvider } from '../contexts/SocketContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SettingsContextProvider } from '../contexts/SettingsContext';
import { Login } from '../views/Login';
import { Application, Map } from '../views/Application';
import { Profile } from '../views/Profile';

const theme = {
  name: 'light',
  colors: {
    black: '#333333',
    blue: '#3bb4e7',
    yellow: '#ffd85f',
    red: '#ed5c68',
    blueDisabled: 'rgba(59, 180, 231, .6)',
    yellowDisabled: 'rgba(255, 216, 95, .6)',
    redDisabled: 'rgba(237, 92, 104, .6)',
    border: '#C4C4C4',
    text: '#333333',
    textLight: '#FFFFFF',
    shadow: '#E0E0E0',
    shadowLight: '#F4F4F4',
    white: '#FFFFFF',
    disabled: '#E4E4E4'
  }
};

export default () => (
  <ThemeProvider theme={theme}>
    <Helmet>
      <style type="text/css">{`
          * {
            font-family: 'Noto Sans', 'Open Sans', Helvetica;
            color: #333;
          }          
      `}</style>
      <meta name="apple-mobile-web-app-capable" content="yes"></meta>
    </Helmet>
    <SocketProvider>
      <SettingsContextProvider>
        <AuthProvider>
          <Router>
            <Application path="/app">
              <Map path="/" />
              <Profile path="/profile" />
            </Application>
            <Login path="/" />
          </Router>
        </AuthProvider>
      </SettingsContextProvider>
    </SocketProvider>
  </ThemeProvider>
);
