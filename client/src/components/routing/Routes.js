import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import SignUpPage from "../auth/SignUpPage";
import SignInPage from "../auth/SignInPage";
import Alert from "../layout/Alert";
import PrivateRoute from "../routing/PrivateRoute";
import Page404 from "../layout/Page404";
import Messenger from "../messenger/Messenger";

const Routes = () => {
  return (
    <Fragment>
      <Alert />
      <Switch>
        <PrivateRoute exact path="/" component={Messenger} />
        <Route exact path="/sign-in" component={SignInPage} />
        <Route exact path="/sign-up" component={SignUpPage} />
        <Route component={Page404} />
      </Switch>
    </Fragment>
  );
};

export default Routes;
