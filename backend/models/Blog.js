import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  freq: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Blog', blogSchema);
