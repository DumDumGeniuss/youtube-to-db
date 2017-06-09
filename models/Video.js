const mongoose = require('mongoose');

const model = mongoose.model('Video', {
  etag: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
  etag: {
    type: String,
    required: true,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  channelTitle: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  defaultThumbnails: {
    type: String,
    required: true,
  },
  mediumThumbnails: {
    type: String,
    required: true,
  },
  highThumbnails: {
    type: String,
    required: true,
  },
  standard: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  viewCount: {
    type: Number,
    required: true,
  },
  likeCount: {
    type: Number,
    required: true,
  },
  dislikeCount: {
    type: Number,
    required: true,
  },
  commentCount: {
    type: Number,
    required: true,
  },
  randomNumber: {
    type: Number,
    required: true,
  },
});

module.exports = model;