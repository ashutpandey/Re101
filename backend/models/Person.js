const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  why: {
    type: String,
    required: true
  },
  blogs: [{
    type: String
  }],
  bestWork: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Person', personSchema);