import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchOpenSourceRepos,
  fetchOpenSourceStats,
  fetchOpenSourceRepoById,
} from '../services/api';
import {
  Code,
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Layers,
  Shield,
  Clock,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Terminal,
  Zap,
  Globe,
  SlidersHorizontal,
  Flame,
  ArrowUpDown,
} from 'lucide-react';

const Github = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
import Footer from '../components/footer/Footer';
import RepoLearningModal from '../components/opensource/RepoLearningModal';

export default function OpenSourcePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repos, setRepos] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [beginnerFriendlyOnly, setBeginnerFriendlyOnly] = useState(false);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortBy, setSortBy] = useState('stars'); // 'stars' | 'alpha' | 'recent' | 'difficulty'

  // Bookmarking state from localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_bookmarked_repos');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal state
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load repositories and stats
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchOpenSourceRepos({ limit: 100 }),
      fetchOpenSourceStats().catch(() => null),
    ])
      .then(([reposData, statsData]) => {
        const repoList = reposData?.repos || reposData || [];
        setRepos(repoList);
        setStats(statsData);

        // If ID in route, open that repo in modal
        if (id) {
          const matched = repoList.find(
            (r) => r._id === id || r.repoName === id || r.name.toLowerCase() === id.toLowerCase()
          );
          if (matched) {
            setSelectedRepo(matched);
            setIsModalOpen(true);
          } else {
            fetchOpenSourceRepoById(id).then((r) => {
              if (r) {
                setSelectedRepo(r);
                setIsModalOpen(true);
              }
            });
          }
        }
      })
      .catch((err) => console.error('Failed to load open source projects:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Toggle bookmark handler
  const handleToggleBookmark = (repo) => {
    const key = repo._id || repo.repoName;
    let updated;
    if (bookmarkedIds.includes(key)) {
      updated = bookmarkedIds.filter((item) => item !== key);
    } else {
      updated = [...bookmarkedIds, key];
    }
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('nexus_bookmarked_repos', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save bookmarks to localStorage', e);
    }
  };

  const handleOpenRepo = (repo) => {
    setSelectedRepo(repo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (id) {
      navigate('/open-source', { replace: true });
    }
  };

  // Categories list
  const categories = [
    'All',
    'Frontend Design & UI/UX',
    'Animation & 3D',
    'Frontend Frameworks',
    'Backend Development',
    'Full-Stack Projects',
    'AI & Machine Learning',
    'Developer Tools & DevOps',
    'Mobile App Development',
  ];

  // Languages list
  const languages = ['All', 'TypeScript', 'JavaScript', 'Python', 'Go', 'Dart', 'ClojureScript', 'PHP'];

  // Difficulties
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Client-side filtering & sorting
  const filteredRepos = repos.filter((repo) => {
    const repoKey = repo._id || repo.repoName;

    if (showBookmarksOnly && !bookmarkedIds.includes(repoKey)) {
      return false;
    }

    if (selectedCategory !== 'All' && repo.category !== selectedCategory) {
      return false;
    }

    if (selectedLanguage !== 'All' && repo.language?.toLowerCase() !== selectedLanguage.toLowerCase()) {
      return false;
    }

    if (selectedDifficulty !== 'All' && repo.difficulty !== selectedDifficulty) {
      return false;
    }

    if (beginnerFriendlyOnly && !repo.isBeginnerFriendly) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = repo.name?.toLowerCase().includes(q);
      const matchDesc = repo.description?.toLowerCase().includes(q);
      const matchOwner = repo.repoOwner?.toLowerCase().includes(q);
      const matchTech = repo.techStack?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchOwner && !matchTech) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') {
      return (b.stars || 0) - (a.stars || 0);
    }
    if (sortBy === 'alpha') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'difficulty') {
      const diffOrder = { Beginner: 1, Intermediate: 2, Advanced: 3, 'All Levels': 1 };
      return (diffOrder[a.difficulty] || 2) - (diffOrder[b.difficulty] || 2);
    }
    return 0;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        {/* Header HUD Banner */}
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
              marginBottom: '14px',
            }}
          >
            <Github size={14} />
            <span>Open-Source Learning Hub</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Explore Frontier Open-Source Architectures
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '720px', lineHeight: 1.6 }}>
            A curated directory of real, world-class GitHub repositories across frontend design, animation,
            modern frameworks, backend microservices, full-stack SaaS, and AI engineering. Dissect the code,
            follow guided roadmaps, and build production apps.
          </p>

          {/* Metrics Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginTop: '28px',
            }}
          >
            {[
              { label: 'Curated Repositories', value: `${stats?.total || repos.length || 27}+`, icon: Code, color: '#00f2fe' },
              { label: 'Engineering Domains', value: '8 Disciplines', icon: Layers, color: '#c084fc' },
              { label: 'Total Stars Tracked', value: '1.2M+ ⭐', icon: Star, color: '#fbbf24' },
              { label: 'Beginner-Friendly Kits', value: `${stats?.difficultyCounts?.Beginner || 6} Starters`, icon: Zap, color: '#10b981' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.6) 0%, rgba(3, 12, 26, 0.75) 100%)',
                    border: '1px solid rgba(0, 242, 254, 0.18)',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `rgba(${stat.color === '#00f2fe' ? '0, 242, 254' : stat.color === '#c084fc' ? '192, 132, 252' : stat.color === '#fbbf24' ? '251, 191, 36' : '16, 185, 129'}, 0.12)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Panel */}
        <div
          style={{
            background: 'rgba(8, 24, 46, 0.45)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '20px',
            padding: '20px 24px',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Top Search & Sort Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                flex: 1,
                minWidth: '280px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search
                size={18}
                color="#00f2fe"
                style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
              />
              <input
                type="text"
                placeholder="Search repos, libraries, tech stack (e.g. React Bits, FastAPI, Three.js, Docker)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 46px',
                  borderRadius: '12px',
                  background: 'rgba(2, 8, 18, 0.8)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#00f2fe')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(0, 242, 254, 0.25)')}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} color="#94a3b8" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(2, 8, 18, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#e2e8f0',
                  padding: '10px 14px',
                  fontSize: '0.84rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="stars">Most Stars ⭐</option>
                <option value="alpha">Alphabetical (A-Z)</option>
                <option value="difficulty">Difficulty (Beginner First)</option>
              </select>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '10px',
                background: showBookmarksOnly ? 'rgba(251, 191, 36, 0.2)' : 'rgba(2, 8, 18, 0.8)',
                border: showBookmarksOnly ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.12)',
                color: showBookmarksOnly ? '#fbbf24' : '#94a3b8',
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Bookmark size={14} fill={showBookmarksOnly ? '#fbbf24' : 'none'} />
              <span>Bookmarks ({bookmarkedIds.length})</span>
            </button>
          </div>

          {/* Domain Category Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>
              Domain:
            </span>
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? repos.length
                  : stats?.categoryCounts?.[cat] || repos.filter((r) => r.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-heading)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isActive
                      ? 'linear-gradient(90deg, #00f2fe, #3b82f6)'
                      : 'rgba(2, 8, 18, 0.6)',
                    color: isActive ? '#020812' : '#94a3b8',
                    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    fontWeight: isActive ? 700 : 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{cat}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      opacity: 0.8,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Row: Language, Difficulty, Beginner Friendly */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', paddingTop: '6px' }}>
            {/* Language */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Language:
              </span>
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    background: selectedLanguage === lang ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedLanguage === lang ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: selectedLanguage === lang ? '#00f2fe' : '#94a3b8',
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Difficulty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                Difficulty:
              </span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer',
                    background: selectedDifficulty === diff ? 'rgba(157, 78, 221, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedDifficulty === diff ? '1px solid #9d4edd' : '1px solid rgba(255, 255, 255, 0.06)',
                    color: selectedDifficulty === diff ? '#c084fc' : '#94a3b8',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Beginner Friendly Toggle */}
            <button
              onClick={() => setBeginnerFriendlyOnly(!beginnerFriendlyOnly)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '8px',
                background: beginnerFriendlyOnly ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: beginnerFriendlyOnly ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.06)',
                color: beginnerFriendlyOnly ? '#10b981' : '#94a3b8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Zap size={13} />
              <span>Beginner-Friendly Only</span>
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Showing <strong style={{ color: '#00f2fe' }}>{sortedRepos.length}</strong> repositories
            {selectedCategory !== 'All' && <span> in <em>{selectedCategory}</em></span>}
          </div>
        </div>

        {/* Repository Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                border: '3px solid rgba(0, 242, 254, 0.2)',
                borderTopColor: '#00f2fe',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
              Indexing open-source repositories...
            </p>
          </div>
        ) : sortedRepos.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              background: 'rgba(8, 24, 46, 0.3)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Github size={48} color="#64748b" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.3rem', marginBottom: '8px' }}>
              No Repositories Match Your Filters
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
              Try broadening your search term or clearing the selected language/difficulty filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLanguage('All');
                setSelectedDifficulty('All');
                setBeginnerFriendlyOnly(false);
                setShowBookmarksOnly(false);
              }}
              className="cyber-btn-secondary"
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '24px',
            }}
          >
            {sortedRepos.map((repo) => {
              const repoKey = repo._id || repo.repoName;
              const isBookmarked = bookmarkedIds.includes(repoKey);

              return (
                <div
                  key={repoKey}
                  style={{
                    background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.75) 0%, rgba(3, 12, 26, 0.85) 100%)',
                    border: '1px solid rgba(0, 242, 254, 0.22)',
                    borderRadius: '20px',
                    padding: '26px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#00f2fe';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow =
                      '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.22)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6)';
                  }}
                >
                  <div>
                    {/* Top Row: Owner, Category Badge & Bookmark Button */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 9px',
                            borderRadius: '8px',
                            background: 'rgba(0, 242, 254, 0.1)',
                            color: '#00f2fe',
                            border: '1px solid rgba(0, 242, 254, 0.25)',
                          }}
                        >
                          {repo.category}
                        </span>

                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 9px',
                            borderRadius: '8px',
                            background: 'rgba(157, 78, 221, 0.15)',
                            color: '#c084fc',
                            border: '1px solid rgba(157, 78, 221, 0.3)',
                          }}
                        >
                          {repo.difficulty}
                        </span>

                        {repo.isBeginnerFriendly && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '2px 7px',
                              borderRadius: '6px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            Starter
                          </span>
                        )}
                      </div>

                      {/* Bookmark Icon */}
                      <button
                        onClick={() => handleToggleBookmark(repo)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: isBookmarked ? '#fbbf24' : '#64748b',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.2s',
                        }}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
                      >
                        <Star size={16} fill={isBookmarked ? '#fbbf24' : 'none'} />
                      </button>
                    </div>

                    {/* Repo Name & Owner */}
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                        {repo.repoOwner}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.35rem',
                          fontWeight: 700,
                          color: '#fff',
                          margin: '2px 0 0 0',
                          lineHeight: 1.3,
                        }}
                      >
                        {repo.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        marginBottom: '16px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {repo.description}
                    </p>

                    {/* Tech Stack Pills */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                      {repo.techStack?.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '0.75rem',
                            color: '#cbd5e1',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Meta & Buttons */}
                  <div>
                    {/* Stars & License Meta */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: '14px',
                        marginBottom: '14px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                          <Star size={13} fill="#fbbf24" />
                          <span>{repo.stars?.toLocaleString()}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Shield size={12} color="#67e8f9" />
                          <span>{repo.license}</span>
                        </span>
                      </div>

                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        {repo.language}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={repo.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#cbd5e1',
                          fontSize: '0.78rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#fff';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#cbd5e1';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        }}
                        title="Open on GitHub"
                      >
                        <Github size={13} />
                        <span>GitHub</span>
                        <ExternalLink size={10} />
                      </a>

                      {repo.docsUrl && (
                        <a
                          href={repo.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: '#cbd5e1',
                            fontSize: '0.78rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#cbd5e1';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                          }}
                          title="Open official documentation"
                        >
                          <BookOpen size={13} />
                          <span>Docs</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenRepo(repo)}
                        className="cyber-btn-primary"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>Start Learning</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deep Learning Experience Modal */}
      <RepoLearningModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        repo={selectedRepo}
        isBookmarked={
          selectedRepo
            ? bookmarkedIds.includes(selectedRepo._id || selectedRepo.repoName)
            : false
        }
        onToggleBookmark={handleToggleBookmark}
      />

      <Footer />
    </div>
  );
}
