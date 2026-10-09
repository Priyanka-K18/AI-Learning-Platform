import React, { useState, useEffect, useRef } from 'react';
import { searchAI } from '../../services/api';
import { Search, X, Sparkles, ExternalLink, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchPalette({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([
    'AI video generator',
    'Cursor',
    'Claude 3.7 Sonnet',
    'Midjourney v7',
    'Flux.1 Pro',
    'ElevenLabs',
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (initialQuery) {
        performSearch(initialQuery);
      }
    }
  }, [isOpen, initialQuery]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchAI(searchTerm);
      setResults(data.results || []);
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      setError('Neural search query timed out or failed to connect.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 280);

    return () => clearTimeout(handler);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(2, 8, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        zIndex: 9999,
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'linear-gradient(180deg, rgba(6, 20, 38, 0.98) 0%, rgba(2, 9, 20, 0.98) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '18px 22px',
            borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
            gap: '14px',
          }}
        >
          <Search size={22} color="#00f2fe" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI tools (e.g. 'AI video generator', 'Cursor', 'Voice')..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
            }}
          />
          {loading && <Loader2 size={18} className="animate-spin" color="#00f2fe" />}
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Suggestions chips */}
        <div
          style={{
            padding: '12px 22px',
            background: 'rgba(2, 10, 24, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Suggestions:
          </span>
          {suggestions.slice(0, 5).map((sugg, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sugg);
                performSearch(sugg);
              }}
              style={{
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                color: '#67e8f9',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 242, 254, 0.2)';
                e.currentTarget.style.borderColor = '#00f2fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.25)';
              }}
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {error && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && query.trim() && results.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>No neural tools found</h4>
              <p style={{ fontSize: '0.88rem' }}>
                We couldn't find matching models or tools for "<span style={{ color: '#00f2fe' }}>{query}</span>".
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                Found {results.length} matching AI tools
              </div>
              {results.map((tool) => (
                <div
                  key={tool._id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: 'rgba(8, 24, 46, 0.5)',
                    border: '1px solid rgba(0, 242, 254, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(12, 36, 68, 0.8)';
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(8, 24, 46, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.12)';
                    e.currentTarget.style.transform = 'translateX(0px)';
                  }}
                  onClick={() => {
                    onClose();
                    navigate(`/tools/${tool._id}`);
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.02rem', fontFamily: 'var(--font-heading)' }}>
                        {tool.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(157, 78, 221, 0.2)',
                          color: '#c084fc',
                          border: '1px solid rgba(157, 78, 221, 0.4)',
                        }}
                      >
                        {tool.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(0, 242, 254, 0.15)',
                          color: '#00f2fe',
                        }}
                      >
                        {tool.pricing}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.4, margin: 0 }}>
                      {tool.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.82rem' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span>{tool.rating}</span>
                    </div>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        color: '#00f2fe',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!query && (
            <div style={{ padding: '24px 0', textAlign: 'center', color: '#64748b' }}>
              <Sparkles size={24} color="#00f2fe" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: '0.88rem' }}>Type to search 100+ neural tools, frameworks, and tracks...</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '12px 22px',
            background: 'rgba(2, 6, 16, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          <span>Press ESC or click outside to dismiss</span>
          <span>Connected to AI Nexus Core API</span>
        </div>
      </div>
    </div>
  );
}
