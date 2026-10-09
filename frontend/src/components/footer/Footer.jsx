import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Globe, MessageCircle, Shield, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        background: 'linear-gradient(180deg, #020812 0%, #01040a 100%)',
        borderTop: '1px solid rgba(0, 242, 254, 0.15)',
        padding: '70px 24px 40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '50px',
        }}
      >
        {/* Brand column */}
        <div style={{ maxWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00f2fe, #9d4edd)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={18} color="#020812" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              AI <span className="text-gradient-cyan">NEXUS</span>
            </span>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
            The premier neural discovery and education gateway. Learn AI, master agent systems, and build the future with curated frontier intelligence.
          </p>

          {/* System status indicator */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#34d399',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span>AI Nexus Core: Operational</span>
          </div>
        </div>

        {/* Directory links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
            Ecosystem
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/tools" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>AI Tools Directory</Link></li>
            <li><Link to="/tools?pricing=Free" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Free & Open Weights</Link></li>
            <li><Link to="/learn" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Curated Learning Tracks</Link></li>
            <li><Link to="/roadmaps" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Career Roadmaps</Link></li>
            <li><Link to="/projects" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Builder Project Showcase</Link></li>
          </ul>
        </div>

        {/* Community links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
            Community
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link to="/community" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Nexus Discussions</Link></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>GitHub Repository</a></li>
            <li><a href="https://discord.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>Discord Matrix</a></li>
            <li><a href="https://x.com" target="_blank" rel="noreferrer" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.88rem' }}>X / Twitter Updates</a></li>
          </ul>
        </div>

        {/* Architecture & Security */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '18px', fontFamily: 'var(--font-heading)' }}>
            Architecture
          </h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
            Built with React, Vite, Node/Express, and MongoDB. Scroll-driven canvas kinematic synthesis engine.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>REST API: v1.0.0</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>PORT: 5000</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          fontSize: '0.82rem',
          color: '#64748b',
        }}
      >
        <div>
          © {new Date().getFullYear()} AI Nexus Technologies. All rights reserved. Your Gateway to the AI Era.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Privacy Policy</span>
          <span>Terms of Neural Service</span>
          <span>API Documentation</span>
        </div>
      </div>
    </footer>
  );
}
