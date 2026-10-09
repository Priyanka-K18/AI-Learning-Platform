import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLearning } from '../services/api';
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Play,
  Tv,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import Footer from '../components/footer/Footer';
import CourseLearningWorkspace from '../components/learning/CourseLearningWorkspace';
import VideoModal from '../components/learning/VideoModal';

export default function LearnPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // If a specific course ID is in the route (/learn/:id), render the full interactive workspace
  if (id) {
    return <CourseLearningWorkspace />;
  }

  // Otherwise, render the Master Tracks Catalog with quick tutorial watching
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');

  // Video preview modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    course: null,
    module: null,
    moduleIndex: 0,
  });

  useEffect(() => {
    setLoading(true);
    fetchLearning()
      .then((data) => {
        setTracks(data || []);
      })
      .catch((err) => console.error('Failed to fetch learning tracks:', err))
      .finally(() => setLoading(false));
  }, []);

  const openVideoModal = (course, module, moduleIndex, e) => {
    e.stopPropagation();
    setModalState({
      isOpen: true,
      course,
      module,
      moduleIndex,
    });
  };

  const closeVideoModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Categories list
  const categories = [
    'All',
    'AI Agents',
    'AI Coding',
    'Generative UI',
    'AI Image Generation',
    'AI Video Creation',
    'AI Automation',
    'AI Research',
    'AI UI/UX',
  ];

  // Levels list
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filtered tracks
  const filteredTracks = tracks.filter((track) => {
    const matchesCategory =
      activeCategory === 'All' ||
      track.category?.toLowerCase().includes(activeCategory.toLowerCase()) ||
      track.title?.toLowerCase().includes(activeCategory.toLowerCase());

    const matchesLevel =
      activeLevel === 'All' ||
      track.level?.toLowerCase() === activeLevel.toLowerCase() ||
      track.level === 'All Levels';

    return matchesCategory && matchesLevel;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        {/* Header Section */}
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
            <BookOpen size={14} />
            <span>Curated Interactive Tracks</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.2rem, 3.8vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            Learn AI & Autonomous Systems
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '680px', lineHeight: 1.6 }}>
            Step-by-step interactive tracks engineered to take you from foundational concepts to building
            production multi-agent systems, generative UI apps, and autonomous workflows.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '36px',
            background: 'rgba(8, 24, 46, 0.4)',
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(0, 242, 254, 0.15)',
          }}
        >
          {/* Domain Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>
              Domain:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    activeCategory === cat ? 'linear-gradient(90deg, #00f2fe, #3b82f6)' : 'rgba(2, 8, 18, 0.6)',
                  color: activeCategory === cat ? '#020812' : '#94a3b8',
                  border: activeCategory === cat ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  fontWeight: activeCategory === cat ? 700 : 500,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginRight: '6px' }}>
              Skill Level:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background:
                    activeLevel === lvl ? 'rgba(157, 78, 221, 0.25)' : 'rgba(2, 8, 18, 0.4)',
                  color: activeLevel === lvl ? '#c084fc' : '#64748b',
                  border: activeLevel === lvl ? '1px solid #9d4edd' : '1px solid rgba(255, 255, 255, 0.05)',
                  fontWeight: activeLevel === lvl ? 600 : 400,
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Master Tracks Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(0, 242, 254, 0.2)',
                borderTopColor: '#00f2fe',
                borderRadius: '50%',
                margin: '0 auto 16px auto',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>Loading curriculum tracks...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredTracks.map((track) => (
              <div
                key={track._id}
                style={{
                  background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.75) 0%, rgba(3, 12, 26, 0.85) 100%)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '20px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00f2fe';
                  e.currentTarget.style.boxShadow =
                    '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 242, 254, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.25)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6)';
                }}
              >
                <div>
                  {/* Top Badges & Rating */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                        {track.level}
                      </span>
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
                        {track.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem' }}>
                      <Star size={14} fill="#fbbf24" />
                      <span>{track.rating}</span>
                    </div>
                  </div>

                  {/* Course Title */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '10px',
                      lineHeight: 1.3,
                    }}
                  >
                    {track.title}
                  </h2>

                  {/* Course Description */}
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55, marginBottom: '20px' }}>
                    {track.description}
                  </p>

                  {/* Curriculum Modules with Watch Tutorial ▶ Button */}
                  <div
                    style={{
                      background: 'rgba(2, 8, 18, 0.75)',
                      borderRadius: '14px',
                      padding: '16px',
                      marginBottom: '22px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <h4
                        style={{
                          color: '#67e8f9',
                          fontSize: '0.78rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          margin: 0,
                        }}
                      >
                        Curriculum Modules ({track.modules?.length || 0}):
                      </h4>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Includes YouTube Video</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {track.modules?.map((mod, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            fontSize: '0.83rem',
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.72rem',
                                color: '#00f2fe',
                                opacity: 0.8,
                              }}
                            >
                              0{idx + 1}
                            </span>
                            <span
                              style={{
                                color: '#e2e8f0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {mod.title}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{mod.duration}</span>

                            {/* Watch Tutorial ▶ Button */}
                            <button
                              onClick={(e) => openVideoModal(track, mod, idx, e)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: 'rgba(0, 242, 254, 0.12)',
                                border: '1px solid rgba(0, 242, 254, 0.3)',
                                color: '#00f2fe',
                                fontSize: '0.74rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 242, 254, 0.25)';
                                e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 242, 254, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 242, 254, 0.12)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                              title="Watch YouTube tutorial video for this lesson"
                            >
                              <Play size={10} fill="#00f2fe" />
                              <span>Watch Tutorial ▶</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Metadata and Start Learning Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '18px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      {track.duration}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={13} />
                      {track.studentsCount} builders
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/learn/${track._id}`)}
                    className="cyber-btn-primary"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Start Learning</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Video Player Modal */}
      <VideoModal
        isOpen={modalState.isOpen}
        onClose={closeVideoModal}
        course={modalState.course}
        module={modalState.module}
        moduleIndex={modalState.moduleIndex}
      />

      <Footer />
    </div>
  );
}
