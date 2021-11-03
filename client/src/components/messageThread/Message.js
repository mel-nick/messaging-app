import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { decrypter } from '../../utils/cryptoUtil';
import { useSelector } from 'react-redux';

const Message = ({ sender, loggedUser, text, currentUser }) => {
  const secret = useSelector(({ auth }) => auth?._crToken);

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    messageWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      flexDirection: sender !== loggedUser?._id ? 'row-reverse' : 'row',
    },
  }));
  const classes = useStyles();
  const p = {
    margin: '5px',
    maxWidth: '40%',
    width: 'fit-content',
    textAlign: sender === loggedUser?._id ? 'right' : 'left',
    padding: '10px',
    backgroundColor: sender === loggedUser?._id ? '#695093' : '#868787',
    color: 'white',
    borderRadius: '15px',
    marginLeft: sender === loggedUser?._id ? 'auto' : 'none',
    marginRight: sender !== loggedUser?._id ? 'auto' : 'none',
  };

  return (
    <div className={classes.messageWrapper}>
      <p className='messageItem' style={p}>
        {decrypter(text, secret)}
      </p>
      <Avatar
        className={classes.small}
        src={
          sender === loggedUser?._id ? loggedUser?.avatar : currentUser?.avatar
        }
      />
    </div>
  );
};

export default Message;
