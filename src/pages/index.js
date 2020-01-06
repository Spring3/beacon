import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import 'normalize.css';

import { AuthProvider } from './contexts/AuthContext';
import { Login } from './Login';

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
    <AuthProvider>
      <Login />
    </AuthProvider>
  </ThemeProvider>
);
