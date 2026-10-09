import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchTools, fetchCategories, bookmarkTool, reportTool, searchWithGemini } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Star,
  ExternalLink,
  Bookmark,
  Filter,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Flag,
  AlertTriangle,
  Check,
  ChevronDown,
  Monitor,
  Code2,
  Loader2,
  X,
  Zap,
} from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('all');
  const [openSourceOnly, setOpenSourceOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [visibleCount, setVisibleCount] = useState(30);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'recently-verified'

  // Report Modal state
  const [reportingTool, setReportingTool] = useState(null);
  const [reportReason, setReportReason] = useState('Broken link');
  const [reportComment, setReportComment] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Gemini AI Search state
  const [isGeminiActive, setIsGeminiActive] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [geminiSummary, setGeminiSummary] = useState('');
  const [geminiModel, setGeminiModel] = useState('');
  const [geminiActiveQuery, setGeminiActiveQuery] = useState('');

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
    if (isGeminiActive) return; // Don't wipe Gemini search results
    fetchTools({
      category: selectedCategory,
      pricing: selectedPricing,
      search: search || undefined,
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setTools(data);
        } else if (data?.tools) {
          setTools(data.tools);
        }
      })
      .catch(console.error);
  }, [selectedCategory, selectedPricing, search, isGeminiActive]);

  const executeGeminiSearch = async (customQ) => {
    const targetQuery = customQ !== undefined ? customQ : search;
    if (!targetQuery.trim()) return;
    setGeminiLoading(true);
    try {
      const data = await searchWithGemini(targetQuery);
      if (data.results && data.results.length > 0) {
        setTools(data.results);
      }
      setGeminiSummary(data.summary || '');
      setGeminiModel(data.modelUsed || 'Gemini 3.5 Flash');
      setGeminiActiveQuery(targetQuery);
      setIsGeminiActive(true);
    } catch (err) {
      console.error('Gemini search failed:', err);
    } finally {
      setGeminiLoading(false);
    }
  };

  const handleClearGemini = () => {
    setIsGeminiActive(false);
    setGeminiSummary('');
    setGeminiActiveQuery('');
    fetchTools({
      category: selectedCategory,
      pricing: selectedPricing,
      search: search || undefined,
    }).then((data) => {
      if (Array.isArray(data)) setTools(data);
      else if (data?.tools) setTools(data.tools);
    });
  };

  useEffect(() => {
    if (user?.savedTools) {
      setBookmarkedIds(new Set(user.savedTools.map((t) => (typeof t === 'string' ? t : t._id))));
    }
  }, [user]);

  // Client-side composite filtering for instant response
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      if (selectedSkillLevel !== 'all' && tool.skillLevel && tool.skillLevel !== selectedSkillLevel) {
        return false;
      }
      if (openSourceOnly && !tool.isOpenSource) {
        return false;
      }
      if (activeTab === 'recently-verified' && !tool.verified) {
        return false;
      }
      return true;
    });
  }, [tools, selectedSkillLevel, openSourceOnly, activeTab]);

  const displayedTools = useMemo(() => {
    return filteredTools.slice(0, visibleCount);
  }, [filteredTools, visibleCount]);

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

  const handleOpenReport = (e, tool) => {
    e.stopPropagation();
    setReportingTool(tool);
    setReportReason('Broken link');
    setReportComment('');
    setReportSuccess(false);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportingTool) return;
    try {
      await reportTool(reportingTool._id, { reason: reportReason, comment: reportComment });
      setReportSuccess(true);
      setTimeout(() => {
        setReportingTool(null);
        setReportSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Compute total counts
  const totalDistinctTools = tools.length;

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
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
            <span>Neural Radar • {totalDistinctTools > 0 ? `${totalDistinctTools} Frontier AI Tools` : '360+ AI Systems'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                Frontier AI Tools Directory
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '680px', margin: 0 }}>
                Explore 360+ hand-curated and verified AI systems for development, video synthesis, reasoning, voice cloning, autonomous agents, and science.
              </p>
            </div>

            {/* View tabs: All vs Recently Verified */}
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: activeTab === 'all' ? 'rgba(0, 242, 254, 0.2)' : 'transparent',
                  color: activeTab === 'all' ? '#00f2fe' : '#94a3b8',
                  border: 'none',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                All Tools ({totalDistinctTools})
              </button>
              <button
                onClick={() => setActiveTab('recently-verified')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: activeTab === 'recently-verified' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                  color: activeTab === 'recently-verified' ? '#34d399' : '#94a3b8',
                  border: 'none',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>Recently Verified</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            background: 'rgba(8, 22, 42, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '18px',
            padding: '18px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Search box with Gemini AI Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '300px' }}>
            <Search size={18} color="#00f2fe" />
            <input
              type="text"
              placeholder="Search 360+ AI tools (e.g. Cursor, Runway, ElevenLabs)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && search.trim()) {
                  executeGeminiSearch();
                }
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
            {search && !geminiLoading && (
              <button
                onClick={() => {
                  setSearch('');
                  if (isGeminiActive) handleClearGemini();
                }}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => executeGeminiSearch()}
              disabled={geminiLoading || !search.trim()}
              title="Search with Gemini AI"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '10px',
                background: search.trim()
                  ? 'linear-gradient(135deg, #9d4edd 0%, #00f2fe 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: search.trim() ? '#fff' : '#64748b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: search.trim() ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: search.trim() ? '0 0 15px rgba(157, 78, 221, 0.4)' : 'none',
              }}
            >
              {geminiLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              <span>Ask Gemini</span>
            </button>
          </div>

          {/* Pricing filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Pricing:</span>
            <select
              value={selectedPricing}
              onChange={(e) => setSelectedPricing(e.target.value)}
              style={{
                background: '#041021',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            >
              <option value="all">All Models</option>
              <option value="Free">Free</option>
              <option value="Freemium">Freemium</option>
              <option value="Paid">Paid</option>
              <option value="Open Source">Open Source</option>
              <option value="Verify on official website">Verify on website</option>
            </select>
          </div>

          {/* Skill Level filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Skill:</span>
            <select
              value={selectedSkillLevel}
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
              style={{
                background: '#041021',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '8px',
                color: '#fff',
                padding: '6px 12px',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Open source toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <input
              type="checkbox"
              checked={openSourceOnly}
              onChange={(e) => setOpenSourceOnly(e.target.checked)}
              style={{ accentColor: '#00f2fe' }}
            />
            <span>Open Source Only</span>
          </label>
        </div>

        {/* Category Pills with verified tool counts */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            marginBottom: '28px',
            scrollbarWidth: 'thin',
          }}
        >
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchParams({});
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === 'all' ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === 'all' ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === 'all' ? '#00f2fe' : '#94a3b8',
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-heading)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>All Categories</span>
            <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({totalDistinctTools})</span>
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat._id || cat.name}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSearchParams({ category: cat.name });
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: isSelected ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isSelected ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#00f2fe' : '#94a3b8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-heading)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{cat.name}</span>
                {cat.toolCount !== undefined && (
                  <span
                    style={{
                      fontSize: '0.74rem',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                      color: isSelected ? '#fff' : '#64748b',
                    }}
                  >
                    {cat.toolCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gemini AI Recommendation Banner */}
        {isGeminiActive && geminiSummary && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.18) 0%, rgba(0, 242, 254, 0.12) 100%)',
              border: '1px solid rgba(157, 78, 221, 0.45)',
              borderRadius: '18px',
              padding: '18px 22px',
              marginBottom: '24px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #9d4edd 0%, #00f2fe 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={17} color="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#f3e8ff', fontSize: '1rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                    Gemini AI Analysis: &ldquo;{geminiActiveQuery}&rdquo;
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#c084fc' }}>
                    Powered by Google {geminiModel} • Intelligently ranked
                  </span>
                </div>
              </div>

              <button
                onClick={handleClearGemini}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <X size={14} />
                <span>Reset to All Tools</span>
              </button>
            </div>

            <p style={{ color: '#e2e8f0', fontSize: '0.94rem', lineHeight: 1.55, margin: 0 }}>
              {geminiSummary}
            </p>
          </div>
        )}

        {/* Results summary counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#94a3b8', fontSize: '0.88rem' }}>
          <div>
            Showing <strong style={{ color: '#00f2fe' }}>{displayedTools.length}</strong> of{' '}
            <strong style={{ color: '#fff' }}>{filteredTools.length}</strong> AI Tools
            {isGeminiActive && <span style={{ color: '#c084fc', marginLeft: '6px' }}>(✨ Gemini Matched)</span>}
            {selectedCategory !== 'all' && <span> in <strong style={{ color: '#00f2fe' }}>{selectedCategory}</strong></span>}
          </div>
          {filteredTools.length > displayedTools.length && (
            <button
              onClick={() => setVisibleCount(filteredTools.length)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00f2fe',
                cursor: 'pointer',
                fontSize: '0.82rem',
                textDecoration: 'underline',
              }}
            >
              Show all {filteredTools.length} tools
            </button>
          )}
        </div>

        {/* Tools Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '22px' }}>
          {displayedTools.map((tool) => {
            const isSaved = bookmarkedIds.has(tool._id);
            const initials = tool.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={tool._id}
                onClick={() => navigate(`/tools/${tool._id}`)}
                style={{
                  background: 'rgba(8, 22, 42, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(0, 242, 254, 0.15)',
                  borderRadius: '20px',
                  padding: '22px',
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
                  {/* Top card row: Category, subcategory, verified, bookmark, report */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          background: 'rgba(0, 242, 254, 0.1)',
                          color: '#00f2fe',
                          border: '1px solid rgba(0, 242, 254, 0.25)',
                        }}
                      >
                        {tool.category}
                      </span>
                      {tool.subcategory && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 7px',
                            borderRadius: '8px',
                            background: 'rgba(56, 189, 248, 0.08)',
                            color: '#7dd3fc',
                          }}
                        >
                          {tool.subcategory}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        title="Report unavailable or broken link"
                        onClick={(e) => handleOpenReport(e, tool)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '6px',
                          padding: '5px',
                          color: '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        <Flag size={13} />
                      </button>

                      <button
                        title={isSaved ? 'Saved to bookmarks' : 'Bookmark tool'}
                        onClick={(e) => handleBookmark(e, tool._id)}
                        style={{
                          background: isSaved ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          border: isSaved ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '5px',
                          color: isSaved ? '#00f2fe' : '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        <Bookmark size={14} fill={isSaved ? '#00f2fe' : 'none'} />
                      </button>
                    </div>
                  </div>

                  {/* Header: Avatar/Logo + Tool Name + Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(168, 85, 247, 0.25) 100%)',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00f2fe',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.25rem',
                            fontWeight: 700,
                            color: '#fff',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {tool.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.82rem', flexShrink: 0 }}>
                          <Star size={13} fill="#fbbf24" />
                          <span>{tool.rating || 4.8}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gemini Rationale Badge */}
                  {tool.geminiRationale && (
                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.16) 0%, rgba(0, 242, 254, 0.08) 100%)',
                        border: '1px solid rgba(157, 78, 221, 0.35)',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        marginBottom: '12px',
                        fontSize: '0.82rem',
                        color: '#f3e8ff',
                        lineHeight: 1.45,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#c084fc', fontWeight: 700, marginBottom: '2px', fontSize: '0.74rem' }}>
                        <Sparkles size={12} />
                        <span>WHY GEMINI RECOMMENDS THIS</span>
                      </div>
                      {tool.geminiRationale}
                    </div>
                  )}

                  {/* Description */}
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      height: '3.9em',
                    }}
                  >
                    {tool.description}
                  </p>

                  {/* Features tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                    {tool.features?.slice(0, 3).map((feat, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                    {tool.isOpenSource && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: '#34d399',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                        }}
                      >
                        Open Source
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer: Pricing & Launch link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {tool.pricing}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Details</span>
                    <a
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.82rem',
                        color: '#00f2fe',
                        textDecoration: 'none',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: 'rgba(0, 242, 254, 0.08)',
                      }}
                    >
                      <span>Launch</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {filteredTools.length > displayedTools.length && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={() => setVisibleCount((prev) => prev + 30)}
              className="cyber-btn-secondary"
              style={{ padding: '12px 32px', fontSize: '0.95rem' }}
            >
              <span>Load More AI Tools ({filteredTools.length - displayedTools.length} remaining)</span>
              <ChevronDown size={16} />
            </button>
          </div>
        )}

        {/* Reporting Modal */}
        {reportingTool && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div
              style={{
                background: '#041021',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                borderRadius: '20px',
                padding: '28px',
                maxWidth: '460px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <AlertTriangle size={20} color="#f87171" />
                <h3 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Report {reportingTool.name}
                </h3>
              </div>

              {reportSuccess ? (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                  }}
                >
                  <Check size={20} style={{ margin: '0 auto 8px auto' }} />
                  <div>Thank you. Report received for re-verification.</div>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '6px' }}>
                      Reason:
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#020812',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '9px',
                        outline: 'none',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="Broken link">Broken link / 404</option>
                      <option value="Tool unavailable">Tool unavailable or shut down</option>
                      <option value="Outdated pricing">Pricing model changed</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '18px' }}>
                    <textarea
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      placeholder="Optional notes for verifier..."
                      rows={3}
                      style={{
                        width: '100%',
                        background: '#020812',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '10px',
                        outline: 'none',
                        fontSize: '0.85rem',
                        resize: 'none',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setReportingTool(null)}
                      style={{
                        padding: '8px 14px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#94a3b8',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cyber-btn-primary"
                      style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
