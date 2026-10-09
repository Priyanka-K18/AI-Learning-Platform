import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, Sparkles, User, LogOut, Menu, X, ArrowRight, Compass } from 'lucide-react';
import SearchPalette from '../search/SearchPalette';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();
  const { user, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Tools', path: '/tools' },
    { name: 'Learn', path: '/learn' },
    { name: 'Projects', path: '/projects' },
    { name: 'Roadmaps', path: '/roadmaps' },
    { name: 'Community', path: '/community' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          minHeight: '72px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrolled
            ? 'rgba(2, 9, 17, 0.92)'
            : 'rgba(2, 9, 17, 0.72)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled
            ? '1px solid rgba(0, 242, 254, 0.22)'
            : '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: scrolled ? '0 10px 30px rgba(0, 0, 0, 0.7)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '14px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #9d4edd 100%)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(0, 242, 254, 0.5)',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: '#020812',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Compass size={22} color="#00f2fe" />
              </div>
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                AI <span className="text-gradient-cyan">NEXUS</span>
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  style={{
                    position: 'relative',
                    padding: '8px 14px',
                    fontSize: '0.92rem',
                    fontWeight: 500,
                    color: isActive ? '#00f2fe' : '#94a3b8',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-heading)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {link.name}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '14px',
                        right: '14px',
                        height: '2px',
                        background: 'linear-gradient(90deg, #00f2fe, #9d4edd)',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px #00f2fe',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Search Input Trigger */}
            <div
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(8, 22, 42, 0.65)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                padding: '8px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                width: '180px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Search size={15} color="#00f2fe" />
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Search anything...</span>
            </div>

            {/* User State */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#67e8f9',
                  }}
                >
                  <User size={14} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '7px',
                    borderRadius: '8px',
                    color: '#f87171',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '8px 12px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#00f2fe')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                >
                  Login
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="cyber-btn-primary"
                  style={{
                    padding: '9px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                  }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={15} />
                </button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: '6px',
              }}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '16px 24px',
              background: 'rgba(2, 8, 18, 0.98)',
              borderTop: '1px solid rgba(0, 242, 254, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: location.pathname === link.path ? '#00f2fe' : '#cbd5e1',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  padding: '8px 0',
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Global Search Palette */}
      <SearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} initialQuery={searchVal} />
    </>
  );
}
