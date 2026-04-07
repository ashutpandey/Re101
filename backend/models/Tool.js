import mongoose from 'mongoose';

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  free: {
    type: Boolean,
    default: true
  },
  platform: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Essential', 'Useful', 'Advanced', 'Setup', 'Reference', 'Beginner+', 'Intermediate+', 'Structured', 'All levels']
  },
  commonCommands: [{
    type: String
  }],
  automationScripts: {
    type: String,
    default: 'N/A'
  },
  category: {
    type: String,
    required: true,
    enum: ['static', 'dynamic', 'intel', 'detection', 'practice']
  },
  categoryLabel: {
    type: String,
    required: true
  },
  categoryColor: {
    type: String,
    required: true
  },
  categoryIcon: {
    type: String,
    required: true
  },
  categoryDesc: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Tool', toolSchema);
