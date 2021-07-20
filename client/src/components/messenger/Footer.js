import React, { useState, useRef, useEffect, useContext } from "react";
import { useStyles } from "./footerStyles";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import { sendMessage } from "../../actions/messaging";
import { SocketContext } from "../../context";

const Footer = ({ currentUser, loggedUser, sendMessage }) => {
  const { socket } = useContext(SocketContext);

  const classes = useStyles();

  let textInput = useRef(null);

  const [text, setText] = useState({ text: "" });
  const [timeOfLastKeyPress, setTimeOfLastKeyPress] = useState(0);
  const [typing, setTyping] = useState(false);

  const checkInterval = () => {
    if (Date.now() - timeOfLastKeyPress > 3000) {
      setTyping(false);
    }
  };

  useEffect(() => {
    socket && !typing && socket.emit("typingMessageEnd", currentUser?._id);
  }, [currentUser, typing, socket]);

  const handleInputChange = (e) => setText({ text: e.target.value });

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage({ ...text, from: loggedUser?._id, to: currentUser?._id });

    socket.emit("sendMessage", {
      ...text,
      from: loggedUser?._id,
      to: currentUser?._id,
    });
    textInput.current.value = "";
  };

  const timeOfFirstKeyPress = Date.now();
  const handleKeyPress = () => {
    const lastKeyPressTime = Date.now();
    if (lastKeyPressTime - timeOfFirstKeyPress < 3000) {
      setTyping(true);
      socket.emit("typingMessageStart", currentUser?._id);
      setTimeOfLastKeyPress(lastKeyPressTime);
    }
    setTimeout(checkInterval, 5000);
  };

  return (
    currentUser && (
      <footer className={[classes.footer]}>
        <form
          className={classes.inputRoot}
          noValidate
          autoComplete="off"
          onSubmit={handleSendMessage}
          onKeyUp={handleKeyPress}
        >
          <TextField
            id="outlined-basic"
            label="Write your message"
            variant="outlined"
            onChange={handleInputChange}
            fullWidth
            inputRef={textInput}
          />
        </form>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon>send</SendIcon>}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </footer>
    )
  );
};

const mapStateToProps = ({ messaging, auth }) => ({
  currentUser: messaging?.currentUser,
  loggedUser: auth?.user,
});

export default connect(mapStateToProps, { sendMessage })(Footer);
