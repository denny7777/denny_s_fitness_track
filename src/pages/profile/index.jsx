import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile, loading, profileLoading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initialize form data when userProfile changes
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData?.full_name?.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return;
    }

    setUpdateLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await updateProfile({
        full_name: formData?.full_name?.trim(),
        email: formData?.email?.trim()
      });

      if (error) {
        setMessage({ type: 'error', text: error?.message || 'Failed to update profile' });
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      full_name: userProfile?.full_name || '',
      email: userProfile?.email || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
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
      <div className="pt-16 px-4 py-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
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
            <div className="flex items-center space-x-2">
              <Icon 
                name={message?.type === 'success' ? 'CheckCircle' : 'AlertCircle'} 
                size={16} 
              />
              <span className="text-sm font-medium">{message?.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Profile Information</h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Edit"
                    iconPosition="left"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={32} color="white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{userProfile?.full_name || 'User'}</h3>
                    <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      value={formData?.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e?.target?.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={formData?.email || ''}
                      onChange={(e) => handleInputChange('email', e?.target?.value)}
                      disabled // Email typically shouldn't be editable
                      placeholder="Enter your email"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email address cannot be changed through this interface
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex items-center space-x-3 pt-4 border-t border-border">
                    <Button
                      variant="default"
                      iconName="Check"
                      iconPosition="left"
                      onClick={handleSave}
                      disabled={updateLoading}
                      loading={updateLoading}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      iconName="X"
                      iconPosition="left"
                      onClick={handleCancel}
                      disabled={updateLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Stats & Info Sidebar */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium text-foreground">
                    {userProfile?.created_at ? format(new Date(userProfile?.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium text-foreground">
                    {userProfile?.updated_at ? format(new Date(userProfile?.updated_at), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => navigate('/account-settings')}
                >
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Target"
                  iconPosition="left"
                  onClick={() => navigate('/goals-list')}
                >
                  View Goals
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Calendar"
                  iconPosition="left"
                  onClick={() => navigate('/daily-check-in')}
                >
                  Daily Check-In
                </Button>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about your profile or account? We're here to help.
              </p>
              <Button
                variant="outline"
                fullWidth
                iconName="HelpCircle"
                iconPosition="left"
                onClick={() => console.log('Contact support')}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;