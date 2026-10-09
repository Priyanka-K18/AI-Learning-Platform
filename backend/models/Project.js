import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    toolsUsed: [String],
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    image: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'AI Nexus Lab',
    },
    stars: {
      type: Number,
      default: 48,
    },
    liveDemo: {
      type: String,
      default: '#',
    },
    githubRepo: {
      type: String,
      default: '#',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
