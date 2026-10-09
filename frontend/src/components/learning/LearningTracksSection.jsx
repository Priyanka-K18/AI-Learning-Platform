import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLearning } from '../../services/api';
import { BookOpen, Clock, Users, Star, ArrowRight, Layers, Sparkles } from 'lucide-react';

export default function LearningTracksSection() {
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLearning()
      .then((data) => setTracks(data))
      .catch((err) => console.error(err));
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
            <BookOpen size={14} color="#00f2fe" />
            <span>Mastery Tracks</span>
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
            Curated AI Learning Paths
          </h2>
        </div>

        <button
          onClick={() => navigate('/learn')}
          className="cyber-btn-secondary"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          Explore All Learning Tracks →
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {tracks.map((track) => (
          <div
            key={track._id}
            onClick={() => navigate(`/learn/${track._id}`)}
            style={{
              background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.7) 0%, rgba(3, 12, 26, 0.8) 100%)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '20px',
              padding: '28px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = '#00f2fe';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 242, 254, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                  }}
                >
                  {track.level}
                </span>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#fbbf24',
                    fontSize: '0.85rem',
                  }}
                >
                  <Star size={14} fill="#fbbf24" />
                  <span>{track.rating}</span>
                </div>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '10px',
                  lineHeight: 1.3,
                }}
              >
                {track.title}
              </h3>

              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                {track.description}
              </p>

              {/* Modules List snippet */}
              <div
                style={{
                  background: 'rgba(2, 8, 18, 0.6)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Curriculum Modules:
                </div>
                {track.modules?.slice(0, 3).map((mod, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      color: '#cbd5e1',
                      padding: '4px 0',
                    }}
                  >
                    <span>• {mod.title}</span>
                    <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{mod.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  {track.duration}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} />
                  {track.studentsCount} builders
                </span>
              </div>

              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#00f2fe',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span>Start Track</span>
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
