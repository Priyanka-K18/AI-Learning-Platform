import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  Star,
  GitFork,
  Shield,
  Clock,
  Compass,
  Code,
  FolderTree,
  Terminal,
  Tv,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

const Github = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function RepoLearningModal({ isOpen, onClose, repo, isBookmarked, onToggleBookmark }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'install' | 'roadmap' | 'source' | 'video'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !repo) return null;

  const handleCopyInstall = () => {
    if (!repo.installGuide) return;
    navigator.clipboard.writeText(repo.installGuide);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const videoId = repo.youtubeTutorial?.videoId;
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 8, 18, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.96) 0%, rgba(3, 12, 26, 0.99) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '1040px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.85), 0 0 45px rgba(0, 242, 254, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.25s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          style={{
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(2, 8, 18, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(157, 78, 221, 0.2) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00f2fe',
              }}
            >
              <Code size={26} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                  {repo.repoOwner} /
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
                  {repo.category}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(157, 78, 221, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                  }}
                >
                  {repo.difficulty}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#fff',
                  margin: 0,
                }}
              >
                {repo.name}
              </h2>
            </div>
          </div>

          {/* Quick Metrics & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onToggleBookmark && onToggleBookmark(repo)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                background: isBookmarked ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isBookmarked ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.12)',
                color: isBookmarked ? '#fbbf24' : '#94a3b8',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Bookmark this repository"
            >
              <Star size={14} fill={isBookmarked ? '#fbbf24' : 'none'} />
              <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>

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
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Action Header Ribbon */}
        <div
          style={{
            padding: '12px 28px',
            background: 'rgba(6, 21, 34, 0.6)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fbbf24' }}>
              <Star size={14} fill="#fbbf24" />
              <strong>{repo.stars?.toLocaleString()}</strong> stars
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <GitFork size={13} />
              {repo.forks?.toLocaleString()} forks
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#67e8f9' }}>
              <Shield size={13} />
              {repo.license} License
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} />
              {repo.lastUpdated}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {repo.docsUrl && (
              <a
                href={repo.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#e2e8f0',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#e2e8f0';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                <BookOpen size={13} />
                <span>Documentation</span>
                <ExternalLink size={11} />
              </a>
            )}

            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cyber-btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                fontSize: '0.82rem',
                textDecoration: 'none',
              }}
            >
              <Github size={14} />
              <span>View on GitHub</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            padding: '12px 28px 0 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(2, 8, 18, 0.4)',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'overview', label: 'Overview & Architecture', icon: Info },
            { id: 'install', label: 'Quickstart & Installation', icon: Terminal },
            { id: 'roadmap', label: 'Learning Roadmap', icon: Compass },
            { id: 'source', label: 'Source Code Tour', icon: FolderTree },
            { id: 'video', label: 'Tutorial Video', icon: Tv },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #00f2fe' : '2px solid transparent',
                  background: 'transparent',
                  color: isActive ? '#00f2fe' : '#94a3b8',
                  fontSize: '0.86rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h4 style={{ color: '#67e8f9', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  What It Does & Core Purpose:
                </h4>
                <p style={{ color: '#e2e8f0', fontSize: '0.98rem', lineHeight: 1.7, margin: 0 }}>
                  {repo.purpose || repo.description}
                </p>
              </div>

              <div>
                <h4 style={{ color: '#c084fc', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  Why Developers Choose It:
                </h4>
                <div
                  style={{
                    background: 'rgba(2, 8, 18, 0.6)',
                    border: '1px solid rgba(157, 78, 221, 0.25)',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    color: '#cbd5e1',
                    fontSize: '0.92rem',
                    lineHeight: 1.65,
                  }}
                >
                  {repo.whyUseIt}
                </div>
              </div>

              {/* Tech Stack Chips */}
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Technology Stack:
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {repo.techStack?.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        background: 'rgba(0, 242, 254, 0.08)',
                        border: '1px solid rgba(0, 242, 254, 0.22)',
                        color: '#67e8f9',
                        fontSize: '0.82rem',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* License & Terms Box */}
              <div
                style={{
                  background: 'rgba(2, 8, 18, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>
                      License: {repo.license}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {repo.license === 'MIT'
                        ? 'Permissive: Free for commercial and private use with attribution.'
                        : repo.license === 'Apache-2.0'
                        ? 'Permissive: Grants explicit patent rights with commercial freedom.'
                        : repo.license?.includes('AGPL')
                        ? 'Copyleft: Modified network services must disclose complete source code.'
                        : 'Open-source licensed for community research and production usage.'}
                    </div>
                  </div>
                </div>

                <a
                  href={`${repo.githubUrl}/blob/main/LICENSE`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#00f2fe',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Inspect LICENSE</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* TAB: INSTALLATION */}
          {activeTab === 'install' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
                  Quickstart & Installation Command
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  Copy and run this command in your project terminal to install or clone this project.
                </p>
              </div>

              <div
                style={{
                  background: '#01050c',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '14px',
                  padding: '20px',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.6)',
                }}
              >
                <button
                  onClick={handleCopyInstall}
                  style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: copied ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)',
                    color: copied ? '#10b981' : '#cbd5e1',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <pre
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: '#67e8f9',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    lineHeight: 1.6,
                    paddingRight: '70px',
                  }}
                >
                  {repo.installGuide || `git clone ${repo.githubUrl}.git\ncd ${repo.repoName}\nnpm install`}
                </pre>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`${repo.githubUrl}#readme`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                  }}
                >
                  <BookOpen size={14} />
                  <span>Read Official README on GitHub</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}

          {/* TAB: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                  Beginner-Friendly Learning Roadmap
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  A structured 3-step pathway to understand, dissect, and integrate this project into your own codebase.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {repo.learningRoadmap?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      background: 'rgba(2, 8, 18, 0.65)',
                      border: '1px solid rgba(0, 242, 254, 0.18)',
                      borderRadius: '16px',
                      padding: '18px 20px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00f2fe 0%, #9d4edd 100%)',
                        color: '#020812',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {item.step || idx + 1}
                    </div>

                    <div>
                      <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '6px', margin: 0 }}>
                        {item.title}
                      </h5>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: '6px 0 0 0' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SOURCE CODE TOUR */}
          {activeTab === 'source' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                  Source Code Exploration Guide
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  Navigate the repository structure effectively by knowing which folders contain core mechanics.
                </p>
              </div>

              {/* Entry Point */}
              <div
                style={{
                  background: 'rgba(2, 8, 18, 0.7)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Terminal size={18} color="#00f2fe" />
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Recommended Entry Point:{' '}
                  <strong style={{ color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>
                    {repo.sourceCodeExploration?.entryPoint || 'src/index.ts'}
                  </strong>
                </span>
              </div>

              {/* Key Folders List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Key Directory Roles:
                </div>
                {repo.sourceCodeExploration?.keyFolders?.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(2, 8, 18, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <code
                      style={{
                        color: '#c084fc',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.86rem',
                        background: 'rgba(157, 78, 221, 0.1)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {f.path}
                    </code>
                    <span style={{ color: '#cbd5e1', fontSize: '0.85rem', flex: 1, minWidth: '240px' }}>
                      {f.role}
                    </span>
                  </div>
                ))}
              </div>

              {/* Architectural Notes */}
              {repo.sourceCodeExploration?.architecturalNotes && (
                <div
                  style={{
                    background: 'rgba(6, 21, 34, 0.5)',
                    border: '1px solid rgba(0, 242, 254, 0.15)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    color: '#94a3b8',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: '#00f2fe' }}>Architectural Insight: </strong>
                  {repo.sourceCodeExploration.architecturalNotes}
                </div>
              )}
            </div>
          )}

          {/* TAB: VIDEO TUTORIAL */}
          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px', fontFamily: 'var(--font-heading)' }}>
                  Verified Video Tutorial & Deep Dive
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  {repo.youtubeTutorial?.title || 'Community tutorial exploring this open-source architecture.'}
                </p>
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: '56.25%',
                  background: '#01050c',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                }}
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={repo.youtubeTutorial?.title || repo.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      color: '#94a3b8',
                    }}
                  >
                    <Tv size={42} color="#00f2fe" />
                    <p style={{ margin: 0 }}>Search YouTube for live community walkthroughs.</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                        repo.name + ' tutorial open source'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cyber-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.84rem', textDecoration: 'none' }}
                    >
                      Search on YouTube ↗
                    </a>
                  </div>
                )}
              </div>

              {repo.youtubeTutorial?.url && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href={repo.youtubeTutorial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#00f2fe',
                      fontSize: '0.84rem',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Watch on YouTube</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
