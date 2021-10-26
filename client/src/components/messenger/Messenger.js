/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { connect } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import Bar from './Bar';
import { useStyles } from './messengerStyles';
import SidePanel from './SidePanel';
import Footer from './Footer';
import Thread from '../messageThread/Thread';
import {
  setArrivalMessage,
  getChats,
  setCurrentUser,
} from '../../actions/messaging';
import { getCrToken } from '../../actions/auth';
import { getOnlineUsers } from '../../actions/users';
import { SocketContext } from '../../context';

const Messenger = ({
  window,
  loggedInUser,
  setArrivalMessage,
  getOnlineUsers,
  getChats,
  currentUser,
  setCurrentUser,
  activeChats,
  getCrToken,
  crToken,
}) => {
  const { socket } = useContext(SocketContext);

  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [typing, setTyping] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const searchUsers = useCallback(async () => {
    const searchUsersUrl = `/api/search/users?q=${searchString}`;
    const result = await axios.get(searchUsersUrl);
    setData(result.data);
  }, [searchString]);

  useEffect(() => {
    searchString && searchUsers();
  }, [searchString, searchUsers]);

  useEffect(() => {
    if (socket && loggedInUser) {
      socket.connect();
      socket.emit('setUserOnline', loggedInUser);
      socket.on('getOnlineUsers', (users) => getOnlineUsers(users));
    }

    if (socket) {
      const onGetMessage = (message) => {
        setIncomingMessage(message);
      };
      socket.on('getMessage', onGetMessage);
      if (
        currentUser &&
        incomingMessage &&
        currentUser._id === incomingMessage?.from
      ) {
        setArrivalMessage(incomingMessage);
      }

      socket.once('isTyping', ({ from, to }) => {
        loggedInUser?._id === to && currentUser?._id === from
          ? setTyping(true)
          : setTyping(false);
      });

      socket.once(
        'notTyping',
        ({ from, to }) =>
          loggedInUser?._id === to &&
          currentUser?._id === from &&
          setTyping(false)
      );
    }
  }, [loggedInUser, currentUser, incomingMessage, socket]);

  useEffect(() => {
    loggedInUser && getChats(loggedInUser?._id);
  }, [loggedInUser]);

  useEffect(() => {
    if (!currentUser && activeChats.length) {
      setCurrentUser(activeChats[0]);
    }
  }, [currentUser, activeChats]);

  useEffect(() => {
    !crToken && loggedInUser && getCrToken();
  }, [crToken, loggedInUser]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Bar classes={classes} handleDrawerToggle={handleDrawerToggle} />
      <nav className={classes.drawer} aria-label='mailbox folders'>
        <Hidden smUp implementation='css'>
          <Drawer
            container={container}
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <SidePanel
              setSearchString={setSearchString}
              searchResults={data}
              setSearchData={setData}
              searchString={searchString}
              handleDrawerToggle={handleDrawerToggle}
            />
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation='css'>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open
          >
            <SidePanel
              setSearchString={setSearchString}
              searchResults={data}
              setSearchData={setData}
              searchString={searchString}
            />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Thread typing={typing} />
      </main>
      <Footer />
    </div>
  );
};

const mapStateToProps = ({ auth, messaging }) => ({
  loggedInUser: auth?.user,
  crToken: auth?._crToken,
  currentUser: messaging?.currentUser,
  activeChats: messaging?.activeChats,
});

export default connect(mapStateToProps, {
  setArrivalMessage,
  getOnlineUsers,
  getChats,
  setCurrentUser,
  getCrToken,
})(Messenger);
