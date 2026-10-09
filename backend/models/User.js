import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    savedTools: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AITool',
      },
    ],
    completedLessons: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'LearningResource',
        },
        moduleIndex: {
          type: Number,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
