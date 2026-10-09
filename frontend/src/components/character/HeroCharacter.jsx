import React, { useRef, useEffect } from 'react';

export default function HeroCharacter({ scrollProgress, onHandPositionUpdate }) {
  const containerRef = useRef(null);
  const handGlowRef = useRef(null);

  // Calculate character kinematics based on scrollProgress (0.0 to 1.0)
  // Phase 1 (0 to 0.25): subtle breathing & posture awakening
  // Phase 2 (0.25 to 0.55): arm raising smoothly toward energy core
  // Phase 3 & 4 (0.55 to 1.0): hand reaching apex, intense energy emission

  const breathing = Math.sin(Date.now() * 0.003) * 1.5;
  const isAwake = scrollProgress > 0.08;
  const isRaisingHand = scrollProgress >= 0.25;
  const isSurging = scrollProgress >= 0.55;

  // Arm angle: 0deg when relaxed, smoothly rotates up to -52deg when reaching
  let armRotation = 0;
  if (scrollProgress < 0.25) {
    armRotation = scrollProgress * 15; // slight subtle hand twitch
  } else if (scrollProgress <= 0.6) {
    const t = (scrollProgress - 0.25) / 0.35;
    armRotation = t * -52; // raise forward
  } else {
    armRotation = -52 + Math.sin(scrollProgress * 20) * 1.5; // slight tension pulse
  }

  // Head tilt: turns slightly more towards the holographic center
  const headTilt = scrollProgress > 0.15 ? Math.min(8, (scrollProgress - 0.15) * 20) : 0;

  // Body scale / chest expansion (breathing)
  const chestExpansion = isAwake ? 1 + (scrollProgress * 0.02) : 1;

  // Track hand coordinates to pass to Canvas
  useEffect(() => {
    const updateHandPos = () => {
      if (handGlowRef.current && onHandPositionUpdate) {
        const rect = handGlowRef.current.getBoundingClientRect();
        const parentRect = containerRef.current?.parentElement?.getBoundingClientRect();
        if (parentRect) {
          onHandPositionUpdate({
            x: rect.left - parentRect.left + rect.width / 2,
            y: rect.top - parentRect.top + rect.height / 2,
          });
        }
      }
    };
    updateHandPos();
    window.addEventListener('resize', updateHandPos);
    return () => window.removeEventListener('resize', updateHandPos);
  }, [scrollProgress, onHandPositionUpdate]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        right: '4%',
        bottom: '8%',
        width: '420px',
        height: '620px',
        pointerEvents: 'none',
        zIndex: 6,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      className="hero-character-wrapper"
    >
      {/* Volumetric Overhead Cone Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '-30%',
          left: '25%',
          width: '320px',
          height: '140%',
          background: `radial-gradient(ellipse at 50% 0%, rgba(0, 242, 254, ${0.12 + scrollProgress * 0.15}) 0%, rgba(157, 78, 221, ${0.06 + scrollProgress * 0.08}) 40%, rgba(2, 8, 18, 0) 75%)`,
          transform: 'rotate(-5deg)',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
        }}
      />

      {/* Cybernetic Character SVG Rig */}
      <svg
        viewBox="0 0 340 540"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          filter: `drop-shadow(0 0 ${15 + scrollProgress * 25}px rgba(0, 242, 254, ${0.2 + scrollProgress * 0.4}))`,
          transform: `translateY(${isAwake ? -scrollProgress * 8 : 0}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        <defs>
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="neonGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#9d4edd" />
          </linearGradient>
          <radialGradient id="handGlowAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#00f2fe" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#9d4edd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#020812" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Metallic Grid Platform Under Feet */}
        <g opacity={0.85}>
          <ellipse cx="170" cy="505" rx="130" ry="24" fill="#020812" stroke="#00f2fe" strokeWidth="1" strokeOpacity="0.4" />
          <ellipse cx="170" cy="505" rx="110" ry="18" fill="none" stroke="#9d4edd" strokeWidth="0.8" strokeOpacity="0.3" />
          {/* Grid lines */}
          <line x1="60" y1="505" x2="280" y2="505" stroke="#00f2fe" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="100" y1="495" x2="240" y2="495" stroke="#00f2fe" strokeWidth="0.5" strokeOpacity="0.2" />
        </g>

        {/* Legs and Combat Boots */}
        <g id="lower-body">
          {/* Left leg */}
          <path d="M140 330 L135 480 L115 495 L145 498 L152 480 L155 330 Z" fill="#090d16" stroke="#1e293b" strokeWidth="1.5" />
          {/* Right leg */}
          <path d="M185 330 L188 480 L175 495 L208 498 L205 480 L198 330 Z" fill="#0d131f" stroke="#1e293b" strokeWidth="1.5" />
          {/* Subtle neon seam on pants */}
          <path d="M135 340 L132 475" stroke="#00f2fe" strokeWidth="0.8" strokeOpacity={0.25 + scrollProgress * 0.3} />
          <path d="M202 340 L204 475" stroke="#9d4edd" strokeWidth="0.8" strokeOpacity={0.25 + scrollProgress * 0.3} />
        </g>

        {/* Torso & Jacket (Chest expands with breathing) */}
        <g
          id="torso"
          style={{
            transformOrigin: '170px 300px',
            transform: `scale(${chestExpansion})`,
            transition: 'transform 0.4s ease-out',
          }}
        >
          {/* Dark technical bomber jacket */}
          <path
            d="M125 155 Q170 148 215 155 L228 330 Q170 338 112 330 Z"
            fill="url(#jacketGrad)"
            stroke="#334155"
            strokeWidth="2"
          />
          {/* Jacket back seams & cybernetic spine glow */}
          <line x1="170" y1="156" x2="170" y2="330" stroke="#00f2fe" strokeWidth={isSurging ? 2.5 : 1} strokeOpacity={0.3 + scrollProgress * 0.6} />
          {/* Shoulder pads */}
          <path d="M125 155 L108 185 L125 210 Z" fill="#0f172a" stroke="#1e293b" />
          <path d="M215 155 L232 185 L215 210 Z" fill="#0f172a" stroke="#1e293b" />
        </g>

        {/* Head & Neck with subtle tilt */}
        <g
          id="head"
          style={{
            transformOrigin: '170px 145px',
            transform: `rotate(${-headTilt}deg)`,
            transition: 'transform 0.4s ease-out',
          }}
        >
          {/* Neck */}
          <path d="M158 135 L158 156 L182 156 L182 135 Z" fill="#1e293b" />
          {/* Head silhouette (facing left/3-quarter) */}
          <path
            d="M152 75 C152 50 188 50 188 75 C188 100 180 135 170 138 C160 135 152 100 152 75 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="1.5"
          />
          {/* High-tech earpiece / neural link on temple */}
          <circle cx="160" cy="92" r="3" fill="#00f2fe" />
          <path d="M160 92 L168 85" stroke="#00f2fe" strokeWidth="1" strokeOpacity={0.7} />
          {isSurging && (
            <circle cx="160" cy="92" r="6" fill="none" stroke="#00f2fe" strokeWidth="0.8" className="animate-ping" />
          )}
        </g>

        {/* Left Arm (Relaxed at side) */}
        <g id="left-arm">
          <path d="M228 170 Q240 240 238 310" stroke="#0f172a" strokeWidth="22" strokeLinecap="round" />
          <path d="M228 170 Q240 240 238 310" stroke="#1e293b" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>

        {/* Right Arm & Hand (The interactive kinematic arm!) */}
        <g
          id="right-arm-articulation"
          style={{
            transformOrigin: '120px 175px',
            transform: `rotate(${armRotation}deg)`,
            transition: 'transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1)',
          }}
        >
          {/* Upper arm */}
          <path d="M120 175 L95 245" stroke="#0f172a" strokeWidth="24" strokeLinecap="round" />
          <path d="M120 175 L95 245" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Forearm reaching forward to the left */}
          <path d="M95 245 L50 280" stroke="#1e293b" strokeWidth="18" strokeLinecap="round" />
          <path d="M95 245 L50 280" stroke="#00f2fe" strokeWidth="1.2" strokeOpacity={0.4 + scrollProgress * 0.5} strokeLinecap="round" fill="none" />

          {/* Hand palm & outstretched fingers pointing toward the AI core */}
          <g transform="translate(42, 282)">
            <path
              d="M10 0 L-10 8 L-16 18 L-8 22 L8 12 Z"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="1.2"
            />
            {/* Extended fingers toward center-left */}
            <line x1="-12" y1="12" x2="-26" y2="16" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-14" y1="16" x2="-28" y2="22" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-10" y1="20" x2="-24" y2="28" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />

            {/* Glowing Neural Palm Node (Ignites with scroll) */}
            <circle
              ref={handGlowRef}
              cx="-12"
              cy="16"
              r={isSurging ? 9 : 4}
              fill="#00f2fe"
              opacity={0.3 + scrollProgress * 0.7}
            />

            {/* Radiant Hand Energy Halo */}
            {scrollProgress > 0.35 && (
              <g>
                <circle
                  cx="-12"
                  cy="16"
                  r={22 * Math.min(1.4, scrollProgress * 1.5)}
                  fill="url(#handGlowAura)"
                />
                <circle
                  cx="-12"
                  cy="16"
                  r={38 * Math.min(1.3, scrollProgress * 1.3)}
                  fill="url(#handGlowAura)"
                  opacity={0.6}
                />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}
