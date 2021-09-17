// /* eslint-disable react-hooks/exhaustive-deps */
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
import { setArrivalMessage, getChats } from '../../actions/messaging';
import { getOnlineUsers } from '../../actions/users';
import { SocketContext } from '../../context';

const Messenger = ({
  window,
  loggedInUser,
  setArrivalMessage,
  getOnlineUsers,
  getChats,
  currentUser,
}) => {
  const { socket } = useContext(SocketContext);

  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState('');
  const [typing, setTyping] = useState(false);
  const [isProperWindow, setIsProperWindow] = useState(false);
  const [message, setMessage] = useState('');

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
  }, [loggedInUser, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (text) => {
        if (currentUser && currentUser._id === text.from) {
          setIsProperWindow(true);
          setMessage(text);
        }
        setIsProperWindow(false);
      });
      socket.on('isTyping', ({ from, to }) => {
        if (loggedInUser?._id === to && currentUser?._id === from) {
          setTyping(true);
        } else setTyping(false);
      });
      socket.on(
        'notTyping',
        ({ from, to }) =>
          loggedInUser?._id === to &&
          currentUser?._id === from &&
          setTyping(false)
      );
    }
  }, [socket, currentUser, loggedInUser]);
  useEffect(() => {
    isProperWindow && setArrivalMessage(message);
  }, [isProperWindow]);

  useEffect(() => {
    loggedInUser && getChats(loggedInUser?._id);
  }, [loggedInUser]);

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
  currentUser: messaging?.currentUser,
});

export default connect(mapStateToProps, {
  setArrivalMessage,
  getOnlineUsers,
  getChats,
})(Messenger);
