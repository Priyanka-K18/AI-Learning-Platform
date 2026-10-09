import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchToolById, bookmarkTool, reportTool } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Star,
  ExternalLink,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Sparkles,
  Shield,
  Layers,
  Monitor,
  Calendar,
  AlertTriangle,
  Flag,
  BookOpen,
  Check,
} from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Broken link');
  const [reportComment, setReportComment] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    fetchToolById(id)
      .then((data) => {
        setTool(data);
        if (user?.savedTools) {
          setIsSaved(user.savedTools.some((t) => (typeof t === 'string' ? t : t._id) === id));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await bookmarkTool(id);
      setIsSaved(res.bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await reportTool(id, { reason: reportReason, comment: reportComment });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportComment('');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#00f2fe', fontFamily: 'var(--font-heading)' }}>Loading tool specification...</span>
      </div>
    );
  }

  if (!tool) {
    return (
      <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '120px', textAlign: 'center', color: '#fff' }}>
        <h2>AI Tool not found</h2>
        <button onClick={() => navigate('/tools')} className="cyber-btn-secondary" style={{ marginTop: '20px' }}>
          Back to Directory
        </button>
      </div>
    );
  }

  const initials = tool.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#f87171',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <Flag size={13} />
            <span>Report Issue</span>
          </button>
        </div>

        {/* Master Tool Card */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.8) 0%, rgba(3, 12, 26, 0.95) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)',
            marginBottom: '40px',
          }}
        >
          {/* Top header row with logo and titles */}
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '24px' }}>
            {/* Logo / Fallback */}
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(168, 85, 247, 0.3) 100%)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00f2fe',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.4rem',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {tool.logo && !imgError ? (
                <img
                  src={tool.logo}
                  alt={tool.name}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0, 242, 254, 0.12)',
                    color: '#00f2fe',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                  }}
                >
                  {tool.category}
                </span>

                {tool.subcategory && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {tool.subcategory}
                  </span>
                )}

                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    background: 'rgba(157, 78, 221, 0.12)',
                    color: '#c084fc',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {tool.pricing}
                </span>

                {tool.isOpenSource && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#34d399',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    Open Source
                  </span>
                )}

                {tool.skillLevel && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#94a3b8',
                      fontSize: '0.78rem',
                    }}
                  >
                    {tool.skillLevel}
                  </span>
                )}
              </div>

              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: '#fff', margin: '4px 0 6px 0' }}>
                {tool.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24' }}>
                  <Star size={15} fill="#fbbf24" />
                  <span style={{ fontWeight: 600 }}>{tool.rating || 4.8}</span>
                </div>
                {tool.lastVerified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                    <Calendar size={13} />
                    <span>Verified: {tool.lastVerified}</span>
                  </div>
                )}
                {tool.verified && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                    <CheckCircle2 size={13} />
                    <span>Active Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={handleBookmark}
                className="cyber-btn-secondary"
                style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Bookmark size={16} fill={isSaved ? '#00f2fe' : 'none'} color={isSaved ? '#00f2fe' : '#cbd5e1'} />
                <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
              </button>

              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn-primary"
                style={{ padding: '10px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Launch Official Website</span>
                <ExternalLink size={15} />
              </a>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '28px' }}>
            {tool.description}
          </p>

          {/* Platform Availability */}
          {tool.platforms && tool.platforms.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '10px' }}>
                <Monitor size={15} color="#00f2fe" />
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Platform Availability:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tool.platforms.map((plat, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      background: 'rgba(2, 10, 24, 0.6)',
                      border: '1px solid rgba(0, 242, 254, 0.2)',
                      color: '#cbd5e1',
                      fontSize: '0.82rem',
                    }}
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Capabilities */}
          {tool.features && tool.features.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.15rem', fontFamily: 'var(--font-heading)', marginBottom: '14px' }}>
                Core Capabilities & Architecture
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {tool.features.map((feat, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 14px',
                      background: 'rgba(2, 10, 24, 0.6)',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 242, 254, 0.15)',
                      color: '#e2e8f0',
                      fontSize: '0.88rem',
                    }}
                  >
                    <CheckCircle2 size={15} color="#00f2fe" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Tags:</span>
            {tool.tags?.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.78rem',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  color: '#94a3b8',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Report Issue Modal */}
        {showReportModal && (
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
                maxWidth: '480px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <AlertTriangle size={22} color="#f87171" />
                <h3 style={{ margin: 0, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                  Report Tool Issue
                </h3>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '20px' }}>
                Notice an issue with <strong>{tool.name}</strong>? Let us know and our verification systems will inspect it.
              </p>

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
                  <div>Thank you. Your report has been logged for re-verification.</div>
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
                        padding: '10px',
                        outline: 'none',
                        fontSize: '0.85rem',
                      }}
                    >
                      <option value="Broken link">Broken link / 404</option>
                      <option value="Tool unavailable">Tool discontinued or unavailable</option>
                      <option value="Outdated pricing">Pricing model changed</option>
                      <option value="Incorrect information">Incorrect description/metadata</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.82rem', marginBottom: '6px' }}>
                      Additional details (optional):
                    </label>
                    <textarea
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      placeholder="e.g. Website URL redirected or service shutting down..."
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
                      onClick={() => setShowReportModal(false)}
                      style={{
                        padding: '8px 16px',
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
                      style={{ padding: '8px 18px', cursor: 'pointer' }}
                    >
                      Submit Report
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
