import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Terminal, Flame, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HeroText({ scrollProgress, onExploreClick, onLearnClick }) {
  const navigate = useNavigate();

  // Progress milestones:
  // 0% - 60%: "Your Gateway to the AI Era" visible, main text hidden/scrambling
  // 65% - 85%: "LEARN AI." being traced and materialized
  // 85% - 100%: "BUILD ANYTHING." materialized
  // 100%: full neon blast / bloom

  const isLearnAiRevealed = scrollProgress >= 0.70;
  const isBuildAnythingRevealed = scrollProgress >= 0.88;
  const isComplete = scrollProgress >= 0.98;

  // Calculate reveal width percentages for the glowing energy sweep (right to left or left to right)
  const line1Progress = Math.max(0, Math.min(1, (scrollProgress - 0.60) / 0.25));
  const line2Progress = Math.max(0, Math.min(1, (scrollProgress - 0.75) / 0.23));

  // Scramble effect simulation for digital letter assembly
  const [scramble1, setScramble1] = useState('LEARN AI.');
  const [scramble2, setScramble2] = useState('BUILD ANYTHING.');

  const glyphs = '01#%&*+=-_<>{}[]/\\~';

  useEffect(() => {
    if (line1Progress > 0 && line1Progress < 1) {
      const target = 'LEARN AI.';
      const revealedCount = Math.floor(line1Progress * target.length);
      const scrambled = target
        .split('')
        .map((char, i) => {
          if (i <= revealedCount) return char;
          if (char === ' ') return ' ';
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');
      setScramble1(scrambled);
    } else {
      setScramble1('LEARN AI.');
    }
  }, [line1Progress]);

  useEffect(() => {
    if (line2Progress > 0 && line2Progress < 1) {
      const target = 'BUILD ANYTHING.';
      const revealedCount = Math.floor(line2Progress * target.length);
      const scrambled = target
        .split('')
        .map((char, i) => {
          if (i <= revealedCount) return char;
          if (char === ' ') return ' ';
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');
      setScramble2(scrambled);
    } else {
      setScramble2('BUILD ANYTHING.');
    }
  }, [line2Progress]);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '820px',
        paddingLeft: '5%',
        paddingRight: '20px',
        pointerEvents: 'auto',
      }}
      className="hero-text-container"
    >
      {/* 1. INITIAL STATE: Your Gateway to the AI Era badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 18px',
          background: 'rgba(8, 24, 48, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '30px',
          marginBottom: '24px',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.25)',
          transform: `translateY(${scrollProgress > 0.1 ? 0 : 0}px)`,
          transition: 'all 0.3s ease',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00f2fe',
            boxShadow: '0 0 12px #00f2fe',
          }}
          className="animate-pulse"
        />
        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.88rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#67e8f9',
          }}
        >
          Your Gateway to the AI Era
        </span>
        <Sparkles size={14} color="#9d4edd" />
      </div>

      {/* 2. MAIN HEADLINE WITH DIGITAL SYNTHESIS & ENERGY TRACING */}
      <div style={{ marginBottom: '22px' }}>
        {/* Line 1: LEARN AI. */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
            marginBottom: '4px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              margin: 0,
              color: isLearnAiRevealed ? '#ffffff' : 'rgba(255, 255, 255, 0.12)',
              textShadow: isComplete
                ? '0 0 35px #00f2fe, 0 0 70px #9d4edd, 0 0 100px rgba(0, 242, 254, 0.8)'
                : isLearnAiRevealed
                ? '0 0 25px rgba(0, 242, 254, 0.6), 0 0 45px rgba(157, 78, 221, 0.4)'
                : 'none',
              filter: `blur(${line1Progress < 1 ? (1 - line1Progress) * 4 : 0}px)`,
              transition: 'text-shadow 0.3s ease, filter 0.2s ease',
            }}
          >
            {line1Progress > 0 && line1Progress < 1 ? scramble1 : 'LEARN AI.'}
          </h1>

          {/* Glowing Energy Trace Sweep Bar */}
          {line1Progress > 0 && line1Progress < 1 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${line1Progress * 100}%`,
                width: '6px',
                background: 'linear-gradient(180deg, #ffffff, #00f2fe, #9d4edd)',
                boxShadow: '0 0 25px #00f2fe, 0 0 50px #9d4edd',
                transform: 'translateX(-50%)',
                zIndex: 2,
              }}
            />
          )}
        </div>

        <br />

        {/* Line 2: BUILD ANYTHING. */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            overflow: 'hidden',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 7.5vw, 6.2rem)',
              fontWeight: 900,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              margin: 0,
              background: isBuildAnythingRevealed
                ? 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 40%, #c084fc 80%, #ffffff 100%)'
                : 'none',
              WebkitBackgroundClip: isBuildAnythingRevealed ? 'text' : 'unset',
              WebkitTextFillColor: isBuildAnythingRevealed ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
              filter: `blur(${line2Progress < 1 ? (1 - line2Progress) * 5 : 0}px)`,
              textShadow: isComplete
                ? '0 0 40px rgba(0, 242, 254, 0.9), 0 0 80px rgba(157, 78, 221, 0.8)'
                : 'none',
              transition: 'filter 0.2s ease, text-shadow 0.3s ease',
            }}
          >
            {line2Progress > 0 && line2Progress < 1 ? scramble2 : 'BUILD ANYTHING.'}
          </h1>

          {/* Glowing Energy Trace Sweep Bar */}
          {line2Progress > 0 && line2Progress < 1 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${line2Progress * 100}%`,
                width: '6px',
                background: 'linear-gradient(180deg, #ffffff, #00f2fe, #9d4edd)',
                boxShadow: '0 0 30px #00f2fe, 0 0 60px #9d4edd',
                transform: 'translateX(-50%)',
                zIndex: 2,
              }}
            />
          )}
        </div>
      </div>

      {/* 3. HERO DESCRIPTION */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          lineHeight: 1.6,
          color: '#cbd5e1',
          maxWidth: '580px',
          marginBottom: '32px',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          opacity: Math.max(0.4, scrollProgress * 1.2),
          transition: 'opacity 0.3s ease',
        }}
      >
        Master the AI tools that help you create, code, design, automate, and build the future.
      </p>

      {/* 4. HERO ACTION BUTTONS */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          opacity: Math.max(0.6, scrollProgress * 1.1),
        }}
      >
        <button
          onClick={onExploreClick || (() => navigate('/tools'))}
          className="cyber-btn-primary"
          style={{
            padding: '16px 32px',
            fontSize: '1.05rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <span>Explore AI Tools</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={onLearnClick || (() => navigate('/learn'))}
          className="cyber-btn-secondary"
          style={{
            padding: '16px 30px',
            fontSize: '1.05rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>Start Learning</span>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#00f2fe',
              boxShadow: '0 0 10px #00f2fe',
            }}
          />
        </button>
      </div>
    </div>
  );
}
