const mongoose = require('mongoose');

const model = mongoose.model('Channel', {
  etag: {
    type: String,
    required: true,
  },
  _id: {
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
  publishedAt: {
    type: Date,
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