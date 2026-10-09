import React from 'react';
import HeroSection from '../components/hero/HeroSection';
import AIToolCategories from '../components/categories/AIToolCategories';
import FeaturedToolsSection from '../components/tools/FeaturedToolsSection';
import LearningTracksSection from '../components/learning/LearningTracksSection';
import InteractiveSandboxSection from '../components/sandbox/InteractiveSandboxSection';
import OpenSourceSpotlightSection from '../components/opensource/OpenSourceSpotlightSection';
import Footer from '../components/footer/Footer';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020812' }}>
      {/* 1. Master Scroll-Driven Cinematic Hero */}
      <HeroSection />

      {/* 2. Interactive AI Categories */}
      <AIToolCategories />

      {/* 3. Featured Tools Directory */}
      <FeaturedToolsSection />

      {/* 4. Interactive Sandbox Demonstration */}
      <InteractiveSandboxSection />

      {/* 5. Curated AI Learning Tracks */}
      <LearningTracksSection />

      {/* 6. Open-Source Learning Hub Spotlight */}
      <OpenSourceSpotlightSection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
