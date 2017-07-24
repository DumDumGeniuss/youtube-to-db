const mongoose = require('mongoose');

const model = mongoose.model('Category', {
  _id: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
});

module.exports = model;