import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AICoachPanel from '../../components/ui/AICoachPanel';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GoalEditForm from './components/GoalEditForm';
import ProgressHistory from './components/ProgressHistory';
import ImpactPreview from './components/ImpactPreview';

const EditGoal = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const goalId = searchParams?.get('id');

  const [goalData, setGoalData] = useState(null);
  const [originalGoal, setOriginalGoal] = useState(null);
  const [updatedGoal, setUpdatedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  // Mock goal data - in real app, this would come from API
  const mockGoalData = {
    id: goalId || '1',
    title: 'Lose 20 Pounds',
    targetValue: 20,
    currentValue: 12,
    unit: 'lbs',
    targetDate: '2025-03-15',
    description: 'I want to lose 20 pounds by March to feel healthier and more confident. This goal is important for my overall well-being and will help me establish better eating and exercise habits.',
    goalType: 'weight_loss',
    priority: 'high',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-10T14:30:00Z'
  };

  useEffect(() => {
    // Simulate loading goal data
    setIsLoading(true);
    setTimeout(() => {
      if (!goalId) {
        navigate('/goals-list');
        return;
      }
      
      setGoalData(mockGoalData);
      setOriginalGoal(mockGoalData);
      setIsLoading(false);
    }, 1000);
  }, [goalId, navigate]);

  const handleSave = async (updatedData) => {
    setIsSaving(true);
    setUpdatedGoal(updatedData);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setGoalData(updatedData);
      setOriginalGoal(updatedData);
      
      // Show success message and redirect
      navigate('/goals-list', { 
        state: { 
          message: 'Goal updated successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/goals-list');
  };

  const toggleAICoach = () => {
    setShowAICoach(!showAICoach);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between">
                <div className="skeleton h-8 w-48"></div>
                <div className="skeleton h-10 w-32"></div>
              </div>
              
              {/* Form Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="skeleton h-96 rounded-lg"></div>
                </div>
                <div className="space-y-6">
                  <div className="skeleton h-64 rounded-lg"></div>
                  <div className="skeleton h-48 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!goalData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="AlertTriangle" size={24} className="text-error" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Goal Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The goal you're trying to edit doesn't exist or has been deleted.
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/goals-list')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Goals
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className={`pt-16 transition-all duration-300 ${showAICoach ? 'lg:pr-80' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/goals-list')}
                className="mr-2"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Edit Goal
                </h1>
                <p className="text-muted-foreground">
                  Modify your fitness goal and track progress
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAICoach}
                iconName="Bot"
                iconPosition="left"
                className="hidden lg:flex"
              >
                AI Coach
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date(goalData.updatedAt)?.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                activeTab === 'edit' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Edit Goal
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                activeTab === 'history' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                activeTab === 'impact' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Impact Preview
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'edit' && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <GoalEditForm
                    goalData={goalData}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    isLoading={isSaving}
                  />
                </div>
              )}

              {activeTab === 'history' && (
                <ProgressHistory goalId={goalData?.id} />
              )}

              {activeTab === 'impact' && updatedGoal && (
                <ImpactPreview
                  originalGoal={originalGoal}
                  updatedGoal={updatedGoal}
                />
              )}

              {activeTab === 'impact' && !updatedGoal && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="BarChart3" size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Changes Yet
                    </h3>
                    <p className="text-muted-foreground">
                      Make changes to your goal to see the impact preview
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Goal Summary */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Current Goal
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">
                      {goalData?.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {goalData?.goalType?.replace('_', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-mono text-foreground">
                      {Math.round((goalData?.currentValue / goalData?.targetValue) * 100)}%
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((goalData?.currentValue / goalData?.targetValue) * 100, 100)}%` 
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current</div>
                      <div className="font-mono text-foreground">
                        {goalData?.currentValue} {goalData?.unit}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Target</div>
                      <div className="font-mono text-foreground">
                        {goalData?.targetValue} {goalData?.unit}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-sm">
                      <Icon name="Calendar" size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Due {new Date(goalData.targetDate)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => navigate('/daily-check-in')}
                  >
                    Log Progress
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="BarChart3"
                    iconPosition="left"
                    onClick={() => navigate('/check-in-history')}
                  >
                    View History
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    iconName="Target"
                    iconPosition="left"
                    onClick={() => navigate('/goals-list')}
                  >
                    All Goals
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Action Toolbar */}
      <QuickActionToolbar className="lg:hidden" />
      {/* AI Coach Panel */}
      <AICoachPanel isOpen={showAICoach} onToggle={toggleAICoach} />
    </div>
  );
};

export default EditGoal;