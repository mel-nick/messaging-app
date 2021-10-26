/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './components/routing/Routes';
import setAuthToken from './utils/setAuthToken';
import { SocketContext } from './context';
import { io } from 'socket.io-client';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    setSocket(io());
  }, []);

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <SocketContext.Provider value={{ socket }}>
        <Router>
          <Fragment>
            <Switch>
              <Route component={Routes} />
            </Switch>
          </Fragment>
        </Router>
      </SocketContext.Provider>
    </Provider>
  );
};

export default App;
