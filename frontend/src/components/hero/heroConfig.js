/**
 * Hero Section Configuration Tunables
 * All key parameters for tweaking scroll duration, smoothing, memory, and framing.
 */
export const HERO_CONFIG = {
  FRAME_COUNT: 300,            // Total sequence frames (1 to 300)
  SCROLL_LENGTH_VH: 500,       // Total outer scroll track height in vh (desktop)
  WINDOW_RADIUS: 45,           // Decoded ImageBitmap sliding window (+/- 45 frames)
  LERP: 0.08,                  // Lenis smooth scroll lerp (0.08 - 0.10)
  DAMPING: 0.15,               // Frame scrub damping: current += (target - current) * 0.15
  MOBILE_STEP: 2,              // Downsample to every 2nd frame on mobile/low-memory (150 total)
  FOCAL_X: 0.75,               // Focal subject position on the right (75% x)
  BG_COLOR: '#020911',         // Canvas clear color & hero background (matches frame edges)
  ASSET_PATH: '/hero-sequence',// Directory where frame_001.webp / frame_001.jpg live
  FRAME_WIDTH: 1280,           // Native frame width
  FRAME_HEIGHT: 720,           // Native frame height
  INITIAL_READY_THRESHOLD: 30, // Minimum frames preloaded before fading out progress bar
};

export const BEAT_CAPTIONS = [
  {
    start: 150,
    end: 180,
    tag: 'PHASE 01 // INPUT',
    title: 'Describe it.',
    subtitle: 'From natural thought to neural synthesis in real-time.',
  },
  {
    start: 181,
    end: 225,
    tag: 'PHASE 02 // COGNITION',
    title: 'Learn the tools.',
    subtitle: 'Orchestrating autonomous agents and foundation models.',
  },
  {
    start: 250,
    end: 300,
    tag: 'PHASE 03 // EXECUTION',
    title: 'Build anything.',
    subtitle: 'Production-ready apps, pipelines, and intelligent workflows.',
  },
];
