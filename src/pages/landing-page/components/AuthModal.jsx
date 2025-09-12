import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  // Demo credentials for easy testing
  const demoCredentials = [
    { email: 'demo@fitness.com', password: 'fitness123', name: 'Demo User' },
    { email: 'john@fitness.com', password: 'password123', name: 'John Doe' }
  ];

  // Enhanced form validation with better error messages
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (mode === 'signup') {
      if (!formData?.name?.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData?.name?.trim()?.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      
      if (!formData?.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Enhanced submit handler with better success handling and redirection
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (mode === 'signin') {
        console.log('Attempting signin for:', formData?.email);
        const { data, error } = await signIn(formData?.email, formData?.password);
        
        if (error) {
          console.error('Signin failed:', error);
          setErrors({ general: error?.message || 'Failed to sign in. Please check your credentials.' });
        } else if (data?.user) {
          console.log('Signin successful');
          // Success - show success message and call success callback
          setErrors({ 
            general: 'Sign in successful! Redirecting to dashboard...' 
          });
          
          // Reset form
          setFormData({ email: '', password: '', confirmPassword: '', name: '' });
          
          // Call success callback after a brief delay to show success message
          setTimeout(() => {
            onAuthSuccess?.();
          }, 1500);
        }
      } else {
        console.log('Attempting signup for:', formData?.email);
        const { data, error } = await signUp(formData?.email, formData?.password, {
          metadata: { full_name: formData?.name?.trim() }
        });
        
        if (error) {
          console.error('Signup failed:', error);
          let errorMessage = 'Failed to create account. Please try again.';
          
          if (error?.message?.includes('already registered')) {
            errorMessage = 'An account with this email already exists. Try signing in instead.';
          } else if (error?.message?.includes('weak password')) {
            errorMessage = 'Password is too weak. Please use a stronger password.';
          } else if (error?.message?.includes('invalid email')) {
            errorMessage = 'Please enter a valid email address.';
          }
          
          setErrors({ general: errorMessage });
        } else if (data?.user) {
          console.log('Signup successful');
          
          // Check if email confirmation is required
          if (data?.user?.email_confirmed_at) {
            // User is immediately confirmed - show success and redirect
            setErrors({ 
              general: 'Account created successfully! Redirecting to dashboard...' 
            });
            setFormData({ email: '', password: '', confirmPassword: '', name: '' });
            
            setTimeout(() => {
              onAuthSuccess?.();
            }, 1500);
          } else {
            // Show confirmation message but keep modal open
            setErrors({ 
              general: 'Account created! Please check your email to confirm your account before signing in.' 
            });
            // Switch to signin mode after a delay
            setTimeout(() => {
              setMode('signin');
              setFormData({ 
                email: formData?.email, 
                password: '', 
                confirmPassword: '', 
                name: '' 
              });
              setErrors({});
            }, 3000);
          }
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced demo login with better success handling
  const handleDemoLogin = async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      setErrors({ general: 'Invalid demo credentials' });
      return;
    }
    
    setFormData({
      email: credentials?.email,
      password: credentials?.password,
      confirmPassword: '',
      name: credentials?.name || ''
    });
    setMode('signin');
    setErrors({});
    
    // Auto-submit demo login
    setIsLoading(true);
    try {
      console.log('Demo login attempt for:', credentials?.email);
      const { data, error } = await signIn(credentials?.email, credentials?.password);
      if (error) {
        setErrors({ general: 'Demo login failed. Please try manual login.' });
      } else if (data?.user) {
        console.log('Demo login successful');
        setErrors({ 
          general: 'Demo login successful! Redirecting to dashboard...' 
        });
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
        
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1500);
      }
    } catch (error) {
      setErrors({ general: 'Demo login failed. Please try manual login.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-elevated border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Dumbbell" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {mode === 'signin' ? 'Welcome Back' : 'Join Fitness Track'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Enhanced Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors?.general && (
            <div className={`border rounded-lg p-4 ${
              errors?.general?.includes('successful') || errors?.general?.includes('created!') || errors?.general?.includes('check your email')
                ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={
                    errors?.general?.includes('successful') || errors?.general?.includes('created!') 
                      ? 'CheckCircle' :'AlertCircle'
                  } 
                  size={16} 
                  className={
                    errors?.general?.includes('successful') || errors?.general?.includes('created!') 
                      ? 'text-success' :'text-error'
                  } 
                />
                <span className={`text-sm ${
                  errors?.general?.includes('successful') || errors?.general?.includes('created!') 
                    ? 'text-success' :'text-error'
                }`}>
                  {errors?.general}
                </span>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData?.name}
              onChange={handleInputChange}
              error={errors?.name}
              required
            />
          )}

          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
          />

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData?.confirmPassword}
              onChange={handleInputChange}
              error={errors?.confirmPassword}
              required
            />
          )}

          {/* Enhanced submit button with better loading state */}
          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
            iconName={mode === 'signin' ? 'LogIn' : 'UserPlus'}
            iconPosition="left"
            className="mt-6"
          >
            {isLoading 
              ? (mode === 'signin' ? 'Signing in...' : 'Creating account...') 
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Button>

          {/* Demo Credentials */}
          {mode === 'signin' && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-start space-x-2 mb-3">
                <Icon name="Info" size={16} className="text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-2">Demo Credentials:</p>
                  {demoCredentials?.map((cred, index) => (
                    <div key={index} className="mb-2">
                      <button
                        type="button"
                        onClick={() => handleDemoLogin(cred)}
                        className="text-left hover:bg-muted/50 rounded p-2 transition-colors w-full"
                      >
                        <p className="text-muted-foreground text-xs">
                          <strong>{cred?.name}:</strong> {cred?.email} / {cred?.password}
                        </p>
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2">
                    Click on any credential to auto-fill the form
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Mail"
              iconPosition="left"
              onClick={() => {
                // Mock Google login - could be implemented later
                setErrors({ general: 'Social login coming soon!' });
              }}
            >
              Continue with Google
            </Button>
          </div>

          {/* Switch Mode */}
          <div className="text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                disabled={isLoading}
                className="ml-1 font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Lock" size={12} className="text-primary" />
              <span>Privacy Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;