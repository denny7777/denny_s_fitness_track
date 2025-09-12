import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../../pages/landing-page/components/AuthModal';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const location = useLocation();
  
  const { user, userProfile, signOut, isAuthenticated } = useAuth();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/user-dashboard',
      icon: 'LayoutDashboard',
      activePattern: '/user-dashboard'
    },
    {
      label: 'Goals',
      path: '/goals-list',
      icon: 'Target',
      activePattern: '/goals'
    },
    {
      label: 'AI Coach',
      path: '/ai-coach',
      icon: 'Bot',
      activePattern: '/ai-coach'
    },
    {
      label: 'Check-Ins',
      path: '/daily-check-in',
      icon: 'Calendar',
      activePattern: '/check-in'
    },
    {
      label: 'History',
      path: '/check-in-history',
      icon: 'History',
      activePattern: '/check-in-history'
    }
  ];

  const isActive = (activePattern) => {
    return location?.pathname?.includes(activePattern);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileDropdownOpen(false);
      // Redirect to landing page or reload
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Enhanced profile dropdown menu items with actual navigation
  const profileMenuItems = isAuthenticated ? [
    {
      icon: 'User',
      label: 'View Profile',
      action: () => {
        setIsProfileDropdownOpen(false);
        // Navigate to profile page
        window.location.href = '/profile';
      }
    },
    {
      icon: 'Settings',
      label: 'Account Settings',
      action: () => {
        setIsProfileDropdownOpen(false);
        // Navigate to account settings page
        window.location.href = '/account-settings';
      }
    },
    {
      icon: 'LogOut',
      label: 'Sign Out',
      action: handleSignOut,
      variant: 'danger'
    }
  ] : [
    {
      icon: 'LogIn',
      label: 'Sign In',
      action: () => openAuthModal('signin')
    },
    {
      icon: 'UserPlus',
      label: 'Sign Up',
      action: () => openAuthModal('signup')
    }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-100 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/user-dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Dumbbell" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">
                Denny's Fitness Track
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <a
                key={item?.path}
                href={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-muted ${
                  isActive(item?.activePattern)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </a>
            ))}
          </nav>

          {/* Quick Actions & Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => window.location.href = '/daily-check-in'}
                >
                  Quick Check-In
                </Button>
                
                <div className="w-px h-6 bg-border"></div>
              </>
            )}
            
            {/* Enhanced Profile Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} color="white" />
                </div>
                {isAuthenticated && userProfile?.full_name && (
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {userProfile?.full_name}
                  </span>
                )}
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-elevated py-1 z-50">
                  {/* User Info Section (only for authenticated users) */}
                  {isAuthenticated && (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <Icon name="User" size={18} color="white" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {userProfile?.full_name || 'User'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Menu Items */}
                  {profileMenuItems?.map((item, index) => (
                    <button
                      key={index}
                      onClick={item?.action}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-sm hover:bg-muted transition-colors duration-150 text-left ${
                        item?.variant === 'danger' ?'text-error hover:bg-error/10' :'text-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-150"
            aria-label="Toggle mobile menu"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border shadow-elevated">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <a
                  key={item?.path}
                  href={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    isActive(item?.activePattern)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </a>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border">
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.href = '/daily-check-in';
                    }}
                  >
                    Quick Check-In
                  </Button>
                )}

                {/* Mobile Profile Section */}
                <div className="mt-4 pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="flex items-center space-x-3 px-4 py-3 mb-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Icon name="User" size={18} color="white" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {userProfile?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {/* Profile Actions */}
                      {profileMenuItems?.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            item?.action();
                          }}
                          className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 text-left ${
                            item?.variant === 'danger' ?'text-error hover:bg-error/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }`}
                        >
                          <Icon name={item?.icon} size={20} />
                          <span>{item?.label}</span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Sign In/Sign Up for mobile */}
                      <div className="space-y-2">
                        <Button
                          variant="default"
                          fullWidth
                          iconName="LogIn"
                          iconPosition="left"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal('signin');
                          }}
                        >
                          Sign In
                        </Button>
                        <Button
                          variant="outline"
                          fullWidth
                          iconName="UserPlus"
                          iconPosition="left"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            openAuthModal('signup');
                          }}
                        >
                          Sign Up
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onAuthSuccess={() => {
          closeAuthModal();
          // Optionally refresh user data or redirect
          window.location?.reload();
        }}
      />
      {/* Backdrop for dropdown (mobile) */}
      {(isProfileDropdownOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;