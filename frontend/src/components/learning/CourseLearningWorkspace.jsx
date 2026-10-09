import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  fetchLearningById,
  fetchCourseProgress,
  toggleCourseModule,
} from '../../services/api';
import {
  Play,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Sparkles,
  Tv,
  FileText,
  ListOrdered,
  Link as LinkIcon,
  Award,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import Footer from '../footer/Footer';

export default function CourseLearningWorkspace() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lesson state
  const initialLessonIndex = parseInt(searchParams.get('lesson') || '0', 10);
  const [activeModuleIndex, setActiveModuleIndex] = useState(
    isNaN(initialLessonIndex) ? 0 : initialLessonIndex
  );
  const [completedModules, setCompletedModules] = useState([]);
  const [activeTab, setActiveTab] = useState('objectives'); // 'objectives' | 'notes' | 'resources'
  const [isToggling, setIsToggling] = useState(false);
  const [videoPlaybackError, setVideoPlaybackError] = useState(false);

  // Load Course and User Progress
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    Promise.all([
      fetchLearningById(id),
      fetchCourseProgress(id).catch(() => ({ completedModules: [] })),
    ])
      .then(([courseData, progressData]) => {
        setCourse(courseData);

        // Merge progress from backend with local fallback
        const localKey = `nexus_course_progress_${id}`;
        let localCompleted = [];
        try {
          const cached = localStorage.getItem(localKey);
          if (cached) localCompleted = JSON.parse(cached);
        } catch {
          localCompleted = [];
        }

        const backendCompleted = progressData?.completedModules || [];
        const mergedCompleted = Array.from(
          new Set([...backendCompleted, ...localCompleted])
        );

        setCompletedModules(mergedCompleted);

        // Validate active lesson index against course modules
        const lessonParam = parseInt(searchParams.get('lesson') || '0', 10);
        if (!isNaN(lessonParam) && courseData.modules && lessonParam < courseData.modules.length) {
          setActiveModuleIndex(lessonParam);
        } else {
          setActiveModuleIndex(0);
        }
      })
      .catch((err) => {
        console.error('Failed to load course details:', err);
        setError('Course could not be loaded. Please check your connection or choose another course.');
      })
      .finally(() => setLoading(false));
  }, [id, searchParams]);

  // Handle switching active module
  const handleSelectModule = (index) => {
    setActiveModuleIndex(index);
    setVideoPlaybackError(false);
    setSearchParams({ lesson: index });
  };

  // Toggle Module Completion
  const handleToggleCompletion = async (index) => {
    if (isToggling) return;
    setIsToggling(true);

    const isCurrentlyCompleted = completedModules.includes(index);
    const updated = isCurrentlyCompleted
      ? completedModules.filter((i) => i !== index)
      : [...completedModules, index];

    setCompletedModules(updated);

    // Save to localStorage immediately
    try {
      localStorage.setItem(`nexus_course_progress_${id}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    // Attempt backend sync
    try {
      await toggleCourseModule(id, index);
    } catch (err) {
      console.warn('Backend progress sync failed, preserved in local storage:', err.message);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#020812',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(0, 242, 254, 0.2)',
            borderTopColor: '#00f2fe',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          Initializing Course Learning Environment...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#020812',
          paddingTop: '120px',
          paddingBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <AlertTriangle size={52} color="#f43f5e" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>
          Course Unavailable
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '480px', marginBottom: '24px' }}>
          {error || 'The requested curriculum track could not be found.'}
        </p>
        <button
          onClick={() => navigate('/learn')}
          className="cyber-btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          ← Return to All Courses
        </button>
      </div>
    );
  }

  const modules = course.modules || [];
  const currentModule = modules[activeModuleIndex] || modules[0] || {};
  const isCurrentCompleted = completedModules.includes(activeModuleIndex);
  const totalModules = modules.length;
  const completedCount = completedModules.length;
  const progressPercent = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Video resolution
  const videoId =
    currentModule.videoId ||
    (currentModule.youtubeUrl ? currentModule.youtubeUrl.split('v=')[1]?.split('&')[0] : '') ||
    course.overviewVideoId;

  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`
    : null;

  const directYoutubeUrl =
    currentModule.youtubeUrl ||
    (videoId
      ? `https://www.youtube.com/watch?v=${videoId}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          course.title + ' ' + (currentModule.title || '') + ' tutorial'
        )}`);

  const fallbackSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    course.title + ' ' + (currentModule.title || '') + ' tutorial'
  )}`;

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '88px', color: '#f8fafc' }}>
      {/* Top Banner & Navigation Header */}
      <div
        style={{
          borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
          background: 'linear-gradient(180deg, rgba(6, 21, 34, 0.85) 0%, rgba(2, 8, 18, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          padding: '16px 24px',
          position: 'sticky',
          top: '70px',
          zIndex: 30,
        }}
      >
        <div
          style={{
            maxWidth: '1520px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Left: Back & Course Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/learn')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94a3b8',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.borderColor = '#00f2fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
            >
              <ChevronLeft size={16} />
              <span>Back to Courses</span>
            </button>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(157, 78, 221, 0.18)',
                    color: '#c084fc',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                  }}
                >
                  {course.level}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: '#00f2fe',
                    border: '1px solid rgba(0, 242, 254, 0.25)',
                  }}
                >
                  {course.category}
                </span>
                {course.instructor && (
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    by {course.instructor}
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                }}
              >
                {course.title}
              </h1>
            </div>
          </div>

          {/* Right: Progress Tracker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(2, 8, 18, 0.7)',
              padding: '8px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Progress:{' '}
                <strong style={{ color: '#00f2fe', fontFamily: 'var(--font-mono)' }}>
                  {completedCount} of {totalModules} lessons ({progressPercent}%)
                </strong>
              </div>
              <div
                style={{
                  width: '160px',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginTop: '4px',
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #00f2fe, #9d4edd)',
                    borderRadius: '3px',
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 10px rgba(0, 242, 254, 0.5)',
                  }}
                />
              </div>
            </div>

            {progressPercent === 100 && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <Award size={14} /> Completed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div
        style={{
          maxWidth: '1520px',
          margin: '0 auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: '28px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Video Player & Study Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Video Player Container */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.7) 0%, rgba(3, 12, 26, 0.85) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
            }}
          >
            {/* Player Top Meta Bar */}
            <div
              style={{
                padding: '14px 20px',
                background: 'rgba(2, 8, 18, 0.8)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0, 242, 254, 0.12)',
                    color: '#00f2fe',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  <Play size={12} fill="#00f2fe" />
                  Lesson {activeModuleIndex + 1} of {totalModules}
                </span>

                {currentModule.channelTitle && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#c084fc',
                      fontSize: '0.82rem',
                    }}
                  >
                    <Tv size={13} />
                    {currentModule.channelTitle}
                  </span>
                )}

                {currentModule.duration && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#94a3b8',
                      fontSize: '0.82rem',
                    }}
                  >
                    <Clock size={13} />
                    {currentModule.duration}
                  </span>
                )}
              </div>

              {/* Action Buttons in Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={directYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
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
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => handleToggleCompletion(activeModuleIndex)}
                  disabled={isToggling}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: isCurrentCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 242, 254, 0.12)',
                    border: isCurrentCompleted ? '1px solid #10b981' : '1px solid rgba(0, 242, 254, 0.3)',
                    color: isCurrentCompleted ? '#10b981' : '#00f2fe',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <CheckCircle2 size={14} />
                  <span>{isCurrentCompleted ? 'Completed ✓' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            {/* Responsive 16:9 Aspect Video Player */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                background: '#01050c',
              }}
            >
              {embedUrl && !videoPlaybackError ? (
                <iframe
                  src={embedUrl}
                  title={currentModule.videoTitle || currentModule.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onError={() => setVideoPlaybackError(true)}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    textAlign: 'center',
                    gap: '14px',
                    background: 'radial-gradient(circle at center, rgba(8, 28, 56, 0.6) 0%, rgba(2, 8, 18, 0.95) 100%)',
                  }}
                >
                  <Tv size={48} color="#00f2fe" />
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.2rem', margin: 0 }}>
                    {videoPlaybackError ? 'Embedded Player Restricted' : 'Direct YouTube Tutorial'}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '480px', margin: 0 }}>
                    This tutorial can be viewed directly on YouTube or searched for live updates.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a
                      href={directYoutubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-btn-primary"
                      style={{ padding: '10px 20px', fontSize: '0.88rem', textDecoration: 'none' }}
                    >
                      Open Video on YouTube ↗
                    </a>
                    <a
                      href={fallbackSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-btn-secondary"
                      style={{ padding: '10px 20px', fontSize: '0.88rem', textDecoration: 'none' }}
                    >
                      Search Lesson on YouTube 🔍
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Navigation Bar (Previous / Next) */}
            <div
              style={{
                padding: '16px 20px',
                background: 'rgba(2, 8, 18, 0.9)',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <button
                onClick={() => handleSelectModule(activeModuleIndex - 1)}
                disabled={activeModuleIndex === 0}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: activeModuleIndex === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: activeModuleIndex === 0 ? '#475569' : '#e2e8f0',
                  fontSize: '0.86rem',
                  cursor: activeModuleIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <ChevronLeft size={16} />
                <span>Previous Lesson</span>
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>
                  {currentModule.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Lesson {activeModuleIndex + 1} of {totalModules} • {currentModule.duration}
                </div>
              </div>

              {activeModuleIndex < totalModules - 1 ? (
                <button
                  onClick={() => handleSelectModule(activeModuleIndex + 1)}
                  className="cyber-btn-primary"
                  style={{ padding: '9px 18px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Next Lesson</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleToggleCompletion(activeModuleIndex)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #10b981, #00f2fe)',
                    border: 'none',
                    color: '#020812',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Award size={16} />
                  <span>{isCurrentCompleted ? 'Course Finished 🎉' : 'Finish Course ✓'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Module Deep Dive Tabs: Objectives, Notes, Resources */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.6) 0%, rgba(3, 12, 26, 0.75) 100%)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            {/* Tab Switcher */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '14px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setActiveTab('objectives')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: activeTab === 'objectives' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  border: activeTab === 'objectives' ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid transparent',
                  color: activeTab === 'objectives' ? '#00f2fe' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <BookOpen size={15} />
                <span>Learning Objectives</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: activeTab === 'notes' ? 'rgba(157, 78, 221, 0.15)' : 'transparent',
                  border: activeTab === 'notes' ? '1px solid rgba(157, 78, 221, 0.4)' : '1px solid transparent',
                  color: activeTab === 'notes' ? '#c084fc' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <FileText size={15} />
                <span>Study Notes & Architecture</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: activeTab === 'resources' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  border: activeTab === 'resources' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                  color: activeTab === 'resources' ? '#10b981' : '#94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <LinkIcon size={15} />
                <span>Docs & Resources</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div>
              {activeTab === 'objectives' && (
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '14px', fontFamily: 'var(--font-heading)' }}>
                    Core Concepts Covered in This Lesson:
                  </h4>
                  {currentModule.objectives && currentModule.objectives.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {currentModule.objectives.map((obj, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            background: 'rgba(2, 8, 18, 0.6)',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <CheckCircle2 size={16} color="#00f2fe" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>{obj}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {currentModule.summary || 'Follow along with the video tutorial and practice building the corresponding workflows.'}
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                    Instructor Field Notes & Insights:
                  </h4>
                  <div
                    style={{
                      background: 'rgba(2, 8, 18, 0.6)',
                      border: '1px solid rgba(157, 78, 221, 0.25)',
                      borderRadius: '12px',
                      padding: '18px',
                      fontSize: '0.92rem',
                      lineHeight: 1.7,
                      color: '#cbd5e1',
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {currentModule.notes ||
                        'Deep-dive into the architectural mechanics shown in the video. Test prompt behaviors, verify deterministic schemas, and observe cycle loops when orchestrating agents.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '12px', fontFamily: 'var(--font-heading)' }}>
                    Recommended Documentation & References:
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {currentModule.resources && currentModule.resources.length > 0 ? (
                      currentModule.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: 'rgba(2, 8, 18, 0.6)',
                            border: '1px solid rgba(0, 242, 254, 0.2)',
                            color: '#00f2fe',
                            fontSize: '0.88rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#00f2fe';
                            e.currentTarget.style.background = 'rgba(0, 242, 254, 0.08)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.2)';
                            e.currentTarget.style.background = 'rgba(2, 8, 18, 0.6)';
                          }}
                        >
                          <span>{res.title}</span>
                          <ExternalLink size={14} />
                        </a>
                      ))
                    ) : (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                        Check the official documentation corresponding to the tools demonstrated in this lesson.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Ordered Curriculum Sidebar */}
        <div
          style={{
            position: 'sticky',
            top: '160px',
            background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.8) 0%, rgba(3, 12, 26, 0.9) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: '#fff', margin: 0 }}>
                Course Curriculum
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {completedCount} of {totalModules} Completed
              </span>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#00f2fe',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(0, 242, 254, 0.1)',
              }}
            >
              {progressPercent}%
            </span>
          </div>

          {/* Module List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {modules.map((mod, idx) => {
              const isActive = idx === activeModuleIndex;
              const isDone = completedModules.includes(idx);

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectModule(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isActive
                      ? 'rgba(0, 242, 254, 0.12)'
                      : 'rgba(2, 8, 18, 0.6)',
                    border: isActive
                      ? '1px solid #00f2fe'
                      : isDone
                      ? '1px solid rgba(16, 185, 129, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 0 15px rgba(0, 242, 254, 0.2)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.4)';
                      e.currentTarget.style.background = 'rgba(8, 24, 46, 0.6)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = isDone
                        ? 'rgba(16, 185, 129, 0.3)'
                        : 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.background = 'rgba(2, 8, 18, 0.6)';
                    }
                  }}
                >
                  {/* Status Indicator Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCompletion(idx);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      color: isDone ? '#10b981' : isActive ? '#00f2fe' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isDone ? (
                      <CheckCircle2 size={18} fill="#10b981" color="#020812" />
                    ) : isActive ? (
                      <Play size={16} fill="#00f2fe" color="#00f2fe" />
                    ) : (
                      <Circle size={16} />
                    )}
                  </button>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        marginBottom: '3px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: isActive ? '#00f2fe' : '#94a3b8',
                        }}
                      >
                        Lesson {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {mod.duration}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#fff' : isDone ? '#94a3b8' : '#e2e8f0',
                        lineHeight: 1.35,
                      }}
                    >
                      {mod.title}
                    </div>

                    {isActive && (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          color: '#00f2fe',
                          marginTop: '6px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#00f2fe',
                            animation: 'pulse 1.5s infinite',
                          }}
                        />
                        <span>Now Playing</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick External Video Link Footer */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <a
              href={directYoutubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                textDecoration: 'none',
              }}
            >
              <span>Watch Playlist on YouTube</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
