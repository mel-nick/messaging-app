import React, { useState, useRef, useContext } from "react";
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

  const [text, setText] = useState(null);
  const handleInputChange = (e) => setText({ text: e.target.value });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text) {
      sendMessage({ ...text, from: loggedUser?._id, to: currentUser?._id });
      socket.emit("sendMessage", {
        ...text,
        from: loggedUser?._id,
        to: currentUser?._id,
      });
    }

    socket.emit("typingMessageEnd", {
      from: loggedUser?._id,
      to: currentUser?._id,
    });

    textInput.current.value = null;
    setText(null);
  };

  const handleKeyPress = () => {
    if (!!textInput.current.value) {
      socket.emit("typingMessageStart", {
        from: loggedUser?._id,
        to: currentUser?._id,
      });
    }
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
          inputref={textInput}
          variant="contained"
          color="primary"
          className={classes.button}
          endIcon={<SendIcon>send</SendIcon>}
          onClick={handleSendMessage}
          disabled={!textInput?.current?.value}
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
