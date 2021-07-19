import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const Bar = ({ classes, handleDrawerToggle, currentUser }) => {
  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        {currentUser && (
          <div className={classes.userTopBar}>
            <Avatar
              alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
              src={currentUser?.avatar}
            />
            <div className={classes.userNameTopBar}>
              <Typography variant='subtitle2' noWrap={true}>
                {currentUser?.firstName} {''} {currentUser?.lastName}
              </Typography>
            </div>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

const mapDispatchToProps = ({ messaging }) => ({
  currentUser: messaging?.currentUser,
});

export default connect(mapDispatchToProps, null)(Bar);
