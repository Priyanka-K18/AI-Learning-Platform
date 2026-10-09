import mongoose from 'mongoose';

const aiToolSchema = new mongoose.Schema(
  {
    name: {
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
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: '',
    },
    pricing: {
      type: String,
      enum: ['Free', 'Freemium', 'Paid', 'Open Source', 'Contact', 'Verify on official website'],
      default: 'Freemium',
    },
    features: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    useCases: [
      {
        type: String,
      },
    ],
    platforms: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    isOpenSource: {
      type: Boolean,
      default: false,
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels',
    },
    status: {
      type: String,
      enum: ['Active', 'Beta', 'Discontinued', 'Unavailable'],
      default: 'Active',
    },
    tutorialUrl: {
      type: String,
      default: '',
    },
    lastVerified: {
      type: String,
      default: '2025-10',
    },
  },
  { timestamps: true }
);

// Text index for full-text search
aiToolSchema.index({ name: 'text', description: 'text', tags: 'text', features: 'text' });

export default mongoose.model('AITool', aiToolSchema);
