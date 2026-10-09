import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../services/api';
import {
  Code2,
  Image,
  Video,
  Palette,
  Mic2,
  FileText,
  Zap,
  Bot,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const iconMap = {
  'AI Coding': Code2,
  'Image Generation': Image,
  'Video Creation': Video,
  'Design & UI/UX': Palette,
  'Audio & Voice': Mic2,
  'Writing & Content': FileText,
  'Productivity': Zap,
  'Automation': Bot,
};

const defaultCategories = [
  { name: 'AI Coding', slug: 'ai-coding', icon: 'Code2', toolCount: 14, color: '#00f2fe', description: 'Next-gen code assistants, IDEs, and agentic compilers.' },
  { name: 'Image Generation', slug: 'image-generation', icon: 'Image', toolCount: 18, color: '#a855f7', description: 'Photorealistic synthesis, concept art, and diffusion engines.' },
  { name: 'Video Creation', slug: 'video-creation', icon: 'Video', toolCount: 12, color: '#3b82f6', description: 'Cinematic video synthesis, motion transfer, camera controls.' },
  { name: 'Design & UI/UX', slug: 'design-ui-ux', icon: 'Palette', toolCount: 15, color: '#06b6d4', description: 'Automated wireframing, high-fidelity UI design generators.' },
  { name: 'Audio & Voice', slug: 'audio-voice', icon: 'Mic2', toolCount: 10, color: '#8b5cf6', description: 'Voice cloning, emotional speech synthesis, audio models.' },
  { name: 'Writing & Content', slug: 'writing-content', icon: 'FileText', toolCount: 16, color: '#00e5ff', description: 'Reasoning models, research synthesizers, copy co-pilots.' },
  { name: 'Productivity', slug: 'productivity', icon: 'Zap', toolCount: 20, color: '#6366f1', description: 'Context-aware workspace copilots, meeting intelligence.' },
  { name: 'Automation', slug: 'automation', icon: 'Bot', toolCount: 11, color: '#10b981', description: 'Autonomous multi-agent workflows, browser orchestration.' },
];

export default function AIToolCategories() {
  const [categories, setCategories] = useState(defaultCategories);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        if (data && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.warn('Using default categories fallback:', err.message);
      });
  }, []);

  return (
    <section
      id="categories"
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '50px 24px 70px 24px',
        maxWidth: '1440px',
        margin: '0 auto',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '38px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '20px',
            color: '#67e8f9',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}
        >
          <Sparkles size={14} color="#00f2fe" />
          <span>Neural Horizons</span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}
        >
          Explore the AI Category Matrix
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Discover the top frontier tools and systems grouped by intelligence discipline.
        </p>
      </div>

      {/* Horizontally arranged / Grid glass cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {categories.map((cat, idx) => {
          const IconComponent = iconMap[cat.name] || Sparkles;
          const isHovered = hoveredIndex === idx;
          const catColor = cat.color || '#00f2fe';

          return (
            <div
              key={cat.name || idx}
              onClick={() => navigate(`/tools?category=${encodeURIComponent(cat.name)}`)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                position: 'relative',
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(14, 38, 72, 0.85) 0%, rgba(6, 18, 36, 0.95) 100%)'
                  : 'rgba(8, 22, 40, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isHovered
                  ? `1px solid ${catColor}`
                  : '1px solid rgba(0, 242, 254, 0.16)',
                borderRadius: '18px',
                padding: '24px 22px',
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                  ? `0 18px 40px rgba(0, 0, 0, 0.7), 0 0 25px ${catColor}55`
                  : '0 8px 24px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top edge glow beam on hover */}
              {isHovered && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '15%',
                    right: '15%',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${catColor}, transparent)`,
                    boxShadow: `0 0 12px ${catColor}`,
                  }}
                />
              )}

              {/* Header row: Icon & Tool Count */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: isHovered
                      ? `linear-gradient(135deg, ${catColor}33, rgba(2, 8, 18, 0.8))`
                      : 'rgba(2, 10, 22, 0.7)',
                    border: `1px solid ${isHovered ? catColor : 'rgba(0, 242, 254, 0.2)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? `0 0 15px ${catColor}66` : 'none',
                  }}
                >
                  <IconComponent
                    size={22}
                    color={isHovered ? '#ffffff' : catColor}
                    style={{
                      transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#94a3b8',
                      padding: '3px 9px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {cat.toolCount ? `${cat.toolCount} tools` : 'Explore'}
                  </span>
                  <div
                    style={{
                      color: isHovered ? catColor : '#64748b',
                      transform: isHovered ? 'translate(2px, -2px)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '8px',
                  letterSpacing: '-0.01em',
                }}
              >
                {cat.name}
              </h3>

              {/* Description */}
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {cat.description || 'Discover frontier neural models and automated workflows.'}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
