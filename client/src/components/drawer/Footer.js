import React, { useState, useRef } from 'react';
import { useStyles } from './footerStyles';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { sendMessage } from '../../actions/messaging';

const Footer = ({ currentUser, loggedUser, sendMessage }) => {
  const classes = useStyles();

  let textInput = useRef(null);

  const [text, setText] = useState({
    text: '',
  });

  const handleInputChange = (e) => setText({ text: e.target.value });

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage({ ...text, from: loggedUser?._id, to: currentUser?._id });
    textInput.current.value = '';
  };

  return (
    currentUser && (
      <footer className={[classes.footer]}>
        <form
          className={classes.inputRoot}
          noValidate
          autoComplete='off'
          onSubmit={handleSendMessage}
        >
          <TextField
            id='outlined-basic'
            label='Write your message'
            variant='outlined'
            onChange={handleInputChange}
            fullWidth
            inputRef={textInput}
          />
        </form>
        <Button
          variant='contained'
          color='primary'
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
