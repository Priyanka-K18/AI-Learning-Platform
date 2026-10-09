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
      enum: ['Free', 'Freemium', 'Paid', 'Open Source', 'Contact'],
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
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
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
  },
  { timestamps: true }
);

export default mongoose.model('AITool', aiToolSchema);
