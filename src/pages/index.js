import React from 'react';
import { Router } from '@reach/router';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';
import Helmet from 'react-helmet';

import { AuthProvider } from './contexts/AuthContext';
import { Login } from './views/Login';
import { Application } from './views/Application';

const theme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    white: '#FFFFFF',
    'white-hover': '#000000',
    black: '#000000',
    'black-hover': '#FFFFFF',
    blue: '#3bb4e7',
    'blue-hover': '#FFFFFF',
    yellow: '#ffd85f',
    'yellow-hover': '#FFFFFF',
    red: '#ed5c68',
    'red-hover': '#FFFFFF',
    green: '#84a295',
    'green-hover': '#FFFFFF',
  },
  shadows: {
    light: 'grey'
  }
};

export default () => (
  <ThemeProvider theme={theme}>
    <Helmet />
    <AuthProvider>
      <Router>
        <Application path="/app" />
        <Login path="/" />
      </Router>
    </AuthProvider>

  </ThemeProvider>
);
