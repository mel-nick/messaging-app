const mongoose = require('mongoose');

// User Schema
const MessageSchema = new mongoose.Schema({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  messages: [
    {
      sender: {
        type: String,
      },
      text: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Message = (module.exports = mongoose.model('message', MessageSchema));
