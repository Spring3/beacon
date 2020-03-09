import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';
import Helmet from 'react-helmet';

import { AuthProvider } from '../contexts/AuthContext';
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
    shadowLight: '#F4F4F4'
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
    <AuthProvider>
      <Router>
        <Application path="/app" />
        <Login path="/" />
      </Router>
    </AuthProvider>

  </ThemeProvider>
);
