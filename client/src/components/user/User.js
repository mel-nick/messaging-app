import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { useStyles } from './userStyles';
import { connect } from 'react-redux';

const User = ({ user, onClickHandler, currentUser }) => {
  const classes = useStyles();

  const currentUserStyles = {
    backgroundColor: '#d3d3d3',
    padding: '0.7rem',
    borderRadius: '15px',
  };
  const [styles, setStyles] = useState({});

  useEffect(() => {
    currentUser?._id === user?._id && setStyles(currentUserStyles);
    return () => setStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user]);

  return (
    <div className={classes.avatar} onClick={onClickHandler} style={styles}>
      <Avatar alt={`${user?.firstName} ${user?.lastName}`} src={user?.avatar} />
      <div className={classes.userData}>
        <Typography variant='subtitle2' noWrap={true}>
          {user?.firstName} {''} {user?.lastName}
        </Typography>
      </div>
    </div>
  );
};

const mapDispatchToProps = ({ messaging }) => ({
  currentUser: messaging?.currentUser,
});

export default connect(mapDispatchToProps, null)(User);
