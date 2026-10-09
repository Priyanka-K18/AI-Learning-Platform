import React, { useState, useEffect } from 'react';
import { fetchCommunity, createCommunityPost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Heart, Send, Sparkles, User, AlertCircle } from 'lucide-react';
import Footer from '../components/footer/Footer';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await fetchCommunity();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError('Please provide a title and post content.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createCommunityPost({ title, content, category });
      setTitle('');
      setContent('');
      loadPosts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#020812', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 80px 24px' }}>
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
            <MessageSquare size={14} />
            <span>Neural Forum</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
            Nexus Builder Community
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '640px' }}>
            Share your discoveries, benchmark findings, agent architectures, and discuss frontier models.
          </p>
        </div>

        {/* Create Post Card */}
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(8, 24, 48, 0.75) 0%, rgba(3, 12, 26, 0.85) 100%)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: '20px',
            padding: '28px',
            marginBottom: '40px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          <h3 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
            Initiate a Discussion
          </h3>

          {error && (
            <div style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="Discussion title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                background: 'rgba(2, 10, 24, 0.7)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.95rem',
              }}
            />

            <textarea
              placeholder="What are your thoughts or questions?..."
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                background: 'rgba(2, 10, 24, 0.7)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.92rem',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <option value="Discussion">General Discussion</option>
                <option value="Architecture">System Architecture</option>
                <option value="Showcase">Showcase & Benchmarks</option>
                <option value="Questions">Q&A Help</option>
              </select>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cyber-btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.88rem' }}
              >
                <Send size={14} />
                <span>{isSubmitting ? 'Transmitting...' : 'Post to Nexus'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Posts list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {posts.map((post) => (
            <div
              key={post._id}
              style={{
                background: 'rgba(8, 22, 42, 0.65)',
                border: '1px solid rgba(0, 242, 254, 0.16)',
                borderRadius: '18px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00f2fe, #9d4edd)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#020812',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                    }}
                  >
                    {post.author ? post.author[0] : 'U'}
                  </div>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.92rem' }}>{post.author}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: '#67e8f9',
                  }}
                >
                  {post.category}
                </span>
              </div>

              <h3 style={{ color: '#fff', fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '10px' }}>
                {post.title}
              </h3>

              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {post.content}
              </p>

              {/* Replies */}
              {post.replies?.length > 0 && (
                <div style={{ background: 'rgba(2, 8, 18, 0.6)', borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Replies ({post.replies.length}):
                  </div>
                  {post.replies.map((rep, idx) => (
                    <div key={idx} style={{ padding: '6px 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                      <span style={{ color: '#00f2fe', fontWeight: 600 }}>{rep.author}: </span>
                      <span>{rep.content}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8', fontSize: '0.82rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Heart size={14} color="#f43f5e" />
                  <span>{post.likes} reactions</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={14} />
                  <span>{post.replies?.length || 0} responses</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
