import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";

const LogOutSwitch = ({ logout, isAuthenticated }) => {
  const handleLogOut = () => {
    logout();
  };

  const styles = {
    root: {
      alignItems: "flex-end",
    },
    switch: {
      flexDirection: "row-reverse",
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
            aria-label="login switch"
          />
        }
        label={isAuthenticated ? "Logout" : null}
      />
    </FormGroup>
  );
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth?.isAuthenticated,
});

export default connect(mapStateToProps, { logout })(LogOutSwitch);
