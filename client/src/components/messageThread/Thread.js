import React, { useEffect } from "react";
import { getMessages, initConversation } from "../../actions/messaging";
import { connect } from "react-redux";
import Message from "./Message";

const Thread = ({
  loggedUser,
  currentUser,
  activeConversation,
  getMessages,
  messages,
  initConversation,
}) => {
  useEffect(() => {
    currentUser && getMessages(loggedUser?._id, currentUser?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, currentUser]);

  useEffect(() => {
    !activeConversation &&
      initConversation({
        from: loggedUser?._id,
        to: currentUser?._id,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, currentUser, activeConversation]);

  return activeConversation
    ? messages.map(({ _id, sender, text }) => (
        <Message
          key={_id}
          sender={sender}
          text={text}
          loggedUser={loggedUser}
          currentUser={currentUser}
        />
      ))
    : "You do not have any messages yet";
};
const mapStateToProps = ({ auth, messaging }) => ({
  loggedUser: auth?.user,
  currentUser: messaging?.currentUser,
  activeConversation: messaging?.activeConversation,
  messages: messaging?.activeConversation?.messages,
});

export default connect(mapStateToProps, { getMessages, initConversation })(
  Thread
);
