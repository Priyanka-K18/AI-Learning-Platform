import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchToolById, bookmarkTool } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, ExternalLink, Bookmark, ArrowLeft, CheckCircle2, Share2, Sparkles, Shield } from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    fetchToolById(id)
      .then((data) => {
        setTool(data);
        if (user?.savedTools) {
          setIsSaved(user.savedTools.some((t) => (typeof t === 'string' ? t : t._id) === id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await bookmarkTool(id);
      setIsSaved(res.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#00f2fe', fontFamily: 'var(--font-heading)' }}>Loading tool specification...</span>
      </div>
    );
  }

  if (!tool) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '120px', textAlign: 'center', color: '#fff' }}>
        <h2>AI Tool not found</h2>
        <button onClick={() => navigate('/tools')} className="cyber-btn-secondary" style={{ marginTop: '20px' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Master Tool Card */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.8) 0%, rgba(3, 12, 26, 0.95) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'rgba(0, 242, 254, 0.12)',
                    color: '#00f2fe',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                  }}
                >
                  {tool.category}
                </span>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    background: 'rgba(157, 78, 221, 0.12)',
                    color: '#c084fc',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tool.pricing}
                </span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {tool.name}
              </h1>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleBookmark}
                className="cyber-btn-secondary"
                style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Bookmark size={16} fill={isSaved ? '#00f2fe' : 'none'} color={isSaved ? '#00f2fe' : '#cbd5e1'} />
                <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>

              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary"
                style={{ padding: '12px 24px', textDecoration: 'none' }}
              >
                <span>Launch Tool</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', lineHeight: 1.7, marginBottom: '32px' }}>
            {tool.description}
          </p>

          {/* Key Capabilities */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
              Core Features & Capabilities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {tool.features?.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    background: 'rgba(2, 10, 24, 0.6)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 242, 254, 0.15)',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                  }}
                >
                  <CheckCircle2 size={16} color="#00f2fe" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tags:</span>
            {tool.tags?.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#94a3b8',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
