import React from 'react';
import { connect } from 'react-redux';
import User from '../user/User';
import { setCurrentUser } from '../../actions/messaging';

const ActiveContacts = ({ activeUsers, setCurrentUser, currentUser }) => {
  return (
    activeUsers && (
      <div>
        {activeUsers.map((user) => (
          <User
            key={user._id}
            user={user}
            onClickHandler={() => {
              if (currentUser?._id !== user._id) {
                setCurrentUser(user);
              }
            }}
          />
        ))}
      </div>
    )
  );
};

const mapStateToProps = ({ messaging }) => ({
  activeUsers: messaging?.activeUsers,
  currentUser: messaging?.currentUser,
});

export default connect(mapStateToProps, { setCurrentUser })(ActiveContacts);
