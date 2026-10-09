import Category from './models/Category.js';
import AITool from './models/AITool.js';
import LearningResource from './models/LearningResource.js';
import Project from './models/Project.js';
import Roadmap from './models/Roadmap.js';
import CommunityPost from './models/CommunityPost.js';

export const seedDatabase = async () => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0) {
      console.log('Database already seeded with categories.');
      return;
    }

    console.log('🌱 Seeding AI Nexus database with futuristic data...');

    const categories = [
      {
        name: 'AI Coding',
        slug: 'ai-coding',
        icon: 'Code2',
        description: 'Next-gen code assistants, autonomous agent engineers, and intelligent debuggers.',
        color: '#00f2fe',
        toolCount: 14,
      },
      {
        name: 'Image Generation',
        slug: 'image-generation',
        icon: 'Image',
        description: 'Photorealistic synthesis, concept art generation, and neural inpainting engines.',
        color: '#a855f7',
        toolCount: 18,
      },
      {
        name: 'Video Creation',
        slug: 'video-creation',
        icon: 'Video',
        description: 'Cinematic video synthesis, motion transfer, and dynamic camera control models.',
        color: '#3b82f6',
        toolCount: 12,
      },
      {
        name: 'Design & UI/UX',
        slug: 'design-ui-ux',
        icon: 'Palette',
        description: 'Automated wireframing, high-fidelity UI design generators, and 3D asset creators.',
        color: '#06b6d4',
        toolCount: 15,
      },
      {
        name: 'Audio & Voice',
        slug: 'audio-voice',
        icon: 'Mic2',
        description: 'Voice cloning, emotional speech synthesis, and AI musical orchestration.',
        color: '#8b5cf6',
        toolCount: 10,
      },
      {
        name: 'Writing & Content',
        slug: 'writing-content',
        icon: 'FileText',
        description: 'Reasoning models, research synthesizers, and creative narrative co-pilots.',
        color: '#00e5ff',
        toolCount: 16,
      },
      {
        name: 'Productivity',
        slug: 'productivity',
        icon: 'Zap',
        description: 'Context-aware workspace copilots, meeting intelligence, and memory augmentation.',
        color: '#6366f1',
        toolCount: 20,
      },
      {
        name: 'Automation',
        slug: 'automation',
        icon: 'Bot',
        description: 'Autonomous multi-agent workflows, browser orchestration, and API pipelines.',
        color: '#10b981',
        toolCount: 11,
      },
    ];

    await Category.insertMany(categories);

    const tools = [
      {
        name: 'Cursor',
        description: 'The AI-first Code Editor built for pair-programming with frontiers models. Deep codebase indexing and terminal intelligence.',
        category: 'AI Coding',
        website: 'https://cursor.com',
        pricing: 'Freemium',
        features: ['Full-codebase indexing', 'Tab autocomplete', 'Multi-file edits', 'Agent mode'],
        tags: ['coding', 'ide', 'claude', 'productivity'],
        rating: 4.9,
        isFeatured: true,
      },
      {
        name: 'v0 by Vercel',
        description: 'Generative UI development platform that turns natural language and screenshots into full React & Tailwind code.',
        category: 'AI Coding',
        website: 'https://v0.dev',
        pricing: 'Freemium',
        features: ['React generation', 'Figma to code', 'Live sandbox', 'Component export'],
        tags: ['frontend', 'react', 'design', 'ui'],
        rating: 4.8,
        isFeatured: true,
      },
      {
        name: 'Claude 3.7 Sonnet',
        description: 'Hybrid reasoning and coding model by Anthropic capable of real-time thought transparency and full-stack software development.',
        category: 'AI Coding',
        website: 'https://claude.ai',
        pricing: 'Freemium',
        features: ['Extended thinking', 'Artifacts', '200k context', 'Vision & code reasoning'],
        tags: ['reasoning', 'coding', 'llm', 'research'],
        rating: 5.0,
        isFeatured: true,
      },
      {
        name: 'Midjourney v7',
        description: 'State of the art photorealistic image generation model with unparalleled prompt fidelity and lighting coherence.',
        category: 'Image Generation',
        website: 'https://midjourney.com',
        pricing: 'Paid',
        features: ['Photorealism', 'Style reference', 'Character consistency', 'Inpainting/Outpainting'],
        tags: ['art', 'photorealism', 'creative', 'prompting'],
        rating: 4.9,
        isFeatured: true,
      },
      {
        name: 'Flux.1 Pro',
        description: 'Open-weights and API visual synthesis powerhouse delivering crisp typography, human anatomy, and precise compositions.',
        category: 'Image Generation',
        website: 'https://blackforestlabs.ai',
        pricing: 'Freemium',
        features: ['Crisp text rendering', 'Complex spatial prompt following', 'Ultra-high detail'],
        tags: ['open-source', 'diffusion', 'graphics'],
        rating: 4.9,
        isFeatured: true,
      },
      {
        name: 'Runway Gen-3 Alpha',
        description: 'Pioneering multimodal video generation model producing high-fidelity cinematic video clips with precise camera control.',
        category: 'Video Creation',
        website: 'https://runwayml.com',
        pricing: 'Paid',
        features: ['Text-to-video', 'Image-to-video', 'Camera motion control', 'Lip sync'],
        tags: ['video', 'vfx', 'cinema', 'animation'],
        rating: 4.8,
        isFeatured: true,
      },
      {
        name: 'Luma Dream Machine',
        description: 'High-speed generative video system that creates smooth, photorealistic, physics-grounded scenes from prompts.',
        category: 'Video Creation',
        website: 'https://lumalabs.ai',
        pricing: 'Freemium',
        features: ['Physical simulation', 'Instant camera pans', 'Realistic lighting'],
        tags: ['video', '3d', 'creative'],
        rating: 4.7,
        isFeatured: false,
      },
      {
        name: 'ElevenLabs Voice Engine',
        description: 'Industry-leading natural voice synthesis, instant voice cloning, and emotional speech articulation in 32+ languages.',
        category: 'Audio & Voice',
        website: 'https://elevenlabs.io',
        pricing: 'Freemium',
        features: ['Realistic voice cloning', 'Dubbing', 'Sound effects generation', 'Conversational AI'],
        tags: ['tts', 'voice', 'audio', 'sound'],
        rating: 4.9,
        isFeatured: true,
      },
      {
        name: 'Suno AI',
        description: 'Create complete radio-ready songs with vocals, lyrics, instrumentation, and harmonic arrangements in any genre.',
        category: 'Audio & Voice',
        website: 'https://suno.ai',
        pricing: 'Freemium',
        features: ['Full song generation', 'Custom lyrics', 'Stem separation', 'Genre fusion'],
        tags: ['music', 'songwriting', 'audio'],
        rating: 4.8,
        isFeatured: false,
      },
      {
        name: 'Perplexity AI',
        description: 'Conversational search engine that indexes the live web in real time, delivering cited answers with deep synthesis.',
        category: 'Writing & Content',
        website: 'https://perplexity.ai',
        pricing: 'Freemium',
        features: ['Real-time citation', 'Pro search mode', 'Collections', 'Multi-model switching'],
        tags: ['search', 'research', 'citations', 'knowledge'],
        rating: 4.9,
        isFeatured: true,
      },
      {
        name: 'Make.com AI Automation',
        description: 'Visual integration platform connecting thousands of apps with autonomous AI agents and conditional pipelines.',
        category: 'Automation',
        website: 'https://make.com',
        pricing: 'Freemium',
        features: ['Visual flowchart builder', 'AI webhooks', 'Multi-step logic', 'Data routers'],
        tags: ['automation', 'workflow', 'no-code', 'agents'],
        rating: 4.8,
        isFeatured: true,
      },
      {
        name: 'Galileo AI',
        description: 'Generative UI interface engine for mobile and web apps that produces editable Figma files from prompt descriptions.',
        category: 'Design & UI/UX',
        website: 'https://usegalileo.ai',
        pricing: 'Freemium',
        features: ['Figma export', 'Design systems', 'Mobile & desktop layout generation'],
        tags: ['ui', 'ux', 'figma', 'design'],
        rating: 4.7,
        isFeatured: false,
      },
      {
        name: 'Notion AI Workspace',
        description: 'Intelligent connected workspace uniting docs, wikis, and task databases with proactive AI retrieval and drafting.',
        category: 'Productivity',
        website: 'https://notion.so',
        pricing: 'Freemium',
        features: ['Q&A across workspace', 'Automatic summaries', 'Action item extraction'],
        tags: ['notes', 'productivity', 'organization'],
        rating: 4.8,
        isFeatured: true,
      },
    ];

    await AITool.insertMany(tools);

    const learningTracks = [
      {
        title: 'Zero to Autonomous AI Agent Architect',
        description: 'Master LangGraph, CrewAI, AutoGen, and tool calling to build reliable multi-agent systems that solve complex workflows.',
        category: 'AI Coding',
        level: 'Intermediate',
        duration: '6 hours',
        modules: [
          { title: 'Foundations of Agentic Loops & ReAct', duration: '45m', summary: 'Understanding reason-and-act patterns' },
          { title: 'Tool Calling & Function Orchestration', duration: '1h 15m', summary: 'Connecting LLMs to external APIs and databases' },
          { title: 'State Graphs & Memory Persistence', duration: '2h', summary: 'Architecting cyclic multi-agent state machines' },
          { title: 'Human-in-the-Loop Safeguards & Deployment', duration: '2h', summary: 'Deploying robust production agents' },
        ],
        icon: 'Cpu',
        rating: 4.95,
        studentsCount: 3840,
      },
      {
        title: 'Mastering Cinematic AI Filmmaking',
        description: 'From Midjourney storyboard prompts to Runway Gen-3 motion control, camera choreography, and ElevenLabs dynamic voice acting.',
        category: 'Video Creation',
        level: 'Beginner',
        duration: '4 hours',
        modules: [
          { title: 'Visual Consistency & Seed Control', duration: '1h', summary: 'Keeping characters and scenes consistent across shots' },
          { title: 'Camera Motion Directing in Gen-3', duration: '1h', summary: 'Executing dollies, tilts, zooms, and motion brushes' },
          { title: 'Audio Soundscape & Voice Acting', duration: '1h', summary: 'Generating foley sound effects and cloned dialog' },
          { title: 'Final Assembly & Post-Coloring', duration: '1h', summary: 'Upscaling to 4K and mastering output' },
        ],
        icon: 'Film',
        rating: 4.88,
        studentsCount: 2950,
      },
      {
        title: 'Full-Stack Generative UI with React & v0',
        description: 'Harness AI to design, prototype, and build responsive production apps in record time without writing repetitive boilerplate.',
        category: 'Design & UI/UX',
        level: 'Intermediate',
        duration: '3.5 hours',
        modules: [
          { title: 'Prompting for Modern UI Systems', duration: '45m', summary: 'Writing effective component specifications' },
          { title: 'Integrating v0 Outputs into Next.js & Vite', duration: '1h', summary: 'Refining generated JSX with custom hooks' },
          { title: 'Micro-Animations with GSAP & Tailwind', duration: '1h', summary: 'Injecting physics and cinematic polish' },
          { title: 'Production State & API Wiring', duration: '45m', summary: 'Connecting to REST/GraphQL backends' },
        ],
        icon: 'Layers',
        rating: 4.92,
        studentsCount: 4210,
      },
    ];

    await LearningResource.insertMany(learningTracks);

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

    console.log('✅ AI Nexus seed data successfully loaded!');
  } catch (error) {
    console.error('Error seeding database:', error.message);
  }
};
