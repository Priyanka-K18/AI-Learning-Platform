import React, { useState, useEffect } from 'react';
import { fetchLearning } from '../services/api';
import { BookOpen, Clock, Users, Star, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function LearnPage() {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    fetchLearning().then((data) => {
      setTracks(data);
      if (data && data.length > 0) setSelectedTrack(data[0]);
    });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              color: '#00f2fe',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-heading)',
              marginBottom: '12px',
            }}
          >
            <BookOpen size={14} />
            <span>Mastery Tracks</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Learn AI & Autonomous Systems
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '640px' }}>
            Step-by-step interactive tracks engineered to take you from foundational concepts to building production AI agents.
          </p>
        </div>

        {/* Master Tracks Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '30px' }}>
          {tracks.map((track) => (
            <div
              key={track._id}
              style={{
                background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.7) 0%, rgba(3, 12, 26, 0.8) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(157, 78, 221, 0.15)',
                      color: '#c084fc',
                    }}
                  >
                    {track.level}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem' }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>{track.rating}</span>
                  </div>
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {track.title}
                </h2>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '24px' }}>
                  {track.description}
                </p>

                {/* Modules Curriculum */}
                <div style={{ background: 'rgba(2, 8, 18, 0.7)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <h4 style={{ color: '#67e8f9', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                    Curriculum Modules:
                  </h4>
                  {track.modules?.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 0',
                        borderBottom: idx < track.modules.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                        <CheckCircle2 size={14} color="#00f2fe" />
                        <span>{mod.title}</span>
                      </div>
                      <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{mod.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    {track.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} />
                    {track.studentsCount} builders
                  </span>
                </div>

                <button className="cyber-btn-primary" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
                  Start Learning ◉
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
