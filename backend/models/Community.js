const mongoose = require('mongoose');

const redditSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  },
  members: {
    type: String,
    required: true
  }
});

const discordSchema = new mongoose.Schema({
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
  }
});

const communitySchema = new mongoose.Schema({
  reddits: [redditSchema],
  discords: [discordSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Community', communitySchema);