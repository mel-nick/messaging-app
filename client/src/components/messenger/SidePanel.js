import React, { Fragment } from 'react';
import { useStyles } from './messengerStyles';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import LogOutSwitch from './LogOutSwitch';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import User from '../user/User';
import {
  setCurrentUser,
  addOnlineUserToActiveChats,
} from '../../actions/messaging';

const SidePanel = ({
  searchString,
  setSearchString,
  searchResults,
  setSearchData,
  handleDrawerToggle,
}) => {
  const dispatch = useDispatch();

  const loggedUser = useSelector(({ auth }) => auth?.user);
  const currentUser = useSelector(({ messaging }) => messaging?.currentUser);
  const activeChats = useSelector(({ messaging }) => messaging?.activeChats);
  const onlineUsers = useSelector(({ messaging }) => messaging?.onlineUsers);

  const classes = useStyles();

  const handleSearchClear = () => {
    setSearchData([]);
    setSearchString('');
  };

  const isUserOnline = (user, usersOnline) => {
    if (usersOnline?.some(({ _id }) => _id === user._id)) {
      return true;
    }
  };

  return (
    <Fragment>
      <div className={classes.toolbar}>
        <LogOutSwitch />
        <div className={classes.avatar}>
          <Avatar
            alt={`${loggedUser?.firstName} ${loggedUser?.lastName}`}
            src={loggedUser?.avatar}
          />
        </div>
        <div className={classes.userData}>
          <Typography align='center' variant='h6'>
            {loggedUser?.firstName} {''} {loggedUser?.lastName}
          </Typography>
        </div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            {!searchString ? (
              <SearchIcon />
            ) : (
              <ClearIcon onClick={handleSearchClear} />
            )}
          </div>
          <InputBase
            placeholder='Search contacts…'
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            value={searchString}
            onChange={(e) => {
              !e.target.value && handleSearchClear();
              setSearchString(e.target.value);
            }}
          />
        </div>
      </div>
      <Divider />
      <div>
        {!searchString
          ? activeChats?.map((user) => (
              <User
                online={isUserOnline(user, onlineUsers)}
                key={user._id}
                user={user}
                onClickHandler={() => {
                  if (currentUser?._id !== user?._id) {
                    dispatch(setCurrentUser(user));
                  }
                  dispatch(addOnlineUserToActiveChats(user));
                  handleSearchClear();
                  !!handleDrawerToggle && handleDrawerToggle(false);
                }}
              />
            ))
          : searchResults
              .filter(({ _id }) => _id !== loggedUser?._id)
              .map((user) => (
                <User
                  online={isUserOnline(user, onlineUsers)}
                  key={user._id}
                  user={user}
                  onClickHandler={() => {
                    if (currentUser?._id !== user?._id) {
                      dispatch(setCurrentUser(user));
                    }
                    dispatch(addOnlineUserToActiveChats(user));
                    handleSearchClear();
                    !!handleDrawerToggle && handleDrawerToggle(false);
                  }}
                />
              ))}
      </div>
    </Fragment>
  );
};

export default SidePanel;
