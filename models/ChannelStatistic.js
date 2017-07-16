const mongoose = require('mongoose');

const model = mongoose.model('ChannelStatistic', {
  _id: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  viewCount: {
    type: Number,
    required: true,
  },
  commentCount: {
    type: Number,
    required: true,
  },
  subscriberCount: {
    type: Number,
    required: true,
  },
  videoCount: {
    type: Number,
    required: true,
  },
});

module.exports = model;