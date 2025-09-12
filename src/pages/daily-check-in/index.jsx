import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CheckInHeader from './components/CheckInHeader';
import MoodEnergyTracker from './components/MoodEnergyTracker';
import WorkoutSummaryForm from './components/WorkoutSummaryForm';
import GoalProgressUpdater from './components/GoalProgressUpdater';
import PreviousCheckInReference from './components/PreviousCheckInReference';
import { useAuth } from '../../contexts/AuthContext';
import { checkInService } from '../../services/checkInService';
import { goalService } from '../../services/goalService';

const DailyCheckIn = () => {
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [checkInData, setCheckInData] = useState({
    mood: '',
    energy_level: 5,
    workout_completed: false,
    workout_summary: '',
    notes: ''
  });
  const [goalUpdates, setGoalUpdates] = useState({});
  const [goals, setGoals] = useState([]);
  const [previousCheckIn, setPreviousCheckIn] = useState(null);
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setDataLoading(true);
      try {
        // Load today's check-in
        const { data: todayData } = await checkInService?.getTodayCheckIn();
        if (todayData) {
          setTodayCheckIn(todayData);
          setCheckInData({
            mood: todayData?.mood || '',
            energy_level: todayData?.energy_level || 5,
            workout_completed: todayData?.workout_completed || false,
            workout_summary: todayData?.workout_summary || '',
            notes: todayData?.notes || ''
          });
        }

        // Load previous check-in for reference
        const yesterday = new Date();
        yesterday?.setDate(yesterday?.getDate() - 1);
        const yesterdayStr = yesterday?.toISOString()?.split('T')?.[0];
        const { data: previousData } = await checkInService?.getCheckInByDate(yesterdayStr);
        setPreviousCheckIn(previousData);

        // Load active goals
        const { data: goalsData } = await goalService?.getFilteredGoals({ status: 'active' });
        setGoals(goalsData || []);

      } catch (error) {
        console.error('Error loading check-in data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Handle check-in data changes
  const handleCheckInChange = (field, value) => {
    setCheckInData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle goal progress updates
  const handleGoalProgressChange = (goalId, newValue, notes) => {
    setGoalUpdates(prev => ({
      ...prev,
      [goalId]: { new_value: newValue, notes: notes || '' }
    }));
  };

  // Submit check-in
  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const today = new Date()?.toISOString()?.split('T')?.[0];
      
      // Create or update today's check-in
      const checkInPayload = {
        user_id: user?.id,
        date: today,
        ...checkInData
      };

      let checkInResult;
      if (todayCheckIn) {
        // Update existing check-in
        checkInResult = await checkInService?.updateCheckIn(todayCheckIn?.id, checkInData);
      } else {
        // Create new check-in
        checkInResult = await checkInService?.createCheckIn(checkInPayload);
      }

      if (checkInResult?.error) {
        throw new Error(checkInResult?.error?.message || 'Failed to save check-in');
      }

      // Update goal progress
      for (const [goalId, update] of Object.entries(goalUpdates)) {
        if (update?.new_value !== undefined) {
          const progressResult = await goalService?.updateProgress(
            goalId, 
            parseFloat(update?.new_value), 
            update?.notes
          );
          
          if (progressResult?.error) {
            console.error('Failed to update goal progress:', progressResult?.error);
          }
        }
      }

      // Success - redirect to dashboard
      alert('Check-in saved successfully!');
      window.location.href = '/user-dashboard';

    } catch (error) {
      console.error('Check-in submission error:', error);
      alert('Failed to save check-in: ' + error?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading check-in...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to access daily check-in</p>
            <button 
              onClick={() => window.location.href = '/landing-page'}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, title: 'Mood & Energy', component: MoodEnergyTracker },
    { id: 2, title: 'Workout Summary', component: WorkoutSummaryForm },
    { id: 3, title: 'Goal Progress', component: GoalProgressUpdater }
  ];

  const getCurrentStepComponent = () => {
    const step = steps?.find(s => s?.id === currentStep);
    if (!step) return null;

    const Component = step?.component;
    
    switch (currentStep) {
      case 1:
        return (
          <Component
            mood={checkInData?.mood}
            energyLevel={checkInData?.energy_level}
            onChange={handleCheckInChange}
          />
        );
      case 2:
        return (
          <Component
            workoutCompleted={checkInData?.workout_completed}
            workoutSummary={checkInData?.workout_summary}
            notes={checkInData?.notes}
            onChange={handleCheckInChange}
          />
        );
      case 3:
        return (
          <Component
            goals={goals}
            goalUpdates={goalUpdates}
            onChange={handleGoalProgressChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <CheckInHeader 
          date={new Date()} 
          isUpdate={!!todayCheckIn}
        />

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step?.id <= currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step?.id}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step?.id <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step?.title}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`ml-4 w-16 h-0.5 ${
                    step?.id < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Previous Check-in Reference */}
            <div className="lg:col-span-1">
              <PreviousCheckInReference 
                previousCheckIn={previousCheckIn}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-lg border border-border p-8">
                {getCurrentStepComponent()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  
                  {currentStep < steps?.length ? (
                    <button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-success text-success-foreground px-6 py-2 rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>✓ Save Check-in</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;