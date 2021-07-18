import React, { useEffect } from 'react';
import { getMessages } from '../../actions/messaging';
import { connect } from 'react-redux';
import Message from './Message';

const Thread = ({
  loggedUser,
  currentUser,
  activeMessageWindow,
  getMessages,
  messages,
}) => {
  useEffect(() => {
    currentUser && getMessages(loggedUser?._id, currentUser?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, currentUser]);

  return activeMessageWindow
    ? messages.map(({ _id, sender, text }) => (
        <Message
          key={_id}
          sender={sender}
          text={text}
          loggedUser={loggedUser}
        />
      ))
    : 'You do not have any messages yet';
};
const mapStateToProps = ({ auth, messaging }) => ({
  loggedUser: auth?.user,
  currentUser: messaging?.currentUser,
  activeMessageWindow: messaging?.activeMessageWindow,
  messages: messaging?.activeMessageWindow?.messages,
});

export default connect(mapStateToProps, { getMessages })(Thread);
