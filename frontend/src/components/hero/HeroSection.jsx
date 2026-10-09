import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { HERO_CONFIG as CONFIG, BEAT_CAPTIONS } from './heroConfig';

export default function HeroSection() {
  const navigate = useNavigate();

  // DOM Refs
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const canvasRef = useRef(null);
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  // Performance & Measurement Refs (no layout reads inside scroll handlers)
  const cachedOffsetTopRef = useRef(0);
  const cachedScrollableRef = useRef(1);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const lastRenderedFrameRef = useRef(-1);

  // Reduced motion state
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Layout & Dimension State
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 720,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  });

  // UI Interactive States (updated only on key milestones, not every frame)
  const [uiState, setUiState] = useState({
    frameIndex: 0,
    buttonsOpacity: 1, // 1 during frames 0-105 & 250-299; 0 in middle
    activeCaption: null,
    captionOpacity: 0,
  });

  // Preloading & Memory States
  const [initialReady, setInitialReady] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // In-memory compressed blobs (Array of Blobs) & Decoded Sliding Window Map (Map<number, ImageBitmap>)
  const blobsRef = useRef(new Array(CONFIG.FRAME_COUNT).fill(null));
  const bitmapCacheRef = useRef(new Map());
  const pendingFetchesRef = useRef(new Set());
  const currentFrameRef = useRef(0);
  const activeStepRef = useRef(1);

  /* -------------------------------------------------------------------------
     HELPER: Format zero-padded frame filename (1-indexed)
     ------------------------------------------------------------------------- */
  const getFrameUrl = useCallback((index, useJpg = false) => {
    const padded = String(index + 1).padStart(3, '0');
    return `${CONFIG.ASSET_PATH}/frame_${padded}.${useJpg ? 'jpg' : 'webp'}`;
  }, []);

  /* -------------------------------------------------------------------------
     CANVAS DRAW FUNCTION (Cover Fit, Focal Point, DPR Aware)
     ------------------------------------------------------------------------- */
  const drawCurrentFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Retrieve bitmap; if missing, locate nearest loaded neighbor or frame 0
    let bitmap = bitmapCacheRef.current.get(frameIdx);
    if (!bitmap) {
      let closestIdx = 0;
      let minDiff = Infinity;
      for (const idx of bitmapCacheRef.current.keys()) {
        const diff = Math.abs(idx - frameIdx);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      }
      bitmap = bitmapCacheRef.current.get(closestIdx);
    }

    if (!bitmap) return; // Still waiting for initial paint

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Ensure backing store matches CSS dimensions * DPR
    const targetW = Math.round(width * dpr);
    const targetH = Math.round(height * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Clear with #020911
    ctx.fillStyle = CONFIG.BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const isMobileView = width < 768;

    if (isMobileView) {
      // Contain fit in the 16:9 box pinned at top
      const scale = Math.min(width / CONFIG.FRAME_WIDTH, height / CONFIG.FRAME_HEIGHT);
      const renderW = CONFIG.FRAME_WIDTH * scale;
      const renderH = CONFIG.FRAME_HEIGHT * scale;
      const dx = (width - renderW) / 2;
      const dy = (height - renderH) / 2;
      ctx.drawImage(bitmap, dx, dy, renderW, renderH);
    } else {
      // Cover fit with FOCAL_X = 0.75 anchoring
      const scale = Math.max(width / CONFIG.FRAME_WIDTH, height / CONFIG.FRAME_HEIGHT);
      const renderW = CONFIG.FRAME_WIDTH * scale;
      const renderH = CONFIG.FRAME_HEIGHT * scale;
      const dy = (height - renderH) / 2;

      // When width < renderW, anchor around focal point (75% x)
      const maxShift = width - renderW;
      const dx = Math.max(maxShift, Math.min(0, (width - renderW) * CONFIG.FOCAL_X));

      ctx.drawImage(bitmap, dx, dy, renderW, renderH);
    }

    ctx.restore();
  }, []);

  /* -------------------------------------------------------------------------
     BITMAP DECODING & SLIDING WINDOW MANAGEMENT
     ------------------------------------------------------------------------- */
  const decodeBitmap = useCallback(async (index, blob) => {
    if (!blob || bitmapCacheRef.current.has(index)) return;

    try {
      if (typeof createImageBitmap !== 'undefined') {
        const bitmap = await createImageBitmap(blob);
        bitmapCacheRef.current.set(index, bitmap);
      } else {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        await img.decode();
        bitmapCacheRef.current.set(index, img);
      }
    } catch {
      // Decode error fallback handled gracefully
    }
  }, []);

  // Evict bitmaps outside sliding window [curr - WINDOW_RADIUS, curr + WINDOW_RADIUS]
  const pruneBitmapCache = useCallback((centerIndex) => {
    const minIndex = Math.max(0, centerIndex - CONFIG.WINDOW_RADIUS);
    const maxIndex = Math.min(CONFIG.FRAME_COUNT - 1, centerIndex + CONFIG.WINDOW_RADIUS);

    for (const [idx, bitmap] of bitmapCacheRef.current.entries()) {
      if (idx !== 0 && (idx < minIndex || idx > maxIndex)) {
        if (bitmap && typeof bitmap.close === 'function') {
          bitmap.close();
        }
        bitmapCacheRef.current.delete(idx);
      }
    }
  }, []);

  /* -------------------------------------------------------------------------
     FETCHING SINGLE FRAME WITH JPG FALLBACK
     ------------------------------------------------------------------------- */
  const fetchFrameBlob = useCallback(async (index) => {
    if (blobsRef.current[index] || pendingFetchesRef.current.has(index)) return;

    pendingFetchesRef.current.add(index);
    try {
      // Try WebP first
      let res = await fetch(getFrameUrl(index, false));
      if (!res.ok) {
        // Fallback to JPG
        res = await fetch(getFrameUrl(index, true));
      }
      if (res.ok) {
        const blob = await res.blob();
        blobsRef.current[index] = blob;
        setLoadedCount((prev) => {
          const next = prev + 1;
          if (next >= CONFIG.INITIAL_READY_THRESHOLD) {
            setInitialReady(true);
          }
          return next;
        });

        // If inside current sliding window, immediately decode
        const dist = Math.abs(index - currentFrameRef.current);
        if (dist <= CONFIG.WINDOW_RADIUS) {
          await decodeBitmap(index, blob);
          if (index === currentFrameRef.current) {
            drawCurrentFrame(index);
          }
        }
      }
    } catch {
      // Network error silent recovery
    } finally {
      pendingFetchesRef.current.delete(index);
    }
  }, [decodeBitmap, drawCurrentFrame, getFrameUrl]);

  /* -------------------------------------------------------------------------
     UPDATE UI STATE (Captions, CTA Opacity)
     ------------------------------------------------------------------------- */
  const updateUIForFrame = useCallback((frameIdx) => {
    // Buttons opacity: frames 0-105 -> 1; 105-125 -> fade to 0; 125-240 -> 0; 240-255 -> fade to 1; 255-299 -> 1
    let buttonsOpacity = 0;
    if (frameIdx <= 105) {
      buttonsOpacity = 1;
    } else if (frameIdx < 125) {
      buttonsOpacity = (125 - frameIdx) / 20;
    } else if (frameIdx >= 255) {
      buttonsOpacity = 1;
    } else if (frameIdx >= 240) {
      buttonsOpacity = (frameIdx - 240) / 15;
    }

    // Active Beat Caption
    let activeCap = null;
    let capOpacity = 0;
    for (const cap of BEAT_CAPTIONS) {
      if (frameIdx >= cap.start && frameIdx <= cap.end) {
        activeCap = cap;
        const span = cap.end - cap.start;
        const progress = (frameIdx - cap.start) / span;
        if (progress < 0.15) {
          capOpacity = progress / 0.15;
        } else if (progress > 0.85) {
          capOpacity = (1 - progress) / 0.15;
        } else {
          capOpacity = 1;
        }
        break;
      }
    }

    setUiState({
      frameIndex: frameIdx,
      buttonsOpacity: Math.max(0, Math.min(1, buttonsOpacity)),
      activeCaption: activeCap,
      captionOpacity: Math.max(0, Math.min(1, capOpacity)),
    });
  }, []);

  /* -------------------------------------------------------------------------
     LAYOUT METRIC CACHING (ResizeObserver / Window Resize)
     ------------------------------------------------------------------------- */
  const measureLayout = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    cachedOffsetTopRef.current = rect.top + scrollY;
    cachedScrollableRef.current = Math.max(
      1,
      containerRef.current.offsetHeight - window.innerHeight
    );

    const isMobile = window.innerWidth < 768;
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile,
    });
    activeStepRef.current = isMobile ? CONFIG.MOBILE_STEP : 1;

    // Redraw current frame with new bounds
    if (lastRenderedFrameRef.current >= 0) {
      drawCurrentFrame(lastRenderedFrameRef.current);
    }
  }, [drawCurrentFrame]);

  /* -------------------------------------------------------------------------
     EFFECT: INITIAL FRAME 1 IMMEDIATE LOAD + PROGRESSIVE QUEUE
     ------------------------------------------------------------------------- */
  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);

    const isMobile = window.innerWidth < 768;
    const isLowMem =
      isMobile ||
      (typeof navigator !== 'undefined' &&
        navigator.deviceMemory &&
        navigator.deviceMemory < 4);
    activeStepRef.current = isLowMem ? CONFIG.MOBILE_STEP : 1;

    let isMounted = true;

    async function initSequence() {
      // 1. Load Frame 1 immediately (index 0) for zero layout shift
      try {
        let res = await fetch(getFrameUrl(0, false));
        if (!res.ok) res = await fetch(getFrameUrl(0, true));
        if (res.ok && isMounted) {
          const blob = await res.blob();
          blobsRef.current[0] = blob;
          await decodeBitmap(0, blob);
          if (isMounted) {
            drawCurrentFrame(0);
            lastRenderedFrameRef.current = 0;
            setLoadedCount(1);
          }
        }
      } catch (err) {
        console.error('Failed loading initial frame 1:', err);
      }

      // If reduced motion is requested, load frame 300 statically and stop
      if (motionQuery.matches) {
        try {
          const lastIdx = CONFIG.FRAME_COUNT - 1;
          let res = await fetch(getFrameUrl(lastIdx, false));
          if (!res.ok) res = await fetch(getFrameUrl(lastIdx, true));
          if (res.ok && isMounted) {
            const blob = await res.blob();
            blobsRef.current[lastIdx] = blob;
            await decodeBitmap(lastIdx, blob);
            if (isMounted) {
              drawCurrentFrame(lastIdx);
              setInitialReady(true);
            }
          }
        } catch {
          // Fallback gracefully
        }
        return;
      }

      // 2. Load initial batch up to INITIAL_READY_THRESHOLD (frames 1..30)
      const initialStep = activeStepRef.current;
      const initialBatch = [];
      for (let i = initialStep; i < CONFIG.INITIAL_READY_THRESHOLD * initialStep; i += initialStep) {
        if (i < CONFIG.FRAME_COUNT) initialBatch.push(i);
      }

      for (const idx of initialBatch) {
        if (!isMounted) break;
        await fetchFrameBlob(idx);
      }
      if (isMounted) setInitialReady(true);

      // 3. Background queue: fetch remaining frames outward from current frame
      const remainingIndices = [];
      for (let i = 0; i < CONFIG.FRAME_COUNT; i += initialStep) {
        if (!blobsRef.current[i]) remainingIndices.push(i);
      }

      // Concurrency limited fetcher (4 parallel requests)
      const CONCURRENCY = 4;
      let currentIndex = 0;

      const worker = async () => {
        while (currentIndex < remainingIndices.length && isMounted) {
          const target = remainingIndices[currentIndex++];
          await fetchFrameBlob(target);
        }
      };

      const workers = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.all(workers);
    }

    initSequence();

    return () => {
      isMounted = false;
    };
  }, [decodeBitmap, drawCurrentFrame, fetchFrameBlob, getFrameUrl]);

  /* -------------------------------------------------------------------------
     EFFECT: LENIS SETUP, RESIZE OBSERVER, AND RAF SMOOTH SCRUB
     ------------------------------------------------------------------------- */
  useEffect(() => {
    if (isReducedMotion) return;

    measureLayout();

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: CONFIG.LERP,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    // Pure calculation in scroll event: NO layout reads or DOM writes!
    const handleScroll = (e) => {
      const scrollY = e.scroll ?? window.scrollY;
      const relativeScroll = scrollY - cachedOffsetTopRef.current;
      const progress = Math.max(0, Math.min(1, relativeScroll / cachedScrollableRef.current));
      targetProgressRef.current = progress;
    };

    lenis.on('scroll', handleScroll);

    // Resize listeners
    const handleResize = () => measureLayout();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // RequestAnimationFrame main loop
    const step = activeStepRef.current;
    const cache = bitmapCacheRef.current;

    const tick = (time) => {
      lenis.raf(time);

      // Smooth extra damping: current += (target - current) * CONFIG.DAMPING
      const target = targetProgressRef.current;
      const curr = currentProgressRef.current;
      currentProgressRef.current += (target - curr) * CONFIG.DAMPING;

      // Map progress (0..1) to frame index (0..299)
      const rawFrame = Math.min(
        CONFIG.FRAME_COUNT - 1,
        Math.max(0, Math.round(currentProgressRef.current * (CONFIG.FRAME_COUNT - 1)))
      );

      // Quantize to step on mobile/low-mem
      const targetFrame = Math.round(rawFrame / step) * step;

      if (targetFrame !== lastRenderedFrameRef.current) {
        currentFrameRef.current = targetFrame;
        drawCurrentFrame(targetFrame);
        lastRenderedFrameRef.current = targetFrame;
        updateUIForFrame(targetFrame);

        // Manage memory sliding window
        pruneBitmapCache(targetFrame);

        // Preload decode for window
        const minW = Math.max(0, targetFrame - CONFIG.WINDOW_RADIUS);
        const maxW = Math.min(CONFIG.FRAME_COUNT - 1, targetFrame + CONFIG.WINDOW_RADIUS);
        for (let i = minW; i <= maxW; i += step) {
          if (!bitmapCacheRef.current.has(i) && blobsRef.current[i]) {
            decodeBitmap(i, blobsRef.current[i]);
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    // Cleanup on unmount
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      lenis.destroy();
      lenisRef.current = null;

      // Close all allocated ImageBitmaps to prevent memory leaks
      for (const bitmap of cache.values()) {
        if (bitmap && typeof bitmap.close === 'function') {
          bitmap.close();
        }
      }
      cache.clear();
    };
  }, [decodeBitmap, drawCurrentFrame, isReducedMotion, measureLayout, pruneBitmapCache, updateUIForFrame]);

  /* -------------------------------------------------------------------------
     ACTION HANDLERS
     ------------------------------------------------------------------------- */
  const scrollToNextSection = () => {
    const nextElem = document.getElementById('categories');
    if (nextElem) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(nextElem, { offset: -60, duration: 1.2 });
      } else {
        nextElem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/tools');
    }
  };

  /* -------------------------------------------------------------------------
     COMPUTED OVERLAY COORDINATES FOR DESKTOP COVER
     ------------------------------------------------------------------------- */
  const computeDesktopButtonBox = () => {
    const { width, height } = viewport;
    const scale = Math.max(width / CONFIG.FRAME_WIDTH, height / CONFIG.FRAME_HEIGHT);
    const renderW = CONFIG.FRAME_WIDTH * scale;
    const renderH = CONFIG.FRAME_HEIGHT * scale;
    const dy = (height - renderH) / 2;
    const maxShift = width - renderW;
    const dx = Math.max(maxShift, Math.min(0, (width - renderW) * CONFIG.FOCAL_X));

    // Baked button coordinates in 1280x720 video:
    // Left: ~5.2% to 32% (0.052 * renderW)
    // Top: ~60.2% (0.602 * renderH)
    return {
      left: Math.round(dx + 0.052 * renderW),
      top: Math.round(dy + 0.602 * renderH),
      width: Math.round(0.32 * renderW),
    };
  };

  const desktopBox = !viewport.isMobile ? computeDesktopButtonBox() : null;

  /* =========================================================================
     RENDER: REDUCED MOTION STATIC HERO
     ========================================================================= */
  if (isReducedMotion) {
    return (
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '85vh',
          background: CONFIG.BG_COLOR,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          paddingTop: '80px',
        }}
        aria-label="Hero Section"
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 24px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(8, 24, 48, 0.8)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              marginBottom: '20px',
            }}
          >
            <Sparkles size={14} color="#00f2fe" />
            <span
              style={{
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono)',
                color: '#67e8f9',
                letterSpacing: '0.05em',
              }}
            >
              NEXT-GEN AI ECOSYSTEM
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '20px',
              letterSpacing: '-0.02em',
            }}
          >
            Learn AI. <span className="text-gradient-cyan">Build Anything.</span>
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
              maxWidth: '600px',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Master the AI tools that help you create, code, design, automate, and build the future.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/tools')}
              className="cyber-btn-primary"
              style={{ padding: '14px 28px' }}
            >
              <span>Explore AI Tools</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/learn')}
              className="cyber-btn-secondary"
              style={{ padding: '14px 28px' }}
            >
              <span>Start Learning</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* =========================================================================
     RENDER: PINNED SCROLL-DRIVEN CINEMATIC HERO
     ========================================================================= */
  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: `${CONFIG.SCROLL_LENGTH_VH}vh`,
        background: CONFIG.BG_COLOR,
      }}
      aria-label="Scroll-driven Hero Animation"
    >
      {/* 1. Visually hidden H1 for SEO and Screen Readers */}
      <h1
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Learn AI. Build Anything.
      </h1>

      {/* 2. Minimal Initial Preloader Bar (thin cyan/violet gradient right below navbar) */}
      {!initialReady && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            height: '3px',
            zIndex: 999,
            pointerEvents: 'none',
            background: 'rgba(2, 9, 17, 0.4)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, Math.round((loadedCount / CONFIG.INITIAL_READY_THRESHOLD) * 100))}%`,
              background: 'linear-gradient(90deg, #00f2fe, #9d4edd)',
              boxShadow: '0 0 12px #00f2fe',
              transition: 'width 0.2s ease-out',
            }}
          />
        </div>
      )}

      {/* 3. Sticky 100vh Viewport Container */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          background: CONFIG.BG_COLOR,
          display: 'flex',
          flexDirection: viewport.isMobile ? 'column' : 'row',
          alignItems: viewport.isMobile ? 'stretch' : 'center',
          justifyContent: viewport.isMobile ? 'flex-start' : 'center',
        }}
      >
        {/* Canvas Element (aria-hidden) */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: viewport.isMobile ? 'relative' : 'absolute',
            inset: viewport.isMobile ? 'auto' : 0,
            width: '100%',
            height: viewport.isMobile ? '52vh' : '100%',
            display: 'block',
            zIndex: 1,
            background: CONFIG.BG_COLOR,
          }}
        />

        {/* ===================================================================
            DESKTOP MODE: OVERLAY CTA BUTTONS (Aligned 1:1 over baked buttons)
            =================================================================== */}
        {!viewport.isMobile && desktopBox && (
          <div
            style={{
              position: 'absolute',
              left: `${desktopBox.left}px`,
              top: `${desktopBox.top}px`,
              zIndex: 25,
              opacity: uiState.buttonsOpacity,
              pointerEvents: uiState.buttonsOpacity > 0.2 ? 'auto' : 'none',
              transition: 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'nowrap',
            }}
          >
            <button
              onClick={scrollToNextSection}
              style={{
                background: '#020911',
                color: '#ffffff',
                border: '1.5px solid #00f2fe',
                borderRadius: '30px',
                boxShadow: '0 0 24px rgba(0, 242, 254, 0.5), inset 0 0 12px rgba(0, 242, 254, 0.2)',
                padding: '11px 22px',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 242, 254, 0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 242, 254, 0.5)';
              }}
              title="Explore All AI Tools"
            >
              <span>Explore AI Tools</span>
              <ArrowRight size={16} color="#00f2fe" />
            </button>

            <button
              onClick={() => navigate('/learn')}
              style={{
                background: '#020911',
                color: '#cbd5e1',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '30px',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.9)',
                padding: '11px 20px',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00f2fe';
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.9)';
              }}
              title="Start AI Learning Tracks"
            >
              <span>Start Learning</span>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRight size={10} color="#cbd5e1" />
              </div>
            </button>
          </div>
        )}

        {/* ===================================================================
            BEAT CAPTIONS: REAL HTML NARRATIVE CUES (Middle & Climax Frames)
            =================================================================== */}
        {uiState.activeCaption && (
          <div
            style={{
              position: 'absolute',
              left: viewport.isMobile ? '20px' : '5%',
              bottom: viewport.isMobile ? '24px' : '22%',
              zIndex: 30,
              opacity: uiState.captionOpacity,
              transform: `translateY(${uiState.captionOpacity < 1 ? (1 - uiState.captionOpacity) * 10 : 0}px)`,
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              pointerEvents: 'none',
              maxWidth: '520px',
            }}
          >
            <div
              style={{
                background: 'rgba(2, 9, 17, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 242, 254, 0.35)',
                borderRadius: '16px',
                padding: '16px 22px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 254, 0.2)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#00f2fe',
                    boxShadow: '0 0 8px #00f2fe',
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#67e8f9',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                  }}
                >
                  {uiState.activeCaption.tag}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '6px',
                  letterSpacing: '-0.02em',
                }}
              >
                {uiState.activeCaption.title}
              </h2>
              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {uiState.activeCaption.subtitle}
              </p>
            </div>
          </div>
        )}

        {/* ===================================================================
            MOBILE MODE (< 768px): Real HTML Headline & Actions below 16:9 canvas
            =================================================================== */}
        {viewport.isMobile && (
          <div
            style={{
              position: 'relative',
              zIndex: 20,
              padding: '16px 20px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: CONFIG.BG_COLOR,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '16px',
                background: 'rgba(8, 24, 48, 0.8)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                marginBottom: '10px',
                alignSelf: 'flex-start',
              }}
            >
              <Sparkles size={12} color="#00f2fe" />
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: '#67e8f9',
                  letterSpacing: '0.04em',
                }}
              >
                LEARN & BUILD PLATFORM
              </span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '8px',
              }}
            >
              Learn AI. <span className="text-gradient-cyan">Build Anything.</span>
            </h2>

            <p
              style={{
                fontSize: '0.88rem',
                color: '#94a3b8',
                lineHeight: 1.5,
                marginBottom: '16px',
              }}
            >
              Master the AI tools that help you create, code, design, automate, and build the future.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToNextSection}
                className="cyber-btn-primary"
                style={{
                  padding: '11px 18px',
                  fontSize: '0.85rem',
                  flex: 1,
                }}
              >
                <span>Explore Tools</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/learn')}
                className="cyber-btn-secondary"
                style={{
                  padding: '11px 18px',
                  fontSize: '0.85rem',
                  flex: 1,
                }}
              >
                <span>Start Learning</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            SUBTLE SCROLL INDICATOR PILL (Disappears when scrolled past 10%)
            =================================================================== */}
        <div
          onClick={scrollToNextSection}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: viewport.isMobile ? '20px' : '40px',
            zIndex: 35,
            opacity: uiState.frameIndex < 25 ? 1 : 0,
            transform: `translateY(${uiState.frameIndex < 25 ? 0 : 10}px)`,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            pointerEvents: uiState.frameIndex < 25 ? 'auto' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(2, 9, 17, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            cursor: 'pointer',
          }}
          title="Scroll or Click to explore"
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              color: '#94a3b8',
              letterSpacing: '0.04em',
            }}
          >
            SCROLL TO SCRUB
          </span>
          <ChevronDown size={14} color="#00f2fe" />
        </div>

        {/* ===================================================================
            EXIT SEAM GRADIENT BLEND (20vh transition from #020911 to #020812)
            =================================================================== */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20vh',
            background: 'linear-gradient(to bottom, rgba(2, 9, 17, 0) 0%, rgba(2, 9, 17, 0.6) 50%, #020812 100%)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      </div>
    </section>
  );
}
