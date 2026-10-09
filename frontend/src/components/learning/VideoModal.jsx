import React from 'react';
import { X, ExternalLink, Play, Clock, Tv, BookOpen, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VideoModal({ isOpen, onClose, course, module, moduleIndex }) {
  const navigate = useNavigate();

  if (!isOpen || !module) return null;

  const videoId = module.videoId || (module.youtubeUrl ? module.youtubeUrl.split('v=')[1]?.split('&')[0] : '');
  const embedUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1` : null;
  const youtubeUrl = module.youtubeUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent((course?.title || '') + ' ' + (module?.title || '') + ' tutorial')}`);
  const fallbackSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((course?.title || '') + ' ' + (module?.title || '') + ' tutorial')}`;

  const handleOpenWorkspace = () => {
    onClose();
    if (course?._id) {
      navigate(`/learn/${course._id}?lesson=${moduleIndex ?? 0}`);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 8, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(8, 24, 46, 0.95) 0%, rgba(3, 12, 26, 0.98) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '920px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(2, 8, 18, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(0, 242, 254, 0.12)',
                color: '#00f2fe',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Play size={12} fill="#00f2fe" />
              <span>Lesson {moduleIndex !== undefined ? moduleIndex + 1 : 1}</span>
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{course?.title}</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={module.videoTitle || module.title}
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
                color: '#94a3b8',
                gap: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <Tv size={42} color="#00f2fe" />
              <p style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>Embedded preview unavailable for this module.</p>
              <a
                href={fallbackSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary"
                style={{ fontSize: '0.85rem', padding: '8px 16px', textDecoration: 'none' }}
              >
                Search Tutorial on YouTube ↗
              </a>
            </div>
          )}
        </div>

        {/* Modal Info Footer */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff', marginBottom: '6px' }}>
                {module.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: '#94a3b8', flexWrap: 'wrap' }}>
                {module.channelTitle && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#c084fc' }}>
                    <Tv size={13} />
                    {module.channelTitle}
                  </span>
                )}
                {module.duration && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} />
                    {module.duration}
                  </span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                  <CheckCircle size={13} />
                  Verified Tutorial
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <span>Watch on YouTube</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={handleOpenWorkspace}
                className="cyber-btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <BookOpen size={14} />
                <span>Open Full Course Workspace →</span>
              </button>
            </div>
          </div>

          {module.summary && (
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              {module.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
