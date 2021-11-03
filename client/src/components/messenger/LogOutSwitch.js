import React from 'react';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions/auth';

const LogOutSwitch = () => {
  const isAuthenticated = useSelector(({ auth }) => auth?.isAuthenticated);

  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout());
  };

  const styles = {
    root: {
      alignItems: 'flex-end',
    },
    switch: {
      flexDirection: 'row-reverse',
    },
  };

  return (
    <FormGroup style={styles.root}>
      <FormControlLabel
        style={styles.switch}
        control={
          <Switch
            checked={isAuthenticated}
            onChange={handleLogOut}
            aria-label='login switch'
          />
        }
        label={isAuthenticated ? 'Logout' : null}
      />
    </FormGroup>
  );
};

export default LogOutSwitch;
