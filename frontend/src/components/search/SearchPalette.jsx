import React, { useState, useEffect, useRef } from 'react';
import { searchAI, searchWithGemini } from '../../services/api';
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  Star,
  ArrowRight,
  Loader2,
  Cpu,
  Zap,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SearchPalette({ isOpen, onClose, initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [isGeminiMode, setIsGeminiMode] = useState(true);
  const [results, setResults] = useState([]);
  const [geminiSummary, setGeminiSummary] = useState('');
  const [modelUsed, setModelUsed] = useState('Gemini 3.5 Flash');
  const [relatedQueries, setRelatedQueries] = useState([]);
  const [suggestions, setSuggestions] = useState([
    'Best AI video generator for cinematic scenes',
    'AI coding assistants for React and Node.js',
    'Free voice cloning and speech synthesis',
    'Tools for generating 3D models and game assets',
    'Open source alternatives to Midjourney',
    'Autonomous AI research agents',
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
        if (isGeminiMode) {
          performGeminiSearch(initialQuery);
        } else {
          performSearch(initialQuery);
        }
      }
    }
  }, [isOpen, initialQuery]);

  const performSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setGeminiSummary('');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchAI(searchTerm);
      setResults(data.results || []);
      setGeminiSummary('');
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      setError('Search query timed out or failed to connect.');
    } finally {
      setLoading(false);
    }
  };

  const performGeminiSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setResults([]);
      setGeminiSummary('');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchWithGemini(searchTerm);
      setResults(data.results || []);
      setGeminiSummary(data.summary || '');
      if (data.modelUsed) setModelUsed(data.modelUsed);
      if (data.relatedQueries && data.relatedQueries.length > 0) {
        setRelatedQueries(data.relatedQueries);
      }
    } catch (err) {
      console.warn('Gemini search failed, falling back to standard search:', err.message);
      // Fallback to standard search if Gemini network error
      performSearch(searchTerm);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search for standard mode; for Gemini mode, trigger on Enter or debounce slightly longer
  useEffect(() => {
    if (!isGeminiMode) {
      const handler = setTimeout(() => {
        if (query.trim()) {
          performSearch(query);
        } else {
          setResults([]);
          setGeminiSummary('');
        }
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [query, isGeminiMode]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      if (isGeminiMode) {
        performGeminiSearch(query);
      } else {
        performSearch(query);
      }
    }
  };

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
        paddingTop: '65px',
        zIndex: 9999,
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '740px',
          background: 'linear-gradient(180deg, rgba(8, 22, 44, 0.98) 0%, rgba(2, 9, 20, 0.98) 100%)',
          border: isGeminiMode ? '1px solid rgba(157, 78, 221, 0.5)' : '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '22px',
          boxShadow: isGeminiMode
            ? '0 30px 90px rgba(0, 0, 0, 0.95), 0 0 40px rgba(157, 78, 221, 0.3), 0 0 60px rgba(0, 242, 254, 0.2)'
            : '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Mode Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 22px',
            background: 'rgba(3, 12, 28, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                setIsGeminiMode(true);
                if (query.trim()) performGeminiSearch(query);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '12px',
                border: isGeminiMode ? '1px solid rgba(157, 78, 221, 0.6)' : '1px solid transparent',
                background: isGeminiMode
                  ? 'linear-gradient(135deg, rgba(157, 78, 221, 0.25) 0%, rgba(0, 242, 254, 0.15) 100%)'
                  : 'transparent',
                color: isGeminiMode ? '#e9d5ff' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={14} color={isGeminiMode ? '#c084fc' : '#94a3b8'} />
              <span>Gemini AI Search</span>
              {isGeminiMode && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.4)',
                    color: '#f3e8ff',
                    fontWeight: 700,
                  }}
                >
                  LIVE
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setIsGeminiMode(false);
                if (query.trim()) performSearch(query);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '12px',
                border: !isGeminiMode ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid transparent',
                background: !isGeminiMode ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                color: !isGeminiMode ? '#00f2fe' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Search size={13} color={!isGeminiMode ? '#00f2fe' : '#94a3b8'} />
              <span>Keyword Search</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span>{isGeminiMode ? modelUsed : 'Database'} Connected</span>
          </div>
        </div>

        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            gap: '14px',
          }}
        >
          {isGeminiMode ? (
            <Sparkles size={22} color="#c084fc" />
          ) : (
            <Search size={22} color="#00f2fe" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isGeminiMode
                ? "Ask Gemini anything (e.g. 'best free tool to clone voice and make anime soundtracks')..."
                : "Search AI tools by name, tag or category..."
            }
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

          {loading && <Loader2 size={18} className="animate-spin" color={isGeminiMode ? '#c084fc' : '#00f2fe'} />}

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setGeminiSummary('');
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}

          {isGeminiMode && (
            <button
              onClick={() => performGeminiSearch(query)}
              disabled={loading || !query.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: query.trim()
                  ? 'linear-gradient(135deg, #9d4edd 0%, #00f2fe 100%)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: query.trim() ? '#fff' : '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: query.trim() ? 'pointer' : 'not-allowed',
                boxShadow: query.trim() ? '0 0 15px rgba(157, 78, 221, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={14} />
              <span>Ask Gemini</span>
            </button>
          )}
        </div>

        {/* Suggestions chips */}
        <div
          style={{
            padding: '10px 22px',
            background: 'rgba(2, 10, 24, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <span
            style={{
              fontSize: '0.74rem',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            {isGeminiMode ? '✨ Try asking:' : 'Suggestions:'}
          </span>
          {suggestions.slice(0, 4).map((sugg, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(sugg);
                if (isGeminiMode) {
                  performGeminiSearch(sugg);
                } else {
                  performSearch(sugg);
                }
              }}
              style={{
                background: isGeminiMode ? 'rgba(157, 78, 221, 0.12)' : 'rgba(0, 242, 254, 0.08)',
                border: isGeminiMode
                  ? '1px solid rgba(157, 78, 221, 0.3)'
                  : '1px solid rgba(0, 242, 254, 0.25)',
                color: isGeminiMode ? '#d8b4fe' : '#67e8f9',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isGeminiMode
                  ? 'rgba(157, 78, 221, 0.25)'
                  : 'rgba(0, 242, 254, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isGeminiMode
                  ? 'rgba(157, 78, 221, 0.12)'
                  : 'rgba(0, 242, 254, 0.08)';
              }}
            >
              {sugg}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div style={{ maxHeight: '460px', overflowY: 'auto', padding: '16px 20px' }}>
          {error && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#f87171' }}>
              <p>{error}</p>
            </div>
          )}

          {/* Gemini AI Synthesis Card */}
          {geminiSummary && !loading && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(0, 242, 254, 0.1) 100%)',
                border: '1px solid rgba(157, 78, 221, 0.35)',
                borderRadius: '16px',
                padding: '16px 20px',
                marginBottom: '16px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #9d4edd 0%, #00f2fe 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={14} color="#fff" />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: '#f3e8ff',
                    }}
                  >
                    Gemini Neural Synthesis
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.25)',
                    color: '#c084fc',
                    border: '1px solid rgba(157, 78, 221, 0.4)',
                  }}
                >
                  {modelUsed}
                </span>
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '0.92rem', lineHeight: 1.55, margin: 0 }}>
                {geminiSummary}
              </p>
            </div>
          )}

          {!loading && !error && query.trim() && results.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '4px' }}>No tools found</h4>
              <p style={{ fontSize: '0.88rem' }}>
                We couldn't find matching models or tools for "<span style={{ color: '#00f2fe' }}>{query}</span>".
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div
                style={{
                  fontSize: '0.76rem',
                  color: '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '2px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Recommended AI Tools ({results.length})</span>
                {isGeminiMode && <span style={{ color: '#c084fc' }}>Ranked by Gemini AI</span>}
              </div>

              {results.map((tool) => (
                <div
                  key={tool._id || tool.name}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: tool.isGeminiRecommended
                      ? 'rgba(16, 28, 54, 0.65)'
                      : 'rgba(8, 24, 46, 0.5)',
                    border: tool.isGeminiRecommended
                      ? '1px solid rgba(157, 78, 221, 0.28)'
                      : '1px solid rgba(0, 242, 254, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(14, 38, 72, 0.85)';
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.45)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = tool.isGeminiRecommended
                      ? 'rgba(16, 28, 54, 0.65)'
                      : 'rgba(8, 24, 46, 0.5)';
                    e.currentTarget.style.borderColor = tool.isGeminiRecommended
                      ? '1px solid rgba(157, 78, 221, 0.28)'
                      : 'rgba(0, 242, 254, 0.12)';
                    e.currentTarget.style.transform = 'translateX(0px)';
                  }}
                  onClick={() => {
                    onClose();
                    if (tool._id && !tool._id.startsWith('gemini-')) {
                      navigate(`/tools/${tool._id}`);
                    } else if (tool.website) {
                      window.open(tool.website, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#fff',
                          fontSize: '1.02rem',
                          fontFamily: 'var(--font-heading)',
                        }}
                      >
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
                        {tool.pricing || 'Freemium'}
                      </span>
                      {tool.isGeminiRecommended && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.3) 0%, rgba(0, 242, 254, 0.3) 100%)',
                            color: '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Sparkles size={11} /> Top AI Pick
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {tool.rating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.82rem' }}>
                          <Star size={13} fill="#fbbf24" />
                          <span>{tool.rating}</span>
                        </div>
                      )}
                      <ArrowRight size={15} color="#00f2fe" />
                    </div>
                  </div>

                  {/* Gemini Rationale or Description */}
                  {tool.geminiRationale ? (
                    <div
                      style={{
                        fontSize: '0.84rem',
                        color: '#cbd5e1',
                        background: 'rgba(2, 8, 20, 0.4)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        borderLeft: '3px solid #c084fc',
                        lineHeight: 1.45,
                      }}
                    >
                      <span style={{ color: '#c084fc', fontWeight: 600, marginRight: '6px' }}>
                        💡 Why Gemini recommends this:
                      </span>
                      {tool.geminiRationale}
                    </div>
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.4, margin: 0 }}>
                      {tool.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Related Queries */}
          {relatedQueries.length > 0 && !loading && (
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                Related Searches (by Gemini):
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {relatedQueries.map((rq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(rq);
                      performGeminiSearch(rq);
                    }}
                    style={{
                      background: 'rgba(157, 78, 221, 0.08)',
                      border: '1px solid rgba(157, 78, 221, 0.25)',
                      color: '#c084fc',
                      padding: '4px 12px',
                      borderRadius: '14px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    {rq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query && (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Sparkles size={22} color="#c084fc" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '4px' }}>
                {isGeminiMode ? 'Gemini AI Search Ready' : 'Global Neural Search'}
              </h4>
              <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
                {isGeminiMode
                  ? 'Ask anything in plain language — Gemini analyzes 360+ AI systems to find the perfect tools for your task.'
                  : 'Search by keyword across all models, roadmaps, and open source tools.'}
              </p>
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
          <span>Press Enter to search • ESC to dismiss</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={12} color="#c084fc" />
            <span>Powered by Google Gemini</span>
          </span>
        </div>
      </div>
    </div>
  );
}
