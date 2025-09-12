import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AICoachPanel from '../../components/ui/AICoachPanel';
import MetricsCard from './components/MetricsCard';
import GoalCard from './components/GoalCard';
import RecentCheckInCard from './components/RecentCheckInCard';
import WeeklyOverview from './components/WeeklyOverview';
import StreakCounter from './components/StreakCounter';
import { useAuth } from '../../contexts/AuthContext';
import { goalService } from '../../services/goalService';
import { checkInService } from '../../services/checkInService';

const UserDashboard = () => {
  const { user, userProfile, loading } = useAuth();
  const [goals, setGoals] = useState([]);
  const [recentCheckIn, setRecentCheckIn] = useState(null);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Generate weekly completion data from recent check-ins
  const generateWeeklyData = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate?.setDate(endDate?.getDate() - 6); // Last 7 days

      const { data: checkIns } = await checkInService?.getUserCheckIns({
        startDate: startDate?.toISOString()?.split('T')?.[0],
        endDate: endDate?.toISOString()?.split('T')?.[0]
      });

      const weeklyArray = [];
      
      for (let i = 6; i >= 0; i--) {
        const currentDate = new Date();
        currentDate?.setDate(endDate?.getDate() - i);
        const dateStr = currentDate?.toISOString()?.split('T')?.[0];
        
        const dayCheckIn = checkIns?.find(checkIn => checkIn?.date === dateStr);
        
        // Calculate completion percentage based on available data
        let completion = 0;
        if (dayCheckIn) {
          // Simple completion calculation based on mood and workout
          const moodScore = dayCheckIn?.mood === 'excellent' ? 40 : 
                           dayCheckIn?.mood === 'good' ? 30 : 
                           dayCheckIn?.mood === 'neutral' ? 20 : 
                           dayCheckIn?.mood === 'tired' ? 10 : 0;
          
          const workoutScore = dayCheckIn?.workout_completed ? 40 : 0;
          const energyScore = (dayCheckIn?.energy_level || 0) * 2; // Scale 1-10 to 0-20
          
          completion = Math.min(100, moodScore + workoutScore + energyScore);
        }
        
        weeklyArray?.push({
          date: dateStr,
          completion: completion
        });
      }
      
      setWeeklyData(weeklyArray);
    } catch (error) {
      console.error('Error generating weekly data:', error);
      setWeeklyData([]);
    }
  };

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      setDataLoading(true);
      try {
        // Load goals
        const { data: goalsData } = await goalService?.getUserGoals();
        setGoals(goalsData?.slice(0, 3) || []); // Show first 3 goals on dashboard

        // Load recent check-in
        const { data: checkInData } = await checkInService?.getTodayCheckIn();
        setRecentCheckIn(checkInData);

        // Load streak
        const { streak: streakData } = await checkInService?.getCheckInStreak();
        setStreak(streakData || 0);

        // Load stats
        const { stats: statsData } = await checkInService?.getCheckInStats(30);
        setStats(statsData);

        // Generate weekly data
        await generateWeeklyData();

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleGoalUpdate = async (goalId) => {
    // Navigate to goal update page or open modal
    // For now, just refresh the goals
    const { data: goalsData } = await goalService?.getUserGoals();
    setGoals(goalsData?.slice(0, 3) || []);
  };

  const handleGoalEdit = (goalId) => {
    // Navigate to edit goal page
    window.location.href = `/edit-goal?id=${goalId}`;
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your dashboard...</p>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Fitness Tracker</h2>
            <p className="text-muted-foreground mb-6">Please sign in to view your dashboard</p>
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

  // Calculate quick metrics from loaded data
  const activeGoals = goals?.filter(goal => goal?.status === 'active')?.length || 0;
  const completedGoals = goals?.filter(goal => goal?.status === 'completed')?.length || 0;
  const avgProgress = goals?.length 
    ? Math.round(goals?.reduce((sum, goal) => sum + ((goal?.current_value || 0) / (goal?.target_value || 1) * 100), 0) / goals?.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Here's your fitness journey overview
            </p>
          </div>
          <StreakCounter days={streak} currentStreak={streak} longestStreak={streak} streakHistory={[]} />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricsCard
            title="Active Goals"
            value={activeGoals}
            subtitle={`${completedGoals} completed`}
            trend={completedGoals > 0 ? 'up' : 'neutral'}
            icon="Target"
            progressData={{}}
          />
          <MetricsCard
            title="Avg Progress"
            value={`${avgProgress}%`}
            subtitle="across all goals"
            trend={avgProgress > 50 ? 'up' : avgProgress > 25 ? 'neutral' : 'down'}
            icon="TrendingUp"
            progressData={{}}
          />
          <MetricsCard
            title="Check-in Streak"
            value={streak}
            subtitle="consecutive days"
            trend={streak > 7 ? 'up' : streak > 3 ? 'neutral' : 'down'}
            icon="Calendar"
            progressData={{}}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Check-in */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Today's Check-in</h2>
                <a 
                  href="/daily-check-in"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Update Check-in →
                </a>
              </div>
              <RecentCheckInCard checkIn={recentCheckIn} />
            </section>

            {/* Active Goals */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Active Goals</h2>
                <a 
                  href="/goals-list"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  View all goals →
                </a>
              </div>
              <div className="space-y-4">
                {goals?.length > 0 ? (
                  goals?.map(goal => (
                    <GoalCard
                      key={goal?.id}
                      goal={goal}
                      onUpdate={handleGoalUpdate}
                      onEdit={handleGoalEdit}
                    />
                  ))
                ) : (
                  <div className="bg-card rounded-lg border border-border p-8 text-center">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first fitness goal to get started
                    </p>
                    <a 
                      href="/add-goal"
                      className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Create Goal
                    </a>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Overview - Fixed data passing */}
            <WeeklyOverview weeklyData={weeklyData} />
            
            {/* AI Coach Panel */}
            <AICoachPanel 
              goals={goals}
              recentActivity={recentCheckIn}
              streak={streak}
              onToggle={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;