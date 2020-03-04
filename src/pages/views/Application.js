import React from 'react';
import { withAuth } from '../hocs/withAuth';

const Application = (props) => {
  return (
    <h1>Hey, sunshine</h1>
  );
};

const PrivateApplicationRoute = withAuth(Application);

export {
  PrivateApplicationRoute as Application
};
