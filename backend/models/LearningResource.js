import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: '30m',
  },
  summary: {
    type: String,
    default: '',
  },
  youtubeUrl: {
    type: String,
    default: '',
  },
  videoId: {
    type: String,
    default: '',
  },
  channelTitle: {
    type: String,
    default: 'AI Academy',
  },
  videoTitle: {
    type: String,
    default: '',
  },
  objectives: [
    {
      type: String,
    },
  ],
  notes: {
    type: String,
    default: '',
  },
  resources: [
    {
      title: String,
      url: String,
    },
  ],
});

const learningResourceSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    duration: {
      type: String,
      default: '2 hours',
    },
    overviewVideoId: {
      type: String,
      default: '',
    },
    instructor: {
      type: String,
      default: 'Nexus Faculty',
    },
    modules: [moduleSchema],
    icon: {
      type: String,
      default: 'BrainCircuit',
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    studentsCount: {
      type: Number,
      default: 1240,
    },
  },
  { timestamps: true }
);

export default mongoose.model('LearningResource', learningResourceSchema);
