import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AITool',
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, toolId: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);
