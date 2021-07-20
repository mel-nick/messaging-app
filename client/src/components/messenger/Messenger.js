import React, { useState, useEffect, useCallback, useContext } from "react";
import { connect } from "react-redux";
// import Typography from '@material-ui/core/Typography';
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { useTheme } from "@material-ui/core/styles";
import axios from "axios";
import Bar from "./Bar";
import { useStyles } from "./messengerStyles";
import SidePanel from "./SidePanel";
import Footer from "./Footer";
import Thread from "../messageThread/Thread";
import { setArrivalMessage } from "../../actions/messaging";
import { getOnlineUsers } from "../../actions/users";
import { SocketContext } from "../../context";

const Messenger = ({
  window,
  loggedInUser,
  setArrivalMessage,
  getOnlineUsers,
}) => {
  const { socket } = useContext(SocketContext);

  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [typing, setTyping] = useState(false);

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
      socket.emit("setUserOnline", loggedInUser);
      socket.on("getOnlineUsers", (users) => getOnlineUsers(users));
      socket.on(
        "getMessage",
        (message) =>
          loggedInUser?._id === message?.to && setArrivalMessage(message)
      );
      socket.on(
        "isTyping",
        (to) => loggedInUser?._id === to && setTyping(true)
      );
      socket.on(
        "notTyping",
        (to) => loggedInUser?._id === to && setTyping(false)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser, socket]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Bar classes={classes} handleDrawerToggle={handleDrawerToggle} />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
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
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
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

const mapStateToProps = ({ auth }) => ({
  loggedInUser: auth?.user,
});

export default connect(mapStateToProps, { setArrivalMessage, getOnlineUsers })(
  Messenger
);
