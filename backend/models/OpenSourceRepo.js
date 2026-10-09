import mongoose from 'mongoose';

const openSourceRepoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    repoOwner: {
      type: String,
      required: true,
      trim: true,
    },
    repoName: {
      type: String,
      required: true,
      trim: true,
    },
    githubUrl: {
      type: String,
      required: true,
      unique: true,
    },
    docsUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      default: '',
    },
    whyUseIt: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Frontend Design & UI/UX',
        'Animation & 3D',
        'Frontend Frameworks',
        'Backend Development',
        'Full-Stack Projects',
        'AI & Machine Learning',
        'Developer Tools & DevOps',
        'Mobile App Development',
      ],
    },
    techStack: [
      {
        type: String,
      },
    ],
    language: {
      type: String,
      default: 'TypeScript',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Intermediate',
    },
    isBeginnerFriendly: {
      type: Boolean,
      default: false,
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    license: {
      type: String,
      default: 'MIT',
    },
    lastUpdated: {
      type: String,
      default: 'Recently Updated',
    },
    installGuide: {
      type: String,
      default: '',
    },
    learningRoadmap: [
      {
        step: Number,
        title: String,
        description: String,
      },
    ],
    sourceCodeExploration: {
      entryPoint: { type: String, default: 'src/index.ts' },
      keyFolders: [
        {
          path: String,
          role: String,
        },
      ],
      architecturalNotes: { type: String, default: '' },
    },
    youtubeTutorial: {
      title: { type: String, default: '' },
      url: { type: String, default: '' },
      videoId: { type: String, default: '' },
      channel: { type: String, default: '' },
    },
    verified: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: 'Code',
    },
  },
  {
    timestamps: true,
  }
);

// Search index for fast text searches without treating programming language field as natural language stemming override
openSourceRepoSchema.index(
  {
    name: 'text',
    description: 'text',
    techStack: 'text',
    repoName: 'text',
    repoOwner: 'text',
  },
  {
    default_language: 'none',
    language_override: 'none',
  }
);

export default mongoose.model('OpenSourceRepo', openSourceRepoSchema);
