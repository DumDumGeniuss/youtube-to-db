const mongoose = require('mongoose');


const model = mongoose.model('CandidateChannel', {
  _id: {
    type: String,
    required: true,
  },
  addTime: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  defaultThumbnails: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPicture: {
    type: String,
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
  isVerified: {
    type: Boolean,
    required: true,
  }
});

module.exports = model;