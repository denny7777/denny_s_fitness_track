import React from 'react';
import Icon from '../../../components/AppIcon';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const CheckInHeader = ({ currentStreak = 7, lastCheckIn = null }) => {
  const today = new Date();
  const formattedDate = today?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your journey today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire! 🔥";
    return "Incredible dedication! 🏆";
  };

  const getLastCheckInMessage = () => {
    if (!lastCheckIn) return "Ready for your first check-in!";
    
    const lastDate = new Date(lastCheckIn);
    const diffTime = today - lastDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Already checked in today!";
    if (diffDays === 1) return "Yesterday's check-in completed";
    return `Last check-in: ${diffDays} days ago`;
  };

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Date and Welcome */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Calendar" size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Daily Check-In</h1>
          </div>
          <p className="text-lg text-foreground font-medium">{formattedDate}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {getLastCheckInMessage()}
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <ProgressVisualization
              type="streak"
              value={currentStreak}
              label="Day Streak"
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              {getStreakMessage(currentStreak)}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="hidden sm:flex flex-col space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-foreground font-medium">3 goals active</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-muted-foreground">Best time: Morning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Workout Summary</p>
              <p className="text-xs text-muted-foreground">Describe your activities</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={16} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Mood & Energy</p>
              <p className="text-xs text-muted-foreground">Track how you feel</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Target" size={16} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Goal Progress</p>
              <p className="text-xs text-muted-foreground">Update your achievements</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInHeader;