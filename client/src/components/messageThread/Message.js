/* eslint-disable no-dupe-keys */
import React from 'react';

const Message = ({ sender, loggedUser, text }) => {
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
    <div>
      <p className='messageItem' style={p}>
        {text}
      </p>
    </div>
  );
};

export default Message;
