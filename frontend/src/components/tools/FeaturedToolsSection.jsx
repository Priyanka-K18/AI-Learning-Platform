import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTools, bookmarkTool } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Star, ExternalLink, Bookmark, Sparkles, Filter, Check } from 'lucide-react';

export default function FeaturedToolsSection() {
  const [tools, setTools] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTools({ limit: 8 })
      .then((data) => {
        setTools(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (user?.savedTools) {
      setBookmarkedIds(new Set(user.savedTools.map((t) => (typeof t === 'string' ? t : t._id))));
    }
  }, [user]);

  const handleBookmark = async (e, toolId) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await bookmarkTool(toolId);
      const next = new Set(bookmarkedIds);
      if (res.bookmarked) {
        next.add(toolId);
      } else {
        next.delete(toolId);
      }
      setBookmarkedIds(next);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTools =
    activeCategory === 'all'
      ? tools
      : tools.filter((t) => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

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
              background: 'rgba(157, 78, 221, 0.12)',
              border: '1px solid rgba(157, 78, 221, 0.3)',
              borderRadius: '20px',
              color: '#c084fc',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={14} color="#a855f7" />
            <span>Frontier Radar</span>
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
            Featured Frontier AI Tools
          </h2>
        </div>

        <button
          onClick={() => navigate('/tools')}
          className="cyber-btn-secondary"
          style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        >
          View All Tools Directory →
        </button>
      </div>

      {/* Grid of Tools */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {filteredTools.map((tool) => {
          const isSaved = bookmarkedIds.has(tool._id);
          return (
            <div
              key={tool._id}
              onClick={() => navigate(`/tools/${tool._id}`)}
              style={{
                background: 'rgba(8, 22, 42, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 242, 254, 0.15)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.45)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                {/* Top bar: Category + Bookmark */}
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
                      borderRadius: '10px',
                      background: 'rgba(0, 242, 254, 0.1)',
                      color: '#00f2fe',
                      border: '1px solid rgba(0, 242, 254, 0.25)',
                    }}
                  >
                    {tool.category}
                  </span>

                  <button
                    onClick={(e) => handleBookmark(e, tool._id)}
                    style={{
                      background: isSaved ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: isSaved ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '6px',
                      color: isSaved ? '#00f2fe' : '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    title={isSaved ? 'Saved to bookmarks' : 'Bookmark tool'}
                  >
                    <Bookmark size={15} fill={isSaved ? '#00f2fe' : 'none'} />
                  </button>
                </div>

                {/* Tool Name & Rating */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.35rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {tool.name}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#fbbf24',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <Star size={14} fill="#fbbf24" />
                    <span>{tool.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}
                >
                  {tool.description}
                </p>

                {/* Features tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {tool.features?.slice(0, 3).map((feat, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar: Pricing & Link */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.82rem',
                    color: '#a855f7',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tool.pricing}
                </span>

                <a
                  href={tool.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    color: '#00f2fe',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <span>Launch Tool</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
