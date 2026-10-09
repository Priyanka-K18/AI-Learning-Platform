import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOpenSourceRepos } from '../../services/api';
import {
  Star,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Code,
  Shield,
  Zap,
} from 'lucide-react';

const Github = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function OpenSourceSpotlightSection() {
  const [spotlightRepos, setSpotlightRepos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpenSourceRepos({ limit: 4, sort: 'stars' })
      .then((data) => {
        const list = data?.repos || data || [];
        setSpotlightRepos(list.slice(0, 4));
      })
      .catch((err) => console.error('Failed to load spotlight repos:', err));
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '60px 24px 80px 24px',
        maxWidth: '1440px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              borderRadius: '20px',
              color: '#00f2fe',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            <Github size={14} color="#00f2fe" />
            <span>Open-Source Learning Hub</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            Master Production Codebases
          </h2>
        </div>

        <button
          onClick={() => navigate('/open-source')}
          className="cyber-btn-secondary"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          Explore All 27+ Open-Source Repos →
        </button>
      </div>

      {/* Grid of 4 top open source projects */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        {spotlightRepos.map((repo) => {
          const repoKey = repo._id || repo.repoName;
          return (
            <div
              key={repoKey}
              onClick={() => navigate(`/open-source/${repo.repoName || repo._id}`)}
              style={{
                background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.7) 0%, rgba(3, 12, 26, 0.8) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '18px',
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#00f2fe';
                e.currentTarget.style.boxShadow =
                  '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(0, 242, 254, 0.1)',
                      color: '#00f2fe',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                    }}
                  >
                    {repo.category}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.8rem' }}>
                    <Star size={12} fill="#fbbf24" />
                    <span>{repo.stars?.toLocaleString()}</span>
                  </div>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: '4px',
                  }}
                >
                  {repo.name}
                </h3>

                <div style={{ fontSize: '0.78rem', color: '#64748b', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>
                  {repo.repoOwner}
                </div>

                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {repo.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ color: '#64748b' }}>{repo.language}</span>
                <span style={{ color: '#00f2fe', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span>Dissect Code</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
