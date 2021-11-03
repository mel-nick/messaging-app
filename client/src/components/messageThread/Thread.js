import React, { useEffect } from 'react';
import { getMessages, initConversation } from '../../actions/messaging';
import { useSelector, useDispatch } from 'react-redux';
import Message from './Message';

const Thread = ({ typing }) => {
  const loggedUser = useSelector(({ auth }) => auth?.user);
  const currentUser = useSelector(({ messaging }) => messaging?.currentUser);
  const activeConversation = useSelector(
    ({ messaging }) => messaging?.activeConversation
  );
  const messages = useSelector(
    ({ messaging }) => messaging?.activeConversation?.messages
  );

  const dispatch = useDispatch();

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  window.addEventListener('scroll', () => {});

  useEffect(() => {
    currentUser && dispatch(getMessages(loggedUser?._id, currentUser?._id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, currentUser]);

  useEffect(() => {
    !activeConversation &&
      dispatch(
        initConversation({
          from: loggedUser?._id,
          to: currentUser?._id,
        })
      );
    activeConversation && scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, currentUser, activeConversation]);

  return activeConversation && currentUser ? (
    <div>
      {messages.map(({ _id, sender, text }) => {
        return (
          <Message
            key={_id}
            sender={sender}
            text={text}
            loggedUser={loggedUser}
            currentUser={currentUser}
          />
        );
      })}
      {typing && <div>typing...</div>}
    </div>
  ) : (
    'You do not have any messages yet'
  );
};

export default Thread;
