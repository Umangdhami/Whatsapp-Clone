const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    _id: String,
    sender_id: {
      type: String,
      require: true,
    },
    reciver_id: {
      type: String,
      require: true,
    },
    is_send: {
      type: Number,
      require: true,
      default: 0,
    },
    is_recived: {
      type: Number,
      require: true,
      default: 0,
    },
    is_read: {
      type: Number,
      require: true,
      default: 0,
    },
    sent_time: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
    reciver_username: {
      type: String,
      require: true,
    },
    sender_username: {
      type: String,
      require: true,
    },
    delete_me: {
      type: Number,
      require: true,
      default: 0,
    },
    edited: {
      type: Number,
      require: true,
      default: 0,
    },
    delete_everyone: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
