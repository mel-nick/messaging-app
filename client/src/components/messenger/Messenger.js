import React, { useState, useEffect, useCallback } from "react";
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
import { io } from "socket.io-client";
import { setArrivalMessage } from "../../actions/messaging";

const Messenger = ({ window, loggedInUser, setArrivalMessage }) => {
  const classes = useStyles();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [socket, setSocket] = useState(null);

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
    setSocket(io());
  }, []);

  useEffect(() => {
    if (socket && loggedInUser) {
      socket.emit("setUserOnline", loggedInUser?._id);
      // socket?.on("getOnlineUsers", (users) => console.log("online users", users));
      socket.on("getMessage", (message) => {
        loggedInUser?._id === message?.to && setArrivalMessage(message);
      });
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
        <Thread />
      </main>
      <Footer socket={socket} />
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  loggedInUser: auth?.user,
});

export default connect(mapStateToProps, { setArrivalMessage })(Messenger);
