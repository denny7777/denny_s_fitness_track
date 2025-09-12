import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, signOut, resetPassword, loading, profileLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data
  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile?.full_name || '',
        email: userProfile?.email || ''
      });
    }
  }, [userProfile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/landing-page');
    }
  }, [user, loading, navigate]);

  const tabs = [
    { id: 'general', label: 'General', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'privacy', label: 'Privacy', icon: 'Lock' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateProfile = async () => {
    if (!formData?.full_name?.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return;
    }

    setUpdateLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateProfile({
        full_name: formData?.full_name?.trim()
      });

      if (error) {
        setMessage({ type: 'error', text: error?.message || 'Failed to update profile' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!userProfile?.email) {
      setMessage({ type: 'error', text: 'Email not found' });
      return;
    }

    setPasswordLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await resetPassword(userProfile?.email);

      if (error) {
        setMessage({ type: 'error', text: error?.message || 'Failed to send password reset email' });
      } else {
        setMessage({ type: 'success', text: 'Password reset email sent successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
    );
    
    if (confirmed) {
      // This would typically involve a more complex flow with re-authentication
      alert('Account deletion would be implemented here with proper security measures.');
    }
  };

  const clearMessage = () => setMessage({ type: '', text: '' });

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading account settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 px-4 py-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences and security settings</p>
            </div>
            <Button
              variant="outline"
              iconName="ArrowLeft"
              iconPosition="left"
              onClick={() => navigate('/user-dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Message Display */}
        {message?.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message?.type === 'success' ?'bg-green-50 border-green-200 text-green-800' :'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={message?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                  size={16} 
                />
                <span className="text-sm font-medium">{message?.text}</span>
              </div>
              <button onClick={clearMessage}>
                <Icon name="X" size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4">
              <nav className="space-y-1">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 text-left ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border border-border p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Information */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Profile Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name
                          </label>
                          <Input
                            type="text"
                            value={formData?.full_name || ''}
                            onChange={(e) => handleInputChange('full_name', e?.target?.value)}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email Address
                          </label>
                          <Input
                            type="email"
                            value={formData?.email || ''}
                            disabled
                            placeholder="Enter your email"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Email address cannot be changed
                          </p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button
                          variant="default"
                          iconName="Save"
                          iconPosition="left"
                          onClick={handleUpdateProfile}
                          disabled={updateLoading}
                          loading={updateLoading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Password Reset */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Reset your password by sending a reset link to your email address.
                      </p>
                      <Button
                        variant="outline"
                        iconName="Mail"
                        iconPosition="left"
                        onClick={handlePasswordReset}
                        disabled={passwordLoading}
                        loading={passwordLoading}
                      >
                        Send Password Reset Email
                      </Button>
                    </div>

                    {/* Account Security Status */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">Account Security</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <Icon name="Shield" size={16} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">Account Verified</p>
                              <p className="text-sm text-green-600">Your email address has been verified</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Notification settings will be available in a future update. You can customize your preferences for:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Goal Reminders</p>
                          <p className="text-sm text-muted-foreground">Get notified about your daily check-ins</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-1 shadow"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">Progress Updates</p>
                          <p className="text-sm text-muted-foreground">Weekly progress summaries</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-1 shadow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">Privacy & Data</h2>
                  
                  <div className="space-y-6">
                    {/* Data Management */}
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Icon name="Info" size={16} className="text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-blue-800">Your Data</p>
                              <p className="text-sm text-blue-600 mt-1">
                                We store your profile information, fitness goals, and check-in data to provide you with personalized fitness tracking.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          iconName="Download"
                          iconPosition="left"
                          onClick={() => alert('Data export feature coming soon!')}
                        >
                          Export My Data
                        </Button>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="border-t border-border pt-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">Delete Account</h3>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                        <div className="flex items-start space-x-3">
                          <Icon name="AlertTriangle" size={16} className="text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">Warning</p>
                            <p className="text-sm text-red-600 mt-1">
                              Deleting your account will permanently remove all your data, including goals, check-ins, and progress history. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        iconName="Trash2"
                        iconPosition="left"
                        onClick={handleDeleteAccount}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Delete My Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;