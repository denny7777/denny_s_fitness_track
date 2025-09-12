import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log('User authenticated, redirecting to dashboard...');
      navigate('/user-dashboard');
    }
  }, [user, loading, navigate]);

  // Handle scroll to sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location?.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = () => {
    // Close modal and redirect will happen automatically via useEffect
    setIsAuthModalOpen(false);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Denny's Fitness Track - Transform Your Fitness Journey</title>
        <meta 
          name="description" 
          content="Set meaningful fitness goals, track daily progress, and get AI-powered coaching recommendations. Your personal fitness companion for sustainable results." 
        />
        <meta name="keywords" content="fitness tracking, goal setting, AI coaching, workout tracker, fitness app" />
        <meta property="og:title" content="Denny's Fitness Track - Transform Your Fitness Journey" />
        <meta property="og:description" content="Set meaningful fitness goals, track daily progress, and get AI-powered coaching recommendations." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Denny's Fitness Track - Transform Your Fitness Journey" />
        <meta name="twitter:description" content="Set meaningful fitness goals, track daily progress, and get AI-powered coaching recommendations." />
      </Helmet>

      {/* Hero Section */}
      <HeroSection 
        onSignUp={handleSignUp}
        onSignIn={handleSignIn}
      />

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;