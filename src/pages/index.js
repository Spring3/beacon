import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Logo } from './logo';

const theme = {
  colors: {
    blue: '#3bb4e7',
    yellow: '#ffd85f',
    red: '#ed5c68'
  }
};

export default () => (
  <ThemeProvider theme={theme}>
    <Logo />
  </ThemeProvider>
);
