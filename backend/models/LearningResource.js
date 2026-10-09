import mongoose from 'mongoose';

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
    modules: [
      {
        title: String,
        duration: String,
        summary: String,
      },
    ],
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
