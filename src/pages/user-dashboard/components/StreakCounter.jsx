import React from 'react';
import Icon from '../../../components/AppIcon';
import ProgressVisualization from '../../../components/ui/ProgressVisualization';

const StreakCounter = ({ currentStreak, longestStreak, streakHistory }) => {
  const getStreakMessage = (streak) => {
    if (streak === 0) return "Start your journey today!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "Great consistency!";
    if (streak < 90) return "You're on fire!";
    return "Legendary dedication!";
  };

  const getStreakColor = (streak) => {
    if (streak === 0) return 'text-muted-foreground';
    if (streak < 7) return 'text-warning';
    if (streak < 30) return 'text-primary';
    return 'text-success';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Check-in Streak</h3>
          <p className="text-sm text-muted-foreground">
            Keep the momentum going!
          </p>
        </div>
        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Flame" size={24} className="text-success" />
        </div>
      </div>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className={`text-4xl font-bold font-mono ${getStreakColor(currentStreak)}`}>
            {currentStreak}
          </span>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Days</p>
            <p className="text-xs text-muted-foreground">Current</p>
          </div>
        </div>
        <p className={`text-sm font-medium ${getStreakColor(currentStreak)}`}>
          {getStreakMessage(currentStreak)}
        </p>
      </div>
      {/* Streak Visualization */}
      <div className="mb-6">
        <ProgressVisualization
          type="streak"
          value={Math.min(currentStreak, 7)}
          label="This Week"
          className="mb-4"
        />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Trophy" size={16} className="text-warning" />
            <span className="text-lg font-bold text-foreground font-mono">
              {longestStreak}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Calendar" size={16} className="text-primary" />
            <span className="text-lg font-bold text-foreground font-mono">
              {streakHistory?.filter(day => day?.completed)?.length}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Total Days</p>
        </div>
      </div>
      {/* Recent streak history */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground mb-2">Last 14 days</p>
        <div className="flex space-x-1">
          {streakHistory?.slice(-14)?.map((day, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                day?.completed ? 'bg-success' : 'bg-muted'
              }`}
              title={`${day?.date}: ${day?.completed ? 'Completed' : 'Missed'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;