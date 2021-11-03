import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(({ auth }) => auth?.isAuthenticated);
  const loading = useSelector(({ auth }) => auth?.loading);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !loading ? (
          <Redirect to='/sign-in' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
