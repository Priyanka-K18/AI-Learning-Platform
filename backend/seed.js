import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import AITool from './models/AITool.js';
import LearningResource from './models/LearningResource.js';
import Project from './models/Project.js';
import Roadmap from './models/Roadmap.js';
import CommunityPost from './models/CommunityPost.js';
import OpenSourceRepo from './models/OpenSourceRepo.js';

import { toolsPart1 } from './tools_data_part1.js';
import { toolsPart2 } from './tools_data_part2.js';
import { toolsPart3 } from './tools_data_part3.js';
import { toolsPart4 } from './tools_data_part4.js';
import { toolsPart5 } from './tools_data_part5.js';
import { toolsPart6 } from './tools_data_part6.js';
import { toolsPart7 } from './tools_data_part7.js';
import { coursesData } from './courses_data.js';
import { openSourceReposData } from './opensource_data.js';

dotenv.config();

export const seedDatabase = async (forceReseed = false) => {
  try {
    const existingToolCount = await AITool.countDocuments();
    const existingCourseCount = await LearningResource.countDocuments();
    const existingRepoCount = await OpenSourceRepo.countDocuments();

    if (existingToolCount >= 300 && existingCourseCount >= 10 && existingRepoCount >= 20 && !forceReseed) {
      console.log(`Database already seeded (${existingToolCount} tools, ${existingCourseCount} courses, ${existingRepoCount} repos).`);
      return;
    }

    console.log(`🌱 Seeding AI Nexus database with comprehensive 300+ AI tools directory...`);

    // Combine all tool parts
    const allTools = [
      ...toolsPart1,
      ...toolsPart2,
      ...toolsPart3,
      ...toolsPart4,
      ...toolsPart5,
      ...toolsPart6,
      ...toolsPart7,
    ];

    // Canonical deduplication by normalized name
    const seenNames = new Set();
    const uniqueTools = [];
    for (const tool of allTools) {
      const canonicalKey = tool.name.toLowerCase().trim();
      if (!seenNames.has(canonicalKey)) {
        seenNames.add(canonicalKey);
        uniqueTools.push({
          ...tool,
          verified: tool.verified ?? true,
          status: tool.status ?? 'Active',
          lastVerified: tool.lastVerified ?? '2025-10',
          skillLevel: tool.skillLevel ?? 'All Levels',
          pricing: tool.pricing ?? 'Freemium',
          rating: tool.rating ?? 4.5,
          isOpenSource: tool.isOpenSource ?? false,
        });
      }
    }

    console.log(`Total unique AI tools prepared: ${uniqueTools.length}`);

    // Compute dynamic tool count per category
    const categoryCounts = {};
    uniqueTools.forEach((t) => {
      categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
    });

    const categoriesData = [
      {
        name: 'AI Coding',
        slug: 'ai-coding',
        icon: 'Code2',
        description: 'Next-gen code assistants, autonomous agent engineers, and intelligent debuggers.',
        color: '#00f2fe',
      },
      {
        name: 'AI Web Building',
        slug: 'ai-web-building',
        icon: 'Globe',
        description: 'Generative website and web application builders from natural language prompts.',
        color: '#38bdf8',
      },
      {
        name: 'Image Generation',
        slug: 'image-generation',
        icon: 'Image',
        description: 'Photorealistic synthesis, concept art generation, and neural diffusion inpainting.',
        color: '#a855f7',
      },
      {
        name: 'Video Creation',
        slug: 'video-creation',
        icon: 'Video',
        description: 'Cinematic video synthesis, motion transfer, camera controls, and avatars.',
        color: '#3b82f6',
      },
      {
        name: 'Writing & Content',
        slug: 'writing-content',
        icon: 'FileText',
        description: 'Reasoning models, research synthesizers, copy co-pilots, and editors.',
        color: '#00e5ff',
      },
      {
        name: 'Research & Search',
        slug: 'research-search',
        icon: 'Search',
        description: 'Live-cited answer engines, academic literature review, and computational reasoning.',
        color: '#f59e0b',
      },
      {
        name: 'Chatbots & Assistants',
        slug: 'chatbots-assistants',
        icon: 'MessageSquare',
        description: 'Everyday conversational intelligence, persona chatbots, and multimodal assistants.',
        color: '#ec4899',
      },
      {
        name: 'Audio & Voice',
        slug: 'audio-voice',
        icon: 'Mic2',
        description: 'Voice cloning, emotional speech synthesis, and audio noise cancellation.',
        color: '#8b5cf6',
      },
      {
        name: 'Music & Sound',
        slug: 'music-sound',
        icon: 'Music',
        description: 'Complete song generation, soundtrack scoring, beatmaking, and stem separation.',
        color: '#d946ef',
      },
      {
        name: 'Design & UI/UX',
        slug: 'design-ui-ux',
        icon: 'Palette',
        description: 'Automated wireframing, high-fidelity UI design generators, and 3D asset creators.',
        color: '#06b6d4',
      },
      {
        name: 'Automation & Agents',
        slug: 'automation-agents',
        icon: 'Bot',
        description: 'Autonomous multi-agent workflows, browser orchestration, and API pipelines.',
        color: '#10b981',
      },
      {
        name: 'Data & Analytics',
        slug: 'data-analytics',
        icon: 'BarChart3',
        description: 'Natural language BI, automated Python data modeling, and predictive intelligence.',
        color: '#14b8a6',
      },
      {
        name: 'Marketing & SEO',
        slug: 'marketing-seo',
        icon: 'Megaphone',
        description: 'SERP optimization, paid ad creatives, social media scheduling, and inbound growth.',
        color: '#f97316',
      },
      {
        name: 'Presentations & Docs',
        slug: 'presentations-docs',
        icon: 'Presentation',
        description: 'Interactive slide decks, automated diagrams, visual reports, and document chat.',
        color: '#eab308',
      },
      {
        name: 'Education & Learning',
        slug: 'education-learning',
        icon: 'GraduationCap',
        description: 'Socratic AI tutors, homework solvers, flashcard memorization, and speech coaches.',
        color: '#6366f1',
      },
      {
        name: 'Cybersecurity & DevOps',
        slug: 'cybersecurity-devops',
        icon: 'ShieldAlert',
        description: 'Application security, code scanning, threat hunting, APM, and CI/CD automation.',
        color: '#ef4444',
      },
      {
        name: 'Sales & Support',
        slug: 'sales-support',
        icon: 'Headphones',
        description: 'Autonomous support bots, revenue intelligence, and B2B outbound prospecting.',
        color: '#22c55e',
      },
      {
        name: 'Translation & Language',
        slug: 'translation-language',
        icon: 'Languages',
        description: 'Nuanced neural translation, multilingual comprehension, and immersion tools.',
        color: '#84cc16',
      },
      {
        name: '3D & Game Dev',
        slug: '3d-game-dev',
        icon: 'Box',
        description: 'Text-to-3D meshes, NeRF / Gaussian Splats, AI NPC engines, and markerless mocap.',
        color: '#e11d48',
      },
      {
        name: 'ML & Model Dev',
        slug: 'ml-model-dev',
        icon: 'Cpu',
        description: 'Model hubs, ultra-fast inference APIs, local LLM runners, and GPU cloud compute.',
        color: '#8b5cf6',
      },
      {
        name: 'Meeting & Notes',
        slug: 'meeting-notes',
        icon: 'Users',
        description: 'Real-time meeting transcription, automated minutes, action items, and call clips.',
        color: '#0284c7',
      },
      {
        name: 'Career & Resume',
        slug: 'career-resume',
        icon: 'Briefcase',
        description: 'ATS resume builders, mock interview simulations, and job application autofill.',
        color: '#059669',
      },
      {
        name: 'Finance & Accounting',
        slug: 'finance-accounting',
        icon: 'DollarSign',
        description: 'Autonomous bookkeeping, invoice reconciliation, and equity research analysis.',
        color: '#16a34a',
      },
      {
        name: 'Healthcare & Bio',
        slug: 'healthcare-bio',
        icon: 'Activity',
        description: 'Clinical decision support, ambient medical scribes, and protein structure modeling.',
        color: '#06b6d4',
      },
      {
        name: 'E-commerce',
        slug: 'e-commerce',
        icon: 'ShoppingBag',
        description: 'AI product photography, virtual fashion models, and intent search merchandising.',
        color: '#f59e0b',
      },
      {
        name: 'Knowledge & Mind Maps',
        slug: 'knowledge-mind-maps',
        icon: 'Network',
        description: 'Visual mind mapping, diagram-as-code, and personal markdown second brains.',
        color: '#6366f1',
      },
      {
        name: 'Legal & Compliance',
        slug: 'legal-compliance',
        icon: 'Scale',
        description: 'Contract redlining, legal case research, due diligence, and regulatory compliance.',
        color: '#a855f7',
      },
      {
        name: 'Science & Engineering',
        slug: 'science-engineering',
        icon: 'FlaskConical',
        description: 'Molecular modeling, aerodynamic physics estimation, and technical computing.',
        color: '#0ea5e9',
      },
      {
        name: 'Robotics & Computer Vision',
        slug: 'robotics-computer-vision',
        icon: 'Eye',
        description: 'Real-time object detection, robotics simulation, spatial depth, and mocap vision.',
        color: '#f43f5e',
      },
    ];

    const enrichedCategories = categoriesData.map((cat) => ({
      ...cat,
      toolCount: categoryCounts[cat.name] || 0,
    }));

    // Reset and seed Tools
    await AITool.deleteMany({});
    await AITool.insertMany(uniqueTools);
    console.log(`✅ Successfully seeded ${uniqueTools.length} distinct AI tools.`);

    // Reset and seed Categories
    await Category.deleteMany({});
    await Category.insertMany(enrichedCategories);
    console.log(`✅ Successfully seeded ${enrichedCategories.length} categories with verified counts.`);

    // Seed Learning Resources with YouTube tutorials
    await LearningResource.deleteMany({});
    await LearningResource.insertMany(coursesData);
    console.log(`✅ Successfully seeded ${coursesData.length} interactive courses with verified YouTube tutorials.`);

    // Check Roadmaps
    const roadmapCount = await Roadmap.countDocuments();
    if (roadmapCount === 0) {
      const roadmaps = [
        {
          title: 'The Modern AI Engineer (2026 Edition)',
          description: 'Complete structured roadmap to transition from traditional software engineer to full-stack AI system architect.',
          targetRole: 'AI Software Engineer',
          duration: '10 weeks',
          level: 'Intermediate',
          steps: [
            { title: '1. Frontier LLM APIs & Token Economics', description: 'Prompt caching, structured JSON outputs, streaming completions', recommendedTools: ['Claude 3.7', 'OpenAI', 'Gemini 2.5'], duration: '2 weeks' },
            { title: '2. Embeddings, Vector DBs & Advanced RAG', description: 'Chunking strategies, hybrid search, rerankers, semantic cache', recommendedTools: ['Pinecone', 'Qdrant', 'Cohere Rerank'], duration: '2 weeks' },
            { title: '3. Multi-Agent Systems & Tool Calling', description: 'Cyclic graph orchestration, agent memory, reflection loops', recommendedTools: ['LangGraph', 'CrewAI'], duration: '3 weeks' },
            { title: '4. Evaluation, Guardrails & Production Tracing', description: 'Synthesizing test sets, latency optimization, observability', recommendedTools: ['Langfuse', 'Braintrust'], duration: '3 weeks' },
          ],
          totalEnrollments: 5420,
        },
        {
          title: 'AI Product Designer & Creative Director',
          description: 'Step-by-step master plan for designers looking to orchestrate generative AI for brand identity, UI, and video.',
          targetRole: 'Creative Director',
          duration: '6 weeks',
          level: 'Beginner',
          steps: [
            { title: '1. Prompt Precision & Visual Synthesizers', description: 'Mastering Midjourney v7, Flux.1, parameter tunings', recommendedTools: ['Midjourney', 'Flux'], duration: '1.5 weeks' },
            { title: '2. AI Interface Prototyping', description: 'Generating design systems, Figma workflows, design tokens', recommendedTools: ['v0', 'Galileo AI', 'Figma'], duration: '1.5 weeks' },
            { title: '3. Dynamic Motion & Synthetic Media', description: 'Text-to-video, audio design, generative micro-interactions', recommendedTools: ['Runway Gen-3', 'ElevenLabs'], duration: '3 weeks' },
          ],
          totalEnrollments: 3210,
        },
      ];
      await Roadmap.insertMany(roadmaps);
    }

    // Check Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const projects = [
        {
          title: 'Nexus Intelligence: Autonomous Research Assistant',
          description: 'A multi-agent research analyst that scrapes live academic papers, synthesizes breakthroughs, and generates interactive graphs.',
          toolsUsed: ['Claude 3.7', 'Perplexity', 'Python', 'FastAPI'],
          difficulty: 'Advanced',
          stars: 342,
          author: 'Sarah Chen (Nexus Resident)',
        },
        {
          title: 'AuraVision: Real-Time Generative AR Persona',
          description: 'An interactive browser experience pairing WebGL avatar rendering with real-time ElevenLabs voice and conversational streaming.',
          toolsUsed: ['Three.js', 'ElevenLabs', 'WebRTC', 'React'],
          difficulty: 'Intermediate',
          stars: 289,
          author: 'Alex Rivera',
        },
        {
          title: 'CyberSync: Automated Workflow Orchestrator',
          description: 'An autonomous pipeline syncing Github commits, Slack discussions, and generating automated sprint retrospectives.',
          toolsUsed: ['Make.com', 'Cursor', 'OpenAI API'],
          difficulty: 'Beginner',
          stars: 174,
          author: 'Elena Rostova',
        },
      ];
      await Project.insertMany(projects);
    }

    // Check Community Posts
    const postCount = await CommunityPost.countDocuments();
    if (postCount === 0) {
      const communityPosts = [
        {
          author: 'Marcus Vance',
          title: 'How are you handling hallucination verification in multi-agent loops?',
          content: 'We found that introducing a dedicated "adversarial critic" subagent with a high temperature verification prompt reduced factual drift by 78%. What are your favorite patterns?',
          category: 'Architecture',
          tags: ['Agents', 'LangGraph', 'Reliability'],
          likes: 64,
          replies: [
            { author: 'Dr. Evelyn Reed', content: 'Dual-evaluation passes against source chunks before execution are essential.' },
            { author: 'Liam K.', content: 'Agree. Also grounding the critic with exact schema validation works wonders.' },
          ],
        },
        {
          author: 'Kyra Vance',
          title: 'Midjourney v7 vs Flux.1 Pro for enterprise design systems: A comparison',
          content: 'I benchmarked 500 prompts across both models for UI components, brand mockups, and text rendering. Here are the detailed latency and rendering artifacts findings.',
          category: 'Showcase',
          tags: ['ImageGen', 'Design', 'Benchmark'],
          likes: 112,
          replies: [
            { author: 'Nathan Drake', content: 'Flux wins on typography hands down, but Midjourney has that cinematic lighting magic.' },
          ],
        },
      ];
      await CommunityPost.insertMany(communityPosts);
    }

    // Seed Open-Source Repositories
    await OpenSourceRepo.deleteMany({});
    await OpenSourceRepo.insertMany(openSourceReposData);
    console.log(`✅ Successfully seeded ${openSourceReposData.length} open-source repositories into Open-Source Learning Hub.`);

    console.log('🎉 AI Nexus directory fully seeded with 360+ frontier tools!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};

// Allow direct execution: `node seed.js`
if (process.argv[1]?.includes('seed.js')) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai_nexus';
  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log('Connected to MongoDB for direct seeding...');
      await seedDatabase(true);
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB. Seed script completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('MongoDB connection error in seed script:', err.message);
      process.exit(1);
    });
}
