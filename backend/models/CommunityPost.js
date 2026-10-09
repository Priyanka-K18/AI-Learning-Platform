import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
      default: 'Nexus Traveler',
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Discussion',
    },
    tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model('CommunityPost', communityPostSchema);
