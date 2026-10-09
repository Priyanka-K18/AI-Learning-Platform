import React, { useState, useEffect } from 'react';
import { fetchRoadmaps } from '../services/api';
import { GitBranch, Clock, Users, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);

  useEffect(() => {
    fetchRoadmaps().then(setRoadmaps).catch(console.error);
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
            <GitBranch size={14} />
            <span>Career Blueprints</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Structured AI Career Roadmaps
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '640px' }}>
            Comprehensive, milestone-driven curriculums designed to help you become an AI Software Engineer or AI Product Designer.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {roadmaps.map((map) => (
            <div
              key={map._id}
              style={{
                background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.8) 0%, rgba(3, 12, 26, 0.9) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '24px',
                padding: '36px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      background: 'rgba(157, 78, 221, 0.2)',
                      color: '#c084fc',
                      display: 'inline-block',
                      marginBottom: '10px',
                    }}
                  >
                    Role: {map.targetRole}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {map.title}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>⏳ {map.duration}</span>
                  <span>👥 {map.totalEnrollments} enrolled</span>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
                {map.description}
              </p>

              {/* Step by step tree */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                {map.steps?.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(2, 10, 24, 0.7)',
                      border: '1px solid rgba(0, 242, 254, 0.18)',
                      borderRadius: '16px',
                      padding: '20px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#00f2fe', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                      Milestone {idx + 1}
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                      {step.title}
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '14px' }}>
                      {step.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {step.recommendedTools?.map((t, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: 'rgba(0, 242, 254, 0.1)',
                            color: '#67e8f9',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
