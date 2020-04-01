import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';
import Helmet from 'react-helmet';

import { SocketProvider } from '../contexts/SocketContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SettingsContextProvider } from '../contexts/SettingsContext';
import { Login } from '../views/Login';
import { Application } from '../views/Application';

const theme = {
  name: 'light',
  colors: {
    black: '#333333',
    blue: '#3bb4e7',
    blueHover: '#FFFFFF',
    yellow: '#ffd85f',
    yellowHover: '#FFFFFF',
    red: '#ed5c68',
    redHover: '#FFFFFF',
    border: '#C4C4C4',
    text: '#333333',
    textMirror: '#FFFFFF',
    shadow: '#E0E0E0',
    shadowLight: '#F4F4F4',
    white: '#FFFFFF'
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
    </Helmet>
    <SocketProvider>
      <SettingsContextProvider>
        <AuthProvider>
          <Router>
            <Application path="/app">
                { /* TODO: Add profile route */ }
            </Application>
            <Login path="/" />
          </Router>
        </AuthProvider>
      </SettingsContextProvider>
    </SocketProvider>
  </ThemeProvider>
);
