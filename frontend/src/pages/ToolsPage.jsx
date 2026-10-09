import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchTools, fetchCategories, bookmarkTool } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Star, ExternalLink, Bookmark, Filter, Sparkles } from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchTools({
      category: selectedCategory,
      pricing: selectedPricing,
      search: search || undefined,
    })
      .then(setTools)
      .catch(console.error);
  }, [selectedCategory, selectedPricing, search]);

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
      if (res.bookmarked) next.add(toolId);
      else next.delete(toolId);
      setBookmarkedIds(next);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        {/* Header */}
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
            <Sparkles size={14} />
            <span>Neural Radar</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Frontier AI Tools Directory
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '640px' }}>
            Explore state-of-the-art AI systems for development, video synthesis, reasoning, voice cloning, and autonomous agents.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            background: 'rgba(8, 22, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#00f2fe" />
            <input
              type="text"
              placeholder="Filter by keyword (e.g. Cursor, Runway, Sonnet)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Pricing filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Pricing:</span>
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              style={{
                background: '#041021',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                padding: '8px 12px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="all">All Models</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchParams({});
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: selectedCategory === 'all' ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === 'all' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === 'all' ? '#00f2fe' : '#94a3b8',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading)',
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id || cat.name}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSearchParams({ category: cat.name });
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '20px',
                border: selectedCategory.toLowerCase() === cat.name.toLowerCase() ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory.toLowerCase() === cat.name.toLowerCase() ? '#00f2fe' : '#94a3b8',
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {tools.map((tool) => {
            const isSaved = bookmarkedIds.has(tool._id);
            return (
              <div
                key={tool._id}
                onClick={() => navigate(`/tools/${tool._id}`)}
                style={{
                  background: 'rgba(8, 22, 42, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0, 242, 254, 0.15)',
                  borderRadius: '20px',
                  padding: '24px',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
                      }}
                    >
                      <Bookmark size={15} fill={isSaved ? '#00f2fe' : 'none'} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {tool.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span>{tool.rating}</span>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {tool.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                    {tool.features?.map((feat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: '#cbd5e1',
                        }}
                      >
                        {feat}
                      </span>
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
                  <span style={{ fontSize: '0.82rem', color: '#a855f7', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
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
                    <span>Launch</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}
