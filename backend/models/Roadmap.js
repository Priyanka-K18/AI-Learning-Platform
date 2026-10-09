import mongoose from 'mongoose';

const roadmapStepSchema = new mongoose.Schema({
  title: String,
  description: String,
  recommendedTools: [String],
  skillsAcquired: [String],
  duration: String,
});

const roadmapSchema = new mongoose.Schema(
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
    targetRole: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '8 weeks',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    steps: [roadmapStepSchema],
    totalEnrollments: {
      type: Number,
      default: 850,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Roadmap', roadmapSchema);
